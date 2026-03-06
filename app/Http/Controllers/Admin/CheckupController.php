<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCheckupRequest;
use App\Models\Checkup;
use App\Models\CheckupResult;
use App\Models\Employee;
use App\Models\ExaminationProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CheckupController extends Controller
{
    public function create(Request $request): Response
    {
        $employee = Employee::query()
            ->with('company')
            ->findOrFail($request->query('employee_id'));

        $profile = ExaminationProfile::query()
            ->with('examinations')
            ->findOrFail($request->query('examination_profile_id'));

        return Inertia::render('admin/checkups/create', [
            'employee' => $employee,
            'examinationProfile' => $profile,
            'examinations' => $profile->examinations,
        ]);
    }

    public function store(StoreCheckupRequest $request): RedirectResponse
    {
        $checkup = Checkup::create([
            ...$request->safe()->except('results'),
            'performed_by' => Auth::id(),
        ]);

        foreach ($request->validated('results', []) as $result) {
            $documentPath = null;

            if (isset($result['document']) && $result['document']) {
                $documentPath = $result['document']->store('checkup-documents');
            }

            CheckupResult::create([
                'checkup_id' => $checkup->id,
                'examination_id' => $result['examination_id'],
                'value' => $result['value'] ?? null,
                'is_normal' => $result['is_normal'] ?? null,
                'notes' => $result['notes'] ?? null,
                'document_path' => $documentPath,
            ]);
        }

        $checkup->updateStatus();

        return redirect()->route('admin.checkups.show', $checkup);
    }

    public function show(Checkup $checkup): Response
    {
        $checkup->load([
            'employee.company',
            'examinationProfile.examinations',
            'results.examination',
            'performer',
        ]);

        return Inertia::render('admin/checkups/show', [
            'checkup' => $checkup,
        ]);
    }
}
