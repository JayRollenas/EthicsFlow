<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReviewPanel extends Model
{
    protected $fillable = [
        'submission_id',
        'coordinator_id',
        'cycle_number',
        'status',
        'assigned_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'completed_at' => 'datetime',
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
    public function coordinator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    /**
     * @return HasMany<PanelAssignment, $this>
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(PanelAssignment::class, 'panel_id');
    }
}
