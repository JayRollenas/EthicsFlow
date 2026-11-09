<?php

use App\Models\EthicsClearance;
use App\Models\ResearchField;
use App\Models\ResearchSubmission;
use App\Models\ReviewPanel;
use App\Models\SubmissionVersion;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function createWorkflowSubmission(User $researcher): ResearchSubmission
{
    $field = ResearchField::create(['name' => 'Psychology']);
    $submittedAt = now();
    $submission = ResearchSubmission::create([
        'researcher_id' => $researcher->id,
        'research_field_id' => $field->id,
        'research_title' => 'Student wellbeing study',
        'abstract' => 'A study about student wellbeing.',
        'research_details' => [
            'research' => ['department' => 'Psychology'],
            'team' => [],
            'ethics' => [],
            'documents' => [],
        ],
        'status' => 'submitted',
        'submitted_at' => $submittedAt,
    ]);

    $documents = [];
    foreach (['manuscript', 'consent', 'instruments'] as $name) {
        $documents[$name] = UploadedFile::fake()
            ->create("{$name}.pdf", 1, 'application/pdf')
            ->store("submissions/{$submission->id}", 'local');
    }

    $details = [
        'research' => ['department' => 'Psychology'],
        'team' => [],
        'ethics' => [],
        'documents' => $documents,
    ];
    $submission->update(['research_details' => $details]);

    SubmissionVersion::create([
        'submission_id' => $submission->id,
        'version_number' => 1,
        'research_title' => $submission->research_title,
        'abstract' => $submission->abstract,
        'research_details' => $details,
        'document_path' => $documents['manuscript'],
        'submitted_by' => $researcher->id,
        'submitted_at' => $submittedAt,
    ]);

    return $submission;
}

function assignWorkflowPanel(User $coordinator, ResearchSubmission $submission, array $reviewers): ReviewPanel
{
    test()->actingAs($coordinator)
        ->post(route('coordinator.submissions.panel', $submission), [
            'reviewer_ids' => array_map(fn (User $reviewer): int => $reviewer->id, $reviewers),
        ])
        ->assertRedirect(route('dashboard'));

    return ReviewPanel::query()
        ->where('submission_id', $submission->id)
        ->orderByDesc('cycle_number')
        ->firstOrFail();
}

beforeEach(function () {
    Storage::fake('local');
});

test('coordinators can view submissions and assign exactly three distinct reviewers without compliance checks', function () {
    $coordinator = User::factory()->create(['role' => 'coordinator']);
    $researcher = User::factory()->create(['role' => 'researcher']);
    $reviewers = User::factory()->count(3)->create(['role' => 'reviewer'])->all();
    $submission = createWorkflowSubmission($researcher);

    $this->actingAs($coordinator)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Coordinator/Dashboard')
            ->where('applications.0.title', $submission->research_title)
            ->where('applications.0.abstract', $submission->abstract)
            ->where('applications.0.documents.manuscript', basename($submission->research_details['documents']['manuscript']))
            ->where('stats.readyToAssign', 1)
        );

    $this->actingAs($coordinator)
        ->get(route('coordinator.submissions.documents', [
            $submission->id,
            'manuscript',
        ]))
        ->assertOk();

    $this->actingAs($coordinator)
        ->post(route('coordinator.submissions.panel', $submission), [
            'reviewer_ids' => [$reviewers[0]->id, $reviewers[1]->id],
        ])
        ->assertSessionHasErrors('reviewer_ids');

    $this->actingAs($coordinator)
        ->post(route('coordinator.submissions.panel', $submission), [
            'reviewer_ids' => [$reviewers[0]->id, $reviewers[1]->id, $researcher->id],
        ])
        ->assertSessionHasErrors('reviewer_ids');

    $panel = assignWorkflowPanel($coordinator, $submission, $reviewers);

    expect($panel->assignments)->toHaveCount(3);
    $this->assertDatabaseHas('research_submissions', [
        'id' => $submission->id,
        'status' => 'under_review',
    ]);
    $this->assertDatabaseCount('notifications', 4);

    $this->actingAs($reviewers[0])
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Reviewer/Dashboard')
            ->where('assignedStudies.0.reference', $submission->referenceNumber())
            ->where('assignedStudies.0.documents.manuscript', basename($submission->research_details['documents']['manuscript']))
        );

    $reviewerAssignment = $panel->assignments()
        ->where('reviewer_id', $reviewers[0]->id)
        ->firstOrFail();
    $this->actingAs($reviewers[0])
        ->post(route('reviewer.assignments.start', $reviewerAssignment))
        ->assertRedirect(route('dashboard'));
    $this->assertDatabaseHas('panel_assignments', [
        'id' => $reviewerAssignment->id,
        'status' => 'in_progress',
    ]);

    $this->actingAs($coordinator)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Coordinator/Dashboard')
            ->where('applications.0.documents.manuscript', basename($submission->research_details['documents']['manuscript']))
            ->where('applications.0.abstract', $submission->abstract)
            ->where('stats.readyToAssign', 0)
        );
});

