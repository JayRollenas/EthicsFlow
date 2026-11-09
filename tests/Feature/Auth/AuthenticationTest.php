<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Hash;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('provided demo accounts can authenticate with their assigned roles', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    $accounts = [
        ['student@email.com', 'Password123!', 'researcher'],
        ['elena.garcia@example.test', 'elena123', 'reviewer'],
        ['liza.cruz@example.test', 'coortest@123!', 'coordinator'],
    ];

    foreach ($accounts as [$email, $password, $role]) {
        $user = User::where('email', $email)->firstOrFail();

        expect($user->role)->toBe($role);

        $this->post('/login', [
            'email' => $email,
            'password' => $password,
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticatedAs($user);
        $this->post('/logout');
    }
});

test('local database seeder creates nine reusable reviewer accounts', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    $reviewers = User::query()->where('role', 'reviewer')->get();

    expect($reviewers)->toHaveCount(9);

    foreach (range(1, 8) as $number) {
        $reviewer = $reviewers->firstWhere('email', "reviewer{$number}@example.test");

        expect($reviewer)->not->toBeNull()
            ->and(Hash::check('Reviewer123!', $reviewer->password))->toBeTrue();
    }

    expect($reviewers->firstWhere('email', 'elena.garcia@example.test'))->not->toBeNull();
});

test('demo accounts are not seeded outside local and testing environments', function () {
    $this->app->detectEnvironment(fn () => 'production');

    $this->artisan('db:seed', [
        '--class' => DatabaseSeeder::class,
        '--force' => true,
    ])->assertExitCode(0);

    $this->assertDatabaseMissing('users', [
        'email' => 'student@email.com',
    ]);
    $this->assertDatabaseMissing('users', [
        'email' => 'elena.garcia@example.test',
    ]);
    $this->assertDatabaseMissing('users', [
        'email' => 'liza.cruz@example.test',
    ]);
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
