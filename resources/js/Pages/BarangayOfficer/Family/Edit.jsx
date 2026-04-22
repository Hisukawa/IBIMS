import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { ArrowLeft, Pencil, Users } from "lucide-react";
import { Toaster, toast } from "sonner";
import PageHeader from "@/Components/PageHeader";
import FamilyForm from "./Partials/FamilyForm";

export default function Edit({ family, members }) {
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
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: "",
        purok_number: "",
        relationship_to_head: "",
        household_position: "",
    };

    const memberList = members.map((mem) => ({
        label: `${mem.firstname} ${mem.middlename} ${mem.lastname} ${
            mem.suffix ?? ""
        }`,
        value: mem.id.toString(),
    }));

    const { data, setData, post, processing, errors, reset } = useForm({
        resident_id: family?.resident_id ?? null,
        resident_name: family?.resident_name ?? "",
        resident_image: family?.resident_image ?? null,
        birthdate: family?.birthdate ?? null,
        purok_number: family?.purok_number ?? null,
        house_number: family?.house_number ?? null,
        family_name: family?.family_name ?? "",
        family_type: family?.family_type ?? "",
        members:
            family?.members?.length > 0
                ? family.members.map((member) => ({
                      resident_id: member.resident_id ?? null,
                      resident_name: member.resident_name ?? "",
                      resident_image: member.resident_image ?? null,
                      birthdate: member.birthdate ?? "",
                      purok_number: member.purok_number ?? "",
                      relationship_to_head: member.relationship_to_head ?? "",
                      household_position: member.household_position ?? "",
                  }))
                : [{ ...defaultMember }],
        family_id: family?.id ?? null,
        _method: "put",
    });

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

    const handleResidentChange = (e) => {
        const resident = members.find((r) => r.id == e.target.value);

        if (resident) {
            setData("resident_id", resident.id);
            setData(
                "resident_name",
                `${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                } ${resident.suffix ?? ""}`,
            );
            setData("purok_number", resident.purok_number);
            setData(
                "house_number",
                resident.latest_household?.house_number ??
                    resident.household?.house_number,
            );
            setData("birthdate", resident.birthdate);
            setData("resident_image", resident.resident_picture_path);
        }
    };

    const handleDynamicResidentChange = (e, index) => {
        const updatedMembers = [...data.members];
        const selected = members.find((r) => r.id == e.target.value);

        if (selected) {
            updatedMembers[index] = {
                ...updatedMembers[index],
                resident_id: selected.id ?? "",
                resident_name: `${selected.firstname ?? ""} ${
                    selected.middlename ?? ""
                } ${selected.lastname ?? ""} ${selected.suffix ?? ""}`,
                purok_number: selected.purok_number ?? "",
                birthdate: selected.birthdate ?? "",
                resident_image: selected.resident_picture_path ?? null,
            };

            setData("members", updatedMembers);
        }
    };

    const handleMemberFieldChange = (e, index) => {
        const { name, value } = e.target;
        const updatedMembers = [...data.members];

        updatedMembers[index] = {
            ...updatedMembers[index],
            [name]: value,
        };

        setData("members", updatedMembers);
    };

    const handleSubmitFamily = (e) => {
        e.preventDefault();

        post(route("family.update", family.id), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);

                const firstError = Object.values(errors)[0];

                toast.error("Validation Error", {
                    description: firstError,
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    const handleResetFamilyForm = () => {
        reset();
        setData({
            resident_id: family?.resident_id ?? null,
            resident_name: family?.resident_name ?? "",
            resident_image: family?.resident_image ?? null,
            birthdate: family?.birthdate ?? null,
            purok_number: family?.purok_number ?? null,
            house_number: family?.house_number ?? null,
            family_name: family?.family_name ?? "",
            family_type: family?.family_type ?? "",
            members:
                family?.members?.length > 0
                    ? family.members.map((member) => ({
                          resident_id: member.resident_id ?? null,
                          resident_name: member.resident_name ?? "",
                          resident_image: member.resident_image ?? null,
                          birthdate: member.birthdate ?? "",
                          purok_number: member.purok_number ?? "",
                          relationship_to_head:
                              member.relationship_to_head ?? "",
                          household_position: member.household_position ?? "",
                      }))
                    : [{ ...defaultMember }],
            family_id: family?.id ?? null,
            _method: "put",
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
                            description="Update the family head, modify family details, and manage the assigned members for this family record."
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
                                    Update family grouping and member details
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
                        errors={errors}
                        memberList={memberList}
                        handleResidentChange={handleResidentChange}
                        handleDynamicResidentChange={
                            handleDynamicResidentChange
                        }
                        handleMemberFieldChange={handleMemberFieldChange}
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
