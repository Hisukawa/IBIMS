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
    errors,
    memberList,
    handleResidentChange,
    handleDynamicResidentChange,
    handleMemberFieldChange,
    handleSubmitFamily,
    addMember,
    removeMember,
    handleResetFamilyForm,
    processing = false,
}) {
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
                        <h2 className="text-lg font-semibold text-slate-900">
                            Linked Household
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                                Head Selected
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {data.resident_name || "—"}
                            </p>
                        </div>
                    </div>
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
