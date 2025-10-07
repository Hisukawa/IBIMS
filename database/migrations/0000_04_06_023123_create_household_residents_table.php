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
        Schema::create('household_residents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->nullable()->constrained('residents')->onDelete('cascade');
            $table->foreignId('household_id')->nullable()->constrained('households')->onDelete('cascade');

            $table->string('relationship_to_head', 55)->nullable();
            $table->string('household_position', 55)->nullable();

            $table->boolean('is_household_head')->default(false); // quick filter
            $table->foreignId('family_id')->nullable()->constrained('families')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('household_residents');
    }
};
