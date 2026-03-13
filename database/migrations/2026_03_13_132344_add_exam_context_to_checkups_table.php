<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('checkups', function (Blueprint $table) {
            $table->string('exam_type')->nullable()->after('checkup_date');
            $table->string('job_environment')->nullable()->after('exam_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('checkups', function (Blueprint $table) {
            $table->dropColumn(['exam_type', 'job_environment']);
        });
    }
};
