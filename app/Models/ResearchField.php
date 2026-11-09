<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResearchField extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * @return HasMany<ResearchSubmission, $this>
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(ResearchSubmission::class);
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function reviewers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'reviewer_fields');
    }
}
