<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubmissionVersion extends Model
{
    protected $fillable = [
        'submission_id',
        'version_number',
        'research_title',
        'abstract',
        'research_details',
        'document_path',
        'submitted_by',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'research_details' => 'array',
            'submitted_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<ResearchSubmission, $this>
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(ResearchSubmission::class, 'submission_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    /**
     * @return HasMany<Review, $this>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'submission_version_id');
    }
}
