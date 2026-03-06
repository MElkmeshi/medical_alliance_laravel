<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use App\Models\User;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    Route::middleware(['web', EnsureUserIsAdmin::class])->get('/test-admin', fn () => 'ok');
});

test('non-admin users receive a 403 response', function () {
    $user = User::factory()->companyMember()->create();
    $this->actingAs($user);

    $response = $this->get('/test-admin');
    $response->assertForbidden();
});

test('admin users can access the route', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $response = $this->get('/test-admin');
    $response->assertOk();
});

test('unauthenticated users receive a 403 response', function () {
    $response = $this->get('/test-admin');
    $response->assertForbidden();
});
