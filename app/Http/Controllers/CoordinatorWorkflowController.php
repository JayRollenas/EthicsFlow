<?php

namespace App\Http\Controllers;

use App\Models\ResearchSubmission;
use App\Models\ReviewPanel;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CoordinatorWorkflowController extends Controller
{
    private const DOCUMENTS = [
        'manuscript' => 'Research manuscript / protocol',
        'consent' => 'Informed consent form',
        'instruments' => 'Research instruments',
        'supporting' => 'Supporting documents',
    ];

    public function assignPanel(Request $request, ResearchSubmission $submission): RedirectResponse
    {
        $this->ensureCoordinator($request);
        abort_unless(in_array($submission->status, ['submitted', 'resubmitted'], true), 409);

        $validated = $request->validate([
            'reviewer_ids' => ['required', 'array', 'size:3', 'distinct'],
            'reviewer_ids.*' => ['required', 'integer', 'exists:users,id'],
        ]);

        $reviewers = User::query()
            ->whereIn('id', $validated['reviewer_ids'])
            ->where('role', 'reviewer')
            ->get();

        if ($reviewers->count() !== 3) {
            throw ValidationException::withMessages([
                'reviewer_ids' => 'Select three distinct reviewer accounts.',
            ]);
        }

        $panel = DB::transaction(function () use ($request, $submission, $reviewers): ReviewPanel {
            $submission = ResearchSubmission::query()
                ->lockForUpdate()
                ->findOrFail($submission->id);
            abort_unless(in_array($submission->status, ['submitted', 'resubmitted'], true), 409);

            $version = $submission->versions()->latest('version_number')->firstOrFail();
            $cycle = (int) $submission->reviewPanels()->max('cycle_number') + 1;
            $now = now();

            $panel = $submission->reviewPanels()->create([
                'coordinator_id' => $request->user()->id,
                'cycle_number' => $cycle,
                'status' => 'in_review',
                'assigned_at' => $now,
            ]);

            foreach ($reviewers as $reviewer) {
                $assignment = $panel->assignments()->create([
                    'reviewer_id' => $reviewer->id,
                    'status' => 'assigned',
                    'assigned_at' => $now,
                ]);

                $assignment->reviews()->create([
                    'submission_version_id' => $version->id,
                    'decision' => 'pending',
                ]);

                $this->notify(
                    $reviewer->id,
                    $submission->id,
                    'review_assigned',
                    "You have been assigned to review {$submission->referenceNumber()}: {$submission->research_title}.",
                );
            }

            $submission->status = 'under_review';
            $submission->save();

            $this->notify(
                $submission->researcher_id,
                $submission->id,
                'review_started',
                "Your application {$submission->referenceNumber()} has been assigned to a review panel.",
            );

            return $panel;
        });

        return redirect()->route('dashboard')->with('status', "Review panel {$panel->cycle_number} assigned.");
    }

    public function downloadDocument(
        Request $request,
        ResearchSubmission $submission,
        string $document,
    ): StreamedResponse {
        $this->ensureCoordinator($request);
        abort_unless(array_key_exists($document, self::DOCUMENTS), 404);

        $path = $submission->research_details['documents'][$document] ?? null;
        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->download($path);
    }

    private function ensureCoordinator(Request $request): void
    {
        abort_unless($request->user()?->role === 'coordinator', 403);
    }

    private function notify(int $userId, int $submissionId, string $type, string $message): void
    {
        DB::table('notifications')->insert([
            'user_id' => $userId,
            'submission_id' => $submissionId,
            'type' => $type,
            'message' => $message,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
