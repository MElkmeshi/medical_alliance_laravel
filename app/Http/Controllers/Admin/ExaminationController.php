<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreExaminationRequest;
use App\Http\Requests\Admin\UpdateExaminationRequest;
use App\Models\Examination;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExaminationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/examinations/index', [
            'examinations' => Examination::query()->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/examinations/create');
    }

    public function store(StoreExaminationRequest $request): RedirectResponse
    {
        Examination::create($request->validated());

        return redirect()->route('admin.examinations.index');
    }

    public function edit(Examination $examination): Response
    {
        return Inertia::render('admin/examinations/edit', [
            'examination' => $examination,
        ]);
    }

    public function update(UpdateExaminationRequest $request, Examination $examination): RedirectResponse
    {
        $examination->update($request->validated());

        return redirect()->route('admin.examinations.index');
    }

    public function destroy(Examination $examination): RedirectResponse
    {
        $examination->delete();

        return redirect()->route('admin.examinations.index');
    }
}
