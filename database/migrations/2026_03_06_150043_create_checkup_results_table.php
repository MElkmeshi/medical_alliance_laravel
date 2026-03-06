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
        Schema::create('checkup_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('checkup_id')->constrained()->cascadeOnDelete();
            $table->foreignId('examination_id')->constrained()->restrictOnDelete();
            $table->string('value')->nullable();
            $table->boolean('is_normal')->nullable();
            $table->string('document_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique(['checkup_id', 'examination_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checkup_results');
    }
};
