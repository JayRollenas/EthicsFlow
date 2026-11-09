<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EthicsClearance extends Model
{
    protected $fillable = [
        'submission_id',
        'review_panel_id',
        'certificate_number',
        'document_path',
        'issued_at',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
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
     * @return BelongsTo<ReviewPanel, $this>
     */
    public function reviewPanel(): BelongsTo
    {
        return $this->belongsTo(ReviewPanel::class, 'review_panel_id');
    }
}
