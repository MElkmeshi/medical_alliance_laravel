<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCheckupRequest;
use App\Models\Checkup;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckupController extends Controller
{
    public function store(StoreCheckupRequest $request): RedirectResponse
    {
        $employeeId = $request->validated()['employee_id'];

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $employee = \App\Models\Employee::query()
            ->where('id', $employeeId)
            ->where('company_id', $user->company_id)
            ->firstOrFail();

        Checkup::create([
            'employee_id' => $employee->id,
            'examination_profile_id' => $request->validated()['examination_profile_id'],
            'checkup_date' => $request->validated()['checkup_date'],
            'exam_type' => $request->validated()['exam_type'] ?? null,
            'job_environment' => $request->validated()['job_environment'] ?? null,
            'notes' => $request->validated()['notes'] ?? null,
            'status' => 'pending',
        ]);

        return redirect()->route('company.employees.show', $employee);
    }

    public function show(Checkup $checkup): Response
    {
        $checkup->load('employee');

        if ($checkup->employee->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        $checkup->load([
            'examinationProfile.examinations',
            'results.examination',
            'performer',
        ]);

        return Inertia::render('company/checkups/show', [
            'checkup' => $checkup,
        ]);
    }
}
