<?php

use App\Models\Checkup;
use App\Models\Employee;
use App\Models\ExaminationProfile;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('company member can view own employee\'s checkup', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create(['company_id' => $user->company_id]);
    $profile = ExaminationProfile::factory()->create();
    $checkup = Checkup::factory()->create([
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
    ]);

    $response = $this->actingAs($user)->get(route('company.checkups.show', $checkup));

    $response->assertOk();
});

test('company member cannot view another company\'s checkup', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create();
    $profile = ExaminationProfile::factory()->create();
    $checkup = Checkup::factory()->create([
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
    ]);

    $response = $this->actingAs($user)->get(route('company.checkups.show', $checkup));

    $response->assertForbidden();
});
