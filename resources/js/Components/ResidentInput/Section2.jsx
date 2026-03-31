import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { Toaster, toast } from "sonner";

const SectionCard = ({ title, description, children }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
            {description && (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
        </div>
        {children}
    </div>
);

const SubCard = ({ title, subtitle, children, onRemove }) => (
    <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
                <h3 className="text-base font-semibold text-slate-800">
                    {title}
                </h3>
                {subtitle && (
                    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                )}
            </div>

            <button
                type="button"
                onClick={onRemove}
                className="shrink-0 rounded-full p-1 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                title="Remove Education Entry"
            >
                <IoIosCloseCircleOutline className="text-2xl" />
            </button>
        </div>

        {children}
    </div>
);

const FieldHint = ({ children }) => (
    <p className="mt-1 text-xs leading-relaxed text-slate-500">{children}</p>
);

const Section2 = ({ data, setData, errors, handleArrayValues }) => {
    const addEducation = () => {
        setData("educational_histories", [
            ...(data.educational_histories || []),
            {},
        ]);
    };

    const removeEducation = (occIndex) => {
        const updated = [...(data.educational_histories || [])];
        updated.splice(occIndex, 1);
        setData("educational_histories", updated);

        toast.warning("History removed.", {
            duration: 2000,
        });
    };

    return (
        <div className="space-y-6">
            <Toaster richColors />

            {/* Header */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50 px-6 py-5 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                    Education and Occupation
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                    Provide the resident&apos;s educational background and
                    current occupation. Add multiple entries if applicable.
                </p>
            </div>

            {/* Education Section */}
            <SectionCard
                title="Educational Background"
                description="Record the resident's educational attainment, school history, and academic details."
            >
                <div className="space-y-5">
                    {Array.isArray(data.educational_histories) &&
                    data.educational_histories.length > 0 ? (
                        data.educational_histories.map(
                            (edu_history, edIndex) => {
                                const noEducation =
                                    edu_history.education ===
                                        "no_formal_education" ||
                                    edu_history.education ===
                                        "no_education_yet";

                                const isCollege =
                                    edu_history.education === "college";

                                const isEnrolled =
                                    edu_history.education_status === "enrolled";

                                return (
                                    <SubCard
                                        key={edIndex}
                                        title={`Educational History #${edIndex + 1}`}
                                        subtitle="Fill in the education details for this entry."
                                        onRemove={() =>
                                            removeEducation(edIndex)
                                        }
                                    >
                                        {/* Main Education Fields */}
                                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                                            <div>
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
                                                    required
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
                                                    placeholder="Select educational attainment"
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `educational_histories.${edIndex}.education`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                                <FieldHint>
                                                    Select the resident&apos;s
                                                    highest or recorded
                                                    educational level for this
                                                    entry.
                                                </FieldHint>
                                            </div>

                                            <div>
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
                                                    value={
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
                                                    disabled={noEducation}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `educational_histories.${edIndex}.education_status`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                                <FieldHint>
                                                    Indicate whether the
                                                    resident is still studying
                                                    or already completed this
                                                    level.
                                                </FieldHint>
                                            </div>

                                            <div>
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
                                                    disabled={noEducation}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `educational_histories.${edIndex}.school_name`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                                <FieldHint>
                                                    Enter the school or
                                                    institution name.
                                                </FieldHint>
                                            </div>
                                        </div>

                                        {/* Secondary Fields */}
                                        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                                            <div>
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
                                                    disabled={noEducation}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `educational_histories.${edIndex}.school_type`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                                <FieldHint>
                                                    Choose whether the school is
                                                    public or private.
                                                </FieldHint>
                                            </div>

                                            <div>
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
                                                    disabled={noEducation}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `educational_histories.${edIndex}.year_started`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                                <FieldHint>
                                                    Select the year the resident
                                                    started.
                                                </FieldHint>
                                            </div>

                                            <div>
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
                                                    disabled={
                                                        noEducation ||
                                                        isEnrolled
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `educational_histories.${edIndex}.year_ended`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                                <FieldHint>
                                                    Leave ongoing studies under
                                                    enrolled.
                                                </FieldHint>
                                            </div>
                                        </div>

                                        {/* College Program */}
                                        {isCollege && (
                                            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
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
                                                            placeholder="Enter course or program"
                                                            disabled={
                                                                noEducation
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `educational_histories.${edIndex}.program`
                                                                ]
                                                            }
                                                            className="mt-1"
                                                        />
                                                        <FieldHint>
                                                            Provide the
                                                            resident&apos;s
                                                            degree, course, or
                                                            academic program.
                                                        </FieldHint>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </SubCard>
                                );
                            },
                        )
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                            <p className="text-sm text-slate-500">
                                No educational history added yet.
                            </p>
                        </div>
                    )}

                    {/* Add Button */}
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={addEducation}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                        >
                            <IoIosAddCircleOutline className="text-2xl" />
                            <span>Add Educational History</span>
                        </button>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
};

export default Section2;
