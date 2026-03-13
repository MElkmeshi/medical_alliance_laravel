<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'name' => fake()->name(),
            'sex' => fake()->randomElement(['male', 'female']),
            'nationality' => fake()->country(),
            'national_id' => fake()->unique()->numerify('##########'),
            'home_address' => fake()->address(),
            'company_employee_number' => fake()->optional()->numerify('EMP-####'),
            'job_description' => fake()->jobTitle(),
            'job_location' => fake()->country(),
            'date_of_birth' => fake()->date(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
        ];
    }
}
