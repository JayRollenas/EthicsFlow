<?php

namespace App\Http\Controllers;

use App\Models\EthicsClearance;
use App\Models\PanelAssignment;
use App\Models\ResearchSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReviewerWorkflowController extends Controller
{
    private const DOCUMENTS = [
        'manuscript' => 'Research manuscript / protocol',
        'consent' => 'Informed consent form',
        'instruments' => 'Research instruments',
        'supporting' => 'Supporting documents',
    ];

    public function startReview(Request $request, PanelAssignment $assignment): RedirectResponse
    {
        $this->ensureReviewer($request);
        abort_unless($assignment->reviewer_id === $request->user()->id, 404);
        abort_unless(in_array($assignment->status, ['assigned', 'in_progress'], true), 409);
        abort_unless($assignment->panel()->where('status', 'in_review')->exists(), 409);

        if ($assignment->status === 'assigned') {
            $assignment->update(['status' => 'in_progress']);
        }

        return redirect()->route('dashboard')->with('status', 'Review started.');
    }

    public function downloadDocument(
        Request $request,
        PanelAssignment $assignment,
        string $document,
    ): StreamedResponse {
        $this->ensureReviewer($request);
        abort_unless($assignment->reviewer_id === $request->user()->id, 404);
        abort_unless(array_key_exists($document, self::DOCUMENTS), 404);

        $review = $assignment->reviews()
            ->with('submissionVersion')
            ->latest('id')
            ->firstOrFail();

        $path = data_get($review->submissionVersion->research_details, "documents.{$document}");
        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->download($path);
    }

    public function submitReview(Request $request, PanelAssignment $assignment): RedirectResponse
    {
        $this->ensureReviewer($request);
        abort_unless($assignment->reviewer_id === $request->user()->id, 404);
        abort_unless($assignment->status !== 'completed', 409);
        abort_unless($assignment->panel()->where('status', 'in_review')->exists(), 409);

        $validated = $request->validate([
            'decision' => ['required', 'in:approve,disapprove'],
            'comment' => ['required', 'string', 'max:10000'],
        ]);

        DB::transaction(function () use ($assignment, $validated): void {
            $review = $assignment->reviews()
                ->whereNull('submitted_at')
                ->latest('id')
                ->firstOrFail();
            $submittedAt = now();

            $review->update([
                'decision' => $validated['decision'],
                'overall_comment' => trim($validated['comment']),
                'submitted_at' => $submittedAt,
            ]);
            $review->comments()->create([
                'comment' => trim($validated['comment']),
            ]);
            $assignment->update([
                'status' => 'completed',
                'completed_at' => $submittedAt,
            ]);

            $panel = $assignment->panel()->with([
                'submission.researcher',
                'assignments.reviews',
            ])->firstOrFail();

            if ($panel->assignments->contains(fn (PanelAssignment $item): bool => $item->status !== 'completed')) {
                return;
            }

            $reviews = $panel->assignments->flatMap->reviews;
            $allApproved = $reviews->count() === 3
                && $reviews->every(fn ($item): bool => $item->decision === 'approve' && $item->submitted_at !== null);

            if (! $allApproved) {
                $panel->update([
                    'status' => 'revision_required',
                    'completed_at' => $submittedAt,
                ]);
                $panel->submission->update(['status' => 'revision_required']);

                $comments = $reviews
                    ->filter(fn ($item): bool => $item->decision === 'disapprove')
                    ->pluck('overall_comment')
                    ->filter()
                    ->implode(' | ');

                $this->notify(
                    $panel->submission->researcher_id,
                    $panel->submission_id,
                    'review_revision_required',
                    "The review panel requested revisions for {$panel->submission->referenceNumber()}. Reviewer feedback: {$comments}",
                );

                return;
            }

            $panel->update([
                'status' => 'approved',
                'completed_at' => $submittedAt,
            ]);

            $submission = ResearchSubmission::query()
                ->lockForUpdate()
                ->findOrFail($panel->submission_id);
            $clearance = EthicsClearance::firstOrCreate(
                ['submission_id' => $submission->id],
                [
                    'review_panel_id' => $panel->id,
                    'certificate_number' => sprintf('EC-%s-%05d', $submittedAt->format('Y'), $submission->id),
                    'issued_at' => $submittedAt,
                ],
            );

            $submission->update(['status' => 'cleared']);
            $this->notify(
                $submission->researcher_id,
                $submission->id,
                'clearance_issued',
                "Ethics clearance {$clearance->certificate_number} has been issued for {$submission->referenceNumber()}.",
            );

            $this->notify(
                $panel->coordinator_id,
                $submission->id,
                'clearance_issued',
                "Unanimous reviewer approval automatically issued clearance {$clearance->certificate_number}.",
            );
        });

        return redirect()->route('dashboard')->with('status', 'Review submitted.');
    }

    private function ensureReviewer(Request $request): void
    {
        abort_unless($request->user()?->role === 'reviewer', 403);
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
