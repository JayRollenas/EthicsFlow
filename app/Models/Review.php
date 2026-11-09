<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Review extends Model
{
    protected $fillable = [
        'panel_assignment_id',
        'submission_version_id',
        'decision',
        'overall_comment',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<PanelAssignment, $this>
     */
    public function assignment(): BelongsTo
    {
        return $this->belongsTo(PanelAssignment::class, 'panel_assignment_id');
    }

    /**
     * @return BelongsTo<SubmissionVersion, $this>
     */
    public function submissionVersion(): BelongsTo
    {
        return $this->belongsTo(SubmissionVersion::class);
    }

    /**
     * @return HasMany<ReviewComment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(ReviewComment::class);
    }
}
