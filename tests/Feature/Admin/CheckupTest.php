<?php

use App\Models\Checkup;
use App\Models\Employee;
use App\Models\Examination;
use App\Models\ExaminationProfile;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('admin can view checkups index', function () {
    $admin = User::factory()->admin()->create();
    Checkup::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.checkups.index'));

    $response->assertOk();
});

test('admin can filter checkups by status', function () {
    $admin = User::factory()->admin()->create();
    Checkup::factory()->create(['status' => 'pending']);
    Checkup::factory()->create(['status' => 'pass']);

    $response = $this->actingAs($admin)->get(route('admin.checkups.index', ['status' => 'pending']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/checkups/index')
        ->where('checkups.data.0.status', 'pending')
        ->where('checkups.total', 1)
    );
});

test('admin can view checkup create form', function () {
    $admin = User::factory()->admin()->create();
    $employee = Employee::factory()->create();
    $profile = ExaminationProfile::factory()->create();
    $examinations = Examination::factory()->count(2)->create(['is_required' => true]);
    $profile->examinations()->sync($examinations->pluck('id'));

    $response = $this->actingAs($admin)->get(route('admin.checkups.create', [
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
    ]));

    $response->assertOk();
});

test('admin can create a checkup with results and status is pass when all required exams are normal', function () {
    $admin = User::factory()->admin()->create();
    $employee = Employee::factory()->create();
    $profile = ExaminationProfile::factory()->create();
    $examinations = Examination::factory()->count(2)->create(['is_required' => true]);
    $profile->examinations()->sync($examinations->pluck('id'));

    $data = [
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
        'checkup_date' => '2026-03-06',
        'notes' => 'Routine checkup',
        'results' => $examinations->map(fn ($exam) => [
            'examination_id' => $exam->id,
            'value' => '95',
            'is_normal' => true,
            'notes' => null,
        ])->toArray(),
    ];

    $response = $this->actingAs($admin)->post(route('admin.checkups.store'), $data);

    $checkup = Checkup::query()->where('employee_id', $employee->id)->first();
    $response->assertRedirect(route('admin.checkups.show', $checkup));
    expect($checkup->status)->toBe('pass');
    expect($checkup->results)->toHaveCount(2);
});

test('checkup status is fail when any required exam is abnormal', function () {
    $admin = User::factory()->admin()->create();
    $employee = Employee::factory()->create();
    $profile = ExaminationProfile::factory()->create();
    $examinations = Examination::factory()->count(2)->create(['is_required' => true]);
    $profile->examinations()->sync($examinations->pluck('id'));

    $data = [
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
        'checkup_date' => '2026-03-06',
        'results' => [
            [
                'examination_id' => $examinations[0]->id,
                'value' => '95',
                'is_normal' => true,
            ],
            [
                'examination_id' => $examinations[1]->id,
                'value' => '250',
                'is_normal' => false,
            ],
        ],
    ];

    $this->actingAs($admin)->post(route('admin.checkups.store'), $data);

    $checkup = Checkup::query()->where('employee_id', $employee->id)->first();
    expect($checkup->status)->toBe('fail');
});

test('checkup status is pending when results are incomplete', function () {
    $admin = User::factory()->admin()->create();
    $employee = Employee::factory()->create();
    $profile = ExaminationProfile::factory()->create();
    $examinations = Examination::factory()->count(2)->create(['is_required' => true]);
    $profile->examinations()->sync($examinations->pluck('id'));

    $data = [
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
        'checkup_date' => '2026-03-06',
        'results' => [
            [
                'examination_id' => $examinations[0]->id,
                'value' => '95',
            ],
            [
                'examination_id' => $examinations[1]->id,
                'value' => '100',
            ],
        ],
    ];

    $this->actingAs($admin)->post(route('admin.checkups.store'), $data);

    $checkup = Checkup::query()->where('employee_id', $employee->id)->first();
    expect($checkup->status)->toBe('pending');
});

test('admin can view checkup details', function () {
    $admin = User::factory()->admin()->create();
    $checkup = Checkup::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.checkups.show', $checkup));

    $response->assertOk();
});

test('admin can view the fill results form for a pending checkup', function () {
    $admin = User::factory()->admin()->create();
    $profile = ExaminationProfile::factory()->create();
    $examinations = Examination::factory()->count(2)->create();
    $profile->examinations()->sync($examinations->pluck('id'));
    $checkup = Checkup::factory()->create([
        'examination_profile_id' => $profile->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.checkups.edit', $checkup));

    $response->assertOk();
});

test('admin can submit results for an existing checkup', function () {
    $admin = User::factory()->admin()->create();
    $employee = Employee::factory()->create();
    $profile = ExaminationProfile::factory()->create();
    $examinations = Examination::factory()->count(2)->create(['is_required' => true]);
    $profile->examinations()->sync($examinations->pluck('id'));
    $checkup = Checkup::factory()->create([
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->put(route('admin.checkups.update', $checkup), [
        'checkup_date' => now()->toDateString(),
        'results' => $examinations->map(fn ($exam) => [
            'examination_id' => $exam->id,
            'value' => '98',
            'is_normal' => true,
        ])->toArray(),
    ]);

    $response->assertRedirect(route('admin.checkups.show', $checkup));
    expect($checkup->fresh()->status)->toBe('pass');
    expect($checkup->fresh()->results)->toHaveCount(2);
});

test('company member cannot access admin checkups', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create();
    $profile = ExaminationProfile::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.checkups.create', [
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
    ]));

    $response->assertForbidden();
});
