<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
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
            'company_id' => ['required', 'exists:companies,id'],
            'name' => ['required', 'string', 'max:255'],
            'sex' => ['nullable', 'string', 'in:male,female'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'national_id' => ['required', 'string', 'max:50', 'unique:employees,national_id'],
            'home_address' => ['nullable', 'string', 'max:500'],
            'company_employee_number' => ['nullable', 'string', 'max:100'],
            'job_description' => ['nullable', 'string', 'max:255'],
            'job_location' => ['nullable', 'string', 'max:100'],
            'date_of_birth' => ['nullable', 'date'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
        ];
    }
}
