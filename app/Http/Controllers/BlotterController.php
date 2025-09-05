<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficial;
use App\Models\BlotterReport;
use App\Http\Requests\StoreBlotterReportRequest;
use App\Http\Requests\UpdateBlotterReportRequest;
use App\Models\CaseParticipant;
use App\Models\Resident;
use DB;
use Inertia\Inertia;

class BlotterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = BlotterReport::with([
                'latestComplainant.resident:id,firstname,lastname,middlename,suffix',
                'recordedBy.resident:id,firstname,lastname,middlename,suffix'
            ])
            ->where('barangay_id', $brgy_id)
            ->latest();

        // Filter by participant name
        if (request()->filled('name')) {
            $search = request('name');
            $query->whereHas('participants', function ($q) use ($search) {
                $q->whereHas('resident', function ($qr) use ($search) {
                    $qr->whereRaw(
                        "CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?",
                        ["%{$search}%"]
                    )
                    ->orWhereRaw(
                        "CONCAT(firstname, ' ', lastname) LIKE ?",
                        ["%{$search}%"]
                    );
                })
                ->orWhere('name', 'like', "%{$search}%"); // matches participants added manually
            });
        }

        // Filter by incident_type
        if (request()->filled('incident_type') && request('incident_type') !== 'All') {
            $query->where('type_of_incident', request('incident_type'));
        }

        // Filter by report_type
        if (request()->filled('report_type') && request('report_type') !== 'All') {
            $query->where('report_type', request('report_type'));
        }

        // Filter by incident_date
        if (request()->filled('incident_date')) {
            $query->whereDate('incident_date', request('incident_date'));
        }

        // Paginate the results
        $blotters = $query->paginate(10)->withQueryString();

        // Get distinct incident types for the filter dropdown
        $incident_types = BlotterReport::where('barangay_id', $brgy_id)
                            ->distinct()
                            ->pluck('type_of_incident');

        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Blotter/Index", [
            'blotters'       => $blotters,
            'queryParams'    => request()->query() ?: null,
            'incident_types' => $incident_types,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $brgy_id = auth()->user()->barangay_id;
        $residents = Resident::where('barangay_id', $brgy_id)->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'gender', 'birthdate', 'purok_number', 'contact_number', 'email')->get();
        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Blotter/Create", [
            'residents' => $residents
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBlotterReportRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            // Get the BarangayOfficial ID of the logged-in officer
            $recordedByOfficialId = BarangayOfficial::where('resident_id', auth()->user()->resident_id)
                ->value('id');
            // 1️⃣ Create BlotterReport
            $blotter = BlotterReport::create([
                'barangay_id'       => auth()->user()->barangay_id,
                'type_of_incident'  => $data['type_of_incident'],
                'incident_date'     => $data['incident_date'],
                'location'          => $data['location'] ?? null,
                'narrative_details' => $data['narrative_details'] ?? null,
                'actions_taken'     => $data['actions_taken'] ?? null,
                'report_status'     => $data['report_status'] ?? 'pending',
                'resolution'        => $data['resolution'] ?? null,
                'recommendations'   => $data['recommendations'] ?? null,
                'recorded_by'       => $recordedByOfficialId,
            ]);

            // 2️⃣ Save Participants
            $saveParticipants = function (array $participants, string $role) use ($blotter) {
                foreach ($participants as $p) {
                    if (empty($p['resident_id']) && empty($p['resident_name']) && empty($p['name'])) {
                        continue; // skip invalid entry
                    }

                    CaseParticipant::create([
                        'blotter_id'  => $blotter->id,
                        'resident_id' => $p['resident_id'] ?? null,
                        'name'        => $p['resident_name'] ?? $p['name'] ?? null,
                        'role_type'   => $role,
                        'notes'       => $p['notes'] ?? null,
                    ]);
                }
            };

            $saveParticipants($data['complainants'] ?? [], 'complainant');
            $saveParticipants($data['respondents'] ?? [], 'respondent');
            $saveParticipants($data['witnesses'] ?? [], 'witness');

            DB::commit();

            return redirect()
                ->route('blotter_report.index')
                ->with('success', 'Blotter report created successfully!');

        } catch (\Throwable $e) {
            DB::rollBack();

            // Log the full error for debugging
            \Log::error("Blotter Report Store Failed", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to save blotter report. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BlotterReport $blotterReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BlotterReport $blotterReport)
    {
        $brgy_id = auth()->user()->barangay_id;
        $blotterReport->load([
            'participants.resident:id,firstname,lastname,middlename,suffix,resident_picture_path,gender,birthdate,purok_number,contact_number,email'
        ]);
        $residents = Resident::where('barangay_id', $brgy_id)->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'sex', 'birthdate', 'purok_number', 'contact_number', 'email')->get();
        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Blotter/Edit", [
            'residents' => $residents,
            'blotter_details' => $blotterReport
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBlotterReportRequest $request, BlotterReport $blotterReport)
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();

            // Get the BarangayOfficial ID for the currently authenticated user
            $recordedByOfficialId = BarangayOfficial::where('resident_id', auth()->user()->resident_id)
                ->value('id');

            // 1️⃣ Update the BlotterReport
            $blotterReport->update([
                'type_of_incident'  => $data['type_of_incident'],
                'incident_date'     => $data['incident_date'],
                'location'          => $data['location'] ?? null,
                'narrative_details' => $data['narrative_details'] ?? null,
                'actions_taken'     => $data['actions_taken'] ?? null,
                'report_status'     => $data['report_status'] ?? 'pending',
                'resolution'        => $data['resolution'] ?? null,
                'recommendations'   => $data['recommendations'] ?? null,
                'recorded_by'       => $recordedByOfficialId,
            ]);

            // 2️⃣ Remove old participants (to avoid duplicates)
            $blotterReport->participants()->delete();

            // 3️⃣ Helper closure to store participants
            $storeParticipants = function (array $participants, string $role) use ($blotterReport) {
                foreach ($participants as $p) {
                    if (empty($p['resident_id']) && empty($p['resident_name'])) {
                        continue; // skip empty participant
                    }

                    CaseParticipant::create([
                        'blotter_id'  => $blotterReport->id,
                        'resident_id' => $p['resident_id'] ?? null,
                        'name'        => $p['resident_name'] ?? $p['name'] ?? null,
                        'role_type'   => $role,
                        'notes'       => $p['notes'] ?? null,
                    ]);
                }
            };

            // 4️⃣ Re-store all participant types
            $storeParticipants($data['complainants'] ?? [], 'complainant');
            $storeParticipants($data['respondents'] ?? [], 'respondent');
            $storeParticipants($data['witnesses'] ?? [], 'witness');

            DB::commit();

            return redirect()
                ->route('blotter_report.index')
                ->with('success', 'Blotter report updated successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update blotter report: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlotterReport $blotterReport)
    {
        DB::beginTransaction();

        try {
            // Delete related participants
            $blotterReport->participants()->delete();

            // // Delete related attachments (if applicable)
            // if ($blotterReport->attachments && $blotterReport->attachments->count() > 0) {
            //     foreach ($blotterReport->attachments as $attachment) {
            //         // Optional: delete file from storage if stored locally
            //         if ($attachment->file_path && \Storage::exists($attachment->file_path)) {
            //             \Storage::delete($attachment->file_path);
            //         }
            //         $attachment->delete();
            //     }
            // }

            // Delete the blotter itself
            $blotterReport->delete();

            DB::commit();

            return redirect()
                ->route('blotter_report.index')
                ->with('success', 'Blotter report deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Blotter report could not be deleted: ' . $e->getMessage());
        }
    }
}
