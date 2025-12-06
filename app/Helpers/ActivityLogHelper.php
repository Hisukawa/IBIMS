<?php

namespace App\Helpers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogHelper
{
    /**
     * Create a log entry for user activities.
     *
     * @param string $module
     * @param string $action
     * @param string|null $description
     * @param int|null $barangayId
     */
    public static function log($module, $action, $description = null, $barangayId = null)
    {
        $user = Auth::user();

        ActivityLog::create([
            'user_id'      => $user?->id,
            'barangay_id'  => $barangayId ?? $user?->barangay_id ?? null,
            'role'         => $user?->role ?? null,
            'module'       => $module,
            'action_type'  => $action,
            'description'  => $description,
            'created_at' => now('Asia/Manila'),
            'updated_at' => now('Asia/Manila'),
        ]);
    }
}
