<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('panel_assignment_id')
                ->constrained('panel_assignments');
            $table->foreignId('submission_version_id')
                ->constrained('submission_versions');

            $table->enum('decision', [
                'pending',
                'approve',
                'disapprove',
            ])->default('pending');

            $table->text('overall_comment')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->unique([
                'panel_assignment_id',
                'submission_version_id',
            ], 'reviews_assignment_version_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
