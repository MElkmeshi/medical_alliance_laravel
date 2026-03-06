<?php

use App\Models\User;

test('admin users are redirected to admin dashboard after login', function () {
    $user = User::factory()->admin()->create([
        'password' => bcrypt('password'),
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect('/admin/dashboard');
});

test('company members are redirected to dashboard after login', function () {
    $user = User::factory()->companyMember()->create([
        'password' => bcrypt('password'),
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect('/company/dashboard');
});
