<?php

namespace App\Http\Controllers;

use App\Helpers\ActivityLogHelper;
use App\Models\BarangayOfficial;
use App\Http\Requests\StoreBarangayOfficialRequest;
use App\Http\Requests\UpdateBarangayOfficialRequest;
use App\Models\BarangayOfficialTerm;
use App\Models\Designation;
use App\Models\Purok;
use App\Models\Resident;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class BarangayOfficialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        // Fetch officials with relationships
        $termFilter = request()->query('term'); // 👈 get filter from query params

        // Fetch officials with relationships + filtering
        $officials = BarangayOfficial::with([
            'resident' => function ($q) {
                $q->select(
                    'id',
                    'firstname',
                    'middlename',
                    'lastname',
                    'suffix',
                    'sex',
                    'birthdate',
                    'contact_number',
                    'barangay_id'
                );
            },
            'resident.barangay' => function ($q) {
                $q->select(
                    'id',
                    'barangay_name',
                    'city',
                    'province'
                );
            },
            'resident.street.purok',
            'term',
            'activeDesignations',
            'activeDesignations.purok'
        ])
        ->whereHas('resident', fn($q) => $q->where('barangay_id', $brgy_id))

        // ⭐ APPLY FILTER ONLY IF TERM PARAM EXISTS
        ->when($termFilter, function ($q) use ($termFilter) {
            $q->where('term_id', $termFilter);
        })

        ->get();

        $priorityOrder = [
            'barangay_captain',
            'barangay_secretary',
            'barangay_treasurer',
            'barangay_kagawad',
            'sk_chairman',
            'sk_kagawad',
            'health_worker',
            'tanod',
        ];

        $officials = $officials->sortBy(function($official) use ($priorityOrder) {
            return array_search($official->position, $priorityOrder);
        })->values();

        // Residents dropdown or selection
        $residents = Resident::where('barangay_id', $brgy_id)
            ->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'purok_number', 'birthdate', 'email', 'contact_number')
            ->get();

        // Purok numbers for filtering
        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');

        // Active official terms
        $activeterms = BarangayOfficialTerm::query()
            ->where('barangay_id', $brgy_id)
            ->where('status', 'active')
            ->get();


        $terms = BarangayOfficialTerm::query()
            ->where('barangay_id', $brgy_id)
            ->get();

        // Return Inertia page
        return Inertia::render('BarangayOfficer/BarangayProfile/BarangayOfficials/BarangayOfficials', [
            'officials'   => $officials,
            'residents'   => $residents,
            'puroks'      => $puroks,
            'activeterms' => $activeterms,
            'terms'       => $terms,
            'queryParams' => request()->query() ?: null,
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
    public function store(StoreBarangayOfficialRequest $request)
    {
        try {
            $data = $request->validated();
            DB::beginTransaction();

            $userBrgyId = auth()->user()->barangay_id;

            // ✅ Create new term if 'term' is null or empty
            if (empty($data['term'])) {
                if (empty($data['new_term_start']) || empty($data['new_term_end'])) {
                    throw new \Exception('Start year and End year are required to create a new term.');
                }

                $term = BarangayOfficialTerm::create([
                    'barangay_id' => $userBrgyId,
                    'term_start'  => $data['new_term_start'],
                    'term_end'    => $data['new_term_end'],
                    'status'      => 'active',
                ]);

                ActivityLogHelper::log(
                    'Barangay Official Term',
                    'create',
                    'Created term: ' . ($term->term_start ?? '') . ' - ' . ($term->term_end ?? ''),
                    $userBrgyId
                );

                $data['term'] = $term->id; // use the newly created term ID
            }

            // Store Barangay Official
            $official = BarangayOfficial::create([
                'resident_id'       => $data['resident_id'],
                'term_id'           => $data['term'],
                'position'          => $data['position'],
                'status'            => $data['status'] ?? 'active',
                'appointment_type'  => $data['appointment_type']  ?? null,
                'appointted_by'     => $data['appointted_by'] ?? null,
                'appointment_reason'=> $data['appointment_reason']  ?? null,
                'remarks'           => $data['remarks']  ?? null,
            ]);

            ActivityLogHelper::log(
                'Barangay Official',
                'create',
                'Added official: position=' . ($official->position ?? 'n/a') . ' resident_id=' . ($official->resident_id ?? 'n/a'),
                $userBrgyId
            );

            // Store designations for kagawad positions
            if (in_array($data['position'], ['barangay_kagawad', 'sk_kagawad']) && !empty($data['designations'])) {
                foreach ($data['designations'] as $designation) {
                    $purok_id = Purok::where('barangay_id', $userBrgyId)
                        ->where('purok_number', $designation['designation'])
                        ->value('id');

                    if ($purok_id) {
                        $createdDesignation = Designation::create([
                            'official_id' => $official->id,
                            'purok_id'    => $purok_id,
                            'started_at'  => $designation['term_start'] ?? now()->year,
                            'ended_at'    => $designation['term_end'] ?? null,
                        ]);

                        // Log designation creation
                        ActivityLogHelper::log(
                            'Designation',
                            'create',
                            'Assigned designation (purok_id=' . $createdDesignation->purok_id . ') to official_id=' . $official->id,
                            $userBrgyId
                        );
                    }
                }
            }

            DB::commit();

            return redirect()
                ->route('barangay_official.index')
                ->with('success', 'Barangay Official successfully added.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Barangay Official could not be added: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayOfficial $barangayOfficial)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayOfficial $barangayOfficial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayOfficialRequest $request, BarangayOfficial $barangayOfficial)
    {
        try {
            $data = $request->validated();
            $userBrgyId = auth()->user()->barangay_id;

            // ✅ Create new term if 'term' is null or empty
            if (empty($data['term'])) {
                if (empty($data['new_term_start']) || empty($data['new_term_end'])) {
                    throw new \Exception('Start year and End year are required to create a new term.');
                }

                $term = BarangayOfficialTerm::create([
                    'barangay_id' => $userBrgyId,
                    'term_start'  => $data['new_term_start'],
                    'term_end'    => $data['new_term_end'],
                    'status'      => 'active',
                ]);

                // Log term creation
                ActivityLogHelper::log(
                    'Barangay Official Term',
                    'create',
                    'Created term: ' . ($term->term_start ?? '') . ' - ' . ($term->term_end ?? ''),
                    $userBrgyId
                );

                $data['term'] = $term->id; // use newly created term
            }

            // Clear appointed fields if not appointed
            if ($data['appointment_type'] !== 'appointed') {
                $data['appointed_by'] = null;
                $data['appointment_reason'] = null;
            }

            // Update official
            $barangayOfficial->update([
                'resident_id'        => $data['resident_id'],
                'position'           => $data['position'],
                'appointment_type'   => $data['appointment_type'],
                'appointed_by'       => $data['appointed_by'] ?? null,
                'appointment_reason' => $data['appointment_reason'] ?? null,
                'term_id'            => $data['term'],
                'remarks'            => $data['remarks'] ?? null,
            ]);

            // Log official update
            ActivityLogHelper::log(
                'Barangay Official',
                'update',
                'Updated official: id=' . $barangayOfficial->id . ' position=' . ($barangayOfficial->position ?? 'n/a'),
                $userBrgyId
            );

            // Update designations if provided
            if (!empty($data['designations'])) {
                // Log clearance of old designations
                $barangayOfficial->designation()->delete();
                ActivityLogHelper::log(
                    'Designation',
                    'delete',
                    'Cleared designations for official_id=' . $barangayOfficial->id,
                    $userBrgyId
                );

                foreach ($data['designations'] as $des) {
                    $createdDesignation = $barangayOfficial->designation()->create([
                        'purok_id'   => $des['designation'],
                        'started_at' => $des['term_start'] ?? now()->year,
                        'ended_at'   => $des['term_end'] ?? null,
                    ]);

                    // Log new designation
                    ActivityLogHelper::log(
                        'Designation',
                        'create',
                        'Assigned designation (purok_id=' . ($createdDesignation->purok_id ?? 'n/a') . ') to official_id=' . $barangayOfficial->id,
                        $userBrgyId
                    );
                }
            }

            return redirect()
                ->route('barangay_official.index')
                ->with('success','Barangay Official successfully updated.');

        } catch (\Exception $e) {
            return back()->with('error','Failed to update Barangay Official: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayOfficial $barangayOfficial)
    {
        DB::beginTransaction();

        try {
            // Delete related designations first
            $barangayOfficial->designation()->delete();

            // Delete the barangay official record
            $barangayOfficial->delete();

            DB::commit();

            ActivityLogHelper::log(
                'Barangay Official',
                'delete',
                'Deleted barangay official: id=' . $barangayOfficial->id . ' position=' . ($barangayOfficial->position ?? 'n/a'),
            );

            return redirect()
                ->route('barangay_official.index')
                ->with('success', 'Barangay Official deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with(
                'error',
                'Failed to delete Barangay Official: ' . $e->getMessage()
            );
        }
    }

    public function getOfficialInformation($id)
    {
        $official = BarangayOfficial::with([
            'resident.barangay',
            'resident.street.purok',
            'designation.purok',
            'term'
        ])->findOrFail($id);

        $official->designation->transform(function ($d) {
            return [
                'id' => $d->id,
                'purok_id' => $d->purok_id,
                'purok_number' => $d->purok->purok_number ?? null, // easier for display
                'started_at' => $d->started_at,
                'ended_at' => $d->ended_at,
            ];
        });

        return response()->json(['official' => $official]);
    }

    public function toggleStatus(BarangayOfficial $official, Request $request)
    {
        try {
            // Validate incoming status
            $validated = $request->validate([
                'status' => 'required|in:active,inactive',
            ]);

            $official->status = $validated['status'];
            $official->save();

            // Build message with only name and position
            $residentName = ucwords($official->resident->firstname . ' ' . $official->resident->lastname);
            $position = ucwords(str_replace('_', ' ', $official->position));
            $statusText = strtoupper($official->status);

            return response()->json([
                'success' => true,
                'message' => "{$residentName} ({$position}) status has been set to {$statusText}.",
                'status' => $official->status,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle official status.',
                'error' => $e->getMessage(), // optional: remove in production
            ], 500);
        }
    }
}
