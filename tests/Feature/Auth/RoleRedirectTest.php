<?php

use App\Models\User;

test('admin user login redirects to admin dashboard', function () {
    $user = User::factory()->admin()->create([
        'password' => bcrypt('password'),
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect('/admin/dashboard');
});

test('company member login redirects to dashboard', function () {
    $user = User::factory()->companyMember()->create([
        'password' => bcrypt('password'),
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect('/company/dashboard');
});

test('admin can access admin dashboard', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/dashboard');

    $response->assertOk();
});

test('company member cannot access admin dashboard', function () {
    $user = User::factory()->companyMember()->create();

    $response = $this->actingAs($user)->get('/admin/dashboard');

    $response->assertForbidden();
});

test('admin cannot access company routes', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/company/employees');

    $response->assertForbidden();
});

test('company member can access company dashboard', function () {
    $user = User::factory()->companyMember()->create();

    $response = $this->actingAs($user)->get('/company/dashboard');

    $response->assertOk();
});
