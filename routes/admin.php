<?php

use App\Http\Controllers\Admin\CheckupController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\ExaminationController;
use App\Http\Controllers\Admin\ExaminationProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('examinations', ExaminationController::class);
    Route::resource('examination-profiles', ExaminationProfileController::class);
    Route::resource('companies', CompanyController::class);
    Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::get('employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
    Route::resource('checkups', CheckupController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update']);
});
