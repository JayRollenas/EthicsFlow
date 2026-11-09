<?php

use App\Http\Controllers\ApplicationsController;
use App\Http\Controllers\CoordinatorWorkflowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewerWorkflowController;
use App\Http\Controllers\RoleDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ROLE-BASED DASHBOARD
Route::get('/dashboard', RoleDashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])
    ->get('/applications/confirmation-preview', function () {

        // Only allow this sample screen in local development.
        abort_unless(app()->environment('local'), 404);

        return Inertia::render('Applications/Confirmation', [
            'demo' => true,

            'application' => [
                'referenceNumber' => 'REC-2026-0042',

                'title' => 'Student Experiences with Online Learning',

                'submittedAt' => 'October 26, 2026, 10:30 AM',

                'detailsUrl' => route('applications.index'),

                'downloadUrl' => null,
            ],
        ]);
    })
    ->name('applications.confirmation-preview');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/applications', [ApplicationsController::class, 'index'])
        ->name('applications.index');
    Route::post('/applications', [ApplicationsController::class, 'store'])
        ->name('applications.store');
    Route::get('/applications/{submission}/revision', [ApplicationsController::class, 'revision'])
        ->whereNumber('submission')
        ->name('applications.revision');
    Route::post('/applications/{submission}/revision', [ApplicationsController::class, 'resubmit'])
        ->whereNumber('submission')
        ->name('applications.resubmit');
    Route::get('/applications/{submission}/confirmation', [ApplicationsController::class, 'confirmation'])
        ->whereNumber('submission')
        ->name('applications.confirmation');
});

Route::middleware(['auth', 'verified'])->prefix('coordinator')->name('coordinator.')->group(function () {
    Route::post('/submissions/{submission}/panel', [CoordinatorWorkflowController::class, 'assignPanel'])
        ->name('submissions.panel');
    Route::get('/submissions/{submission}/documents/{document}', [CoordinatorWorkflowController::class, 'downloadDocument'])
        ->name('submissions.documents');
});

Route::middleware(['auth', 'verified'])->prefix('reviewer')->name('reviewer.')->group(function () {
    Route::post('/assignments/{assignment}/start', [ReviewerWorkflowController::class, 'startReview'])
        ->name('assignments.start');
    Route::post('/assignments/{assignment}/review', [ReviewerWorkflowController::class, 'submitReview'])
        ->name('assignments.review');
    Route::get('/assignments/{assignment}/documents/{document}', [ReviewerWorkflowController::class, 'downloadDocument'])
        ->name('assignments.documents');
});

Route::middleware(['auth', 'verified'])->get('/requirements', function () {
    return Inertia::render('Requirements');
})->name('requirements.index');

Route::get('/notifications', function () {
    return Inertia::render('Notifications/Index');
})->name('notifications.index');

Route::middleware(['auth', 'verified'])
    ->get('/applications/create', [ApplicationsController::class, 'create'])
    ->name('applications.create');

require __DIR__.'/auth.php';
