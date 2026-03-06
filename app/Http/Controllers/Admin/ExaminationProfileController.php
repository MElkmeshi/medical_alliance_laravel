<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreExaminationProfileRequest;
use App\Http\Requests\Admin\UpdateExaminationProfileRequest;
use App\Models\Examination;
use App\Models\ExaminationProfile;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExaminationProfileController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/examination-profiles/index', [
            'profiles' => ExaminationProfile::query()
                ->withCount('examinations')
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/examination-profiles/create', [
            'examinations' => Examination::query()->where('is_active', true)->get(),
        ]);
    }

    public function store(StoreExaminationProfileRequest $request): RedirectResponse
    {
        $profile = ExaminationProfile::create($request->safe()->except('examinations'));

        $profile->examinations()->sync(
            collect($request->validated('examinations'))->mapWithKeys(fn ($id, $index) => [$id => ['sort_order' => $index]])
        );

        return redirect()->route('admin.examination-profiles.index');
    }

    public function show(ExaminationProfile $examinationProfile): Response
    {
        $examinationProfile->load('examinations');

        return Inertia::render('admin/examination-profiles/show', [
            'profile' => $examinationProfile,
        ]);
    }

    public function edit(ExaminationProfile $examinationProfile): Response
    {
        $examinationProfile->load('examinations');

        return Inertia::render('admin/examination-profiles/edit', [
            'profile' => $examinationProfile,
            'examinations' => Examination::query()->where('is_active', true)->get(),
        ]);
    }

    public function update(UpdateExaminationProfileRequest $request, ExaminationProfile $examinationProfile): RedirectResponse
    {
        $examinationProfile->update($request->safe()->except('examinations'));

        $examinationProfile->examinations()->sync(
            collect($request->validated('examinations'))->mapWithKeys(fn ($id, $index) => [$id => ['sort_order' => $index]])
        );

        return redirect()->route('admin.examination-profiles.index');
    }

    public function destroy(ExaminationProfile $examinationProfile): RedirectResponse
    {
        $examinationProfile->delete();

        return redirect()->route('admin.examination-profiles.index');
    }
}
