<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreEmployeeRequest;
use App\Http\Requests\Company\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        $employees = Employee::query()
            ->where('company_id', auth()->user()->company_id)
            ->latest()
            ->get();

        return Inertia::render('company/employees/index', [
            'employees' => $employees,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('company/employees/create');
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        Employee::create([
            ...$request->validated(),
            'company_id' => auth()->user()->company_id,
        ]);

        return redirect()->route('company.employees.index');
    }

    public function show(Employee $employee): Response
    {
        $this->authorizeCompanyAccess($employee);

        $employee->load([
            'checkups.examinationProfile',
            'checkups.results.examination',
        ]);

        return Inertia::render('company/employees/show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee): Response
    {
        $this->authorizeCompanyAccess($employee);

        return Inertia::render('company/employees/edit', [
            'employee' => $employee,
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $this->authorizeCompanyAccess($employee);

        $employee->update($request->validated());

        return redirect()->route('company.employees.index');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $this->authorizeCompanyAccess($employee);

        $employee->delete();

        return redirect()->route('company.employees.index');
    }

    private function authorizeCompanyAccess(Employee $employee): void
    {
        if ($employee->company_id !== auth()->user()->company_id) {
            abort(403);
        }
    }
}
