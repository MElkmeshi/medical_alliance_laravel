<?php

use App\Models\Company;
use App\Models\ExaminationProfile;
use App\Models\User;

test('admin can view companies index', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.companies.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/companies/index'));
});

test('admin can create a company with profiles', function () {
    $admin = User::factory()->admin()->create();
    $profiles = ExaminationProfile::factory()->count(2)->create(['is_active' => true]);

    $data = [
        'name' => 'Acme Corporation',
        'contact_person' => 'John Doe',
        'email' => 'john@acme.com',
        'phone' => '123-456-7890',
        'address' => '123 Main St',
        'is_active' => true,
        'examination_profiles' => $profiles->pluck('id')->toArray(),
    ];

    $response = $this->actingAs($admin)->post(route('admin.companies.store'), $data);

    $response->assertRedirect(route('admin.companies.index'));
    $this->assertDatabaseHas('companies', ['name' => 'Acme Corporation']);

    $company = Company::query()->where('name', 'Acme Corporation')->first();
    expect($company->examinationProfiles)->toHaveCount(2);
});

test('admin can view company details', function () {
    $admin = User::factory()->admin()->create();
    $company = Company::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.companies.show', $company));

    $response->assertOk();
});

test('admin can update a company', function () {
    $admin = User::factory()->admin()->create();
    $company = Company::factory()->create();
    $profiles = ExaminationProfile::factory()->count(3)->create(['is_active' => true]);

    $data = [
        'name' => 'Updated Company Name',
        'contact_person' => 'Jane Doe',
        'email' => 'jane@updated.com',
        'phone' => '987-654-3210',
        'address' => '456 Other St',
        'is_active' => true,
        'examination_profiles' => $profiles->pluck('id')->toArray(),
    ];

    $response = $this->actingAs($admin)->put(route('admin.companies.update', $company), $data);

    $response->assertRedirect(route('admin.companies.index'));
    $this->assertDatabaseHas('companies', [
        'id' => $company->id,
        'name' => 'Updated Company Name',
    ]);
    expect($company->fresh()->examinationProfiles)->toHaveCount(3);
});

test('admin can delete a company', function () {
    $admin = User::factory()->admin()->create();
    $company = Company::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.companies.destroy', $company));

    $response->assertRedirect(route('admin.companies.index'));
    $this->assertDatabaseMissing('companies', ['id' => $company->id]);
});

test('company member cannot access admin companies', function () {
    $user = User::factory()->companyMember()->create();

    $response = $this->actingAs($user)->get(route('admin.companies.index'));

    $response->assertForbidden();
});
