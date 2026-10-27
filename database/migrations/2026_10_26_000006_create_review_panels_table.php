<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('review_panels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')
                ->constrained('research_submissions');
            $table->foreignId('coordinator_id')->constrained('users');

            $table->unsignedInteger('cycle_number');
            $table->enum('status', [
                'pending_assignment',
                'in_review',
                'revision_required',
                'approved',
                'cancelled',
            ])->default('pending_assignment');

            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['submission_id', 'cycle_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_panels');
    }
};
