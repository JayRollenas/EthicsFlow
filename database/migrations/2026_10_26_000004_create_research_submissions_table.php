<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('research_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('researcher_id')->constrained('users');
            $table->foreignId('research_field_id')->constrained('research_fields');

            $table->string('research_title');
            $table->text('abstract');
            $table->json('research_details')->nullable();

            $table->enum('status', [
                'draft',
                'submitted',
                'under_review',
                'revision_required',
                'resubmitted',
                'approved',
                'cleared',
                'withdrawn',
            ])->default('draft');

            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->index(['researcher_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('research_submissions');
    }
};
