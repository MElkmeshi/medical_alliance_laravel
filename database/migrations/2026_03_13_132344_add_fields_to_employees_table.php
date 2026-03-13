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
        Schema::table('employees', function (Blueprint $table) {
            $table->string('sex')->nullable()->after('name');
            $table->string('nationality')->nullable()->after('sex');
            $table->string('home_address')->nullable()->after('national_id');
            $table->string('company_employee_number')->nullable()->after('home_address');
            $table->string('job_description')->nullable()->after('company_employee_number');
            $table->string('job_location')->nullable()->after('job_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['sex', 'nationality', 'home_address', 'company_employee_number', 'job_description', 'job_location']);
        });
    }
};
