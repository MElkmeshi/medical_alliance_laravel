<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function show(Employee $employee): Response
    {
        $employee->load([
            'company.examinationProfiles',
            'checkups.examinationProfile',
            'checkups.results.examination',
        ]);

        return Inertia::render('admin/employees/show', [
            'employee' => $employee,
            'examinationProfiles' => $employee->company?->examinationProfiles ?? collect(),
        ]);
    }
}
