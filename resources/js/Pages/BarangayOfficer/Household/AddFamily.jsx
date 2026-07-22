import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadCrumbsHeader";
import InputField from "@/Components/InputField";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import {
    Home,
    MapPin,
    Navigation,
    UserRound,
    Crown,
    Plus,
    Trash2,
    RotateCcw,
    MoveRight,
    ShieldCheck,
    CalendarDays,
    MapPinned,
    GitBranch,
    Users,
    BriefcaseBusiness,
} from "lucide-react";

const familyTypeOptions = [
    { label: "Nuclear", value: "nuclear" },
    { label: "Extended", value: "extended" },
    { label: "Single Parent", value: "single_parent" },
    { label: "Grandparent", value: "grandparent" },
    { label: "Childless", value: "childless" },
    { label: "Cohabiting Partners", value: "cohabiting_partners" },
    { label: "One-person Household", value: "one_person_household" },
    { label: "Roommates", value: "roommates" },
];

const relationshipOptions = [
    { label: "Self", value: "self" },
    { label: "Spouse", value: "spouse" },
    { label: "Child", value: "child" },
    { label: "Sibling", value: "sibling" },
    { label: "Parent", value: "parent" },
    { label: "Parent-in-law", value: "parent_in_law" },
    { label: "Grandparent", value: "grandparent" },
    { label: "Other Relative", value: "other_relative" },
    { label: "Boarder", value: "boarder" },
    { label: "Tenant", value: "tenant" },
];

const householdPositionOptions = [
    { label: "Primary/Nuclear", value: "primary" },
    { label: "Extended", value: "extended" },
    { label: "Boarder", value: "boarder" },
];

const defaultMember = {
    resident_id: "",
    resident_name: "",
    resident_image: "",
    birthdate: "",
    purok_number: "",
    house_number: "",
    relation_to_household_head: "",
    household_position: "",
    is_family_head: false,
};

