import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import DropdownInputField from "@/Components/DropdownInputField";
import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import {
    MoveRight,
    RotateCcw,
    Users,
    Home,
    MapPin,
    UserRound,
    AlertCircle,
    KeyRound,
    Building2,
    CalendarDays,
    BedDouble,
    Layers3,
    Navigation,
} from "lucide-react";
import { toast } from "sonner";

const familyTypeOptions = [
    { label: "Nuclear", value: "nuclear" },
    { label: "Extended", value: "extended" },
    { label: "Single Parent", value: "single_parent" },
    { label: "Stepfamilies", value: "stepfamilies" },
    { label: "Grandparent", value: "grandparent" },
    { label: "Childless", value: "childless" },
    { label: "Cohabiting Partners", value: "cohabiting_partners" },
    { label: "One-person Household", value: "one_person_household" },
    { label: "Roommates", value: "roommates" },
];

const relationshipOptions = [
    { label: "Spouse", value: "spouse" },
    { label: "Child", value: "child" },
    { label: "Sibling", value: "sibling" },
    { label: "Parent", value: "parent" },
    { label: "Parent-in-law", value: "parent_in_law" },
    { label: "Grandparent", value: "grandparent" },
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
    relationship_to_head: "",
    household_position: "",
};

export default function Index({ household, residents = [] }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Households",
            href: route("household.index"),
            showOnMobile: false,
        },
        { label: "Add Family", showOnMobile: true },
    ];

    const memberList = residents.map((resident) => ({
        label: `${resident.firstname ?? ""} ${resident.middlename ?? ""} ${resident.lastname ?? ""} ${resident.suffix ?? ""}`
            .replace(/\s+/g, " ")
            .trim(),
        value: String(resident.id),
    }));

    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            household_id: household?.id ?? "",
            resident_id: "",
            resident_name: "",
            resident_image: "",
            birthdate: "",
            purok_number: household?.purok?.purok_number ?? "",
            house_number: household?.house_number ?? "",
            family_name: "",
            fmaily_name: "",
            family_type: "",
            members: [{ ...defaultMember }],
        });

    const handleResidentChange = (e) => {
        const selected = residents.find((r) => String(r.id) === e.target.value);
        if (!selected) return;

        setData((prev) => ({
            ...prev,
            resident_id: selected.id,
            resident_name:
                `${selected.firstname ?? ""} ${selected.middlename ?? ""} ${selected.lastname ?? ""} ${selected.suffix ?? ""}`
                    .replace(/\s+/g, " ")
                    .trim(),
            resident_image: selected.resident_picture_path ?? "",
            birthdate: selected.birthdate ?? "",
            purok_number:
                selected.purok_number ?? household?.purok?.purok_number ?? "",
            house_number:
                selected.latest_household?.house_number ??
                household?.house_number ??
                "",
        }));
    };

    const handleDynamicResidentChange = (e, index) => {
        const selected = residents.find((r) => String(r.id) === e.target.value);
        if (!selected) return;

        const updatedMembers = [...data.members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            resident_id: selected.id ?? "",
            resident_name:
                `${selected.firstname ?? ""} ${selected.middlename ?? ""} ${selected.lastname ?? ""} ${selected.suffix ?? ""}`
                    .replace(/\s+/g, " ")
                    .trim(),
            purok_number:
                selected.purok_number ?? household?.purok?.purok_number ?? "",
            birthdate: selected.birthdate ?? "",
            resident_image: selected.resident_picture_path ?? "",
        };

        setData("members", updatedMembers);
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

    const addMember = () => {
        setData("members", [...data.members, { ...defaultMember }]);
    };

    const removeMember = (memberIndex) => {
        const updated = [...data.members];
        updated.splice(memberIndex, 1);
        setData("members", updated);

        toast.warning("Member removed.", {
            duration: 2000,
        });
    };

    const handleReset = () => {
        reset();
        setData({
            household_id: household?.id ?? "",
            resident_id: "",
            resident_name: "",
            resident_image: "",
            birthdate: "",
            purok_number: household?.purok?.purok_number ?? "",
            house_number: household?.house_number ?? "",
            family_name: "",
            fmaily_name: "",
            family_type: "",
            members: [{ ...defaultMember }],
        });
    };

    const handleSubmitFamily = (e) => {
        e.preventDefault();

        if (!data.resident_id) {
            toast.error("Please select the family head.");
            return;
        }

        if (!data.family_type) {
            toast.error("Please select the family type.");
            return;
        }

        if (!data.members.length) {
            toast.error("Please add at least one family member.");
            return;
        }

        transform((formData) => ({
            ...formData,
            fmaily_name: formData.family_name, // matches current StoreFamilyRequest typo
        }));

        post(route("family.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Family added successfully.");
                handleReset();
            },
            onError: (formErrors) => {
                console.error("Validation Errors:", formErrors);
                toast.error("Please check the form fields.");
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Add Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm my-3 transition hover:shadow-md">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        {/* LEFT */}
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
                                    Create a family record by assigning a
                                    household head and linking members within
                                    this household.
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

                        {/* RIGHT */}
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

                <form
                    onSubmit={handleSubmitFamily}
                    className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="border-b border-slate-200 p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Family Head Information
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Select the resident who will serve as the family
                                head.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
                            <div className="lg:col-span-2 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-5">
                                <InputLabel
                                    htmlFor="resident_image"
                                    value="Profile Photo"
                                />
                                <img
                                    src={
                                        data.resident_image
                                            ? `/storage/${data.resident_image}`
                                            : "/images/default-avatar.jpg"
                                    }
                                    alt="Resident Image"
                                    className="mt-3 h-32 w-32 rounded-full border border-slate-300 object-cover shadow-sm"
                                />
                            </div>

                            <div className="lg:col-span-4 space-y-4">
                                <DropdownInputField
                                    label="Full Name"
                                    name="resident_name"
                                    value={
                                        data.resident_id
                                            ? String(data.resident_id)
                                            : ""
                                    }
                                    placeholder="Select a resident"
                                    onChange={handleResidentChange}
                                    items={memberList}
                                />
                                <InputError
                                    message={errors.resident_id}
                                    className="mt-1"
                                />

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <InputField
                                        label="Birthdate"
                                        name="birthdate"
                                        value={data.birthdate || ""}
                                        readOnly
                                    />
                                    <InputField
                                        label="Purok Number"
                                        name="purok_number"
                                        value={data.purok_number || ""}
                                        readOnly
                                    />
                                    <InputField
                                        label="House Number"
                                        name="house_number"
                                        value={data.house_number || ""}
                                        readOnly
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Family Members
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Add the other members that belong to this
                                    family.
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addMember}
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                <IoIosAddCircleOutline className="mr-1 text-xl" />
                                Add Member
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {data.members.map((member, memberIndex) => (
                                <div
                                    key={memberIndex}
                                    className="relative rounded-xl border border-slate-200 bg-slate-50 p-5"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeMember(memberIndex)
                                        }
                                        className="absolute right-3 top-3 text-2xl text-red-500 hover:text-red-700"
                                        title="Remove Member"
                                    >
                                        <IoIosCloseCircleOutline />
                                    </button>

                                    <div className="mb-4 flex items-center gap-2">
                                        <UserRound className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Member {memberIndex + 1}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
                                        <div className="lg:col-span-2 flex flex-col items-center rounded-xl border border-slate-200 bg-white p-4">
                                            <InputLabel
                                                htmlFor="resident_image"
                                                value="Profile Photo"
                                            />
                                            <img
                                                src={
                                                    member.resident_image
                                                        ? `/storage/${member.resident_image}`
                                                        : "/images/default-avatar.jpg"
                                                }
                                                alt="Resident Image"
                                                className="mt-3 h-24 w-24 rounded-full border border-slate-300 object-cover"
                                            />
                                        </div>

                                        <div className="lg:col-span-4 space-y-4">
                                            <DropdownInputField
                                                label="Full Name"
                                                name="resident_name"
                                                value={
                                                    member.resident_id
                                                        ? String(
                                                              member.resident_id,
                                                          )
                                                        : ""
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
                                                className="mt-1"
                                            />

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <InputField
                                                    label="Birthdate"
                                                    name="birthdate"
                                                    value={
                                                        member.birthdate || ""
                                                    }
                                                    readOnly
                                                />
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

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <DropdownInputField
                                                    label="Relationship to Head"
                                                    name="relationship_to_head"
                                                    onChange={(e) =>
                                                        handleMemberFieldChange(
                                                            e,
                                                            memberIndex,
                                                        )
                                                    }
                                                    value={
                                                        member.relationship_to_head ||
                                                        ""
                                                    }
                                                    items={relationshipOptions}
                                                />
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
                                            </div>

                                            <InputError
                                                message={
                                                    errors[
                                                        `members.${memberIndex}.relationship_to_head`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `members.${memberIndex}.household_position`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                            >
                                <RotateCcw className="mr-1 h-4 w-4" />
                                Reset
                            </Button>

                            <Button
                                className="bg-blue-700 text-white hover:bg-blue-600"
                                type="submit"
                                disabled={processing}
                            >
                                Add Family
                                <MoveRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
