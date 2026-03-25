import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import SidebarModal from "@/components/SidebarModal";
import InputLabel from "@/components/InputLabel";
import InputError from "@/components/InputError";
import InputField from "@/components/InputField";
import DropdownInputField from "@/components/DropdownInputField";

import {
    Info,
    RotateCcw,
    Save,
    Trash2,
    UserRound,
    UsersRound,
} from "lucide-react";
import { IoIosAddCircleOutline, IoIosArrowForward } from "react-icons/io";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";

export default function InstitutionMemberSidebarModal({
    isOpen,
    onClose,
    modalState,
    memberDetails,
    selectedResident,
    data,
    errors,
    residentsList,
    hasHead,
    handleAddSubmit,
    handleEditSubmit,
    handleResidentChange,
    handleArrayValues,
    removeMember,
    addMember,
    reset,
}) {
    const isEdit = memberDetails !== null || modalState === "edit";

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                isEdit ? "Edit Institution Member" : "Add Institution Member"
            }
        >
            {modalState === "view" ? (
                selectedResident ? (
                    <PersonDetailContent person={selectedResident} />
                ) : null
            ) : (
                <div className="space-y-6 bg-white p-1 text-sm text-slate-800">
                    <form
                        onSubmit={
                            memberDetails ? handleEditSubmit : handleAddSubmit
                        }
                        className="space-y-6"
                    >
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                    <UsersRound className="h-6 w-6 text-blue-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                        {isEdit
                                            ? "Update Institution Member Information"
                                            : "Add Institution Member Information"}
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Provide the resident membership details,
                                        role, status, and head designation for
                                        accurate institution record-keeping.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-full bg-blue-100 p-2">
                                    <Info className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-blue-900">
                                        Institution Member Records
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-blue-700">
                                        Add one or more institution members and
                                        provide their resident details,
                                        membership date, status, and whether
                                        they serve as the institution head.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {Array.isArray(data.members) &&
                                data.members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                                    <UserRound className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900">
                                                        Member #{index + 1}
                                                    </h4>
                                                    <p className="text-xs text-slate-500">
                                                        Enter the resident and
                                                        membership details.
                                                    </p>
                                                </div>
                                            </div>

                                            {!isEdit &&
                                                data.members.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeMember(index)
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Remove
                                                    </button>
                                                )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-6">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                                                <InputLabel
                                                    htmlFor={`resident_image_${index}`}
                                                    value="Profile Photo"
                                                />
                                                <div className="mt-3 flex justify-center">
                                                    <img
                                                        src={
                                                            member.resident_image
                                                                ? `/storage/${member.resident_image}`
                                                                : "/images/default-avatar.jpg"
                                                        }
                                                        alt="Resident"
                                                        className="h-32 w-32 rounded-full border border-slate-200 object-cover shadow-sm"
                                                    />
                                                </div>
                                                <p className="mt-3 text-center text-xs text-slate-500">
                                                    Resident profile image
                                                    preview.
                                                </p>
                                            </div>

                                            <div className="space-y-5 md:col-span-4">
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <DropdownInputField
                                                        label="Resident Name"
                                                        name={`members.${index}.resident_name`}
                                                        value={
                                                            member.resident_name ||
                                                            ""
                                                        }
                                                        placeholder="Select a resident"
                                                        onChange={(e) =>
                                                            handleResidentChange(
                                                                e,
                                                                index,
                                                            )
                                                        }
                                                        items={residentsList}
                                                    />
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        Select the resident who
                                                        will be registered as a
                                                        member of the
                                                        institution.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `members.${index}.resident_id`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                        <InputField
                                                            label="Birthdate"
                                                            name={`members.${index}.birthdate`}
                                                            value={
                                                                member.birthdate ||
                                                                ""
                                                            }
                                                            readOnly
                                                        />
                                                        <p className="mt-2 text-xs text-slate-500">
                                                            Resident birthdate
                                                            based on the
                                                            selected record.
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                        <InputField
                                                            label="Purok Number"
                                                            name={`members.${index}.purok_number`}
                                                            value={
                                                                member.purok_number ||
                                                                ""
                                                            }
                                                            readOnly
                                                        />
                                                        <p className="mt-2 text-xs text-slate-500">
                                                            Assigned purok
                                                            number of the
                                                            selected resident.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                        <InputField
                                                            type="date"
                                                            label="Member Since"
                                                            name={`members.${index}.member_since`}
                                                            value={
                                                                member.member_since ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleArrayValues(
                                                                    e,
                                                                    index,
                                                                    "member_since",
                                                                )
                                                            }
                                                        />
                                                        <p className="mt-2 text-xs text-slate-500">
                                                            Date when the
                                                            resident officially
                                                            became a member.
                                                        </p>
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `members.${index}.member_since`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                        <InputLabel value="Status" />
                                                        <select
                                                            name={`members.${index}.status`}
                                                            value={
                                                                member.status ||
                                                                "active"
                                                            }
                                                            onChange={(e) =>
                                                                handleArrayValues(
                                                                    e,
                                                                    index,
                                                                    "status",
                                                                )
                                                            }
                                                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        >
                                                            <option value="active">
                                                                Active
                                                            </option>
                                                            <option value="inactive">
                                                                Inactive
                                                            </option>
                                                        </select>
                                                        <p className="mt-2 text-xs text-slate-500">
                                                            Current
                                                            participation status
                                                            of the member.
                                                        </p>
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `members.${index}.status`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </div>

                                                {(!hasHead ||
                                                    member.is_head) && (
                                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-900">
                                                                    Head of
                                                                    Institution
                                                                </p>
                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    Enable this
                                                                    if the
                                                                    selected
                                                                    member is
                                                                    the official
                                                                    head of the
                                                                    institution.
                                                                </p>
                                                            </div>

                                                            <Switch
                                                                id={`is_head_${index}`}
                                                                checked={
                                                                    !!member.is_head
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    handleArrayValues(
                                                                        {
                                                                            target: {
                                                                                value: checked,
                                                                            },
                                                                        },
                                                                        index,
                                                                        "is_head",
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    {!isEdit && (
                                        <button
                                            type="button"
                                            onClick={addMember}
                                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                        >
                                            <IoIosAddCircleOutline className="text-xl" />
                                            Add Member
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    {!isEdit && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => reset()}
                                            className="inline-flex items-center gap-2"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            Reset
                                        </Button>
                                    )}

                                    <Button
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                        type="submit"
                                    >
                                        <Save className="h-4 w-4" />
                                        {memberDetails ? "Update" : "Save"}
                                        <IoIosArrowForward />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </SidebarModal>
    );
}
