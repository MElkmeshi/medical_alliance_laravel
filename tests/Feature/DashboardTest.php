<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get('/dashboard');
    $response->assertRedirect(route('login'));
});

test('authenticated admin users are redirected to admin dashboard', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $response = $this->get('/dashboard');
    $response->assertRedirect(route('admin.dashboard'));
});

test('authenticated company members are redirected to company dashboard', function () {
    $user = User::factory()->companyMember()->create();
    $this->actingAs($user);

    $response = $this->get('/dashboard');
    $response->assertRedirect(route('company.dashboard'));
});
