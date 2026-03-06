<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Checkup;
use Inertia\Inertia;
use Inertia\Response;

class CheckupController extends Controller
{
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
