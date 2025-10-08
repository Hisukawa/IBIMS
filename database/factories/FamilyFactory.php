<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Family>
 */
class FamilyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'barangay_id' => 1,
            'household_id' => Household::inRandomOrder()->first()?->id ?? Household::factory(),
            'income_bracket' => $this->faker->randomElement([
                'below_5000',
                '5001_10000',
                '10001_20000',
                '20001_40000',
                '40001_70000',
                '70001_120000',
                'above_120001'
            ]),
            'income_category' => $this->faker->randomElement([
                'survival',
                'poor',
                'low_income',
                'lower_middle_income',
                'middle_income',
                'upper_middle_income',
                'above_high_income'
            ]),
            'family_name' => $this->faker->randomElement([
                    'Dela Cruz', 'Reyes', 'Santos', 'Garcia', 'Lopez',
                    'Mendoza', 'Torres', 'Ramos', 'Gonzales', 'Fernandez',
                    'Castro', 'Gutierrez', 'Pascual', 'Domingo', 'Villanueva',
                    'Agbayani', 'Buenaventura', 'Cabrera', 'Lagman', 'Soriano',
                    'Salazar', 'Alcantara', 'Yap', 'Chua', 'Tan',
                    'Lim', 'Co', 'Ong', 'Bautista', 'Padilla',
                    'Aquino', 'Marquez', 'Navarro', 'Del Rosario', 'Calderon',
                    'Mercado', 'Rosales', 'Abad', 'Esquivel', 'Balagtas', 'Alejo', 'Balila', 'Quiling',
                    'Carreon', 'Cariño', 'Medico', 'Agtarap', 'Baingan', 'dela Rosa', 'Paril',
                    'Rivera', 'Bermudez', 'Barrio', 'Aguinaldo', 'Agriam', 'Aguilar'
                ]),
            'family_type' => $this->faker->randomElement(["nuclear",
            "single_parent",
            "extended",
            "stepfamilies",
            "grandparent",
            "childless",
            "cohabiting_partners",
            "one_person_household",
            "roommates",]),
                ];
    }
}
