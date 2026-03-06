<?php

namespace App\Http\Requests\Admin;

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
            'notes' => ['nullable', 'string'],
            'results' => ['required', 'array'],
            'results.*.examination_id' => ['required', 'exists:examinations,id'],
            'results.*.value' => ['nullable', 'string'],
            'results.*.is_normal' => ['nullable', 'boolean'],
            'results.*.document' => ['nullable', 'file', 'max:10240'],
            'results.*.notes' => ['nullable', 'string'],
        ];
    }
}
