<?php

namespace App\Http\Controllers;

use App\Models\ResearchField;
use App\Models\ResearchSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class ApplicationsController extends Controller
{
    public function create(Request $request): Response
    {
        $this->ensureResearcher($request);

        return Inertia::render('Applications/Create');
    }

    public function index(Request $request): Response
    {
        $this->ensureResearcher($request);

        $applications = $request->user()
            ->researchSubmissions()
            ->whereNotNull('submitted_at')
            ->latest('submitted_at')
            ->get([
                'id',
                'research_title',
                'research_details',
                'status',
                'submitted_at',
                'updated_at',
            ])
            ->map(fn (ResearchSubmission $submission): array => [
                'id' => $submission->id,
                'reference' => $this->reference($submission),
                'title' => $submission->research_title,
                'department' => data_get($submission->research_details, 'research.department', ''),
                'status' => $submission->status,
                'submittedAt' => $submission->submitted_at->toDateString(),
                'updatedAt' => $submission->updated_at->toDateString(),
            ])
            ->values();

        return Inertia::render('Applications/Index', [
            'applications' => $applications,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureResearcher($request);

        $validated = $request->validate([
            'research' => ['required', 'array'],
            'research.researchTitle' => ['required', 'string', 'max:255'],
            'research.department' => ['required', 'string', 'max:150'],
            'research.researchType' => ['required', 'string', 'max:100'],
            'research.studyDescription' => ['required', 'string', 'max:20000'],
            'research.proposedStartDate' => ['required', 'date'],
            'research.proposedEndDate' => ['required', 'date', 'after_or_equal:research.proposedStartDate'],
            'team' => ['required', 'array'],
            'team.primary' => ['required', 'array'],
            'team.primary.fullName' => ['required', 'string', 'max:255'],
            'team.primary.email' => ['required', 'email', 'max:255'],
            'team.primary.studentNumber' => ['required', 'string', 'max:100'],
            'team.primary.contactNumber' => ['required', 'string', 'max:50'],
            'team.members' => ['nullable', 'array', 'max:20'],
            'team.members.*.fullName' => ['nullable', 'string', 'max:255'],
            'team.members.*.email' => ['nullable', 'email', 'max:255'],
            'team.members.*.studentNumber' => ['nullable', 'string', 'max:100'],
            'team.adviser' => ['required', 'array'],
            'team.adviser.fullName' => ['required', 'string', 'max:255'],
            'team.adviser.email' => ['required', 'email', 'max:255'],
            'team.adviser.department' => ['required', 'string', 'max:150'],
            'ethics' => ['required', 'array'],
            'ethics.humanParticipants' => ['required', 'in:yes,no'],
            'ethics.vulnerableGroups' => ['required', 'in:yes,no,na'],
            'ethics.consent' => ['required', 'string', 'max:10000'],
            'ethics.dataProtection' => ['required', 'string', 'max:10000'],
            'documents' => ['required', 'array'],
            'documents.manuscript' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            'documents.consent' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            'documents.instruments' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            'documents.supporting' => ['nullable', 'file', 'mimes:pdf,docx', 'max:10240'],
        ]);

        $storedPaths = [];

        try {
            $submission = DB::transaction(function () use ($request, $validated, &$storedPaths): ResearchSubmission {
                $research = $validated['research'];
                $researchField = ResearchField::firstOrCreate([
                    'name' => $research['researchType'],
                ]);
                $submittedAt = now();

                $submission = $request->user()->researchSubmissions()->create([
                    'research_field_id' => $researchField->id,
                    'research_title' => $research['researchTitle'],
                    'abstract' => $research['studyDescription'],
                    'research_details' => [
                        'research' => $research,
                        'team' => $validated['team'],
                        'ethics' => $validated['ethics'],
                    ],
                    'status' => 'submitted',
                    'submitted_at' => $submittedAt,
                ]);

                $documentPaths = [];

                foreach ($validated['documents'] as $name => $file) {
                    if (! $file instanceof UploadedFile) {
                        continue;
                    }

                    $path = $file->store("submissions/{$submission->id}", 'local');

                    if ($path === false) {
                        throw new RuntimeException('An uploaded application document could not be stored.');
                    }

                    $storedPaths[] = $path;
                    $documentPaths[$name] = $path;
                }

                $researchDetails = [
                    'research' => $research,
                    'team' => $validated['team'],
                    'ethics' => $validated['ethics'],
                    'documents' => $documentPaths,
                ];

                $submission->research_details = $researchDetails;
                $submission->save();

                DB::table('submission_versions')->insert([
                    'submission_id' => $submission->id,
                    'version_number' => 1,
                    'research_title' => $submission->research_title,
                    'abstract' => $submission->abstract,
                    'research_details' => json_encode($researchDetails, JSON_THROW_ON_ERROR),
                    'document_path' => $documentPaths['manuscript'],
                    'submitted_by' => $request->user()->id,
                    'submitted_at' => $submittedAt,
                    'created_at' => $submittedAt,
                    'updated_at' => $submittedAt,
                ]);

                return $submission;
            });
        } catch (Throwable $exception) {
            Storage::disk('local')->delete($storedPaths);

            throw $exception;
        }

        return redirect()->route('applications.confirmation', $submission);
    }

    public function revision(Request $request, ResearchSubmission $submission): Response
    {
        $this->ensureResearcher($request);
        abort_unless($submission->researcher_id === $request->user()->id, 404);
        abort_unless($submission->status === 'revision_required', 404);

        $version = $submission->versions()->latest('version_number')->firstOrFail();
        $details = $version->research_details ?? [];
        $lastPanel = $submission->reviewPanels()
            ->with('assignments.reviews')
            ->latest('cycle_number')
            ->first();

        $reviewerFeedback = $lastPanel?->assignments
            ->flatMap(fn ($assignment) => $assignment->reviews)
            ->where('decision', 'disapprove')
            ->pluck('overall_comment')
            ->filter()
            ->values()
            ->all() ?? [];

        return Inertia::render('Applications/Revision', [
            'submission' => [
                'id' => $submission->id,
                'reference' => $submission->referenceNumber(),
                'title' => $version->research_title,
                'abstract' => $version->abstract,
                'department' => data_get($details, 'research.department', ''),
                'reviewerFeedback' => $reviewerFeedback,
                'documents' => collect($details['documents'] ?? [])
                    ->map(fn (string $path): array => [
                        'fileName' => basename($path),
                    ])
                    ->all(),
            ],
        ]);
    }

    public function resubmit(Request $request, ResearchSubmission $submission): RedirectResponse
    {
        $this->ensureResearcher($request);
        abort_unless($submission->researcher_id === $request->user()->id, 404);
        abort_unless($submission->status === 'revision_required', 409);

        $validated = $request->validate([
            'research_title' => ['required', 'string', 'max:255'],
            'abstract' => ['required', 'string', 'max:20000'],
            'documents' => ['nullable', 'array'],
            'documents.manuscript' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'documents.consent' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'documents.instruments' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'documents.supporting' => ['nullable', 'file', 'mimes:pdf,docx', 'max:10240'],
        ]);

        $uploads = $validated['documents'] ?? [];

        $storedPaths = [];

        try {
            DB::transaction(function () use ($request, $submission, $validated, $uploads, &$storedPaths): void {
                $previousVersion = $submission->versions()
                    ->latest('version_number')
                    ->firstOrFail();
                $details = $previousVersion->research_details ?? [];
                $research = $details['research'] ?? [];
                $research['researchTitle'] = $validated['research_title'];
                $research['studyDescription'] = $validated['abstract'];
                $details['research'] = $research;

                $paths = $details['documents'] ?? [];

                foreach ($uploads as $document => $file) {
                    if (! $file instanceof UploadedFile) {
                        continue;
                    }

                    $path = $file->store("submissions/{$submission->id}", 'local');
                    if ($path === false) {
                        throw new RuntimeException('A replacement application document could not be stored.');
                    }

                    $storedPaths[] = $path;
                    $paths[$document] = $path;
                }

                $details['documents'] = $paths;
                $now = now();
                $nextVersion = (int) $previousVersion->version_number + 1;

                $submission->versions()->create([
                    'version_number' => $nextVersion,
                    'research_title' => $validated['research_title'],
                    'abstract' => $validated['abstract'],
                    'research_details' => $details,
                    'document_path' => $paths['manuscript'],
                    'submitted_by' => $request->user()->id,
                    'submitted_at' => $now,
                ]);

                $submission->research_title = $validated['research_title'];
                $submission->abstract = $validated['abstract'];
                $submission->research_details = $details;
                $submission->status = 'resubmitted';
                $submission->submitted_at = $now;
                $submission->save();

                $coordinatorIds = DB::table('users')
                    ->where('role', 'coordinator')
                    ->pluck('id');

                foreach ($coordinatorIds as $coordinatorId) {
                    DB::table('notifications')->insert([
                        'user_id' => $coordinatorId,
                        'submission_id' => $submission->id,
                        'type' => 'application_resubmitted',
                        'message' => "Application {$submission->referenceNumber()} has been resubmitted and is ready for reviewer assignment.",
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            });
        } catch (Throwable $exception) {
            Storage::disk('local')->delete($storedPaths);

            throw $exception;
        }

        return redirect()->route('applications.confirmation', $submission);
    }

    public function confirmation(Request $request, ResearchSubmission $submission): Response
    {
        $this->ensureResearcher($request);
        abort_unless(
            $request->user()->researchSubmissions()
                ->whereKey($submission->getKey())
                ->exists(),
            404,
        );
        abort_unless($submission->submitted_at !== null, 404);

        return Inertia::render('Applications/Confirmation', [
            'demo' => false,
            'application' => [
                'referenceNumber' => $this->reference($submission),
                'title' => $submission->research_title,
                'submittedAt' => $submission->submitted_at->format('F j, Y, g:i A'),
                'detailsUrl' => route('applications.index'),
                'downloadUrl' => null,
            ],
        ]);
    }

    private function ensureResearcher(Request $request): void
    {
        abort_unless($request->user()?->role === 'researcher', 403);
    }

    private function reference(ResearchSubmission $submission): string
    {
        return sprintf(
            'REC-%s-%04d',
            $submission->submitted_at?->format('Y') ?? $submission->created_at->format('Y'),
            $submission->id,
        );
    }
}
