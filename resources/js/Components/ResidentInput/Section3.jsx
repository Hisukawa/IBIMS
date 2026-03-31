import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import SelectField from "../SelectField";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

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
                title="Remove Occupation Entry"
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

const Section3 = ({ data, setData, errors, occupationTypes = null }) => {
    const addOccupation = () => {
        setData("occupations", [...(data.occupations || []), {}]);
    };

    const removeOccupation = (occIndex) => {
        const updated = [...(data.occupations || [])];
        updated.splice(occIndex, 1);
        setData("occupations", updated);
    };

    const handleOccupationFieldChange = (e, occIndex, fieldName) => {
        const updated = [...(data.occupations || [])];

        updated[occIndex] = {
            ...updated[occIndex],
            [fieldName]: e.target.value,
        };

        setData("occupations", updated);
    };

    return (
        <div className="space-y-6 mb-3">
            {/* Header */}
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-slate-50 px-6 py-5 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                    Occupation & Livelihood Details
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                    Please select the resident&apos;s current employment or
                    occupation status. This helps track employment trends and
                    identify beneficiaries for livelihood programs.
                </p>
            </div>

            {/* Employment Status */}
            <SectionCard
                title="Employment Overview"
                description="Set the resident's current overall employment status before adding occupation or livelihood records."
            >
                <div className="max-w-md">
                    <SelectField
                        label="Current Employment Status"
                        name="employment_status"
                        value={data.employment_status || ""}
                        onChange={(e) =>
                            setData("employment_status", e.target.value)
                        }
                        items={[
                            { label: "Employed", value: "employed" },
                            { label: "Unemployed", value: "unemployed" },
                            { label: "Underemployed", value: "under_employed" },
                            { label: "Self-Employed", value: "self_employed" },
                            { label: "Student", value: "student" },
                            { label: "Retired", value: "retired" },
                            { label: "Homemaker", value: "homemaker" },
                            {
                                label: "Not Applicable",
                                value: "not_applicable",
                            },
                        ]}
                        required
                    />
                    <InputError
                        message={errors.employment_status}
                        className="mt-2"
                    />
                    <FieldHint>
                        Select the option that best describes the
                        resident&apos;s current employment or occupation.
                    </FieldHint>
                </div>
            </SectionCard>

            {/* Occupation Entries */}
            <SectionCard
                title="Occupation / Livelihood Records"
                description="Add one or more occupation or livelihood entries for the resident."
            >
                <div className="space-y-5">
                    {Array.isArray(data.occupations) &&
                    data.occupations.length > 0 ? (
                        data.occupations.map((occupation, occIndex) => {
                            const isUnemployed =
                                occupation.employment_status === "unemployed";
                            const isNotApplicable =
                                occupation.employment_status ===
                                "not_applicable";
                            const isActive =
                                occupation.occupation_status === "active";

                            return (
                                <SubCard
                                    key={occIndex}
                                    title={`Occupation Record #${occIndex + 1}`}
                                    subtitle="Provide the resident's job or livelihood details for this entry."
                                    onRemove={() => removeOccupation(occIndex)}
                                >
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                                        <div>
                                            <DropdownInputField
                                                label="Occupation / Livelihood"
                                                name="occupation"
                                                value={
                                                    occupation.occupation || ""
                                                }
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "occupation",
                                                    )
                                                }
                                                placeholder="Enter occupation or livelihood"
                                                items={occupationTypes}
                                                disabled={isUnemployed}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.occupation`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Select or enter the
                                                resident&apos;s occupation or
                                                source of livelihood.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <SelectField
                                                label="Employment Type"
                                                name="employment_type"
                                                value={
                                                    occupation.employment_type ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "employment_type",
                                                    )
                                                }
                                                items={[
                                                    {
                                                        label: "Full-time",
                                                        value: "full_time",
                                                    },
                                                    {
                                                        label: "Part-time",
                                                        value: "part_time",
                                                    },
                                                    {
                                                        label: "Seasonal",
                                                        value: "seasonal",
                                                    },
                                                    {
                                                        label: "Contractual",
                                                        value: "contractual",
                                                    },
                                                    {
                                                        label: "Self-employed",
                                                        value: "self_employed",
                                                    },
                                                ]}
                                                disabled={
                                                    isUnemployed ||
                                                    isNotApplicable
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.employment_type`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Select the arrangement or
                                                category of employment.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <SelectField
                                                label="Occupation Status"
                                                name="occupation_status"
                                                value={
                                                    occupation.occupation_status ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "occupation_status",
                                                    )
                                                }
                                                items={[
                                                    {
                                                        label: "Active",
                                                        value: "active",
                                                    },
                                                    {
                                                        label: "Inactive",
                                                        value: "inactive",
                                                    },
                                                    {
                                                        label: "Ended",
                                                        value: "ended",
                                                    },
                                                    {
                                                        label: "Retired",
                                                        value: "retired",
                                                    },
                                                    {
                                                        label: "Terminated",
                                                        value: "terminated",
                                                    },
                                                    {
                                                        label: "Resigned",
                                                        value: "resigned",
                                                    },
                                                ]}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.occupation_status`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Current status of this
                                                occupation or livelihood entry.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <SelectField
                                                label="Work Arrangement"
                                                name="work_arrangement"
                                                value={
                                                    occupation.work_arrangement ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "work_arrangement",
                                                    )
                                                }
                                                items={[
                                                    {
                                                        label: "Remote",
                                                        value: "remote",
                                                    },
                                                    {
                                                        label: "On-site",
                                                        value: "on_site",
                                                    },
                                                    {
                                                        label: "Hybrid",
                                                        value: "hybrid",
                                                    },
                                                ]}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.work_arrangement`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Indicate where or how the work
                                                is performed.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <InputField
                                                label="Employer / Business Name"
                                                name="employer"
                                                type="text"
                                                value={
                                                    occupation.employer || ""
                                                }
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "employer",
                                                    )
                                                }
                                                placeholder="Enter employer or business name"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.employer`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Provide the company, employer,
                                                or business name.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <YearDropdown
                                                label="Year Started"
                                                name="started_at"
                                                value={
                                                    occupation.started_at || ""
                                                }
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "started_at",
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.started_at`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Year this work or livelihood
                                                began.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <YearDropdown
                                                label="Year Ended"
                                                name="ended_at"
                                                value={
                                                    occupation.ended_at || ""
                                                }
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "ended_at",
                                                    )
                                                }
                                                disabled={isActive}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.ended_at`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Only applicable if the
                                                occupation is no longer active.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <InputField
                                                type="number"
                                                label="Income"
                                                name="income"
                                                value={occupation.income || ""}
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "income",
                                                    )
                                                }
                                                placeholder="Enter income"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.income`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Enter the reported income
                                                amount.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <SelectField
                                                label="Income Frequency"
                                                name="income_frequency"
                                                value={
                                                    occupation.income_frequency ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "income_frequency",
                                                    )
                                                }
                                                items={[
                                                    {
                                                        label: "Daily",
                                                        value: "daily",
                                                    },
                                                    {
                                                        label: "Weekly",
                                                        value: "weekly",
                                                    },
                                                    {
                                                        label: "Bi-weekly",
                                                        value: "bi_weekly",
                                                    },
                                                    {
                                                        label: "Monthly",
                                                        value: "monthly",
                                                    },
                                                    {
                                                        label: "Annually",
                                                        value: "annually",
                                                    },
                                                ]}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.income_frequency`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Choose how often the income is
                                                received.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <RadioGroup
                                                label="Overseas Filipino Worker"
                                                name="is_ofw"
                                                selectedValue={
                                                    occupation?.is_ofw?.toString() ||
                                                    ""
                                                }
                                                options={[
                                                    { label: "Yes", value: 1 },
                                                    { label: "No", value: 0 },
                                                ]}
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "is_ofw",
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.is_ofw`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Indicate whether the resident is
                                                an OFW for this occupation.
                                            </FieldHint>
                                        </div>

                                        <div>
                                            <RadioGroup
                                                label="Is Main Livelihood"
                                                name="is_main_livelihood"
                                                selectedValue={
                                                    occupation?.is_main_livelihood?.toString() ||
                                                    ""
                                                }
                                                options={[
                                                    { label: "Yes", value: 1 },
                                                    { label: "No", value: 0 },
                                                ]}
                                                onChange={(e) =>
                                                    handleOccupationFieldChange(
                                                        e,
                                                        occIndex,
                                                        "is_main_livelihood",
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `occupations.${occIndex}.is_main_livelihood`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                            <FieldHint>
                                                Mark this if it is the
                                                resident&apos;s primary source
                                                of livelihood.
                                            </FieldHint>
                                        </div>
                                    </div>
                                </SubCard>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                            <p className="text-sm text-slate-500">
                                No occupation records added yet.
                            </p>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={addOccupation}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                        >
                            <IoIosAddCircleOutline className="text-2xl" />
                            <span>Add Occupation</span>
                        </button>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
};

export default Section3;
