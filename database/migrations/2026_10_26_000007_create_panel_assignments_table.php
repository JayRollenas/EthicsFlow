<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('panel_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('panel_id')
                ->constrained('review_panels');
            $table->foreignId('reviewer_id')->constrained('users');

            $table->enum('status', [
                'assigned',
                'in_progress',
                'completed',
                'cancelled',
            ])->default('assigned');

            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['panel_id', 'reviewer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('panel_assignments');
    }
};