export default function Create({
    household,
    residents = [],
    headResidentId = null,
    headResident = null,
}) {
    const breadcrumbs = [
        { title: "Households", href: route("household.index") },
        { title: "Add Family", href: "#" },
    ];

    const memberList = residents.map((resident) => ({
        label: `${resident.firstname ?? ""} ${resident.middlename ?? ""} ${
            resident.lastname ?? ""
        } ${resident.suffix ?? ""}`
            .replace(/\s+/g, " ")
            .trim(),
        value: String(resident.id),
    }));

    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            household_id: household?.id ?? "",
            househohold_head_id: headResidentId ?? "",
            purok_number: household?.purok?.purok_number ?? "",
            house_number: household?.house_number ?? "",
            family_name: "",
            family_type: "",
            members: [{ ...defaultMember, is_family_head: true }],
        });

    const getResidentById = (residentId) =>
        residents.find(
            (resident) => String(resident.id) === String(residentId),
        );

    const buildResidentName = (resident) =>
        `${resident?.firstname ?? ""} ${resident?.middlename ?? ""} ${
            resident?.lastname ?? ""
        } ${resident?.suffix ?? ""}`
            .replace(/\s+/g, " ")
            .trim();
    const handleDynamicResidentChange = (e, index) => {
        const selected = getResidentById(e.target.value);
        if (!selected) return;

        const updatedMembers = [...data.members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            resident_id: selected.id ? String(selected.id) : "",
            resident_name: buildResidentName(selected),
            purok_number:
                selected.purok_number ?? household?.purok?.purok_number ?? "",
            birthdate: selected.birthdate ?? "",
            resident_image: selected.resident_picture_path ?? "",
        };

        setData("members", updatedMembers);
    };

    const handleMemberFieldChange = (e, memberIndex) => {
        const { name, value } = e.target;

        setData(
            "members",
            data.members.map((member, index) =>
                index === memberIndex ? { ...member, [name]: value } : member,
            ),
        );
    };

    const setFamilyHead = (index) => {
        const updatedMembers = data.members.map((member, memberIndex) => ({
            ...member,
            is_family_head: memberIndex === index,
            relationship_to_head:
                memberIndex === index ? "self" : member.relationship_to_head,
        }));

        setData("members", updatedMembers);
    };

    const addMember = () => {
        setData("members", [...data.members, { ...defaultMember }]);
    };

    const removeMember = (memberIndex) => {
        if (data.members.length === 1) {
            toast.error("At least one family member is required.");
            return;
        }

        const updated = [...data.members];
        const removedMember = updated[memberIndex];
        updated.splice(memberIndex, 1);

        if (removedMember.is_family_head && updated.length) {
            updated[0] = {
                ...updated[0],
                is_family_head: true,
                relationship_to_head: "self",
            };
        }

        setData("members", updated);

        toast.warning("Member removed.", {
            duration: 2000,
        });
    };

    const handleReset = () => {
        reset();
        setData({
            household_id: household?.id ?? "",
            househohold_head_id: headResidentId ?? "",
            purok_number: household?.purok?.purok_number ?? "",
            house_number: household?.house_number ?? "",
            fmaily_name: "",
            family_type: "",
            members: [{ ...defaultMember, is_family_head: true }],
        });
    };

    const handleSubmitFamily = (e) => {
        e.preventDefault();

        if (!data.family_type) {
            toast.error("Please select the family type.");
            return;
        }

        if (!data.members.length) {
            toast.error("Please add at least one family member.");
            return;
        }

        const familyHead = data.members.find((member) => member.is_family_head);

        if (!familyHead?.resident_id) {
            toast.error("Please select the family head.");
            return;
        }

        const selectedIds = data.members
            .map((member) => member.resident_id)
            .filter(Boolean);

        const hasDuplicateResidents =
            new Set(selectedIds.map(String)).size !== selectedIds.length;

        if (hasDuplicateResidents) {
            toast.error("Duplicate residents are not allowed.");
            return;
        }

        transform((formData) => {
            const currentFamilyHead = formData.members.find(
                (member) => member.is_family_head,
            );

            return {
                ...formData,
                resident_id: currentFamilyHead?.resident_id ?? "",
                resident_name: currentFamilyHead?.resident_name ?? "",
                resident_image: currentFamilyHead?.resident_image ?? "",
                birthdate: currentFamilyHead?.birthdate ?? "",
                fmaily_name: formData.family_name,
                members: formData.members.map((member) => ({
                    ...member,
                    relation_to_household_head:
                        member.relation_to_household_head || "",
                })),
            };
        });

        post(route("family.extended.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Family added successfully.");
                handleReset();
            },
            onError: (formErrors) => {
                console.error("Validation Errors:", formErrors);
                const firstError = Object.values(formErrors)[0];
                toast.error(firstError || "Please check the form fields.");
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Add Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
                <div className="my-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                <Home className="h-7 w-7" />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-semibold text-slate-900">
                                        Add Family
                                    </h1>

                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                        House #{household?.house_number ?? "—"}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Create a family record within this
                                    household. The household head and family
                                    head may be different.
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        Purok{" "}
                                        {household?.purok?.purok_number ??
                                            "N/A"}
                                    </span>

                                    {household?.street?.street_name && (
                                        <span className="flex items-center gap-1">
                                            <Navigation className="h-3.5 w-3.5" />
                                            {household.street.street_name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full justify-end md:w-auto">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.visit(route("household.index"))
                                }
                                className="border-slate-300 text-slate-700 hover:bg-slate-100"
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
                    <strong>Reminder:</strong> The household head and all family
                    members must already be registered as residents.
                </div>

                <form onSubmit={handleSubmitFamily} className="space-y-6 pb-32">
                    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50/60 p-6 md:p-8">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div className="max-w-2xl">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        <Home className="h-3.5 w-3.5" />
                                        Household Family Setup
                                    </div>

                                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                                        Family Information
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Create a new family record within this
                                        household. The household head is shown
                                        for reference, while the family head is
                                        selected from the members below.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            House Number
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-900">
                                            {data.house_number || "—"}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Purok Number
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-900">
                                            {data.purok_number || "—"}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Household Head
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
                                            {headResident
                                                ? headResident.fullname
                                                : "Not assigned"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <div className="xl:col-span-1">
                                    <DropdownInputField
                                        label="Family Type"
                                        value={data.family_type || ""}
                                        items={familyTypeOptions}
                                        onChange={(e) =>
                                            setData(
                                                "family_type",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Select family type"
                                    />
                                    <InputError
                                        message={errors.family_type}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="xl:col-span-2">
                                    <InputField
                                        label="Family Name (Optional)"
                                        name="family_name"
                                        value={data.family_name || ""}
                                        onChange={(e) => {
                                            setData(
                                                "family_name",
                                                e.target.value,
                                            );
                                            setData(
                                                "fmaily_name",
                                                e.target.value,
                                            );
                                        }}
                                        placeholder="Enter family name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="mb-6 flex flex-col gap-4 border-b border-dashed border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        Family Members
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        The first selected member is the default
                                        family head, but you can assign another
                                        member anytime.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addMember}
                                    className="rounded-xl border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Member
                                </Button>
                            </div>

                            <div className="space-y-5">
                                {(data.members || []).map(
                                    (member, memberIndex) => (
                                        <div
                                            key={memberIndex}
                                            className={`overflow-hidden rounded-3xl border shadow-sm transition-all duration-200 ${
                                                member.is_family_head
                                                    ? "border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 shadow-indigo-100/40"
                                                    : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                        >
                                            <div
                                                className={`border-b px-5 py-4 md:px-6 ${
                                                    member.is_family_head
                                                        ? "border-indigo-100 bg-indigo-50/60"
                                                        : "border-slate-200 bg-slate-50/70"
                                                }`}
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                                                                member.is_family_head
                                                                    ? "border-indigo-200 bg-indigo-100 text-indigo-700"
                                                                    : "border-slate-200 bg-slate-100 text-slate-600"
                                                            }`}
                                                        >
                                                            {member.is_family_head ? (
                                                                <Crown className="h-5 w-5" />
                                                            ) : (
                                                                <Users className="h-5 w-5" />
                                                            )}
                                                        </div>

                                                        <div>
                                                            <h3 className="text-sm font-semibold text-slate-900">
                                                                {member.is_family_head
                                                                    ? "Family Head"
                                                                    : `Family Member ${memberIndex + 1}`}
                                                            </h3>
                                                            <p className="text-xs text-slate-500">
                                                                {member.is_family_head
                                                                    ? "Main representative of this family record"
                                                                    : "Member assigned under this household family"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {member.is_family_head ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                                Current Family
                                                                Head
                                                            </span>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    setFamilyHead(
                                                                        memberIndex,
                                                                    )
                                                                }
                                                                className="h-9 rounded-xl border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                                                            >
                                                                <Crown className="mr-2 h-4 w-4" />
                                                                Set as Head
                                                            </Button>
                                                        )}

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                removeMember(
                                                                    memberIndex,
                                                                )
                                                            }
                                                            className="h-9 rounded-xl border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-12 md:p-6">
                                                <div className="md:col-span-3">
                                                    <div className="sticky top-4 rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm">
                                                        <div className="flex flex-col items-center text-center">
                                                            <div className="relative">
                                                                <div className="rounded-full bg-white p-1.5 shadow-sm ring-1 ring-slate-200">
                                                                    <img
                                                                        src={
                                                                            member.resident_image
                                                                                ? `/storage/${member.resident_image}`
                                                                                : "/images/default-avatar.jpg"
                                                                        }
                                                                        alt="Resident"
                                                                        className="h-28 w-28 rounded-full object-cover"
                                                                    />
                                                                </div>

                                                                {member.is_family_head && (
                                                                    <span className="absolute -bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                                                                        <Crown className="h-3 w-3" />
                                                                        Head
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mt-4 text-sm font-semibold text-slate-900">
                                                                {member.resident_name ||
                                                                    "No resident selected"}
                                                            </p>
                                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                                Resident profile
                                                                and basic
                                                                details will
                                                                appear here
                                                                after selection.
                                                            </p>

                                                            <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left">
                                                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                                    Member
                                                                    Status
                                                                </p>
                                                                <p
                                                                    className={`mt-1 text-sm font-semibold ${
                                                                        member.is_family_head
                                                                            ? "text-indigo-700"
                                                                            : "text-slate-700"
                                                                    }`}
                                                                >
                                                                    {member.is_family_head
                                                                        ? "Assigned as Family Head"
                                                                        : "Regular Family Member"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-5 md:col-span-9">
                                                    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                                        <div className="mb-3 flex items-center gap-2">
                                                            <UserRound className="h-4 w-4 text-slate-500" />
                                                            <p className="text-sm font-semibold text-slate-800">
                                                                Resident
                                                                Information
                                                            </p>
                                                        </div>

                                                        <DropdownInputField
                                                            label="Resident"
                                                            name="resident_id"
                                                            value={
                                                                member.resident_id ||
                                                                ""
                                                            }
                                                            placeholder="Select a resident"
                                                            onChange={(e) =>
                                                                handleDynamicResidentChange(
                                                                    e,
                                                                    memberIndex,
                                                                )
                                                            }
                                                            items={memberList}
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `members.${memberIndex}.resident_id`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                                            <div className="mb-3 flex items-center gap-2">
                                                                <CalendarDays className="h-4 w-4 text-slate-500" />
                                                                <p className="text-sm font-semibold text-slate-800">
                                                                    Birth
                                                                    Information
                                                                </p>
                                                            </div>

                                                            <InputField
                                                                label="Birthdate"
                                                                name="birthdate"
                                                                value={
                                                                    member.birthdate ||
                                                                    ""
                                                                }
                                                                readOnly
                                                            />
                                                        </div>

                                                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                                            <div className="mb-3 flex items-center gap-2">
                                                                <MapPinned className="h-4 w-4 text-slate-500" />
                                                                <p className="text-sm font-semibold text-slate-800">
                                                                    Location
                                                                </p>
                                                            </div>

                                                            <InputField
                                                                label="Purok Number"
                                                                name="purok_number"
                                                                value={
                                                                    member.purok_number ||
                                                                    ""
                                                                }
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                                            <div className="mb-3 flex items-center gap-2">
                                                                <GitBranch className="h-4 w-4 text-slate-500" />
                                                                <p className="text-sm font-semibold text-slate-800">
                                                                    Household
                                                                    Relation
                                                                </p>
                                                            </div>

                                                            <DropdownInputField
                                                                label="Relation to Household Head"
                                                                name="relation_to_household_head"
                                                                onChange={(e) =>
                                                                    handleMemberFieldChange(
                                                                        e,
                                                                        memberIndex,
                                                                    )
                                                                }
                                                                value={
                                                                    member.relation_to_household_head ||
                                                                    ""
                                                                }
                                                                items={
                                                                    relationshipOptions
                                                                }
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `members.${memberIndex}.relation_to_household_head`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>

                                                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                                            <div className="mb-3 flex items-center gap-2">
                                                                <BriefcaseBusiness className="h-4 w-4 text-slate-500" />
                                                                <p className="text-sm font-semibold text-slate-800">
                                                                    Household
                                                                    Role
                                                                </p>
                                                            </div>

                                                            <DropdownInputField
                                                                label="Household Position"
                                                                name="household_position"
                                                                onChange={(e) =>
                                                                    handleMemberFieldChange(
                                                                        e,
                                                                        memberIndex,
                                                                    )
                                                                }
                                                                value={
                                                                    member.household_position ||
                                                                    ""
                                                                }
                                                                items={
                                                                    householdPositionOptions
                                                                }
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `members.${memberIndex}.household_position`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900">
                                    Ready to save this family record?
                                </p>
                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Review the family head, member details, and
                                    household assignment before submitting.
                                </p>
                            </div>

                            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end lg:w-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    className="h-11 rounded-xl border-slate-300 px-5 text-slate-700 hover:bg-slate-100"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset Form
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 rounded-xl bg-blue-700 px-6 text-white hover:bg-blue-800"
                                >
                                    {processing ? "Saving..." : "Add Family"}
                                    <MoveRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
