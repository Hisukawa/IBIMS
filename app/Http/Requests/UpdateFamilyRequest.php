<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFamilyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'household_id' => $this->household_id ?: null,
            'family_name' => $this->family_name ?: null,
        ]);
    }

    public function rules(): array
    {
        return [
            'household_id' => ['nullable', 'exists:households,id'],

            'resident_id' => ['required', 'exists:residents,id'],

            'family_type' => [
                'required',
                Rule::in([
                    'nuclear',
                    'extended',
                    'single_parent',
                    'grandparent',
                    'childless',
                    'cohabiting_partners',
                    'one_person_household',
                    'roommates',
                ]),
            ],

            'family_name' => ['nullable', 'string', 'max:255'],

            'members' => ['nullable', 'array'],
            'members.*' => ['array'],

            'members.*.resident_id' => [
                'required',
                'exists:residents,id',
                'distinct',
            ],

            'members.*.relationship_to_head' => [
                'required',
                'string',
                'max:55',
            ],

            'members.*.household_position' => [
                'required',
                Rule::in(['primary', 'extended', 'boarder']),
            ],
        ];
    }

    public function attributes(): array
    {
        $attributes = [
            'household_id' => 'household',
            'resident_id' => 'family head',
            'resident_name' => 'family head name',
            'family_name' => 'family name',
            'family_type' => 'family type',
            'birthdate' => 'family head birthdate',
            'purok_number' => 'purok number',
            'house_number' => 'house number',
        ];

        if ($this->has('members')) {
            foreach ($this->input('members', []) as $index => $member) {
                $row = $index + 1;

                $attributes["members.$index.resident_id"] = "member #$row resident";
                $attributes["members.$index.resident_name"] = "member #$row name";
                $attributes["members.$index.birthdate"] = "member #$row birthdate";
                $attributes["members.$index.purok_number"] = "member #$row purok number";
                $attributes["members.$index.relationship_to_head"] = "member #$row relationship to head";
                $attributes["members.$index.household_position"] = "member #$row household position";
            }
        }

        return $attributes;
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Please select a family head.',
            'resident_id.exists' => 'The selected family head is invalid.',

            'household_id.exists' => 'The selected household is invalid.',

            'family_type.required' => 'Please select a family type.',
            'family_type.in' => 'The selected family type is invalid.',

            'members.array' => 'Family members must be a valid list.',
            'members.*.resident_id.required' => 'Each member must have a resident selected.',
            'members.*.resident_id.exists' => 'One of the selected members is invalid.',
            'members.*.resident_id.distinct' => 'Duplicate family members are not allowed.',

            'members.*.relationship_to_head.required' => 'Relationship to head is required.',
            'members.*.household_position.required' => 'Household position is required.',
            'members.*.household_position.in' => 'The selected household position is invalid.',
        ];
    }
}
