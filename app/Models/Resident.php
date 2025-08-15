<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class Resident extends Model
{
    /** @use HasFactory<\Database\Factories\ResidentFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'firstname',
        'middlename',
        'lastname',
        'maiden_name',
        'suffix',
        'birthdate',
        'birthplace',
        'gender',
        'civil_status',
        'registered_voter',
        'employment_status',
        'citizenship',
        'religion',
        'contact_number',
        'email',
        'purok_number',
        'street_id',
        'residency_date',
        'residency_type',
        'resident_picture_path',
        'is_pwd',
        'ethnicity',
        'date_of_death',
        'household_id',
        'is_household_head',
        'family_id',
        'verified',
        'created_at',
        'updated_at',
    ];

    public function parents()
    {
        return $this->belongsToMany(Resident::class, 'family_relations', 'related_to', 'resident_id')
            ->wherePivot('relationship', 'parent')->select('residents.*');;
    }

    // Child Relationships (Who are this resident's children?)
    public function children()
    {
        return $this->belongsToMany(Resident::class, 'family_relations', 'resident_id', 'related_to')
            ->wherePivot('relationship', 'parent')->select('residents.*');;
    }

    // Siblings (Find other residents who share the same parents)
    public function siblings()
    {
        return $this->parents()->with('children')->get()
            ->flatMap(fn($parent) => $parent->children) // Get all children of parents
            ->unique('id') // Remove duplicates
            ->reject(fn($sibling) => $sibling->id === $this->id) // Exclude self
            ->values(); // Reset array keys
    }

    // Spouse Relationship
    public function spouses()
    {
        return $this->belongsToMany(Resident::class, 'family_relations', 'resident_id', 'related_to')
            ->wherePivot('relationship', 'spouse')
            ->withPivot('relationship')
            ->select('residents.*'); // 🔧 Fix ambiguity by specifying table
    }
    public function familyTree()
    {
        // Load direct parents
        $parents = $this->parents()->with('parents')->get();

        // Get grandparents from parents
        $grandparents = $parents->flatMap(fn($parent) => $parent->parents);

        // Get uncles & aunts: Fetch all children of grandparents (excluding direct parents)
        $unclesAunts = $grandparents->flatMap(fn($grandparent) => $grandparent->children)
            ->unique('id') // Remove duplicates
            ->reject(fn($uncleAunt) => $parents->contains('id', $uncleAunt->id)); // Exclude actual parents

        // Load children
        $children = $this->children()->get();

        // Load spouse(s)
        $spouses = $this->spouses()->get();

        // Load siblings (Excluding self)
        $siblings = $this->siblings()->unique('id')->values();

        return [
            'self' => $this,
            'parents' => $parents,
            'grandparents' => $grandparents,
            'uncles_aunts' => $unclesAunts->values(),
            'siblings' => $siblings,
            'children' => $children,
            'spouse' => $spouses,
        ];
    }

    public function familyTree2()
    {
        $visited = collect(); // Tracks visited residents to avoid infinite loops

        $buildTree = function ($resident) use (&$buildTree, &$visited) {
            if ($visited->contains('id', $resident->id)) {
                return null; // Skip already visited
            }

            $visited->push($resident);

            // Eager load to prevent N+1 queries
            $resident->loadMissing(['parents', 'children', 'spouses']);

            return [
                'id' => $resident->id,
                'name' => $resident->name,
                'spouses' => $resident->spouses->map(function ($spouse) {
                    return ['id' => $spouse->id, 'name' => $spouse->name];
                }),
                'siblings' => $resident->siblings()->map(function ($sibling) {
                    return ['id' => $sibling->id, 'name' => $sibling->name];
                }),
                'parents' => $resident->parents->map(fn($parent) => $buildTree($parent))->filter()->values(),
                'children' => $resident->children->map(fn($child) => $buildTree($child))->filter()->values(),
            ];
        };

        return $buildTree($this);
    }

    public function household()
    {
        return $this->belongsTo(Household::class);
    }
    public function householdResidents()
    {
        return $this->hasMany(HouseholdResident::class);
    }
    public function latestHouseholdResident()
    {
        return $this->hasOne(HouseholdResident::class)->latestOfMany();
    }

    public function latestHousehold()
    {
        return $this->hasOneThrough(
            Household::class,
            HouseholdResident::class,
            'resident_id',
            'id',
            'id',
            'household_id'
        )->latest('household_residents.created_at');
    }
    public function householdHeadHistories()
    {
        return $this->hasMany(HouseholdHeadHistory::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function street()
    {
        return $this->belongsTo(Street::class);
    }

    public function socialwelfareprofile()
    {
        return $this->hasOne(SocialWelfareProfile::class);
    }

    public function votingInformation()
    {
        return $this->hasOne(ResidentVoterInformation::class);
    }
    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
    public function purokResidencies()
    {
        return $this->hasMany(PurokResidency::class);
    }
    public function family()
    {
        return $this->belongsTo(Family::class);
    }
    public function occupations()
    {
        return $this->hasMany(Occupation::class);
    }
    public function latestOccupation()
    {
        return $this->hasOne(Occupation::class)->latestOfMany('started_at');
    }
    public function disabilities()
    {
        return $this->hasMany(Disability::class);
    }
    public function livelihoods()
    {
        return $this->hasMany(Livelihood::class);
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }
    public function seniorcitizen()
    {
        return $this->hasOne(SeniorCitizen::class);
    }
    public function educationalHistories()
    {
        return $this->hasMany(EducationalHistory::class);
    }
    public function latestEducation()
    {
        return $this->hasOne(EducationalHistory::class)->latestOfMany('year_ended');
    }
    public function medicalInformation()
    {
        return $this->hasOne(MedicalInformation::class);
    }

    public function barangayOfficials()
    {
        return $this->hasMany(BarangayOfficial::class, 'resident_id');
    }

    public function familyRelations(){
        return $this->hasMany(FamilyRelation::class, 'resident_id');
    }


    public function getAgeAttribute()
    {
        return Carbon::parse($this->birthdate)->age;
    }
    public function getFullNameAttribute()
    {
        $name = trim("{$this->firstname} {$this->middlename} {$this->lastname}");
        if ($this->suffix) {
            $name .= " {$this->suffix}";
        }
        return $name;
    }
}
