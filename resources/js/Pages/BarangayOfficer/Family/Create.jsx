import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { Toaster, toast } from "sonner";
import PageHeader from "@/Components/PageHeader";
import FamilyForm from "./Partials/FamilyForm";

export default function Create({ members, households }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Families",
            href: route("family.index"),
            showOnMobile: true,
        },
        {
            label: "Create",
            href: route("family.create"),
            showOnMobile: true,
        },
    ];

    const { success, error } = usePage().props;

    const defaultMember = {
        resident_id: "",
        resident_name: "",
        resident_image: "",
        birthdate: "",
        purok_number: "",
        relationship_to_head: "",
        household_position: "",
    };

    const initialFamilyForm = {
        household_id: "",
        household_head_name: "",
        has_linked_household: false,
        resident_id: "",
        resident_name: "",
        resident_image: "",
        birthdate: "",
        purok_number: "",
        house_number: "",
        family_name: "",
        family_type: "",
        members: [{ ...defaultMember }],
        family_id: "",
        _method: undefined,
    };

    const { data, setData, post, processing, errors, reset } =
        useForm(initialFamilyForm);

    const handleResetFamilyForm = () => {
        setData(initialFamilyForm);
    };

    const addMember = () => {
        setData("members", [...(data.members || []), { ...defaultMember }]);
    };

    const removeMember = (memberIndex) => {
        const updated = [...(data.members || [])];
        updated.splice(memberIndex, 1);
        setData("members", updated);

        toast.warning("Member removed.", {
            duration: 2000,
        });
    };

    const handleSubmitFamily = (e) => {
        e.preventDefault();

        post(route("family.store"), {
            onError: (errors) => {
                const firstError = Object.values(errors)[0];

                toast.error("Validation Error", {
                    description: firstError,
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    useEffect(() => {
        if (success) {
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
        }
    }, [success]);

    // useEffect(() => {
    //     if (error) {
    //         toast.error(error, {
    //             description: "Operation failed!",
    //             duration: 3000,
    //             closeButton: true,
    //         });
    //     }
    // }, [error]);

    return (
        <AdminLayout>
            <Head title="Create Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="pt-4 mb-6">
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <PageHeader
                            title="Create Family Record"
                            description="Register a new family by selecting the family head and assigning household members from the resident list."
                            icon={Users}
                            badge={
                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                    New Entry
                                </span>
                            }
                            actions={
                                <button
                                    onClick={() =>
                                        router.visit(route("family.index"))
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </button>
                            }
                        >
                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                <div>
                                    <span className="font-medium text-slate-700">
                                        Purpose:
                                    </span>{" "}
                                    Create family grouping from registered
                                    residents
                                </div>
                                <div>
                                    <span className="font-medium text-slate-700">
                                        Includes:
                                    </span>{" "}
                                    Head, members, type, and household linkage
                                </div>
                            </div>
                        </PageHeader>
                    </div>

                    <FamilyForm
                        data={data}
                        setData={setData}
                        members={members}
                        households={households}
                        errors={errors}
                        handleSubmitFamily={handleSubmitFamily}
                        addMember={addMember}
                        removeMember={removeMember}
                        handleResetFamilyForm={handleResetFamilyForm}
                        processing={processing}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
