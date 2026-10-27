<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ethics_clearances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')
                ->unique()
                ->constrained('research_submissions');
            $table->foreignId('review_panel_id')
                ->constrained('review_panels');

            $table->string('certificate_number', 100)->unique();
            $table->string('document_path', 500)->nullable();
            $table->timestamp('issued_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ethics_clearances');
    }
};
