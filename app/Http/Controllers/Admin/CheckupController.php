<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCheckupRequest;
use App\Http\Requests\Admin\UpdateCheckupRequest;
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
    public function index(Request $request): Response
    {
        $checkups = Checkup::query()
            ->with(['employee.company', 'examinationProfile'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('company_id'), fn ($q, $id) => $q->whereHas('employee', fn ($q) => $q->where('company_id', $id)))
            ->latest()
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('admin/checkups/index', [
            'checkups' => $checkups,
            'filters' => $request->only(['status', 'company_id']),
        ]);
    }

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

    public function edit(Checkup $checkup): Response
    {
        $checkup->load([
            'employee.company',
            'examinationProfile.examinations',
            'results',
        ]);

        return Inertia::render('admin/checkups/edit', [
            'checkup' => $checkup,
        ]);
    }

    public function update(UpdateCheckupRequest $request, Checkup $checkup): RedirectResponse
    {
        $checkup->update($request->safe()->except('results'));

        // Delete existing results and re-create (clean slate per submission)
        $checkup->results()->delete();

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

        $checkup->update(['performed_by' => Auth::id()]);
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
