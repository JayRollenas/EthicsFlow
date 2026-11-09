<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
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
Route::get('/dashboard', function (Request $request) {

    $user = $request->user();

    if ($user->role === 'researcher') {
        return Inertia::render('Dashboard');
    }

    if ($user->role === 'reviewer') {
        return Inertia::render('Reviewer/Dashboard');
    }

    if ($user->role === 'coordinator') {
        return Inertia::render('Coordinator/Dashboard');
    }

    abort(403, 'Unauthorized role.');

})->middleware(['auth', 'verified'])->name('dashboard');

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

Route::middleware(['auth', 'verified'])->get('/applications', function () {
    return Inertia::render('Applications/Index');
})->name('applications.index');

Route::middleware(['auth', 'verified'])->get('/requirements', function () {
    return Inertia::render('Requirements');
})->name('requirements.index');

Route::get('/notifications', function () {
    return Inertia::render('Notifications/Index');
})->name('notifications.index');


Route::middleware(['auth', 'verified'])->get('/applications/create', function () {
    return Inertia::render('Applications/Create');
})->name('applications.create');



require __DIR__.'/auth.php';
