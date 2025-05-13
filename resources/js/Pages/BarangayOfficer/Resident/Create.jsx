import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
export default function Index() {
    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <div>
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        hello word
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
