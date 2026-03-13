<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $employees = Employee::query()
            ->with('company')
            ->when($request->query('search'), fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('national_id', 'like', "%{$search}%")
                    ->orWhere('company_employee_number', 'like', "%{$search}%");
            }))
            ->when($request->query('company_id'), fn ($q, $id) => $q->where('company_id', $id))
            ->orderBy('name')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('admin/employees/index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'company_id']),
        ]);
    }

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
