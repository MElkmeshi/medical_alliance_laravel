<?php

use App\Models\Checkup;
use App\Models\CheckupResult;
use App\Models\Company;
use App\Models\Employee;
use App\Models\Examination;
use App\Models\ExaminationProfile;
use App\Models\User;
use Database\Seeders\MedicalDataSeeder;

beforeEach(function () {
    $this->seed(MedicalDataSeeder::class);
});

test('it creates 68 examinations', function () {
    expect(Examination::count())->toBe(68);
});

test('it creates examinations with correct attributes', function () {
    $bloodSugar = Examination::where('name', 'Blood Sugar (Fasting)')->first();

    expect($bloodSugar)
        ->not->toBeNull()
        ->unit->toBe('mmol/l')
        ->is_required->toBeTrue();

    $chestXray = Examination::where('name', 'Chest X-Ray')->first();

    expect($chestXray)
        ->not->toBeNull()
        ->is_required->toBeTrue()
        ->requires_document->toBeTrue();
});

test('it creates 4 examination profiles with correct exam counts', function () {
    expect(ExaminationProfile::count())->toBe(4);

    $slb = ExaminationProfile::where('name', 'SLB MedCheck Full')->first();
    expect($slb->examinations)->toHaveCount(68);

    $oilField = ExaminationProfile::where('name', 'Oil Field Pre-Employment')->first();
    expect($oilField->examinations)->toHaveCount(56);

    $annual = ExaminationProfile::where('name', 'Annual Health Checkup')->first();
    expect($annual->examinations)->toHaveCount(43);

    $executive = ExaminationProfile::where('name', 'Executive Health Screening')->first();
    expect($executive->examinations)->toHaveCount(60);
});

test('it creates 3 companies with profiles assigned', function () {
    expect(Company::count())->toBe(3);

    $petroGulf = Company::where('name', 'PetroGulf Engineering')->first();
    expect($petroGulf->examinationProfiles)->toHaveCount(3);

    $atlas = Company::where('name', 'Atlas Mining Corp')->first();
    expect($atlas->examinationProfiles)->toHaveCount(2);

    $global = Company::where('name', 'Global Construction Ltd')->first();
    expect($global->examinationProfiles)->toHaveCount(2);
});

test('it creates an admin user and 3 company users', function () {
    expect(User::count())->toBe(4);

    $admin = User::where('email', 'admin@example.com')->first();
    expect($admin)
        ->role->toBe('admin')
        ->company_id->toBeNull();

    $petroGulfUser = User::where('email', 'petrogulf@example.com')->first();
    expect($petroGulfUser)
        ->role->toBe('company_member')
        ->company_id->not->toBeNull();
});

test('it creates employees for each company', function () {
    expect(Employee::count())->toBe(10);

    $petroGulf = Company::where('name', 'PetroGulf Engineering')->first();
    expect($petroGulf->employees)->toHaveCount(3);

    $atlas = Company::where('name', 'Atlas Mining Corp')->first();
    expect($atlas->employees)->toHaveCount(4);

    $global = Company::where('name', 'Global Construction Ltd')->first();
    expect($global->employees)->toHaveCount(3);
});

test('it creates sample checkups with correct statuses', function () {
    expect(Checkup::count())->toBe(3);

    $passCheckup = Checkup::whereHas('employee', fn ($q) => $q->where('name', 'Ahmad Al-Rashid'))->first();
    expect($passCheckup->status)->toBe('pass');

    $failCheckup = Checkup::whereHas('employee', fn ($q) => $q->where('name', 'John Smith'))->first();
    expect($failCheckup->status)->toBe('fail');

    $pendingCheckup = Checkup::whereHas('employee', fn ($q) => $q->where('name', 'Chen Wei'))->first();
    expect($pendingCheckup->status)->toBe('pending');
});

test('it creates checkup results for sample checkups', function () {
    // Ahmad: 68, John: 56, Chen: 24, Mohamed: 0
    expect(CheckupResult::count())->toBe(148);
});
