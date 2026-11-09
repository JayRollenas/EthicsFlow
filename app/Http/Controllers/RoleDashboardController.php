<?php

namespace App\Http\Controllers;

use App\Models\EthicsClearance;
use App\Models\PanelAssignment;
use App\Models\ResearchSubmission;
use App\Models\ReviewPanel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RoleDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return match ($request->user()->role) {
            'researcher' => Inertia::render('Dashboard'),
            'reviewer' => $this->reviewerDashboard($request),
            'coordinator' => $this->coordinatorDashboard($request),
            default => abort(403, 'Unauthorized role.'),
        };
    }

    private function reviewerDashboard(Request $request): Response
    {
        $assignments = PanelAssignment::query()
            ->where('reviewer_id', $request->user()->id)
            ->whereIn('status', ['assigned', 'in_progress'])
            ->whereHas('panel', fn ($query) => $query->where('status', 'in_review'))
            ->with([
                'panel.submission.researcher',
                'panel.submission.researchField',
                'reviews' => fn ($query) => $query
                    ->with('submissionVersion')
                    ->latest('id')
                    ->limit(1),
            ])
            ->get()
            ->map(function (PanelAssignment $assignment): array {
                $submission = $assignment->panel->submission;
                $review = $assignment->reviews->first();

                return [
                    'id' => $assignment->id,
                    'reference' => $submission->referenceNumber(),
                    'title' => $submission->research_title,
                    'abstract' => $submission->abstract,
                    'researcher' => $submission->researcher->name,
                    'department' => data_get($submission->research_details, 'research.department', ''),
                    'status' => $assignment->status,
                    'assignedAt' => $assignment->assigned_at?->toDateString(),
                    'decision' => $review?->decision,
                    'comment' => $review?->overall_comment,
                    'documents' => collect(data_get($review?->submissionVersion?->research_details, 'documents', []))
                        ->map(fn (string $path): string => basename($path))
                        ->all(),
                ];
            });

        $completed = PanelAssignment::query()
            ->where('reviewer_id', $request->user()->id)
            ->where('status', 'completed')
            ->with([
                'panel.submission.researcher',
                'reviews' => fn ($query) => $query
                    ->with('submissionVersion')
                    ->latest('id')
                    ->limit(1),
            ])
            ->latest('completed_at')
            ->get()
            ->map(function (PanelAssignment $assignment): array {
                $submission = $assignment->panel->submission;
                $review = $assignment->reviews->first();

                return [
                    'id' => $assignment->id,
                    'reference' => $submission->referenceNumber(),
                    'title' => $submission->research_title,
                    'abstract' => $submission->abstract,
                    'researcher' => $submission->researcher->name,
                    'department' => data_get($submission->research_details, 'research.department', ''),
                    'completedAt' => $assignment->completed_at?->toDateString(),
                    'decision' => $review?->decision,
                    'comment' => $review?->overall_comment,
                    'documents' => collect(data_get($review?->submissionVersion?->research_details, 'documents', []))
                        ->map(fn (string $path): string => basename($path))
                        ->all(),
                ];
            });

        $notifications = DB::table('notifications')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->limit(10)
            ->get(['id', 'type', 'message', 'read_at', 'created_at']);

        return Inertia::render('Reviewer/Dashboard', [
            'assignedStudies' => $assignments,
            'completedReviews' => $completed,
            'notifications' => $notifications,
            'stats' => [
                'assigned' => $assignments->count() + $completed->count(),
                'pending' => $assignments->where('status', 'assigned')->count(),
                'inProgress' => $assignments->where('status', 'in_progress')->count(),
                'completed' => $completed->count(),
            ],
        ]);
    }

    private function coordinatorDashboard(Request $request): Response
    {
        $submissions = ResearchSubmission::query()
            ->with([
                'researcher:id,name,email',
                'researchField:id,name',
                'reviewPanels.assignments.reviewer:id,name,email',
                'reviewPanels.assignments.reviews',
                'clearances',
            ])
            ->whereNotIn('status', ['draft', 'withdrawn'])
            ->latest('submitted_at')
            ->get()
            ->map(fn (ResearchSubmission $submission): array => [
                'id' => $submission->id,
                'reference' => $submission->referenceNumber(),
                'title' => $submission->research_title,
                'abstract' => $submission->abstract,
                'researcher' => $submission->researcher->name,
                'researcherEmail' => $submission->researcher->email,
                'department' => data_get(
                    $submission->research_details,
                    'research.department',
                    '',
                ),
                'researchType' => $submission->researchField->name,
                'status' => $submission->status,
                'submittedAt' => $submission->submitted_at?->toISOString(),
                'documents' => collect($submission->research_details['documents'] ?? [])
                    ->map(fn (string $path): string => basename($path))
                    ->all(),
                'panels' => $submission->reviewPanels
                    ->sortByDesc('cycle_number')
                    ->values()
                    ->map(fn (ReviewPanel $panel): array => [
                        'id' => $panel->id,
                        'cycle' => $panel->cycle_number,
                        'status' => $panel->status,
                        'assignments' => $panel->assignments->map(
                            fn (PanelAssignment $assignment): array => [
                                'id' => $assignment->id,
                                'reviewer' => $assignment->reviewer->name,
                                'status' => $assignment->status,
                                'decision' => $assignment->reviews->last()?->decision,
                                'comment' => $assignment->reviews->last()?->overall_comment,
                            ],
                        ),
                    ]),
                'clearance' => $submission->clearances->first()?->certificate_number,
            ]);

        $reviewers = User::query()
            ->where('role', 'reviewer')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $notifications = DB::table('notifications')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->limit(10)
            ->get(['id', 'type', 'message', 'read_at', 'created_at']);

        return Inertia::render('Coordinator/Dashboard', [
            'applications' => $submissions,
            'reviewers' => $reviewers,
            'notifications' => $notifications,
            'clearances' => EthicsClearance::query()
                ->with('submission.researcher:id,name')
                ->latest('issued_at')
                ->get()
                ->map(fn (EthicsClearance $clearance): array => [
                    'id' => $clearance->id,
                    'certificateNumber' => $clearance->certificate_number,
                    'reference' => $clearance->submission->referenceNumber(),
                    'title' => $clearance->submission->research_title,
                    'researcher' => $clearance->submission->researcher->name,
                    'issuedAt' => $clearance->issued_at->format('M j, Y'),
                ]),
            'stats' => [
                'readyToAssign' => $submissions->whereIn('status', ['submitted', 'resubmitted'])->count(),
                'underReview' => $submissions->where('status', 'under_review')->count(),
                'revisionRequired' => $submissions->where('status', 'revision_required')->count(),
                'cleared' => $submissions->where('status', 'cleared')->count(),
            ],
        ]);
    }
}
