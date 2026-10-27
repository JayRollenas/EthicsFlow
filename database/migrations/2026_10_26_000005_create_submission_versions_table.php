<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submission_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')
                ->constrained('research_submissions');
            $table->unsignedInteger('version_number');

            $table->string('research_title');
            $table->text('abstract');
            $table->json('research_details')->nullable();
            $table->string('document_path', 500)->nullable();

            $table->foreignId('submitted_by')->constrained('users');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->unique(['submission_id', 'version_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submission_versions');
    }
};
