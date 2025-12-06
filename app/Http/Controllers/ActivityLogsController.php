<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = ActivityLog::with([
            'user:id,username',
            'barangay:id,barangay_name'
        ]);

        // Filter by barangay if the user has a barangay_id
        if (auth()->user()->barangay_id) {
            $query->where('barangay_id', auth()->user()->barangay_id);
        }

        // SEARCH BY NAME
        if (request()->has('name') && request('name') !== '') {
            $search = request('name');

            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                ->orWhere('action_type', 'like', "%{$search}%")
                ->orWhereHas('user', function ($uq) use ($search) {
                    $uq->where('username', 'like', "%{$search}%");
                });
            });
        }

        // ACTION TYPE FILTER
        if (request()->filled('action') && request('action') !== 'All') {
            $query->where('action_type', request('action'));
        }

        // ROLE FILTER
        if (request()->filled('role') && request('role') !== 'All') {
            $query->where('role', request('role'));
        }

        // MODULE FILTER
        if (request()->filled('module') && request('module') !== 'All') {
            $query->where('module', request('module'));
        }

        // DATE RANGE FILTER
        if (request()->filled('start_date')) {
            $query->whereDate('created_at', '>=', request('start_date'));
        }

        if (request()->filled('end_date')) {
            $query->whereDate('created_at', '<=', request('end_date'));
        }

        $logs = $query
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString()
            ->through(function ($log) {
                return [
                    'id'            => $log->id,
                    'user_name'     => $log->user?->username ?? 'N/A',
                    'role'          => $log->role,
                    'module'        => $log->module,
                    'action_type'   => $log->action_type,
                    'description'   => $log->description,
                    'barangay_name' => $log->barangay?->barangay_name ?? 'N/A',
                    'created_at'    => $log->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('ActivityLogs/Index', [
            'activity_logs' => $logs,
            'queryParams' => request()->query() ?: null,
            'action_types' => ActivityLog::distinct()->orderBy('action_type')->pluck('action_type'),
            'modules'      => ActivityLog::distinct()->orderBy('module')->pluck('module'),
            'roles'        => ActivityLog::distinct()->orderBy('role')->pluck('role'),
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
    public function show(ActivityLog $activityLog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ActivityLog $activityLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ActivityLog $activityLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActivityLog $activityLog)
    {
        //
    }
}
