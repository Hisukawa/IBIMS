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
        Schema::create('senior_citizens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->integer('osca_id_number')->nullable();
            $table->enum('is_pensioner', ['yes', 'no', 'pending'])->nullable();
            $table->enum('pension_type', ['SSS', 'GSIS', 'DSWD', 'private', 'none'])->nullable();
            $table->boolean('living_alone')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('senior_citizens');
    }
};
