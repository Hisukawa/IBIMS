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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->enum('request_status', ['pending', 'approved', 'denied', 'issued']);
            $table->text('purpose');
            $table->date('issued_at');
            $table->foreignId('issued_by')->constrained('barangay_officials')->onDelete('cascade'); // Assuming `users` is the table for issued_by.
            $table->text('docx_path')->nullable(); // Path to the certificate file
            $table->text('pdf_path')->nullable(); // Path to the generated PDF file, if applicable
            $table->string('control_number')->nullable(); // Optional control number field
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
