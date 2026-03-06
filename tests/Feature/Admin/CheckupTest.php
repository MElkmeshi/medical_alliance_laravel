<?php

use App\Models\Checkup;
use App\Models\Employee;
use App\Models\Examination;
use App\Models\ExaminationProfile;
use App\Models\User;

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
