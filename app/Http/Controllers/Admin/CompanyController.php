<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompanyRequest;
use App\Http\Requests\Admin\UpdateCompanyRequest;
use App\Models\Company;
use App\Models\ExaminationProfile;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/companies/index', [
            'companies' => Company::query()
                ->withCount('employees')
                ->with('examinationProfiles')
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/companies/create', [
            'examinationProfiles' => ExaminationProfile::query()->where('is_active', true)->get(),
        ]);
    }

    public function store(StoreCompanyRequest $request): RedirectResponse
    {
        $company = Company::create($request->safe()->except('examination_profiles'));

        $company->examinationProfiles()->sync($request->validated('examination_profiles', []));

        return redirect()->route('admin.companies.index');
    }

    public function show(Company $company): Response
    {
        $company->load(['employees', 'examinationProfiles']);

        return Inertia::render('admin/companies/show', [
            'company' => $company,
        ]);
    }

    public function edit(Company $company): Response
    {
        $company->load('examinationProfiles');

        return Inertia::render('admin/companies/edit', [
            'company' => $company,
            'examinationProfiles' => ExaminationProfile::query()->where('is_active', true)->get(),
        ]);
    }

    public function update(UpdateCompanyRequest $request, Company $company): RedirectResponse
    {
        $company->update($request->safe()->except('examination_profiles'));

        $company->examinationProfiles()->sync($request->validated('examination_profiles', []));

        return redirect()->route('admin.companies.index');
    }

    public function destroy(Company $company): RedirectResponse
    {
        $company->delete();

        return redirect()->route('admin.companies.index');
    }
}
