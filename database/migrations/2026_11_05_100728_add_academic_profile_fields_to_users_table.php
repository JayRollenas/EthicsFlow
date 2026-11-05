<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('student_number')->nullable()->unique()->after('email');
            $table->string('campus')->nullable()->after('student_number');
            $table->string('academic_level')->nullable()->after('campus');
            $table->string('department')->nullable()->after('academic_level');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['student_number']);

            $table->dropColumn([
                'first_name',
                'last_name',
                'student_number',
                'campus',
                'academic_level',
                'department',
            ]);
        });
    }
};