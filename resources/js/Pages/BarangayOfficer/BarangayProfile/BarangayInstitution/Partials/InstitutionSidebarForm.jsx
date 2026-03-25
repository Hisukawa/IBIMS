import { Button } from "@/components/ui/button";
import SidebarModal from "@/Components/SidebarModal";
import InputField from "@/Components/InputField";
import InputError from "@/Components/InputError";
import DropdownInputField from "@/Components/DropdownInputField";
import SelectField from "@/Components/SelectField";
import YearDropdown from "@/Components/YearDropdown";
import {
    Building2,
    Info,
    RotateCcw,
    Save,
    Trash2,
    UsersRound,
} from "lucide-react";
import { IoIosAddCircleOutline, IoIosArrowForward } from "react-icons/io";
import { Textarea } from "@/Components/ui/textarea";

export default function InstitutionSidebarForm({
    isOpen,
    onClose,
    modalState,
    institutionDetails,
    data,
    errors,
    handleSubmitInstitution,
    handleUpdateInstitution,
    handleInstitutionFieldChange,
    removeInstitution,
    addInstitution,
    reset,
}) {
    const isEdit = institutionDetails !== null || modalState === "edit";

    const institutionTypes = [
        { label: "Youth Organization", value: "youth_org" },
        { label: "Cooperative", value: "coop" },
        { label: "Religious Group", value: "religious" },
        { label: "Farmers Association", value: "farmers" },
        { label: "Transport Group", value: "transport" },
    ];

    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Dissolved", value: "dissolved" },
    ];

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Institution" : "Add Institution"}
        >
            <div className="space-y-6 bg-white p-1 text-sm text-slate-800">
                <form
                    onSubmit={
                        institutionDetails
                            ? handleUpdateInstitution
                            : handleSubmitInstitution
                    }
                    className="space-y-6"
                >
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-green-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                                <UsersRound className="h-6 w-6 text-green-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    {isEdit
                                        ? "Update Institution Information"
                                        : "Add Institution Information"}
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Provide details about institutions,
                                    organizations, and community groups within
                                    the barangay for easier monitoring and
                                    record-keeping.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-full bg-green-100 p-2">
                                <Info className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-green-900">
                                    Institution Records
                                </p>
                                <p className="mt-1 text-xs leading-5 text-green-700">
                                    Add one or more institution records and
                                    provide their name, type, description,
                                    establishment year, and current status.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {Array.isArray(data.institutions) &&
                            data.institutions.map((institution, instIdx) => (
                                <div
                                    key={instIdx}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100">
                                                <Building2 className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">
                                                    Institution #{instIdx + 1}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Enter the institution's
                                                    profile and operational
                                                    details.
                                                </p>
                                            </div>
                                        </div>

                                        {!isEdit && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeInstitution(instIdx)
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-6">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                                            <InputField
                                                label="Institution Name"
                                                name="name"
                                                value={institution.name || ""}
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
                                                        "name",
                                                    )
                                                }
                                                placeholder="e.g. Fisherfolk Association"
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Official name of the
                                                institution, group, or
                                                organization.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.name`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                                            <DropdownInputField
                                                label="Institution Type"
                                                name="type"
                                                value={institution.type || ""}
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
                                                        "type",
                                                    )
                                                }
                                                placeholder="Select or enter type"
                                                items={institutionTypes}
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Classify the institution by its
                                                primary nature or function.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.type`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-6">
                                            <Textarea
                                                label="Description"
                                                name="description"
                                                value={
                                                    institution.description ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
                                                        "description",
                                                    )
                                                }
                                                className="text-gray-600"
                                                placeholder="Brief description of the institution..."
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Add a short description of the
                                                institution's role, purpose, or
                                                activities.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.description`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                                            <YearDropdown
                                                label="Year Established"
                                                name="year_established"
                                                value={
                                                    institution.year_established ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
                                                        "year_established",
                                                    )
                                                }
                                                placeholder="YYYY"
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Year when the institution was
                                                established.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.year_established`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                                            <SelectField
                                                label="Status"
                                                name="status"
                                                value={institution.status || ""}
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
                                                        "status",
                                                    )
                                                }
                                                items={statusOptions}
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Current operational status of
                                                the institution.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.status`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
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
                                        onClick={addInstitution}
                                        className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                                    >
                                        <IoIosAddCircleOutline className="text-xl" />
                                        Add Institution
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
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                    type="submit"
                                >
                                    <Save className="h-4 w-4" />
                                    {institutionDetails ? "Update" : "Save"}
                                    <IoIosArrowForward />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </SidebarModal>
    );
}
