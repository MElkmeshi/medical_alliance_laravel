<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Checkup;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $company = auth()->user()->company;

        return Inertia::render('company/dashboard', [
            'company' => $company,
            'employeesCount' => $company->employees()->count(),
            'recentCheckups' => Checkup::query()
                ->whereHas('employee', fn ($q) => $q->where('company_id', $company->id))
                ->with(['employee', 'examinationProfile'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
