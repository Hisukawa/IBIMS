import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
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

const SubCard = ({ title, description, children }) => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
        </div>
        {children}
    </div>
);

const FieldHint = ({ children }) => (
    <p className="mt-1 text-xs leading-relaxed text-slate-500">{children}</p>
);

const Section4 = ({ data, setData, errors }) => {
    const addDisability = () => {
        setData("disabilities", [...(data.disabilities || []), {}]);
    };

    const removeDisability = (disAbIndex) => {
        const updated = [...(data.disabilities || [])];
        updated.splice(disAbIndex, 1);
        setData("disabilities", updated);
    };

    const updateDisability = (index, value) => {
        const updated = [...(data.disabilities || [])];
        updated[index] = {
            ...updated[index],
            disability_type: value,
        };
        setData("disabilities", updated);
    };

    return (
        <div className="space-y-6 mb-3">
            {/* Header */}
            <div className="rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-slate-50 px-6 py-5 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                    Medical Information
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                    Please record the resident&apos;s medical and health
                    information, including body measurements, emergency contact,
                    blood type, PhilHealth membership, lifestyle habits, and PWD
                    details.
                </p>
            </div>

            {/* Body Measurements */}
            <SectionCard
                title="Body Measurements"
                description="Record the resident’s physical measurements and calculated nutrition details."
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <InputField
                            label="Weight (KG)"
                            name="weight_kg"
                            value={data.weight_kg || ""}
                            onChange={(e) =>
                                setData("weight_kg", e.target.value)
                            }
                            placeholder="Enter weight in kg"
                            type="number"
                            step="0.01"
                        />
                        <InputError
                            message={errors.weight_kg}
                            className="mt-1"
                        />
                        <FieldHint>
                            Enter the resident’s weight in kilograms.
                        </FieldHint>
                    </div>

                    <div>
                        <InputField
                            label="Height (CM)"
                            name="height_cm"
                            value={data.height_cm || ""}
                            onChange={(e) =>
                                setData("height_cm", e.target.value)
                            }
                            placeholder="Enter height in cm"
                            type="number"
                            step="0.01"
                        />
                        <InputError
                            message={errors.height_cm}
                            className="mt-1"
                        />
                        <FieldHint>
                            Enter the resident’s height in centimeters.
                        </FieldHint>
                    </div>

                    <div>
                        <InputField
                            label="BMI"
                            name="bmi"
                            placeholder="Calculated automatically"
                            value={data.bmi || ""}
                            disabled
                        />
                        <InputError message={errors.bmi} className="mt-1" />
                        <FieldHint>
                            This field is computed automatically.
                        </FieldHint>
                    </div>

                    <div>
                        <InputField
                            label="Nutrition Status"
                            name="nutrition_status"
                            value={data.nutrition_status || ""}
                            placeholder="Calculated automatically"
                            disabled
                        />
                        <InputError
                            message={errors.nutrition_status}
                            className="mt-1"
                        />
                        <FieldHint>
                            This field is based on the BMI result.
                        </FieldHint>
                    </div>
                </div>
            </SectionCard>

            {/* Emergency and Health Profile */}
            <SectionCard
                title="Emergency & Health Profile"
                description="Enter emergency contact details, blood type, and PhilHealth information."
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <InputField
                            label="Emergency Contact Number"
                            name="emergency_contact_number"
                            value={data.emergency_contact_number || ""}
                            onChange={(e) =>
                                setData(
                                    "emergency_contact_number",
                                    e.target.value,
                                )
                            }
                            placeholder="09XXXXXXXXX"
                        />
                        <InputError
                            message={errors.emergency_contact_number}
                            className="mt-1"
                        />
                        <FieldHint>
                            Provide a reachable contact number for emergencies.
                        </FieldHint>
                    </div>

                    <div>
                        <InputField
                            label="Emergency Contact Name"
                            name="emergency_contact_name"
                            value={data.emergency_contact_name || ""}
                            onChange={(e) =>
                                setData(
                                    "emergency_contact_name",
                                    e.target.value,
                                )
                            }
                            placeholder="Enter contact name"
                        />
                        <InputError
                            message={errors.emergency_contact_name}
                            className="mt-1"
                        />
                        <FieldHint>
                            Enter the full name of the emergency contact person.
                        </FieldHint>
                    </div>

                    <div>
                        <DropdownInputField
                            label="Relationship"
                            name="emergency_contact_relationship"
                            value={data.emergency_contact_relationship || ""}
                            onChange={(e) =>
                                setData(
                                    "emergency_contact_relationship",
                                    e.target.value,
                                )
                            }
                            placeholder="Select relationship"
                            items={[
                                "Mother",
                                "Father",
                                "Sibling",
                                "Grandparent",
                                "Relative",
                                "Neighbor",
                                "Friend",
                                "Guardian",
                                "Other",
                            ]}
                        />
                        <InputError
                            message={errors.emergency_contact_relationship}
                            className="mt-1"
                        />
                        <FieldHint>
                            Specify the resident’s relationship to the contact.
                        </FieldHint>
                    </div>

                    <div>
                        <DropdownInputField
                            label="Blood Type"
                            name="blood_type"
                            value={data.blood_type || ""}
                            onChange={(e) =>
                                setData("blood_type", e.target.value)
                            }
                            placeholder="Select blood type"
                            items={[
                                { label: "A+", value: "A+" },
                                { label: "A-", value: "A-" },
                                { label: "B+", value: "B+" },
                                { label: "B-", value: "B-" },
                                { label: "AB+", value: "AB+" },
                                { label: "O+", value: "O+" },
                                { label: "O-", value: "O-" },
                            ]}
                        />
                        <InputError
                            message={errors.blood_type}
                            className="mt-1"
                        />
                        <FieldHint>Select the resident’s blood type.</FieldHint>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                        <RadioGroup
                            label="PhilHealth Member"
                            name="has_philhealth"
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            selectedValue={data.has_philhealth || ""}
                            onChange={(e) =>
                                setData("has_philhealth", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.has_philhealth}
                            className="mt-1"
                        />
                        <FieldHint>
                            Indicate whether the resident is a PhilHealth
                            member.
                        </FieldHint>
                    </div>

                    {data.has_philhealth == 1 && (
                        <div className="md:col-span-2">
                            <InputField
                                label="PhilHealth ID Number"
                                name="philhealth_id_number"
                                value={data.philhealth_id_number || ""}
                                onChange={(e) =>
                                    setData(
                                        "philhealth_id_number",
                                        e.target.value,
                                    )
                                }
                                placeholder="Enter PhilHealth ID number"
                            />
                            <InputError
                                message={errors.philhealth_id_number}
                                className="mt-1"
                            />
                            <FieldHint>
                                Enter the resident’s PhilHealth identification
                                number.
                            </FieldHint>
                        </div>
                    )}
                </div>
            </SectionCard>

            {/* Lifestyle and PWD */}
            <SectionCard
                title="Lifestyle & PWD Information"
                description="Record health-related lifestyle habits and any disability information."
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <RadioGroup
                            label="Consume Alcohol"
                            name="is_alcohol_user"
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            selectedValue={data.is_alcohol_user || ""}
                            onChange={(e) =>
                                setData("is_alcohol_user", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.is_alcohol_user}
                            className="mt-1"
                        />
                        <FieldHint>
                            Indicate whether the resident consumes alcohol.
                        </FieldHint>
                    </div>

                    <div>
                        <RadioGroup
                            label="Smoker"
                            name="is_smoker"
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            selectedValue={data.is_smoker || ""}
                            onChange={(e) =>
                                setData("is_smoker", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.is_smoker}
                            className="mt-1"
                        />
                        <FieldHint>
                            Indicate whether the resident is a smoker.
                        </FieldHint>
                    </div>

                    <div>
                        <RadioGroup
                            label="Person with Disability (PWD)"
                            name="is_pwd"
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            selectedValue={data.is_pwd || ""}
                            onChange={(e) => setData("is_pwd", e.target.value)}
                        />
                        <InputError message={errors.is_pwd} className="mt-1" />
                        <FieldHint>
                            Mark yes if the resident is registered or identified
                            as PWD.
                        </FieldHint>
                    </div>
                </div>

                {data.is_pwd == 1 && (
                    <div className="mt-6">
                        <SubCard
                            title="PWD Details"
                            description="Provide the resident’s PWD identification number and listed disability types."
                        >
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div>
                                    <InputField
                                        label="PWD ID Number"
                                        name="pwd_id_number"
                                        value={data.pwd_id_number || ""}
                                        onChange={(e) =>
                                            setData(
                                                "pwd_id_number",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="PWD-XXX-XXXXXXX"
                                    />
                                    <InputError
                                        message={errors.pwd_id_number}
                                        className="mt-1"
                                    />
                                    <FieldHint>
                                        Enter the official PWD ID number if
                                        available.
                                    </FieldHint>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Disability Type(s)
                                    </label>

                                    <div className="space-y-3">
                                        {(data.disabilities || []).map(
                                            (disability, disIndex) => (
                                                <div
                                                    key={disIndex}
                                                    className="flex items-start gap-2"
                                                >
                                                    <div className="flex-1">
                                                        <InputField
                                                            type="text"
                                                            name="disability_type"
                                                            value={
                                                                disability.disability_type ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                updateDisability(
                                                                    disIndex,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Enter disability type"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeDisability(
                                                                disIndex,
                                                            )
                                                        }
                                                        className="mt-1 rounded-full p-1 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                                                        title="Remove disability"
                                                    >
                                                        <IoIosCloseCircleOutline className="text-2xl" />
                                                    </button>
                                                </div>
                                            ),
                                        )}

                                        <button
                                            type="button"
                                            onClick={addDisability}
                                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                        >
                                            <IoIosAddCircleOutline className="text-2xl" />
                                            <span>Add Disability Type</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SubCard>
                    </div>
                )}
            </SectionCard>
        </div>
    );
};

export default Section4;
