import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import DropdownInputField from "@/Components/DropdownInputField";
import { Button } from "@/Components/ui/button";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { House, MoveRight, RotateCcw, UserRound, Users } from "lucide-react";

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
    { label: "Spouse", value: "spouse" },
    { label: "Child", value: "child" },
    { label: "Sibling", value: "sibling" },
    { label: "Parent", value: "parent" },
    { label: "Parent-in-law", value: "parent_in_law" },
    { label: "Grandparent", value: "grandparent" },
    { label: "Boarder", value: "boarder" },
    { label: "Tenant", value: "tenant" },
];

const householdPositionOptions = [
    { label: "Primary/Nuclear", value: "primary" },
    { label: "Extended", value: "extended" },
    { label: "Boarder", value: "boarder" },
];

export default function FamilyForm({
    data,
    setData,
    members,
    households,
    errors,
    handleSubmitFamily,
    addMember,
    removeMember,
    handleResetFamilyForm,
    processing = false,
}) {
    const handleResidentChange = (e) => {
        const residentId = Number(e.target.value);
        const resident = members.find((r) => r.id === residentId);

        if (!resident) return;

        const linkedHousehold =
            resident.latest_household ?? resident.household ?? null;

        setData("resident_id", resident.id);
        setData(
            "resident_name",
            `${resident.firstname} ${resident.middlename ?? ""} ${resident.lastname} ${resident.suffix ?? ""}`.trim(),
        );
        setData("birthdate", resident.birthdate ?? "");
        setData("resident_image", resident.resident_picture_path ?? "");

        if (linkedHousehold) {
            setData("has_linked_household", true);
            setData("household_id", linkedHousehold.id ?? "");
            setData("house_number", linkedHousehold.house_number ?? "");
            setData(
                "purok_number",
                linkedHousehold.purok?.purok_number ??
                    resident.purok_number ??
                    "",
            );
            setData(
                "household_head_name",
                linkedHousehold.latest_household_head?.resident?.full_name ??
                    `${resident.firstname} ${resident.middlename ?? ""} ${resident.lastname} ${resident.suffix ?? ""}`.trim(),
            );
        } else {
            setData("has_linked_household", false);
            setData("household_id", "");
            setData("house_number", "");
            setData("household_head_name", "");
            setData("purok_number", resident.purok_number ?? "");
        }
    };
    const memberList = members.map((mem) => ({
        label: `${mem.firstname} ${mem.middlename} ${mem.lastname} ${
            mem.suffix ?? ""
        }`,
        value: mem.id.toString(),
    }));
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
    const householdList = households.map((household) => ({
        label: `House #${household.house_number} • ${household.latest_household_head?.resident?.full_name ?? "No household head"}`,
        value: String(household.id),
        id: household.id,
        house_number: household.house_number,
        head_name: household.latest_household_head?.resident?.full_name ?? "",
        head_resident_id: household.latest_household_head?.resident?.id ?? "",
    }));
    const handleHouseholdChange = (e) => {
        const selectedHouseholdId = e.target.value;
        const selectedHousehold = householdList.find(
            (item) => item.value === selectedHouseholdId,
        );

        if (!selectedHousehold) {
            setData("household_id", "");
            setData("house_number", "");
            setData("household_head_name", "");
            return;
        }

        setData("household_id", selectedHousehold.value);
        setData("house_number", selectedHousehold.house_number ?? "");
        setData("household_head_name", selectedHousehold.head_name ?? "");
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-6 text-amber-800">
                    <span className="font-semibold">Reminder:</span> The family
                    head and all members must already be registered as residents
                    before creating a family record.
                </p>
            </div>

            <form onSubmit={handleSubmitFamily} className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-2">
                        <UserRound className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-slate-900">
                            Family Head Information
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
                        <div className="md:col-span-2">
                            <InputLabel
                                htmlFor="resident_image"
                                value="Profile Photo"
                            />
                            <div className="mt-2 flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <img
                                    src={
                                        data.resident_image
                                            ? `/storage/${data.resident_image}`
                                            : "/images/default-avatar.jpg"
                                    }
                                    alt="Resident"
                                    className="h-32 w-32 rounded-full border border-slate-200 object-cover shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 md:col-span-4">
                            <DropdownInputField
                                label="Family Head"
                                name="resident_name"
                                value={data.resident_name || ""}
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
                                    label="Family Name"
                                    name="family_name"
                                    value={data.family_name || ""}
                                    onChange={(e) =>
                                        setData("family_name", e.target.value)
                                    }
                                    placeholder="Enter family name"
                                />
                                <DropdownInputField
                                    label="Family Type"
                                    name="family_type"
                                    value={data.family_type || ""}
                                    items={familyTypeOptions}
                                    onChange={(e) =>
                                        setData("family_type", e.target.value)
                                    }
                                    placeholder="Select family type"
                                />
                            </div>

                            <InputError
                                message={errors.family_name}
                                className="mt-1"
                            />
                            <InputError
                                message={errors.family_type}
                                className="mt-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <House className="h-5 w-5 text-emerald-600" />
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Linked Household
                            </h2>
                            <p className="text-sm text-slate-500">
                                Household information connected to the selected
                                family head.
                            </p>
                        </div>
                    </div>

                    {data.has_linked_household ? (
                        <>
                            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                                <p className="text-sm font-medium text-emerald-800">
                                    The selected family head already has a
                                    linked household.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                                        Purok
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {data.purok_number || "—"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                                        House Number
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {data.house_number || "—"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-violet-600">
                                        Household Head
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {data.household_head_name ||
                                            data.resident_name ||
                                            "—"}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                <p className="text-sm text-amber-800">
                                    The selected family head does not have a
                                    linked household yet. Please select a
                                    household manually.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="md:col-span-3">
                                    <DropdownInputField
                                        label="Select Household"
                                        name="household_id"
                                        value={data.household_id || ""}
                                        items={householdList}
                                        onChange={handleHouseholdChange}
                                        placeholder="Choose a household"
                                    />
                                    <InputError
                                        message={errors.household_id}
                                        className="mt-1"
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Purok
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {data.purok_number || "—"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        House Number
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {data.house_number || "—"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Household Head
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {data.household_head_name || "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-violet-600" />
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Family Members
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Add all members belonging to this family.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={addMember}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                        >
                            <IoIosAddCircleOutline className="text-xl" />
                            Add Member
                        </button>
                    </div>

                    <div className="space-y-4">
                        {(data.members || []).map((member, memberIndex) => (
                            <div
                                key={memberIndex}
                                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5"
                            >
                                <button
                                    type="button"
                                    onClick={() => removeMember(memberIndex)}
                                    className="absolute right-3 top-3 text-red-500 hover:text-red-700"
                                >
                                    <IoIosCloseCircleOutline className="text-2xl" />
                                </button>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
                                    <div className="md:col-span-2">
                                        <InputLabel value="Profile Photo" />
                                        <div className="mt-2 flex justify-center rounded-2xl border border-slate-200 bg-white p-4">
                                            <img
                                                src={
                                                    member.resident_image
                                                        ? `/storage/${member.resident_image}`
                                                        : "/images/default-avatar.jpg"
                                                }
                                                alt="Member"
                                                className="h-24 w-24 rounded-full border border-slate-200 object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:col-span-4">
                                        <DropdownInputField
                                            label="Member Name"
                                            name="resident_name"
                                            value={member.resident_name || ""}
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
                                                value={member.birthdate || ""}
                                                readOnly
                                            />
                                            <InputField
                                                label="Purok Number"
                                                name="purok_number"
                                                value={
                                                    member.purok_number || ""
                                                }
                                                readOnly
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <DropdownInputField
                                                label="Relationship to Head"
                                                name="relationship_to_head"
                                                value={
                                                    member.relationship_to_head ||
                                                    ""
                                                }
                                                items={relationshipOptions}
                                                onChange={(e) =>
                                                    handleMemberFieldChange(
                                                        e,
                                                        memberIndex,
                                                    )
                                                }
                                            />
                                            <DropdownInputField
                                                label="Household Position"
                                                name="household_position"
                                                value={
                                                    member.household_position ||
                                                    ""
                                                }
                                                items={householdPositionOptions}
                                                onChange={(e) =>
                                                    handleMemberFieldChange(
                                                        e,
                                                        memberIndex,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sticky bottom-4 z-30 flex justify-center">
                    <div className="w-full max-w-4xl rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-lg px-4 py-3">
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleResetFamilyForm}
                                className="bg-white/60 backdrop-blur-md border-white/30 hover:bg-white/80"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset Form
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600/90 backdrop-blur-md text-white hover:bg-blue-700 shadow-md"
                            >
                                Add Family
                                <MoveRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
