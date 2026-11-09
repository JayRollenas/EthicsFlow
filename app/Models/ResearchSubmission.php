<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResearchSubmission extends Model
{
    protected $fillable = [
        'researcher_id',
        'research_field_id',
        'research_title',
        'abstract',
        'research_details',
        'status',
        'submitted_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'research_details' => 'array',
            'submitted_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function researcher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'researcher_id');
    }

    /**
     * @return BelongsTo<ResearchField, $this>
     */
    public function researchField(): BelongsTo
    {
        return $this->belongsTo(ResearchField::class);
    }

    /**
     * @return HasMany<SubmissionVersion, $this>
     */
    public function versions(): HasMany
    {
        return $this->hasMany(SubmissionVersion::class, 'submission_id');
    }

    /**
     * @return HasMany<ReviewPanel, $this>
     */
    public function reviewPanels(): HasMany
    {
        return $this->hasMany(ReviewPanel::class, 'submission_id');
    }

    /**
     * @return HasMany<EthicsClearance, $this>
     */
    public function clearances(): HasMany
    {
        return $this->hasMany(EthicsClearance::class, 'submission_id');
    }

    public function referenceNumber(): string
    {
        return sprintf(
            'REC-%s-%04d',
            $this->submitted_at?->format('Y') ?? $this->created_at->format('Y'),
            $this->getKey(),
        );
    }
}
