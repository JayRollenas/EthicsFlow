<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            return;
        }

        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'role' => 'researcher',
                'email_verified_at' => now(),
            ],
        );

        foreach ([
            [
                'name' => 'Student User',
                'email' => 'student@email.com',
                'password' => 'Password123!',
                'role' => 'researcher',
            ],
            [
                'name' => 'Elena Garcia',
                'email' => 'elena.garcia@example.test',
                'password' => 'elena123',
                'role' => 'reviewer',
            ],
            [
                'name' => 'Reviewer One',
                'email' => 'reviewer1@example.test',
                'password' => 'Reviewer123!',
                'role' => 'reviewer',
            ],
            [
                'name' => 'Reviewer Two',
                'email' => 'reviewer2@example.test',
                'password' => 'Reviewer123!',
                'role' => 'reviewer',
            ],
            [
                'name' => 'Reviewer Three',
                'email' => 'reviewer3@example.test',
                'password' => 'Reviewer123!',
                'role' => 'reviewer',
            ],
            [
                'name' => 'Reviewer Four',
                'email' => 'reviewer4@example.test',
                'password' => 'Reviewer123!',
                'role' => 'reviewer',
            ],
            [
                'name' => 'Reviewer Five',
                'email' => 'reviewer5@example.test',
                'password' => 'Reviewer123!',
                'role' => 'reviewer',
            ],
            [
                'name' => 'Reviewer Six',
                'email' => 'reviewer6@example.test',
                'password' => 'Reviewer123!',
                'role' => 'reviewer',
            ],
            [
                'name' => 'Reviewer Seven',
                'email' => 'reviewer7@example.test',
                'password' => 'Reviewer123!',
                'role' => 'reviewer',
            ],
            [
                'name' => 'Reviewer Eight',
                'email' => 'reviewer8@example.test',
                'password' => 'Reviewer123!',
                'role' => 'reviewer',
            ],
            [
                'name' => 'Liza Cruz',
                'email' => 'liza.cruz@example.test',
                'password' => 'coortest@123!',
                'role' => 'coordinator',
            ],
        ] as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                [...$account, 'email_verified_at' => now()],
            );
        }
    }
}
