<?php

namespace Database\Factories;

use App\Models\Checkup;
use App\Models\Examination;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CheckupResult>
 */
class CheckupResultFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'checkup_id' => Checkup::factory(),
            'examination_id' => Examination::factory(),
            'value' => fake()->randomFloat(2, 0, 200),
            'is_normal' => fake()->boolean(),
            'document_path' => null,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
