<?php

use App\Http\Controllers\Company\CheckupController;
use App\Http\Controllers\Company\DashboardController;
use App\Http\Controllers\Company\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'company_member'])->prefix('company')->name('company.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('employees', EmployeeController::class);
    Route::get('checkups/{checkup}', [CheckupController::class, 'show'])->name('checkups.show');
});