test('reviewers can access only their assigned documents and unanimous approval issues clearance', function () {
    $coordinator = User::factory()->create(['role' => 'coordinator']);
    $researcher = User::factory()->create(['role' => 'researcher']);
    $reviewers = User::factory()->count(3)->create(['role' => 'reviewer'])->all();
    $submission = createWorkflowSubmission($researcher);
    $panel = assignWorkflowPanel($coordinator, $submission, $reviewers);
    $assignments = $panel->assignments()->orderBy('id')->get();

    $this->actingAs($reviewers[0])
        ->get(route('reviewer.assignments.documents', [
            $assignments[0]->id,
            'manuscript',
        ]))
        ->assertOk();

    $this->actingAs($reviewers[1])
        ->get(route('reviewer.assignments.documents', [
            $assignments[0]->id,
            'manuscript',
        ]))
        ->assertNotFound();

    foreach ($assignments as $assignment) {
        $this->actingAs($assignment->reviewer)
            ->post(route('reviewer.assignments.review', $assignment), [
                'decision' => 'approve',
                'comment' => 'The submission meets the ethics requirements.',
            ])
            ->assertRedirect(route('dashboard'));
    }

    $this->assertDatabaseHas('research_submissions', [
        'id' => $submission->id,
        'status' => 'cleared',
    ]);
    $this->assertDatabaseHas('review_panels', [
        'id' => $panel->id,
        'status' => 'approved',
    ]);
    expect(EthicsClearance::where('submission_id', $submission->id)->count())->toBe(1);
});

test('a panel with a disapproval requests revisions instead of issuing clearance', function () {
    $coordinator = User::factory()->create(['role' => 'coordinator']);
    $researcher = User::factory()->create(['role' => 'researcher']);
    $reviewers = User::factory()->count(3)->create(['role' => 'reviewer'])->all();
    $submission = createWorkflowSubmission($researcher);
    $panel = assignWorkflowPanel($coordinator, $submission, $reviewers);

    foreach ($panel->assignments()->orderBy('id')->get() as $index => $assignment) {
        $this->actingAs($assignment->reviewer)
            ->post(route('reviewer.assignments.review', $assignment), [
                'decision' => $index === 0 ? 'disapprove' : 'approve',
                'comment' => $index === 0
                    ? 'Please clarify the participant consent process.'
                    : 'No additional changes are required.',
            ])
            ->assertRedirect(route('dashboard'));
    }

    $this->assertDatabaseHas('research_submissions', [
        'id' => $submission->id,
        'status' => 'revision_required',
    ]);
    $this->assertDatabaseHas('review_panels', [
        'id' => $panel->id,
        'status' => 'revision_required',
    ]);
    expect(EthicsClearance::where('submission_id', $submission->id)->exists())->toBeFalse();
    $this->assertDatabaseHas('notifications', [
        'user_id' => $researcher->id,
        'type' => 'review_revision_required',
    ]);

    $this->actingAs($researcher)
        ->get(route('applications.revision', $submission))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Applications/Revision')
            ->where('submission.reviewerFeedback.0', 'Please clarify the participant consent process.')
        );
});

