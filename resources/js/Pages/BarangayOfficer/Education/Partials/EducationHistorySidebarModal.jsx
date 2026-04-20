import { Button } from "@/components/ui/button";
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import RadioGroup from "@/Components/RadioGroup";
import SelectField from "@/Components/SelectField";
import YearDropdown from "@/Components/YearDropdown";
import {
    MoveRight,
    GraduationCap,
    School,
    UserRound,
    RotateCcw,
    Plus,
    Trash2,
} from "lucide-react";

export default function EducationHistorySidebarModal({
    isModalOpen,
    handleModalClose,
    modalState,
    educationHistory,
    data,
    errors,
    residentsList,
    handleResidentChange,
    handleEditSubmit,
    handleAddSubmit,
    handleArrayValues,
    removeEducation,
    addEducation,
    reset,
    selectedResident,
}) {
    const isDisabledEducationFields = (edu_history) =>
        edu_history.education === "no_formal_education" ||
        edu_history.education === "no_education_yet";

    return (
        <SidebarModal
            isOpen={isModalOpen}
            onClose={() => {
                handleModalClose();
            }}
            title={
                modalState === "add"
                    ? educationHistory
                        ? "Edit Education History"
                        : "Add Education History"
                    : "View Resident Details"
            }
        >
            {modalState === "add" && (
                <div className="w-full space-y-6 bg-white p-1 text-sm text-slate-800">
                    <form
                        onSubmit={
                            educationHistory
                                ? handleEditSubmit
                                : handleAddSubmit
                        }
                        className="space-y-6"
                    >
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-violet-50 via-white to-white p-5 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
                                    <GraduationCap className="h-6 w-6 text-violet-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                        {educationHistory
                                            ? "Update Education History"
                                            : "Add Education History"}
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Manage the resident’s educational
                                        background and school information in one
                                        organized form.
                                    </p>

                                    <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                        {data.resident_name ||
                                            "No resident selected"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h4 className="text-base font-semibold text-slate-900">
                                    Resident Information
                                </h4>
                                <p className="mt-1 text-sm text-slate-500">
                                    Select a resident and review the basic
                                    details before managing educational history.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
                                <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                                    <div className="relative">
                                        <img
                                            src={
                                                data.resident_image
                                                    ? `/storage/${data.resident_image}`
                                                    : "/images/default-avatar.jpg"
                                            }
                                            alt="Resident Image"
                                            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                                        />
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-medium text-white shadow">
                                            Resident
                                        </div>
                                    </div>

                                    <h5 className="mt-4 text-sm font-semibold text-slate-900">
                                        {data.resident_name ||
                                            "No resident selected"}
                                    </h5>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {data.resident_id
                                            ? "Preview of the selected resident profile."
                                            : "Select a resident to display profile details."}
                                    </p>
                                </div>

                                <div className="space-y-5 lg:col-span-2">
                                    <div>
                                        <DropdownInputField
                                            label="Full Name"
                                            name="resident_name"
                                            value={data.resident_name || ""}
                                            placeholder="Select a resident"
                                            onChange={(e) =>
                                                handleResidentChange(e)
                                            }
                                            items={residentsList}
                                            readOnly={educationHistory}
                                        />
                                        <InputError
                                            message={errors.resident_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <InputField
                                                label="Birthdate"
                                                name="birthdate"
                                                value={data.birthdate || ""}
                                                readOnly={true}
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Resident's registered birthdate
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <InputField
                                                label="Purok Number"
                                                name="purok_number"
                                                value={data.purok_number || ""}
                                                readOnly={true}
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Assigned purok information
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h4 className="text-base font-semibold text-slate-900">
                                            Educational Background
                                        </h4>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Add one or more education records
                                            for the selected resident.
                                        </p>
                                    </div>

                                    {educationHistory === null && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addEducation}
                                            className="gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Educational History
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-5 p-6">
                                {Array.isArray(data.educational_histories) &&
                                    data.educational_histories.map(
                                        (edu_history, edIndex) => (
                                            <div
                                                key={edIndex}
                                                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                                            >
                                                <div className="border-b border-slate-200 bg-white px-5 py-4">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                                                                <School className="h-5 w-5 text-violet-600" />
                                                            </div>
                                                            <div>
                                                                <h5 className="text-sm font-semibold text-slate-900">
                                                                    Educational
                                                                    Record{" "}
                                                                    {edIndex +
                                                                        1}
                                                                </h5>
                                                                <p className="text-xs text-slate-500">
                                                                    Fill in the
                                                                    school and
                                                                    attainment
                                                                    details for
                                                                    this record.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {educationHistory ===
                                                            null && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    removeEducation(
                                                                        edIndex,
                                                                    )
                                                                }
                                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-6 p-5">
                                                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                            <DropdownInputField
                                                                label="Educational Attainment"
                                                                name="education"
                                                                value={
                                                                    edu_history.education ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        edIndex,
                                                                        "education",
                                                                        "educational_histories",
                                                                    )
                                                                }
                                                                items={[
                                                                    {
                                                                        label: "No Education Yet",
                                                                        value: "no_education_yet",
                                                                    },
                                                                    {
                                                                        label: "No Formal Education",
                                                                        value: "no_formal_education",
                                                                    },
                                                                    {
                                                                        label: "Prep School",
                                                                        value: "prep_school",
                                                                    },
                                                                    {
                                                                        label: "Kindergarten",
                                                                        value: "kindergarten",
                                                                    },
                                                                    {
                                                                        label: "Elementary",
                                                                        value: "elementary",
                                                                    },
                                                                    {
                                                                        label: "High School",
                                                                        value: "high_school",
                                                                    },
                                                                    {
                                                                        label: "Senior High School",
                                                                        value: "senior_high_school",
                                                                    },
                                                                    {
                                                                        label: "College",
                                                                        value: "college",
                                                                    },
                                                                    {
                                                                        label: "ALS (Alternative Learning System)",
                                                                        value: "als",
                                                                    },
                                                                    {
                                                                        label: "TESDA",
                                                                        value: "tesda",
                                                                    },
                                                                    {
                                                                        label: "Vocational",
                                                                        value: "vocational",
                                                                    },
                                                                    {
                                                                        label: "Post Graduate",
                                                                        value: "post_graduate",
                                                                    },
                                                                ]}
                                                                placeholder="Select your Educational Attainment"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `educational_histories.${edIndex}.education`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>

                                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                            <SelectField
                                                                label="Educational Status"
                                                                name="education_status"
                                                                items={[
                                                                    {
                                                                        label: "Currently Enrolled",
                                                                        value: "enrolled",
                                                                    },
                                                                    {
                                                                        label: "Graduated",
                                                                        value: "graduated",
                                                                    },
                                                                    {
                                                                        label: "Incomplete",
                                                                        value: "incomplete",
                                                                    },
                                                                    {
                                                                        label: "Dropped Out",
                                                                        value: "dropped_out",
                                                                    },
                                                                ]}
                                                                selectedValue={
                                                                    edu_history.education_status ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        edIndex,
                                                                        "education_status",
                                                                        "educational_histories",
                                                                    )
                                                                }
                                                                disabled={isDisabledEducationFields(
                                                                    edu_history,
                                                                )}
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `educational_histories.${edIndex}.education_status`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>

                                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                            <InputField
                                                                label="School Name"
                                                                name="school_name"
                                                                type="text"
                                                                value={
                                                                    edu_history.school_name ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        edIndex,
                                                                        "school_name",
                                                                        "educational_histories",
                                                                    )
                                                                }
                                                                placeholder="Enter school name"
                                                                disabled={isDisabledEducationFields(
                                                                    edu_history,
                                                                )}
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `educational_histories.${edIndex}.school_name`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>

                                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                            <RadioGroup
                                                                label="School Type"
                                                                name="school_type"
                                                                options={[
                                                                    {
                                                                        label: "Public",
                                                                        value: "public",
                                                                    },
                                                                    {
                                                                        label: "Private",
                                                                        value: "private",
                                                                    },
                                                                ]}
                                                                selectedValue={
                                                                    edu_history.school_type ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        edIndex,
                                                                        "school_type",
                                                                        "educational_histories",
                                                                    )
                                                                }
                                                                disabled={isDisabledEducationFields(
                                                                    edu_history,
                                                                )}
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `educational_histories.${edIndex}.school_type`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>

                                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                            <YearDropdown
                                                                label="Year Started"
                                                                name="year_started"
                                                                value={
                                                                    edu_history.year_started ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        edIndex,
                                                                        "year_started",
                                                                        "educational_histories",
                                                                    )
                                                                }
                                                                disabled={isDisabledEducationFields(
                                                                    edu_history,
                                                                )}
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `educational_histories.${edIndex}.year_started`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>

                                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                            <YearDropdown
                                                                label="Year Ended"
                                                                name="year_ended"
                                                                value={
                                                                    edu_history.year_ended ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        edIndex,
                                                                        "year_ended",
                                                                        "educational_histories",
                                                                    )
                                                                }
                                                                disabled={isDisabledEducationFields(
                                                                    edu_history,
                                                                )}
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `educational_histories.${edIndex}.year_ended`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                    </div>

                                                    {edu_history.education ===
                                                        "college" && (
                                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                            <InputField
                                                                label={
                                                                    edu_history.education_status ===
                                                                    "graduated"
                                                                        ? "Finished Course"
                                                                        : "Current Course"
                                                                }
                                                                name="program"
                                                                type="text"
                                                                value={
                                                                    edu_history.program ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        edIndex,
                                                                        "program",
                                                                        "educational_histories",
                                                                    )
                                                                }
                                                                placeholder="Enter your course"
                                                                disabled={
                                                                    edu_history.education ===
                                                                    "no_formal_education"
                                                                }
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `educational_histories.${edIndex}.program`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}

                                {(!data.educational_histories ||
                                    data.educational_histories.length ===
                                        0) && (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200">
                                            <UserRound className="h-6 w-6 text-slate-600" />
                                        </div>
                                        <h5 className="mt-4 text-sm font-semibold text-slate-900">
                                            No educational history added yet
                                        </h5>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Start by adding an education record
                                            for this resident.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs leading-5 text-slate-500">
                                    Review all educational records before
                                    submitting the form.
                                </p>

                                <div className="flex items-center justify-end gap-2">
                                    {educationHistory == null && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => reset()}
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Reset
                                        </Button>
                                    )}

                                    <Button
                                        type="submit"
                                        className="bg-violet-700 hover:bg-violet-800"
                                    >
                                        {educationHistory ? "Update" : "Add"}
                                        <MoveRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {modalState === "view" ? (
                selectedResident ? (
                    <PersonDetailContent person={selectedResident} />
                ) : null
            ) : null}
        </SidebarModal>
    );
}
