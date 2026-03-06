<?php

use App\Models\Examination;
use App\Models\User;

test('admin can view examinations index', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.examinations.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/examinations/index'));
});

test('admin can view create examination form', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.examinations.create'));

    $response->assertOk();
});

test('admin can create an examination', function () {
    $admin = User::factory()->admin()->create();

    $data = [
        'name' => 'Blood Glucose Test',
        'description' => 'Measures blood sugar levels',
        'unit' => 'mg/dL',
        'min_value' => 70,
        'max_value' => 100,
        'is_required' => true,
        'requires_document' => false,
        'is_active' => true,
    ];

    $response = $this->actingAs($admin)->post(route('admin.examinations.store'), $data);

    $response->assertRedirect(route('admin.examinations.index'));
    $this->assertDatabaseHas('examinations', ['name' => 'Blood Glucose Test']);
});

test('admin can view edit examination form', function () {
    $admin = User::factory()->admin()->create();
    $examination = Examination::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.examinations.edit', $examination));

    $response->assertOk();
});

test('admin can update an examination', function () {
    $admin = User::factory()->admin()->create();
    $examination = Examination::factory()->create();

    $data = [
        'name' => 'Updated Examination Name',
        'description' => 'Updated description',
        'unit' => 'mmol/L',
        'min_value' => 10,
        'max_value' => 50,
        'is_required' => false,
        'requires_document' => true,
        'is_active' => true,
    ];

    $response = $this->actingAs($admin)->put(route('admin.examinations.update', $examination), $data);

    $response->assertRedirect(route('admin.examinations.index'));
    $this->assertDatabaseHas('examinations', [
        'id' => $examination->id,
        'name' => 'Updated Examination Name',
    ]);
});

test('admin can delete an examination', function () {
    $admin = User::factory()->admin()->create();
    $examination = Examination::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.examinations.destroy', $examination));

    $response->assertRedirect(route('admin.examinations.index'));
    $this->assertDatabaseMissing('examinations', ['id' => $examination->id]);
});

test('company member cannot access admin examinations', function () {
    $user = User::factory()->companyMember()->create();

    $response = $this->actingAs($user)->get(route('admin.examinations.index'));

    $response->assertForbidden();
});

test('validation fails with missing name', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.examinations.store'), [
        'description' => 'No name provided',
        'is_required' => true,
        'requires_document' => false,
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('name');
});
