<?php

use App\Models\Examination;
use App\Models\ExaminationProfile;
use App\Models\User;

test('admin can view profiles index', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.examination-profiles.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/examination-profiles/index'));
});

test('admin can create a profile with examinations', function () {
    $admin = User::factory()->admin()->create();
    $examinations = Examination::factory()->count(3)->create(['is_active' => true]);

    $data = [
        'name' => 'General Health Profile',
        'description' => 'A comprehensive health check',
        'is_active' => true,
        'examinations' => $examinations->pluck('id')->toArray(),
    ];

    $response = $this->actingAs($admin)->post(route('admin.examination-profiles.store'), $data);

    $response->assertRedirect(route('admin.examination-profiles.index'));
    $this->assertDatabaseHas('examination_profiles', ['name' => 'General Health Profile']);

    $profile = ExaminationProfile::query()->where('name', 'General Health Profile')->first();
    expect($profile->examinations)->toHaveCount(3);
});

test('admin can view profile details', function () {
    $admin = User::factory()->admin()->create();
    $profile = ExaminationProfile::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.examination-profiles.show', $profile));

    $response->assertOk();
});

test('admin can update a profile', function () {
    $admin = User::factory()->admin()->create();
    $profile = ExaminationProfile::factory()->create();
    $examinations = Examination::factory()->count(2)->create(['is_active' => true]);

    $data = [
        'name' => 'Updated Profile Name',
        'description' => 'Updated description',
        'is_active' => true,
        'examinations' => $examinations->pluck('id')->toArray(),
    ];

    $response = $this->actingAs($admin)->put(route('admin.examination-profiles.update', $profile), $data);

    $response->assertRedirect(route('admin.examination-profiles.index'));
    $this->assertDatabaseHas('examination_profiles', [
        'id' => $profile->id,
        'name' => 'Updated Profile Name',
    ]);
    expect($profile->fresh()->examinations)->toHaveCount(2);
});

test('admin can delete a profile', function () {
    $admin = User::factory()->admin()->create();
    $profile = ExaminationProfile::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.examination-profiles.destroy', $profile));

    $response->assertRedirect(route('admin.examination-profiles.index'));
    $this->assertDatabaseMissing('examination_profiles', ['id' => $profile->id]);
});

test('company member cannot access admin profiles', function () {
    $user = User::factory()->companyMember()->create();

    $response = $this->actingAs($user)->get(route('admin.examination-profiles.index'));

    $response->assertForbidden();
});
