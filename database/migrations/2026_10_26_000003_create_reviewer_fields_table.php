<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviewer_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewer_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('research_field_id')
                ->constrained('research_fields')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['reviewer_id', 'research_field_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviewer_fields');
    }
};
