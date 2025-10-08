<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Household extends Model
{
    /** @use HasFactory<\Database\Factories\HouseholdFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'street_id',
        'purok_id',
        'house_number',
        'ownership_type',
        'housing_condition',
        'year_established',
        'house_structure',
        'bath_and_wash_area',
        'number_of_rooms',
        'number_of_floors',
        'latitude',
        'longitude',
        'created_at',
        'updated_at',
    ];

    public function residents()
    {
        return $this->hasMany(Resident::class);
    }
    public function street()
    {
        return $this->belongsTo(Street::class);
    }

    public function purok()
    {
        return $this->belongsTo(Purok::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    public function householdResidents()
    {
        return $this->hasMany(HouseholdResident::class);
    }

    public function householdHeadHistories()
    {
        return $this->hasMany(HouseholdHeadHistory::class);
    }

    public function residentsCount()
    {
        return $this->residents()->selectRaw('household_id, COUNT(*) as aggregate')
            ->groupBy('household_id');
    }

    public function toilets(){
        return $this->hasMany(HouseholdToilet::class);
    }

    public function electricityTypes(){
        return $this->hasMany(HouseholdElectricitySource::class);
    }

    public function waterSourceTypes(){
        return $this->hasMany(HouseholdWaterSource::class);
    }

    public function wasteManagementTypes(){
        return $this->hasMany(HouseholdWasteManagement::class);
    }

    public function livestocks(){
        return $this->hasMany(Livestock::class);
    }

    public function pets(){
        return $this->hasMany(Pet::class);
    }

    public function internetAccessibility(){
        return $this->hasMany(InternetAccessibility::class);
    }
}
