import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { toTitleCase } from "@/utils/stringFormat";

const SectionCard = ({ title, description, children }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
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

const Section1 = ({
    data,
    setData,
    handleArrayValues,
    errors,
    showMaidenMiddleName,
    barangays = [],
    puroks = [],
    existingImagePath = null,
}) => {
    const addVehicle = () => {
        setData("vehicles", [...(data.vehicles || []), {}]);
    };

    const removeVehicle = (vehicleIndex) => {
        const updated = [...(data.vehicles || [])];
        updated.splice(vehicleIndex, 1);
        setData("vehicles", updated);
    };

    const purok_numbers = puroks.map((purok) => ({
        label: "Purok " + purok,
        value: purok.toString(),
    }));

    const barangayList = Object.entries(barangays).map(([id, name]) => ({
        label: name,
        value: id,
    }));

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50 px-6 py-5 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Resident Information
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                    Please provide the personal details of the resident. Fields
                    marked with{" "}
                    <span className="font-semibold text-red-600">*</span> are
                    required.
                </p>
            </div>

            {/* Personal Information */}
            <SectionCard
                title="Personal Information"
                description="Enter the resident's basic identity details and upload a profile photo."
            >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
                    {/* Profile Photo */}
                    <div className="lg:col-span-2">
                        <div className="flex h-full flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                            <InputLabel
                                htmlFor="resident_image"
                                value="Profile Photo"
                            />

                            <img
                                src={
                                    data.resident_image instanceof File
                                        ? URL.createObjectURL(
                                              data.resident_image,
                                          )
                                        : existingImagePath ||
                                          "/images/default-avatar.jpg"
                                }
                                alt="Resident Image"
                                className="mt-4 h-32 w-32 rounded-full border-4 border-white object-cover shadow-md"
                            />

                            <input
                                id="resident_image"
                                type="file"
                                name="resident_image"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) setData("resident_image", file);
                                }}
                                className="mt-4 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                            />
                            <InputError
                                message={errors.resident_image}
                                className="mt-2"
                            />
                            <FieldHint>
                                Upload a clear profile photo in JPEG or PNG
                                format. Maximum size: 5MB.
                            </FieldHint>
                        </div>
                    </div>

                    {/* Main Fields */}
                    <div className="lg:col-span-4 space-y-5">
                        <div
                            className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${
                                showMaidenMiddleName
                                    ? "xl:grid-cols-4"
                                    : "xl:grid-cols-3"
                            }`}
                        >
                            <div>
                                <InputField
                                    label="Last Name"
                                    name="lastname"
                                    value={data.lastname || ""}
                                    placeholder="Enter last name"
                                    onChange={(e) =>
                                        setData(
                                            "lastname",
                                            toTitleCase(e.target.value),
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.lastname}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <InputField
                                    label="First Name"
                                    name="firstname"
                                    value={data.firstname || ""}
                                    placeholder="Enter first name"
                                    onChange={(e) =>
                                        setData(
                                            "firstname",
                                            toTitleCase(e.target.value),
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.firstname}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <InputField
                                    label="Middle Name"
                                    name="middlename"
                                    value={data.middlename || ""}
                                    placeholder="Enter middle name"
                                    onChange={(e) =>
                                        setData(
                                            "middlename",
                                            toTitleCase(e.target.value),
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.middlename}
                                    className="mt-1"
                                />
                            </div>

                            {showMaidenMiddleName && (
                                <div>
                                    <InputField
                                        label="Maiden Middle Name"
                                        name="maiden_middle_name"
                                        value={data.maiden_middle_name || ""}
                                        placeholder="Enter maiden middle name"
                                        onChange={(e) =>
                                            setData(
                                                "maiden_middle_name",
                                                toTitleCase(e.target.value),
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.maiden_middle_name}
                                        className="mt-1"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div>
                                <DropdownInputField
                                    label="Suffix"
                                    name="suffix"
                                    value={data.suffix}
                                    items={["Jr.", "Sr.", "III", "IV"]}
                                    placeholder="Select suffix"
                                    onChange={(e) =>
                                        setData("suffix", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.suffix}
                                    className="mt-1"
                                />
                                <FieldHint>Optional field.</FieldHint>
                            </div>

                            <div>
                                <DropdownInputField
                                    label="Civil Status"
                                    name="civil_status"
                                    value={data.civil_status || ""}
                                    items={[
                                        "Single",
                                        "Married",
                                        "Widowed",
                                        "Divorced",
                                        "Separated",
                                        "Annulled",
                                    ]}
                                    placeholder="Select civil status"
                                    onChange={(e) =>
                                        setData(
                                            "civil_status",
                                            e.target.value.toLowerCase(),
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.civil_status}
                                    className="mt-1"
                                />
                                <FieldHint>
                                    Select the resident's current civil status.
                                </FieldHint>
                            </div>

                            <div>
                                <RadioGroup
                                    label="Sex"
                                    name="sex"
                                    options={[
                                        { label: "Male", value: "male" },
                                        { label: "Female", value: "female" },
                                    ]}
                                    selectedValue={data.sex || ""}
                                    onChange={(e) =>
                                        setData("sex", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.sex}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <DropdownInputField
                                    label="Gender"
                                    name="gender"
                                    items={[
                                        { label: "Male", value: "male" },
                                        { label: "Female", value: "female" },
                                        { label: "LGBTQ+", value: "lgbtq" },
                                    ]}
                                    value={data.gender || ""}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                    placeholder="Select gender"
                                />
                                <InputError
                                    message={errors.gender}
                                    className="mt-1"
                                />
                                <FieldHint>
                                    Optional. This may differ from sex.
                                </FieldHint>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* Birth & Citizenship */}
            <SectionCard
                title="Birth & Citizenship"
                description="Provide the resident's birth details, religious affiliation, ethnicity, and citizenship."
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <div>
                        <InputField
                            type="date"
                            label="Birth Date"
                            name="birthdate"
                            value={data.birthdate || ""}
                            required
                            onChange={(e) => {
                                setData("birthdate", e.target.value);

                                const birthDate = new Date(e.target.value);
                                const today = new Date();

                                let calculatedAge =
                                    today.getFullYear() -
                                    birthDate.getFullYear();

                                const monthDiff =
                                    today.getMonth() - birthDate.getMonth();

                                if (
                                    monthDiff < 0 ||
                                    (monthDiff === 0 &&
                                        today.getDate() < birthDate.getDate())
                                ) {
                                    calculatedAge--;
                                }

                                if (
                                    !isNaN(calculatedAge) &&
                                    calculatedAge >= 0
                                ) {
                                    setData("age", calculatedAge);
                                }
                            }}
                        />
                        <InputError
                            message={errors.birthdate}
                            className="mt-1"
                        />
                        <FieldHint>
                            Age will be calculated automatically.
                        </FieldHint>
                    </div>

                    <div>
                        <InputField
                            label="Birth Place"
                            name="birthplace"
                            value={data.birthplace || "City of Ilagan"}
                            placeholder="Enter birth place"
                            required
                            onChange={(e) =>
                                setData(
                                    "birthplace",
                                    toTitleCase(e.target.value),
                                )
                            }
                        />
                        <InputError
                            message={errors.birthplace}
                            className="mt-1"
                        />
                        <FieldHint>
                            Enter the city or municipality of birth.
                        </FieldHint>
                    </div>

                    <div>
                        <DropdownInputField
                            label="Religion"
                            name="religion"
                            value={data.religion || ""}
                            items={[
                                "Roman Catholic",
                                "Iglesia ni Cristo",
                                "Born Again",
                                "Baptists",
                            ]}
                            placeholder="Select religion"
                            required
                            onChange={(e) =>
                                setData("religion", toTitleCase(e.target.value))
                            }
                        />
                        <InputError
                            message={errors.religion}
                            className="mt-1"
                        />
                        <FieldHint>
                            Choose the resident's religious affiliation.
                        </FieldHint>
                    </div>

                    <div>
                        <DropdownInputField
                            label="Ethnicity"
                            name="ethnicity"
                            value={data.ethnicity || ""}
                            items={[
                                "Ilocano",
                                "Ibanag",
                                "Tagalog",
                                "Indigenous People",
                            ]}
                            placeholder="Select ethnicity"
                            onChange={(e) =>
                                setData(
                                    "ethnicity",
                                    toTitleCase(e.target.value),
                                )
                            }
                        />
                        <InputError
                            message={errors.ethnicity}
                            className="mt-1"
                        />
                        <FieldHint>Select the ethnic group.</FieldHint>
                    </div>

                    <div>
                        <DropdownInputField
                            label="Citizenship"
                            name="citizenship"
                            value={data.citizenship || "Filipino"}
                            items={["Filipino", "Chinese", "American"]}
                            placeholder="Select citizenship"
                            required
                            onChange={(e) =>
                                setData(
                                    "citizenship",
                                    toTitleCase(e.target.value),
                                )
                            }
                        />
                        <InputError
                            message={errors.citizenship}
                            className="mt-1"
                        />
                        <FieldHint>
                            Specify the resident's citizenship.
                        </FieldHint>
                    </div>
                </div>
            </SectionCard>

            {/* Contact and Residency */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <SectionCard
                    title="Contact Information"
                    description="Provide the resident's contact details for communication."
                >
                    <div className="space-y-4">
                        <div>
                            <InputField
                                label="Contact Number"
                                name="contactNumber"
                                value={data.contactNumber || ""}
                                placeholder="Enter contact number"
                                onChange={(e) =>
                                    setData("contactNumber", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.contactNumber}
                                className="mt-1"
                            />
                            <FieldHint>
                                Include the correct mobile or telephone number.
                            </FieldHint>
                        </div>

                        <div>
                            <InputField
                                label="Email"
                                name="email"
                                value={data.email || ""}
                                placeholder="Enter email"
                                type="email"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                            <FieldHint>
                                Use a valid email for official communication.
                            </FieldHint>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Residency Information"
                    description="Specify the type and duration of the resident's stay in the barangay."
                >
                    <div className="space-y-4">
                        <div>
                            <SelectField
                                label="Residency Type"
                                name="residency_type"
                                value={data.residency_type || ""}
                                items={[
                                    { label: "Permanent", value: "permanent" },
                                    { label: "Temporary", value: "temporary" },
                                    { label: "Immigrant", value: "immigrant" },
                                ]}
                                onChange={(e) =>
                                    setData("residency_type", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.residency_type}
                                className="mt-1"
                            />
                            <FieldHint>
                                Select the category that best describes the
                                resident's stay.
                            </FieldHint>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <SelectField
                                    label="Purok Number"
                                    name="purok_number"
                                    value={data.purok_number || ""}
                                    onChange={(e) =>
                                        setData("purok_number", e.target.value)
                                    }
                                    placeholder="Select Purok"
                                    items={purok_numbers}
                                />
                                <InputError
                                    message={errors.purok_number}
                                    className="mt-1"
                                />
                                <FieldHint>
                                    Select the assigned purok number.
                                </FieldHint>
                            </div>

                            <div>
                                <YearDropdown
                                    label="Residency Date"
                                    name="residency_date"
                                    value={data.residency_date || ""}
                                    placeholder="Select residency date"
                                    onChange={(e) =>
                                        setData(
                                            "residency_date",
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.residency_date}
                                    className="mt-1"
                                />
                                <FieldHint>
                                    Select the year the resident started living
                                    in the area.
                                </FieldHint>
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* Government Programs */}
            <SectionCard
                title="Government Programs"
                description="Indicate whether the resident is enrolled in government programs or registered as a voter."
            >
                <div
                    className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
                        data.is_solo_parent == 1
                            ? "xl:grid-cols-5"
                            : "xl:grid-cols-4"
                    }`}
                >
                    <div>
                        <RadioGroup
                            label="4Ps Beneficiary"
                            name="is_4ps_beneficiary"
                            selectedValue={data.is_4ps_beneficiary || ""}
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            onChange={(e) =>
                                setData("is_4ps_beneficiary", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.is_4ps_beneficiary}
                            className="mt-1"
                        />
                        <FieldHint>
                            Pantawid Pamilyang Pilipino Program beneficiary.
                        </FieldHint>
                    </div>

                    <div>
                        <RadioGroup
                            label="Solo Parent"
                            name="is_solo_parent"
                            selectedValue={data.is_solo_parent || ""}
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            onChange={(e) =>
                                setData("is_solo_parent", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.is_solo_parent}
                            className="mt-1"
                        />
                        <FieldHint>
                            Indicate whether the resident is a solo parent.
                        </FieldHint>
                    </div>

                    {data.is_solo_parent == 1 && (
                        <div>
                            <InputField
                                label="Solo Parent ID"
                                name="solo_parent_id_number"
                                value={data.solo_parent_id_number || ""}
                                onChange={(e) =>
                                    setData(
                                        "solo_parent_id_number",
                                        e.target.value,
                                    )
                                }
                                placeholder="Enter ID number"
                            />
                            <InputError
                                message={errors.solo_parent_id_number}
                                className="mt-1"
                            />
                            <FieldHint>
                                ID number issued by the proper office.
                            </FieldHint>
                        </div>
                    )}

                    <div>
                        <RadioGroup
                            label="Registered Voter"
                            name="registered_voter"
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            selectedValue={data.registered_voter || ""}
                            onChange={(e) =>
                                setData("registered_voter", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.registered_voter}
                            className="mt-1"
                        />
                        <FieldHint>
                            Specify if the resident is a registered voter.
                        </FieldHint>
                    </div>

                    <div>
                        <InputField
                            label="PhilSys Card Number (PCN)"
                            name="philsys_card_number"
                            value={data.philsys_card_number || ""}
                            maxLength={16}
                            onChange={(e) =>
                                setData("philsys_card_number", e.target.value)
                            }
                            placeholder="Enter 16-digit PCN"
                        />
                        <InputError
                            message={errors.philsys_card_number}
                            className="mt-1"
                        />
                        <FieldHint>
                            Enter the 16-digit number from the National ID.
                        </FieldHint>
                    </div>
                </div>

                {data.registered_voter == 1 && (
                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-800">
                            Voter Details
                        </h4>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <DropdownInputField
                                    label="Voting Status"
                                    name="voting_status"
                                    value={data.voting_status || ""}
                                    items={[
                                        { label: "Active", value: "active" },
                                        {
                                            label: "Inactive",
                                            value: "inactive",
                                        },
                                        {
                                            label: "Disqualified",
                                            value: "disqualified",
                                        },
                                        { label: "Medical", value: "medical" },
                                        {
                                            label: "Overseas",
                                            value: "overseas",
                                        },
                                        {
                                            label: "Detained",
                                            value: "detained",
                                        },
                                        {
                                            label: "Deceased",
                                            value: "deceased",
                                        },
                                    ]}
                                    placeholder="Select status"
                                    onChange={(e) =>
                                        setData("voting_status", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.voting_status}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <InputField
                                    label="Voter ID Number"
                                    name="voter_id_number"
                                    value={data.voter_id_number || ""}
                                    placeholder="Enter voter ID number"
                                    onChange={(e) =>
                                        setData(
                                            "voter_id_number",
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.voter_id_number}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <DropdownInputField
                                    label="Registered Barangay"
                                    name="registered_barangay"
                                    value={data.registered_barangay || ""}
                                    items={barangayList}
                                    placeholder="Select registered barangay"
                                    onChange={(e) =>
                                        setData(
                                            "registered_barangay",
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.registered_barangay}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* Senior Citizen */}
            {data.age >= 60 && (
                <SectionCard
                    title="Senior Citizen Information"
                    description="Provide additional details for residents aged 60 and above."
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <RadioGroup
                                label="Pensioner"
                                name="is_pensioner"
                                options={[
                                    { label: "Yes", value: "yes" },
                                    { label: "No", value: "no" },
                                    { label: "Pending", value: "pending" },
                                ]}
                                selectedValue={data.is_pensioner || ""}
                                onChange={(e) =>
                                    setData("is_pensioner", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.is_pensioner}
                                className="mt-1"
                            />
                            <FieldHint>
                                Indicate if the resident currently receives a
                                pension.
                            </FieldHint>
                        </div>

                        {data.is_pensioner === "yes" && (
                            <>
                                <div>
                                    <InputField
                                        label="OSCA ID Number"
                                        name="osca_id_number"
                                        type="number"
                                        value={data.osca_id_number || ""}
                                        placeholder="Enter OSCA ID number"
                                        onChange={(e) =>
                                            setData(
                                                "osca_id_number",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.osca_id_number}
                                        className="mt-1"
                                    />
                                    <FieldHint>
                                        Official ID number for senior citizens.
                                    </FieldHint>
                                </div>

                                <div>
                                    <DropdownInputField
                                        label="Pension Type"
                                        name="pension_type"
                                        value={data.pension_type || ""}
                                        items={[
                                            "SSS",
                                            "DSWD",
                                            "GSIS",
                                            "Private",
                                            "None",
                                        ]}
                                        placeholder="Select pension type"
                                        onChange={(e) =>
                                            setData(
                                                "pension_type",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.pension_type}
                                        className="mt-1"
                                    />
                                    <FieldHint>
                                        Select the applicable pension source.
                                    </FieldHint>
                                </div>
                            </>
                        )}

                        <div>
                            <RadioGroup
                                label="Living Alone"
                                name="living_alone"
                                options={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ]}
                                selectedValue={data.living_alone ?? ""}
                                onChange={(e) =>
                                    setData("living_alone", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.living_alone}
                                className="mt-1"
                            />
                            <FieldHint>
                                Indicate whether the resident lives alone.
                            </FieldHint>
                        </div>
                    </div>
                </SectionCard>
            )}

            {/* Vehicle Information */}
            <SectionCard
                title="Vehicle Information"
                description="Record vehicles owned by the resident, including classification, purpose, and registration."
            >
                <div>
                    <RadioGroup
                        label="Owns Vehicle(s)?"
                        name="has_vehicle"
                        selectedValue={data.has_vehicle ?? 0}
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        onChange={(e) => setData("has_vehicle", e.target.value)}
                    />
                    <InputError message={errors.has_vehicle} className="mt-1" />
                </div>

                {data.has_vehicle == 1 && (
                    <div className="mt-5 space-y-4">
                        {(data.vehicles || []).map((vehicle, vecIndex) => (
                            <div
                                key={vecIndex}
                                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                                        Vehicle #{vecIndex + 1}
                                    </h4>

                                    <button
                                        type="button"
                                        onClick={() => removeVehicle(vecIndex)}
                                        className="text-2xl text-red-500 transition hover:text-red-700"
                                        title="Remove Vehicle"
                                    >
                                        <IoIosCloseCircleOutline />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    <div>
                                        <DropdownInputField
                                            label="Vehicle Type"
                                            name="vehicle_type"
                                            value={vehicle.vehicle_type || ""}
                                            items={[
                                                "Motorcycle",
                                                "Tricycle",
                                                "Car",
                                                "Jeep",
                                                "Truck",
                                                "Bicycle",
                                            ]}
                                            onChange={(e) =>
                                                handleArrayValues(
                                                    e,
                                                    vecIndex,
                                                    "vehicle_type",
                                                    "vehicles",
                                                )
                                            }
                                            placeholder="Select type"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `vehicles.${vecIndex}.vehicle_type`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <DropdownInputField
                                            label="Classification"
                                            name="vehicle_class"
                                            value={vehicle.vehicle_class || ""}
                                            items={[
                                                {
                                                    label: "Private",
                                                    value: "private",
                                                },
                                                {
                                                    label: "Public",
                                                    value: "public",
                                                },
                                            ]}
                                            onChange={(e) =>
                                                handleArrayValues(
                                                    e,
                                                    vecIndex,
                                                    "vehicle_class",
                                                    "vehicles",
                                                )
                                            }
                                            placeholder="Select class"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `vehicles.${vecIndex}.vehicle_class`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <DropdownInputField
                                            label="Usage Purpose"
                                            name="usage_status"
                                            value={vehicle.usage_status || ""}
                                            items={[
                                                {
                                                    label: "Personal",
                                                    value: "personal",
                                                },
                                                {
                                                    label: "Public Transport",
                                                    value: "public_transport",
                                                },
                                                {
                                                    label: "Business Use",
                                                    value: "business_use",
                                                },
                                            ]}
                                            onChange={(e) =>
                                                handleArrayValues(
                                                    e,
                                                    vecIndex,
                                                    "usage_status",
                                                    "vehicles",
                                                )
                                            }
                                            placeholder="Select usage"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `vehicles.${vecIndex}.usage_status`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <RadioGroup
                                            label="Is Registered?"
                                            name="is_registered"
                                            options={[
                                                { label: "Yes", value: 1 },
                                                { label: "No", value: 0 },
                                            ]}
                                            selectedValue={
                                                vehicle.is_registered || ""
                                            }
                                            onChange={(e) =>
                                                handleArrayValues(
                                                    e,
                                                    vecIndex,
                                                    "is_registered",
                                                    "vehicles",
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `vehicles.${vecIndex}.is_registered`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addVehicle}
                            className="inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                            title="Add Vehicle"
                        >
                            <IoIosAddCircleOutline className="mr-2 text-2xl" />
                            Add Vehicle
                        </button>
                    </div>
                )}
            </SectionCard>
        </div>
    );
};

export default Section1;
