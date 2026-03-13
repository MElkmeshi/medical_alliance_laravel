<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\ExaminationProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Checkup>
 */
class CheckupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'examination_profile_id' => ExaminationProfile::factory(),
            'checkup_date' => fake()->date(),
            'exam_type' => fake()->randomElement(['pre_employment', 'periodic', 'other']),
            'job_environment' => fake()->randomElement(['office', 'rig_field', 'workshop_laboratory']),
            'status' => 'pending',
            'notes' => fake()->optional()->sentence(),
            'performed_by' => User::factory(),
        ];
    }
}
