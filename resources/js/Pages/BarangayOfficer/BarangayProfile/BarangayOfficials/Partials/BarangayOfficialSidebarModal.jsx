import SidebarModal from "@/components/SidebarModal";
import InputLabel from "@/components/InputLabel";
import InputError from "@/components/InputError";
import InputField from "@/components/InputField";
import DropdownInputField from "@/components/DropdownInputField";
import SelectField from "@/components/SelectField";
import YearDropdown from "@/components/YearDropdown";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
    BadgeCheck,
    CalendarDays,
    Info,
    Mail,
    Phone,
    RotateCcw,
    Save,
    Shield,
    Trash2,
    UserCog,
    UsersRound,
} from "lucide-react";
import {
    IoIosAddCircleOutline,
    IoIosArrowForward,
    IoIosCloseCircleOutline,
} from "react-icons/io";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import { Textarea } from "@/Components/ui/textarea";

export default function BarangayOfficialSidebarModal({
    isModalOpen,
    isAddModalOpen,
    handleModalClose,
    selectedResident,
    selectedOfficial,
    onAddSubmit,
    onEditSubmit,
    data,
    setData,
    errors,
    processing,
    residentsList,
    officialPositionsList,
    active_terms,
    purok_numbers,
    showNewTermToggle,
    setShowNewTermToggle,
    handleResidentChange,
    handleChange,
    handleArrayValues,
    addDesignation,
    removeDesignation,
}) {
    const title = selectedResident
        ? "Resident Details"
        : selectedOfficial
          ? "Edit Official"
          : "Add Official";

    return (
        <SidebarModal
            isOpen={isModalOpen}
            onClose={() => handleModalClose()}
            title={title}
        >
            {selectedResident && (
                <PersonDetailContent person={selectedResident} />
            )}

            {isAddModalOpen && (
                <div className="space-y-6 bg-white p-1 text-sm text-slate-800">
                    <form
                        onSubmit={selectedOfficial ? onEditSubmit : onAddSubmit}
                        className="space-y-6"
                    >
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                    <UsersRound className="h-6 w-6 text-blue-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                        {selectedOfficial
                                            ? "Update Barangay Official Information"
                                            : "Add Barangay Official Information"}
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Provide the complete details of elected
                                        and appointed barangay officials,
                                        including their position, term, contact
                                        details, and official designations.
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
                                        Official Records
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-blue-700">
                                        Select a resident, assign the official
                                        position, specify the term and
                                        appointment type, and complete any
                                        additional designation or appointment
                                        details as needed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                        <UserCog className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900">
                                            Resident and Position Information
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Select the resident and assign the
                                            proper official role.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-6">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                                    <InputLabel
                                        htmlFor="resident_image"
                                        value="Resident Photo"
                                    />

                                    <div className="mt-3 flex justify-center">
                                        <img
                                            src={
                                                data.resident_image instanceof
                                                File
                                                    ? URL.createObjectURL(
                                                          data.resident_image,
                                                      )
                                                    : data.resident_image
                                                      ? `/storage/${data.resident_image}`
                                                      : "/images/default-avatar.jpg"
                                            }
                                            alt="Resident"
                                            className="h-40 w-40 rounded-full border border-slate-200 object-cover shadow-sm"
                                        />
                                    </div>

                                    <p className="mt-3 text-center text-xs text-slate-500">
                                        Resident profile preview based on
                                        selected record.
                                    </p>

                                    <InputError
                                        message={errors.resident_image}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="space-y-5 md:col-span-4">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <DropdownInputField
                                            id="resident_name"
                                            name="resident_name"
                                            label="Full Name"
                                            placeholder="Select resident"
                                            value={data.resident_name || ""}
                                            onChange={(e) =>
                                                handleResidentChange(e)
                                            }
                                            items={residentsList}
                                        />
                                        <p className="mt-2 text-xs text-slate-500">
                                            Select the resident to be assigned
                                            as a barangay official.
                                        </p>
                                        <InputError
                                            message={errors.resident_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <SelectField
                                            id="position"
                                            name="position"
                                            label="Position"
                                            value={data.position}
                                            onChange={handleChange}
                                            items={officialPositionsList}
                                        >
                                            <option value="" disabled>
                                                Select barangay position
                                            </option>
                                        </SelectField>
                                        <p className="mt-2 text-xs text-slate-500">
                                            Assign the official role or position
                                            of the selected resident.
                                        </p>
                                        <InputError
                                            message={errors.position}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <InputField
                                                id="contact_number"
                                                name="contact_number"
                                                label="Phone Number"
                                                type="text"
                                                placeholder="09XXXXXXXXX"
                                                value={
                                                    data.contact_number || ""
                                                }
                                                onChange={handleChange}
                                                disabled
                                            />
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <Phone className="h-3.5 w-3.5" />
                                                Contact number based on resident
                                                information.
                                            </p>
                                            <InputError
                                                message={errors.contact_number}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <InputField
                                                id="email"
                                                name="email"
                                                label="Email"
                                                type="email"
                                                placeholder="test@gmail.com"
                                                value={data.email || ""}
                                                onChange={handleChange}
                                                disabled
                                            />
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <Mail className="h-3.5 w-3.5" />
                                                Email based on resident
                                                information.
                                            </p>
                                            <InputError
                                                message={errors.email}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                        <CalendarDays className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900">
                                            Term and Appointment Details
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Define the official term and
                                            appointment type.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <SelectField
                                        id="term"
                                        name="term"
                                        label="Official Term"
                                        placeholder="Select term of official"
                                        value={data.term || ""}
                                        onChange={handleChange}
                                        items={active_terms}
                                    />
                                    <InputError
                                        message={errors.term}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <SelectField
                                        id="appointment_type"
                                        name="appointment_type"
                                        label="Appointment Type"
                                        value={data.appointment_type || ""}
                                        onChange={handleChange}
                                        items={[
                                            {
                                                label: "Elected",
                                                value: "elected",
                                            },
                                            {
                                                label: "Appointed",
                                                value: "appointed",
                                            },
                                            {
                                                label: "Succession",
                                                value: "succession",
                                            },
                                        ]}
                                    />
                                    <InputError
                                        message={errors.appointment_type}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                Add New Term
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Enable this if the official term
                                                is not yet available in the
                                                existing list.
                                            </p>
                                        </div>

                                        <Switch
                                            checked={showNewTermToggle}
                                            onCheckedChange={
                                                setShowNewTermToggle
                                            }
                                        />
                                    </div>
                                </div>

                                {showNewTermToggle && (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div>
                                                <InputField
                                                    type="number"
                                                    label="Start Year"
                                                    name="new_term_start"
                                                    value={
                                                        data.new_term_start ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "new_term_start",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. 2024"
                                                />
                                                <InputError
                                                    message={
                                                        errors.new_term_start
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div>
                                                <InputField
                                                    type="number"
                                                    label="End Year"
                                                    name="new_term_end"
                                                    value={
                                                        data.new_term_end || ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "new_term_end",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. 2027"
                                                />
                                                <InputError
                                                    message={
                                                        errors.new_term_end
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        <p className="mt-3 text-xs text-slate-500">
                                            Enter the years for the new barangay
                                            term. This will become available
                                            after submission.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {["barangay_kagawad", "sk_kagawad"].includes(
                            data.position,
                        ) && (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                                <BadgeCheck className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">
                                                    Designations
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Assign designations and
                                                    their corresponding term
                                                    years.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => addDesignation()}
                                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                        >
                                            <IoIosAddCircleOutline className="text-xl" />
                                            Add Designation
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
                                    {(data.designations || []).map(
                                        (designation, desIdx) => (
                                            <div
                                                key={desIdx}
                                                className="relative rounded-xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeDesignation(
                                                            desIdx,
                                                        )
                                                    }
                                                    className="absolute right-3 top-3 inline-flex items-center rounded-md p-1 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                                                    title="Remove"
                                                >
                                                    <IoIosCloseCircleOutline className="text-2xl" />
                                                </button>

                                                <div className="space-y-4 pr-8">
                                                    <SelectField
                                                        id="designation"
                                                        name="designation"
                                                        label="Designation"
                                                        value={
                                                            designation.designation ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleArrayValues(
                                                                e,
                                                                desIdx,
                                                                "designation",
                                                                "designations",
                                                            )
                                                        }
                                                        items={purok_numbers.map(
                                                            (item, idx) => ({
                                                                ...item,
                                                                key: idx,
                                                            }),
                                                        )}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `designations.${desIdx}.designation`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />

                                                    <YearDropdown
                                                        id="term_start"
                                                        name="term_start"
                                                        label="Term Start"
                                                        value={
                                                            designation.term_start ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleArrayValues(
                                                                e,
                                                                desIdx,
                                                                "term_start",
                                                                "designations",
                                                            )
                                                        }
                                                        className="w-full"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `designations.${desIdx}.term_start`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />

                                                    <YearDropdown
                                                        id="term_end"
                                                        name="term_end"
                                                        label="Term End"
                                                        value={
                                                            designation.term_end ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleArrayValues(
                                                                e,
                                                                desIdx,
                                                                "term_end",
                                                                "designations",
                                                            )
                                                        }
                                                        className="w-full"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `designations.${desIdx}.term_end`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                        {data.appointment_type === "appointed" && (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">
                                                Appointment Information
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                Complete the details related to
                                                the appointment.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <DropdownInputField
                                            id="appointted_by"
                                            name="appointted_by"
                                            label="Appointed By"
                                            placeholder="Enter full name"
                                            value={data.appointted_by || ""}
                                            onChange={(e) => handleChange(e)}
                                            items={residentsList}
                                        />
                                        <InputError
                                            message={errors.appointted_by}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <InputField
                                            id="remarks"
                                            name="remarks"
                                            label="Remarks"
                                            value={data.remarks}
                                            onChange={handleChange}
                                        />
                                        <InputError
                                            message={errors.remarks}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                                        <Textarea
                                            id="appointment_reason"
                                            name="appointment_reason"
                                            label="Appointment Reason"
                                            value={data.appointment_reason}
                                            onChange={handleChange}
                                        />
                                        <InputError
                                            message={errors.appointment_reason}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                    type="submit"
                                    disabled={processing}
                                >
                                    <Save className="h-4 w-4" />
                                    {selectedOfficial
                                        ? processing
                                            ? "Updating..."
                                            : "Update"
                                        : processing
                                          ? "Saving..."
                                          : "Save"}
                                    <IoIosArrowForward />
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </SidebarModal>
    );
}
