<?php

namespace App\Http\Controllers\BarangayAdmin\BarangayResources;

use App\Helpers\ActivityLogHelper;
use App\Http\Controllers\Controller;
use App\Models\Purok;
use App\Models\Street;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StreetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $barangayId = auth()->user()->barangay_id;
        $search = trim($request->get('search', ''));

        $query = Street::with('purok')
            ->whereHas('purok', fn($q) => $q->where('barangay_id', $barangayId))
            ->join('puroks', 'puroks.id', '=', 'streets.purok_id')
            ->select('streets.*') // avoid column conflicts
            ->when($request->filled('purok') && $request->get('purok') !== 'All', function ($q) use ($request) {
                $q->where('puroks.purok_number', $request->get('purok'));
            })
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('streets.street_name', 'like', "%{$search}%")
                        ->orWhere('puroks.purok_number', 'like', "%{$search}%");
                });
            })
            ->orderBy('puroks.purok_number')
            ->orderBy('streets.street_name');

        $puroks = Purok::where('barangay_id', $barangayId)
            ->orderBy('purok_number', 'asc')
            ->get(['id', 'purok_number']);

        $streets = $query->paginate(10)->withQueryString();

        return Inertia::render("BarangayOfficer/BarangayProfile/Street/Index", [
            'streets' => $streets,
            'queryParams' => $request->query() ?: null,
            'puroks' => $puroks,
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
        // ✅ Validate input
        $validated = $request->validate([
            'street_name' => ['required', 'string', 'max:255'],
            'purok_id'    => ['required', 'exists:puroks,id'],
        ]);

        try {
            Street::create([
                'street_name' => $validated['street_name'],
                'purok_id'    => $validated['purok_id'],
            ]);

            ActivityLogHelper::log(
                'Street',
                'create',
                "Added new street: {$validated['street_name']}"
            );

            return back()->with('success', 'Street added successfully!');

        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Failed to add street: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Street $street)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Street $street)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Street $street)
    {
        try {
            $oldName = $street->street_name ?? 'N/A';

            $validated = $request->validate([
                'street_name' => ['required', 'string', 'max:255'],
                'purok_id'    => ['required', 'exists:puroks,id'],
            ]);

            $street->update([
                'street_name' => $validated['street_name'],
                'purok_id'    => $validated['purok_id'],
            ]);

            // Friendlier and more descriptive log
            ActivityLogHelper::log(
                'Street',
                'update',
                "Street name changed from '{$oldName}' to '{$validated['street_name']}'"
            );

            return back()->with('success', 'Street updated successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->with('error', 'Please check the form and try again.');
        } catch (\Exception $e) {
            return back()
                ->with('error', 'Something went wrong while updating the street.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Street $street)
    {
        try {
            $streetName = $street->street_name;
            $street->delete();
            ActivityLogHelper::log(
                'Street',
                'delete',
                "Deleted street: {$streetName}"
            );
            return back()->with('success', 'Street deleted successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete street. Please try again.');
        }
    }


    public function streetDetails($id)
    {
        try {
            $street = Street::with('purok')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $street,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Street not found.',
            ], 404);
        }
    }
}
