import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { Toaster, toast } from "sonner";
import PageHeader from "@/Components/PageHeader";
import FamilyForm from "./Partials/FamilyForm";

export default function Edit({ family, members, households }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Families",
            href: route("family.index"),
            showOnMobile: true,
        },
        {
            label: "Edit",
            href: route("family.edit", family?.id),
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
        household_id: family?.household_id ?? "",
        household_head_name: family?.household_head_name ?? "",
        has_linked_household: Boolean(family?.household_id),

        resident_id: family?.resident_id ?? "",
        resident_name: family?.resident_name ?? "",
        resident_image: family?.resident_image ?? "",
        birthdate: family?.birthdate ?? "",
        purok_number: family?.purok_number ?? "",
        house_number: family?.house_number ?? "",

        family_name: family?.family_name ?? "",
        family_type: family?.family_type ?? "",

        members:
            family?.members?.length > 0
                ? family.members.map((member) => ({
                      resident_id: member.resident_id ?? "",
                      resident_name: member.resident_name ?? "",
                      resident_image: member.resident_image ?? "",
                      birthdate: member.birthdate ?? "",
                      purok_number: member.purok_number ?? "",
                      relationship_to_head: member.relationship_to_head ?? "",
                      household_position: member.household_position ?? "",
                  }))
                : [{ ...defaultMember }],

        family_id: family?.id ?? "",
        _method: "put",
    };

    const { data, setData, post, processing, errors } =
        useForm(initialFamilyForm);

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

    const handleResetFamilyForm = () => {
        setData(initialFamilyForm);
    };

    const handleSubmitFamily = (e) => {
        e.preventDefault();

        post(route("family.update", family.id), {
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
                description: "Family record updated successfully!",
                duration: 3000,
                closeButton: true,
            });
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                description: "Operation failed!",
                duration: 3000,
                closeButton: true,
            });
        }
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Edit Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />

            <div className="pt-4 mb-6">
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <PageHeader
                            title="Edit Family Record"
                            description="Update the family head, family details, members, and optional household linkage."
                            icon={Users}
                            badge={
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                                    Update Record
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
                                        Family ID:
                                    </span>{" "}
                                    {family?.id ?? "—"}
                                </div>
                                <div>
                                    <span className="font-medium text-slate-700">
                                        Purpose:
                                    </span>{" "}
                                    Update family grouping
                                </div>
                                <div>
                                    <span className="font-medium text-slate-700">
                                        Household:
                                    </span>{" "}
                                    Optional
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
