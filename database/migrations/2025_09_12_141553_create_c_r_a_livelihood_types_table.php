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
        Schema::create('c_r_a_livelihood_types', function (Blueprint $table) {
            $table->id();
            $table->string('livelihood_name', 150); // e.g., farming, fishing, trading
            $table->text('description')->nullable(); // optional details
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_livelihood_types');
    }
};
