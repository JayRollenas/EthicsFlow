<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'name',
    'first_name',
    'last_name',
    'email',
    'student_number',
    'campus',
    'academic_level',
    'department',
    'password',
    'role',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * @return HasMany<ResearchSubmission, $this>
     */
    public function researchSubmissions(): HasMany
    {
        return $this->hasMany(ResearchSubmission::class, 'researcher_id');
    }

    /**
     * @return HasMany<PanelAssignment, $this>
     */
    public function panelAssignments(): HasMany
    {
        return $this->hasMany(PanelAssignment::class, 'reviewer_id');
    }

    /**
     * @return BelongsToMany<ResearchField, $this>
     */
    public function researchFields(): BelongsToMany
    {
        return $this->belongsToMany(ResearchField::class, 'reviewer_fields');
    }
}
