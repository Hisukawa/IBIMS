<?php

namespace App\Http\Controllers\BarangayAdmin\BarangayResources;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
use Inertia\Inertia;

class BarangayManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('BarangayOfficer/BarangayProfile/BarangayManagement');
    }
    public function barangayDetails()
    {
        $barangayId = Auth()->user()->barangay_id;
        $barangay = Barangay::findOrFail($barangayId);

        return response()->json([
            'data' => $barangay,
        ]);
    }
}
