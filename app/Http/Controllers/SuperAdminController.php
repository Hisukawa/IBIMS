<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\CRAGeneralPopulation;
use App\Models\CRAPopulationAgeGroup;
use App\Models\CRAPopulationGender;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $barangayId = $request->query('barangay_id');

        if ($barangayId) {
            $totalPopulation = CRAGeneralPopulation::where('barangay_id', $barangayId)->sum('total_population');
            $totalHouseholds = CRAGeneralPopulation::where('barangay_id', $barangayId)->sum('total_households');
            $totalFamilies   = CRAGeneralPopulation::where('barangay_id', $barangayId)->sum('total_families');

            $ageDistribution = CRAPopulationAgeGroup::select(
                'age_group',
                DB::raw('SUM(male_without_disability) as male_without_disability'),
                DB::raw('SUM(male_with_disability) as male_with_disability'),
                DB::raw('SUM(female_without_disability) as female_without_disability'),
                DB::raw('SUM(female_with_disability) as female_with_disability'),
                DB::raw('SUM(lgbtq_without_disability) as lgbtq_without_disability'),
                DB::raw('SUM(lgbtq_with_disability) as lgbtq_with_disability')
            )
                ->where('barangay_id', $barangayId)
                ->groupBy('age_group')
                ->orderBy('age_group')
                ->get();

            $genderData = CRAPopulationGender::select(
                'gender',
                DB::raw('SUM(quantity) as total_quantity')
            )
                ->where('barangay_id', $barangayId)
                ->groupBy('gender')
                ->get();
        } else {
            $totalPopulation = CRAGeneralPopulation::sum('total_population');
            $totalHouseholds = CRAGeneralPopulation::sum('total_households');
            $totalFamilies   = CRAGeneralPopulation::sum('total_families');

            $ageDistribution = CRAPopulationAgeGroup::select(
                'age_group',
                DB::raw('SUM(male_without_disability) as male_without_disability'),
                DB::raw('SUM(male_with_disability) as male_with_disability'),
                DB::raw('SUM(female_without_disability) as female_without_disability'),
                DB::raw('SUM(female_with_disability) as female_with_disability'),
                DB::raw('SUM(lgbtq_without_disability) as lgbtq_without_disability'),
                DB::raw('SUM(lgbtq_with_disability) as lgbtq_with_disability')
            )
                ->groupBy('age_group')
                ->orderBy('age_group')
                ->get();

            $genderData = CRAPopulationGender::select(
                'gender',
                DB::raw('SUM(quantity) as total_quantity')
            )
                ->groupBy('gender')
                ->get();
        }

        // Fetch all barangays for dropdown
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        $sort = $request->query('sort', 'desc'); // default is 'desc' for top barangays

        $topBarangays = DB::table('barangays as b')
            ->join('c_r_a_general_populations as g', 'g.barangay_id', '=', 'b.id')
            ->select(
                'b.id',
                'b.barangay_name as barangay_name',
                DB::raw('SUM(g.total_population) as population'),
                DB::raw('SUM(g.total_households) as households'),
                DB::raw('SUM(g.total_families) as families')
            )
            ->groupBy('b.id', 'b.barangay_name')
            ->orderBy('population', $sort) // sort dynamically
            ->get()
            ->map(function ($row) {
                return [
                    'id' => $row->id,
                    'barangay_name' => $row->barangay_name,
                    'population' => (int) $row->population,
                    'households' => (int) $row->households,
                    'families' => (int) $row->families,
                ];
            });

        return Inertia::render('SuperAdmin/Dashboard', [
            'totalPopulation' => $totalPopulation,
            'totalHouseholds' => $totalHouseholds,
            'totalFamilies'   => $totalFamilies,
            'ageDistribution' => $ageDistribution,
            'genderData'      => $genderData,
            'barangays'       => $allBarangays,
            'topBarangays'    => $topBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function accounts(Request $request)
    {
        // Base query for all Barangay Officer accounts
        $query = User::with([
                'resident:id,firstname,lastname,middlename,suffix,purok_number,barangay_id'
            ])
            ->where('role', 'barangay_officer')
            ->select('id', 'resident_id', 'username', 'email', 'status', 'is_disabled', 'created_at', 'updated_at');

        // Filters on user fields
        if ($request->filled('session_status') && $request->session_status !== 'All') {
            $query->where('status', $request->session_status);
        }

        if ($request->filled('account_status') && $request->account_status !== 'All') {
            $query->where('is_disabled', $request->account_status);
        }

        // Name filter: if user has resident linked, search resident name; otherwise search username/email
        if ($request->filled('name')) {
            $name = $request->name;
            $query->where(function ($q) use ($name) {
                $q->where('username', 'like', "%{$name}%")
                ->orWhere('email', 'like', "%{$name}%")
                ->orWhereHas('resident', function ($q2) use ($name) {
                    $q2->where('firstname', 'like', "%{$name}%")
                        ->orWhere('lastname', 'like', "%{$name}%")
                        ->orWhere('middlename', 'like', "%{$name}%");
                });
            });
        }

        $accounts = $query->paginate(10)->withQueryString();
        $barangays = Barangay::all()->select('id', 'barangay_name');

        return Inertia::render('SuperAdmin/Account/Index', [
            'accounts' => $accounts,
            'queryParams' => $request->query() ?: null,
            'barangays' => $barangays
        ]);
    }
}
