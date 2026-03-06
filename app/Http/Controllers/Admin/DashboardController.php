<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Checkup;
use App\Models\Company;
use App\Models\Employee;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'companiesCount' => Company::query()->count(),
            'employeesCount' => Employee::query()->count(),
            'checkupsCount' => Checkup::query()->count(),
            'recentCheckups' => Checkup::query()
                ->with(['employee.company', 'examinationProfile', 'performer'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
