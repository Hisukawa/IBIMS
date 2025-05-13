<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResidentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Admin-only routes
Route::middleware(['auth', 'role:barangay_officer'])->prefix('barangay_officer')->group(function () {
    Route::get('dashboard', function () {
        return inertia('BarangayOfficer/Dashboard');
    })->name('barangay_officer.dashboard');

    Route::resource('resident', ResidentController::class);
    Route::resource('document', DocumentController::class);
    Route::resource('household', HouseholdController::class);
    Route::get('familytree/{resident}', [ResidentController::class, 'getFamilyTree'])->name('barangay_officer.familytree');
});

// Resident-only routes
Route::middleware(['auth', 'role:resident'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

// Routes accessible to both resident and admin users (verified users)
Route::middleware(['auth', 'verified', 'role:resident|barangay_officer'])->group(function () {
    // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome'); // Welcome page accessible to both admin and resident

require __DIR__.'/auth.php';
