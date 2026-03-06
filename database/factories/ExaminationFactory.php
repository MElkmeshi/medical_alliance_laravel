<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Examination>
 */
class ExaminationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'unit' => fake()->randomElement(['mg/dL', 'mmol/L', 'g/dL', 'U/L', '%', 'mm/hr']),
            'min_value' => fake()->randomFloat(2, 0, 50),
            'max_value' => fake()->randomFloat(2, 51, 200),
            'is_required' => fake()->boolean(),
            'requires_document' => false,
            'is_active' => true,
        ];
    }
}
