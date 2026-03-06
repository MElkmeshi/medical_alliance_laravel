<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('company.dashboard');
    })->name('dashboard');
});

Route::get('admin/login', function () {
    if (auth()->check()) {
        return redirect()->route('admin.dashboard');
    }

    return app(\Laravel\Fortify\Contracts\LoginViewResponse::class);
})->middleware('guest')->name('admin.login');

require __DIR__.'/settings.php';
