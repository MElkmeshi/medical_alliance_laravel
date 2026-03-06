<?php

use App\Models\Employee;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('company member can view employees index', function () {
    $user = User::factory()->companyMember()->create();

    $response = $this->actingAs($user)->get(route('company.employees.index'));

    $response->assertOk();
});

test('company member can create an employee', function () {
    $user = User::factory()->companyMember()->create();

    $response = $this->actingAs($user)->post(route('company.employees.store'), [
        'name' => fake()->name(),
        'national_id' => fake()->numerify('##########'),
        'date_of_birth' => fake()->date(),
        'phone' => fake()->phoneNumber(),
        'email' => fake()->safeEmail(),
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('employees', [
        'company_id' => $user->company_id,
    ]);
});

test('company member can view employee details', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create(['company_id' => $user->company_id]);

    $response = $this->actingAs($user)->get(route('company.employees.show', $employee));

    $response->assertOk();
});

test('company member can update an employee', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create(['company_id' => $user->company_id]);

    $updatedName = fake()->name();

    $response = $this->actingAs($user)->put(route('company.employees.update', $employee), [
        'name' => $updatedName,
        'national_id' => $employee->national_id,
        'date_of_birth' => $employee->date_of_birth->format('Y-m-d'),
        'phone' => $employee->phone,
        'email' => $employee->email,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('employees', [
        'id' => $employee->id,
        'name' => $updatedName,
    ]);
});

test('company member can delete an employee', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create(['company_id' => $user->company_id]);

    $response = $this->actingAs($user)->delete(route('company.employees.destroy', $employee));

    $response->assertRedirect();
    $this->assertDatabaseMissing('employees', [
        'id' => $employee->id,
    ]);
});

test('company member cannot view another company\'s employee', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create();

    $response = $this->actingAs($user)->get(route('company.employees.show', $employee));

    $response->assertForbidden();
});

test('company member cannot update another company\'s employee', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create();

    $response = $this->actingAs($user)->put(route('company.employees.update', $employee), [
        'name' => fake()->name(),
        'national_id' => $employee->national_id,
    ]);

    $response->assertForbidden();
});

test('company member cannot delete another company\'s employee', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create();

    $response = $this->actingAs($user)->delete(route('company.employees.destroy', $employee));

    $response->assertForbidden();
});

test('admin cannot access company employee routes', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('company.employees.index'));

    $response->assertForbidden();
});

test('validation fails with missing name', function () {
    $user = User::factory()->companyMember()->create();

    $response = $this->actingAs($user)->post(route('company.employees.store'), [
        'national_id' => fake()->numerify('##########'),
        'date_of_birth' => fake()->date(),
        'phone' => fake()->phoneNumber(),
        'email' => fake()->safeEmail(),
    ]);

    $response->assertSessionHasErrors('name');
});

test('validation fails with duplicate national_id', function () {
    $user = User::factory()->companyMember()->create();
    $existingEmployee = Employee::factory()->create(['company_id' => $user->company_id]);

    $response = $this->actingAs($user)->post(route('company.employees.store'), [
        'name' => fake()->name(),
        'national_id' => $existingEmployee->national_id,
        'date_of_birth' => fake()->date(),
        'phone' => fake()->phoneNumber(),
        'email' => fake()->safeEmail(),
    ]);

    $response->assertSessionHasErrors('national_id');
});
