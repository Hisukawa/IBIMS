import SidebarModal from "@/Components/SidebarModal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import DropdownInputField from "@/Components/DropdownInputField";
import { Button } from "@/Components/ui/button";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { RotateCcw, MoveRight } from "lucide-react";

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
];

const householdPositionOptions = [
    { label: "Primary/Nuclear", value: "primary" },
    { label: "Extended", value: "extended" },
    { label: "Boarder", value: "boarder" },
];

export default function FamilyFormModal({
    isOpen,
    onClose,
    familyDetails,
    data,
    setData,
    errors,
    memberList,
    handleResidentChange,
    handleDynamicResidentChange,
    handleMemberFieldChange,
    handleSubmitFamily,
    handleUpdateFamily,
    addMember,
    removeMember,
    reset,
}) {
    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={familyDetails ? "Edit a Family" : "Create a Family"}
        >
            <p className="text-sm text-black bg-white/10 backdrop-blur-sm border border-white/40 rounded-lg p-4 mb-6 shadow-lg">
                <strong>Reminder:</strong> To add a family, the household head
                and all family members must already be registered as residents.
                If they are not yet registered, please create a household first
                before proceeding.
            </p>

            <form
                className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200 rounded-2xl shadow-xl p-8 text-gray-800"
                onSubmit={
                    familyDetails ? handleUpdateFamily : handleSubmitFamily
                }
            >
                <div className="mb-8 text-left">
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">
                        {familyDetails
                            ? "Update Family Profile"
                            : "Register a New Family"}
                    </h2>
                    <p className="text-gray-600 text-sm max-w-2xl">
                        Provide accurate household details for the barangay
                        records. Start by selecting the household head, then add
                        all family members with their corresponding
                        relationships and roles.
                    </p>
                </div>

                {/* Family Head Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        Family Head Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-3">
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
                                className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-sm"
                            />
                        </div>

                        <div className="md:col-span-4 space-y-4">
                            <DropdownInputField
                                label="Full Name"
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

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <InputField
                                    label="Family Name (Optional)"
                                    name="family_name"
                                    value={data.family_name || ""}
                                    onChange={(e) =>
                                        setData("family_name", e.target.value)
                                    }
                                    placeholder="Enter family name (optional)"
                                />
                                <DropdownInputField
                                    label="Family Type"
                                    value={data.family_type || ""}
                                    items={familyTypeOptions}
                                    onChange={(e) =>
                                        setData("family_type", e.target.value)
                                    }
                                    placeholder="e.g., Nuclear, Extended"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Family Members Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        Family Members
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                        Add all household members below. Make sure their
                        information is accurate and relationships to the
                        household head are correctly specified.
                    </p>

                    <div className="space-y-4">
                        {(data.members || []).map((member, memberIndex) => (
                            <div
                                key={memberIndex}
                                className="relative bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                    <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-3">
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
                                            className="w-24 h-24 object-cover rounded-full border border-gray-300"
                                        />
                                    </div>

                                    <div className="md:col-span-4 space-y-3">
                                        <DropdownInputField
                                            label="Full Name"
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <DropdownInputField
                                        label="Relationship to Head"
                                        name="relationship_to_head"
                                        onChange={(e) =>
                                            handleMemberFieldChange(
                                                e,
                                                memberIndex,
                                            )
                                        }
                                        value={member.relationship_to_head}
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
                                        value={member.household_position}
                                        items={householdPositionOptions}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeMember(memberIndex)}
                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-2xl transition-colors"
                                    title="Remove Member"
                                >
                                    <IoIosCloseCircleOutline />
                                </button>
                            </div>
                        ))}

                        <div className="flex justify-between items-center mt-6">
                            <button
                                type="button"
                                onClick={addMember}
                                className="flex items-center text-blue-700 hover:text-blue-900 text-sm font-medium transition"
                            >
                                <IoIosAddCircleOutline className="text-3xl mr-1" />
                                Add Member
                            </button>

                            <div className="flex items-center gap-3">
                                {!familyDetails && (
                                    <Button type="button" onClick={reset}>
                                        <RotateCcw className="mr-1 h-4 w-4" />
                                        Reset
                                    </Button>
                                )}

                                <Button
                                    className="bg-blue-700 hover:bg-blue-500 text-white"
                                    type="submit"
                                >
                                    {familyDetails ? "Update" : "Add"}
                                    <MoveRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </SidebarModal>
    );
}