test('only the researcher who owns an application can open requested revisions', function () {
    $researcher = User::factory()->create(['role' => 'researcher']);
    $otherResearcher = User::factory()->create(['role' => 'researcher']);
    $submission = createWorkflowSubmission($researcher);
    $submission->update(['status' => 'revision_required']);

    $this->actingAs($researcher)
        ->get(route('applications.revision', $submission))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Applications/Revision')
            ->where('submission.reference', $submission->referenceNumber())
        );

    $this->actingAs($otherResearcher)
        ->get(route('applications.revision', $submission))
        ->assertNotFound();
});

test('researchers resubmit corrected documents as a new version', function () {
    $researcher = User::factory()->create(['role' => 'researcher']);
    $coordinator = User::factory()->create(['role' => 'coordinator']);
    $reviewers = User::factory()->count(3)->create(['role' => 'reviewer'])->all();
    $submission = createWorkflowSubmission($researcher);
    $firstPanel = assignWorkflowPanel($coordinator, $submission, $reviewers);

    foreach ($firstPanel->assignments()->orderBy('id')->get() as $index => $assignment) {
        $this->actingAs($assignment->reviewer)
            ->post(route('reviewer.assignments.review', $assignment), [
                'decision' => $index === 0 ? 'disapprove' : 'approve',
                'comment' => $index === 0
                    ? 'Please update the study protocol.'
                    : 'No additional changes are required.',
            ])
            ->assertRedirect(route('dashboard'));
    }

    $this->assertDatabaseHas('research_submissions', [
        'id' => $submission->id,
        'status' => 'revision_required',
    ]);

    $response = $this->actingAs($researcher)
        ->post(route('applications.resubmit', $submission), [
            'research_title' => 'Updated student wellbeing study',
            'abstract' => 'An updated study about student wellbeing.',
            'documents' => [
                'manuscript' => UploadedFile::fake()->create('updated-manuscript.pdf', 1, 'application/pdf'),
            ],
        ]);

    $response->assertRedirect(route('applications.confirmation', $submission));
    $this->assertDatabaseHas('submission_versions', [
        'submission_id' => $submission->id,
        'version_number' => 2,
        'research_title' => 'Updated student wellbeing study',
    ]);
    $this->assertDatabaseHas('research_submissions', [
        'id' => $submission->id,
        'status' => 'resubmitted',
    ]);
    $this->assertDatabaseHas('notifications', [
        'user_id' => $coordinator->id,
        'submission_id' => $submission->id,
        'type' => 'application_resubmitted',
    ]);
    $this->assertDatabaseHas('notifications', [
        'user_id' => $coordinator->id,
        'type' => 'application_resubmitted',
        'message' => "Application {$submission->referenceNumber()} has been resubmitted and is ready for reviewer assignment.",
    ]);

    $panel = assignWorkflowPanel($coordinator, $submission, $reviewers);
    expect($panel->cycle_number)->toBe(2);
    $this->assertDatabaseHas('reviews', [
        'panel_assignment_id' => $panel->assignments()->firstOrFail()->id,
        'submission_version_id' => $submission->versions()->where('version_number', 2)->firstOrFail()->id,
    ]);
});

test('review workflow routes are forbidden to roles outside their workflow', function () {
    $researcher = User::factory()->create(['role' => 'researcher']);
    $submission = createWorkflowSubmission($researcher);

    $this->actingAs($researcher)
        ->post(route('coordinator.submissions.panel', $submission), [
            'reviewer_ids' => [],
        ])
        ->assertForbidden();

    $this->actingAs($researcher)
        ->get(route('dashboard'))
        ->assertOk();
});
