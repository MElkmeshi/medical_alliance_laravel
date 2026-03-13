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

test('company member can request a checkup for their employee', function () {
    $user = User::factory()->companyMember()->create();
    $employee = Employee::factory()->create(['company_id' => $user->company_id]);
    $profile = ExaminationProfile::factory()->create(['is_active' => true]);

    $response = $this->actingAs($user)->post(route('company.checkups.store'), [
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
        'checkup_date' => now()->toDateString(),
        'exam_type' => 'pre_employment',
        'job_environment' => 'office',
    ]);

    $response->assertRedirect(route('company.employees.show', $employee));
    $this->assertDatabaseHas('checkups', [
        'employee_id' => $employee->id,
        'examination_profile_id' => $profile->id,
        'status' => 'pending',
    ]);
});

test('company member cannot request a checkup for another company\'s employee', function () {
    $user = User::factory()->companyMember()->create();
    $otherEmployee = Employee::factory()->create();
    $profile = ExaminationProfile::factory()->create(['is_active' => true]);

    $response = $this->actingAs($user)->post(route('company.checkups.store'), [
        'employee_id' => $otherEmployee->id,
        'examination_profile_id' => $profile->id,
        'checkup_date' => now()->toDateString(),
    ]);

    $response->assertNotFound();
    $this->assertDatabaseMissing('checkups', [
        'employee_id' => $otherEmployee->id,
    ]);
});
