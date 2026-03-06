<?php

use App\Http\Middleware\EnsureUserIsCompanyMember;
use App\Models\User;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    Route::middleware(['web', EnsureUserIsCompanyMember::class])->get('/test-company', fn () => 'ok');
});

test('admin users receive a 403 response', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $response = $this->get('/test-company');
    $response->assertForbidden();
});

test('company members can access the route', function () {
    $user = User::factory()->companyMember()->create();
    $this->actingAs($user);

    $response = $this->get('/test-company');
    $response->assertOk();
});

test('unauthenticated users receive a 403 response', function () {
    $response = $this->get('/test-company');
    $response->assertForbidden();
});
