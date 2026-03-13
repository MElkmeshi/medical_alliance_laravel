<?php

namespace App\Http\Requests\Company;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCheckupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'examination_profile_id' => ['required', 'exists:examination_profiles,id'],
            'checkup_date' => ['required', 'date'],
            'exam_type' => ['nullable', 'string', 'in:pre_employment,periodic,other'],
            'job_environment' => ['nullable', 'string', 'in:office,rig_field,workshop_laboratory'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
