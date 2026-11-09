<?php

use App\Models\ResearchField;
use App\Models\ResearchSubmission;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('researchers can see only their submitted applications', function () {
    $researcher = User::factory()->create([
        'role' => 'researcher',
    ]);
    $otherResearcher = User::factory()->create([
        'role' => 'researcher',
    ]);
    $researchField = ResearchField::create([
        'name' => 'Psychology',
    ]);

    ResearchSubmission::create([
        'researcher_id' => $researcher->id,
        'research_field_id' => $researchField->id,
        'research_title' => 'My submitted study',
        'abstract' => 'Study abstract.',
        'research_details' => [
            'research' => ['department' => 'Psychology'],
        ],
        'status' => 'submitted',
        'submitted_at' => now(),
    ]);

    ResearchSubmission::create([
        'researcher_id' => $researcher->id,
        'research_field_id' => $researchField->id,
        'research_title' => 'Unsubmitted draft',
        'abstract' => 'Draft abstract.',
        'research_details' => [
            'research' => ['department' => 'Psychology'],
        ],
        'status' => 'draft',
    ]);

    ResearchSubmission::create([
        'researcher_id' => $otherResearcher->id,
        'research_field_id' => $researchField->id,
        'research_title' => 'Another student study',
        'abstract' => 'Private abstract.',
        'research_details' => [
            'research' => ['department' => 'Psychology'],
        ],
        'status' => 'submitted',
        'submitted_at' => now(),
    ]);

    $this->actingAs($researcher)
        ->get(route('applications.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Applications/Index')
            ->has('applications', 1)
            ->where('applications.0.title', 'My submitted study')
            ->where('applications.0.department', 'Psychology')
            ->where('applications.0.status', 'submitted')
        );
});

test('researchers can submit applications and view their confirmation', function () {
    Storage::fake('local');
    $researcher = User::factory()->create([
        'role' => 'researcher',
    ]);

    $response = $this->actingAs($researcher)
        ->post(route('applications.store'), [
            'research' => [
                'researchTitle' => 'A study about student wellbeing',
                'department' => 'Psychology',
                'researchType' => 'Qualitative Research',
                'studyDescription' => 'This study explores student wellbeing.',
                'proposedStartDate' => '2026-12-01',
                'proposedEndDate' => '2027-01-31',
            ],
            'team' => [
                'primary' => [
                    'fullName' => 'Test Researcher',
                    'email' => $researcher->email,
                    'studentNumber' => '20260001',
                    'contactNumber' => '09123456789',
                ],
                'members' => [],
                'adviser' => [
                    'fullName' => 'Test Adviser',
                    'email' => 'adviser@example.test',
                    'department' => 'Psychology',
                ],
            ],
            'ethics' => [
                'humanParticipants' => 'yes',
                'vulnerableGroups' => 'no',
                'consent' => 'Participants will provide informed consent.',
                'dataProtection' => 'Data will be stored securely.',
            ],
            'documents' => [
                'manuscript' => UploadedFile::fake()->create('manuscript.pdf', 1, 'application/pdf'),
                'consent' => UploadedFile::fake()->create('consent.pdf', 1, 'application/pdf'),
                'instruments' => UploadedFile::fake()->create('instruments.pdf', 1, 'application/pdf'),
            ],
        ]);

    $submission = ResearchSubmission::firstOrFail();

    $response->assertRedirect(route('applications.confirmation', $submission));
    $this->assertDatabaseHas('submission_versions', [
        'submission_id' => $submission->id,
        'version_number' => 1,
        'submitted_by' => $researcher->id,
    ]);

    foreach ($submission->research_details['documents'] as $path) {
        Storage::disk('local')->assertExists($path);
    }

    $this->actingAs($researcher)
        ->get(route('applications.confirmation', $submission))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Applications/Confirmation')
            ->where('demo', false)
            ->where('application.title', 'A study about student wellbeing')
            ->where('application.referenceNumber', sprintf('REC-%s-%04d', now()->format('Y'), $submission->id))
        );
});

test("researchers cannot view another researcher's confirmation", function () {
    $owner = User::factory()->create([
        'role' => 'researcher',
    ]);
    $otherResearcher = User::factory()->create([
        'role' => 'researcher',
    ]);
    $researchField = ResearchField::create([
        'name' => 'Psychology',
    ]);
    $submission = ResearchSubmission::create([
        'researcher_id' => $owner->id,
        'research_field_id' => $researchField->id,
        'research_title' => 'Private study',
        'abstract' => 'Private abstract.',
        'research_details' => [],
        'status' => 'submitted',
        'submitted_at' => now(),
    ]);

    $this->actingAs($otherResearcher)
        ->get(route('applications.confirmation', $submission))
        ->assertNotFound();
});

test('reviewers cannot access the student applications page or submit applications', function () {
    $reviewer = User::factory()->create([
        'role' => 'reviewer',
    ]);

    $this->actingAs($reviewer)
        ->get(route('applications.index'))
        ->assertForbidden();

    $this->actingAs($reviewer)
        ->get(route('applications.create'))
        ->assertForbidden();

    $this->actingAs($reviewer)
        ->post(route('applications.store'))
        ->assertForbidden();
});
