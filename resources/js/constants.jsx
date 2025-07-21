import { Mars, Venus, VenusAndMars } from "lucide-react";

export const RESIDENT_CIVIL_STATUS_TEXT = {
    single: "Single",
    married: "Married",
    widowed: "Widowed",
    separated: "Separated",
    divorced: "Divorced",
    annulled: "Annulled",
};

export const RESIDENT_EMPLOYMENT_STATUS_TEXT = {
    student: "Student",
    employed: "Employed",
    unemployed: "Unemployed",
    self_employed: "Self Employed",
    under_employed: "Under Employed",
    retired: "Retired",
};

export const RESIDENT_GENDER_TEXT = {
    male: (
        <>
            <Mars className="inline-block mr-1 w-4 h-4" />
            Male
        </>
    ),
    female: (
        <>
            <Venus className="inline-block mr-1 w-4 h-4" />
            Female
        </>
    ),
    LGBTQ: (
        <>
            <VenusAndMars className="inline-block mr-1 w-4 h-4" />
            LGBTQA+
        </>
    ),
};

export const RESIDENT_GENDER_TEXT2 = {
    male: "Male",
    female: "Female",
    LGBTQ: "LGBTQA+",
};

export const RESIDENT_GENDER_COLOR_CLASS = {
    male: "p-1 bg-blue-200 text-blue-800 rounded-lg",
    female: "p-1 bg-red-100 text-red-800 rounded-lg",
    LGBTQ: "bg-gradient-to-r from-pink-300 via-yellow-300 to-blue-300 text-black-400",
};

export const RESIDENT_ROLE_TEXT = {
    barangay_officer: "Barangay Officer",
    resident: "Resident",
    admin: "Administrator",
    super_admin: "Super Administrator",
};

export const RESIDENT_REGISTER_VOTER_TEXT = {
    0: "Not Eligible",
    1: "Eligible",
};
export const RESIDENT_REGISTER_VOTER_CLASS = {
    0: "p-1 bg-red-100 text-red-800 rounded-lg",
    1: "p-1 bg-green-200 text-green-800 rounded-lg",
};


export const RESIDENT_RECIDENCY_TYPE_TEXT = {
    permanent: "Permanent",
    temporary: "Temporary",
    imigrant: "Imigrant",
};
export const RESIDENT_4PS_TEXT = {
    0: "No",
    1: "Yes",
};

export const RESIDENT_SOLO_PARENT_TEXT = {
    0: "No",
    1: "Yes",
};

export const RESIDENT_REGISTER_VOTER_TEXT2 = {
    0: "No",
    1: "Yes",
};

export const RESIDENT_VOTING_STATUS_TEXT = {
    active: "Active",
    inactive: "Inactive",
    disqualified: "Disqualified",
    medical: "Medical",
    overseas: "Overseas",
    detained: "Detained",
    deceased: "Deceased",
};

export const SENIOR_LIVING_ALONE_TEXT = {
    0: "No",
    1: "Yes",
};

export const SENIOR_PESIONER_TEXT = {
    yes: "Yes",
    no: "No",
    pendeing: "Pending",
};

export const VEHICLE_OWNERSHIP_TEXT = {
    1: "Yes",
    0: "No",
};

export const VEHICLE_CLASS_TEXT = {
    private: "Private",
    public: "Public",
};

export const VEHICLE_USAGE_TEXT = {
    personal: "Personal",
    public_transport: "Public Transport",
    business_use: "Business Use",
};

export const VEHICLE_USAGE_STYLES = {
    personal: "bg-blue-100 text-blue-700",
    business_use: "bg-yellow-100 text-yellow-700",
    public_transport: "bg-green-100 text-green-700",
};

export const HOUSEHOLD_POSITION_TEXT = {
    primary: "Primary",
    extended: "Extended",
    boarder: "Boarder",
};

export const HOUSEHOLD_BATH_WASH_TEXT = {
    with_own_sink_and_bath: "With own sink and bath",
    with_own_sink_only: "With own sink only",
    with_own_bath_only: "With own bath only",
    shared_or_communal: "Shared or communa",
    none: "None",
};

export const HOUSEHOLD_TOILET_TYPE_TEXT = {
    water_sealed: "Water Sealed",
    compost_pit_toilet: "Compost pit toilet",
    shared_communal_public_toilet: "Shared communal public toilet",
    shared_or_communal: "Shared or communal",
    no_latrine: "No latrine",
};

export const HOUSEHOLD_ELECTRICITY_TYPE = {
    distribution_company_iselco_ii: "ISELCO II (Distribution Company)",
    generator: "Generator",
    solar_renewable_energy_source: "Solar / Renewable Energy Source",
    battery: "Battery",
    none: "None",
};

export const HOUSEHOLD_WATER_SOURCE_TEXT = {
    level_ii_water_system: "Level II Water System",
    level_iii_water_system: "Level III Water System",
    deep_well_level_i: "Deep Well Level I",
    artesian_well_level_i: "Artesian Well Level I",
    shallow_well_level_i: "Shallow Well Level I",
    commercial_water_refill_source: "Commercial Water Refill Source",
    none: "None",
};

export const HOUSEHOLD_WASTE_DISPOSAL_TEXT = {
    open_dump_site: "Open Dump Site",
    sanitary_landfill: "Sanitary Landfill",
    compost_pits: "Compost Pits",
    material_recovery_facility: "Material Recovery Facility",
    garbage_is_collected: "Garbage is Collected",
    none: "None",
};

export const HOUSEHOLD_INTERNET_TYPE_TEXT = {
    mobile_data: "Mobile Data",
    wireless_fidelity: "Wi-Fi",
    none: "None",
};

export const FAMILY_TYPE_TEXT = {
    nuclear: "Nuclear",
    single_parent: "Single-parent",
    extended: "Extended",
    stepfamilies: "Stepfamilies",
    grandparent: "Grandparent",
    childless: "Childless",
    cohabiting_partners: "Cohabiting Partners",
    one_person_household: "One-person Household",
    roommates: "Roommates",
    other: "Other",
};

export const RELATIONSHIP_TO_HEAD_TEXT = {
    self: "Self",
    spouse: "Spouse",
    child: "Child",
    sibling: "Sibling",
    parent: "Parent",
    grandparent: "Grandparent",
    other: "Other",
};

export const HOUSEHOLD_OWNERSHIP_TEXT = {
    owned: "Owned",
    rented: "Rented",
    shared: "Shared",
    government_provided: "Goverment-Provided",
    inherited: "Inherited",
    others: "Others",
};

export const HOUSEHOLD_STRUCTURE_TEXT = {
    concrete: "Concrete",
    semi_concrete: "Semi-concrete",
    wood: "Wood",
    makeshift: "Makeshift",
};

export const HOUSEHOLD_CONDITION_TEXT = {
    good: "Good",
    needs_repair: "Needs Repair",
    dilapidated: "Delapitated",
};

export const HOUSING_CONDITION_COLOR = {
    good: "bg-green-100 text-green-800",
    dilapidated: "bg-red-100 text-red-800",
    needs_repair: "bg-yellow-100 text-yellow-800", // fallback or neutral option
};

export const PETS_PURPOSE_TEXT = {
    personal_consumption: "Personal Consumption",
    commercial: "Commercial",
    both: "Both",
};

export const PETS_VACCINE_TEXT = {
    0: "No",
    1: "Yes",
};

export const MEDICAL_SMOKE_TEXT = {
    0: "No",
    1: "Yes",
};

export const MEDICAL_ALCOHOL_TEXT = {
    0: "No",
    1: "Yes",
};

export const MEDICAL_PWD_TEXT = {
    0: "No",
    1: "Yes",
};

export const MEDICAL_PHILHEALTH_TEXT = {
    0: "No",
    1: "Yes",
};

export const EDUCATION_SCHOOL_TYPE = {
    public: "Public",
    label: "Private",
};

export const EDUCATION_LEVEL_TEXT = {
    no_formal_education: "No Formal Education",
    elementary: "Elementary",
    high_school: "High School",
    college: "College",
    post_grad: "Post Grad",
    vocational: "Vocational",
};

export const EDUCATION_STATUS_TEXT = {
    graduate: "Graduate",
    undergraduate: "Undergraduate",
    enrolled: "Currently Enrolled",
    stopped: "Stopped",
};

export const EDUCATION_OSY_TEXT = {
    0: "No",
    1: "Yes",
};

export const EDUCATION_OSC_TEXT = {
    0: "No",
    1: "Yes",
};

export const EMPLOYMENT_TYPE_TEXT = {
    full_time: "Full-time",
    part_time: "Part-time",
    seasonal: "Seasonal",
    contractual: "Contractual",
    self_employed: "Self-employed",
};

export const OCCUPATION_STATUS_TEXT = {
    active: "Active",
    inactive: "Inactive",
    ended: "Ended",
    retired: "Retired",
};

export const WORK_ARRANGEMENT_TEXT = {
    remote: "Remote",
    onsite: "Onsite",
    hybrid: "Hybrid",
};

export const INCOME_CATEGORY_TEXT = {
    survival: "Survival",
    poor: "Poor",
    low_income: "Low Income",
    lower_middle_income: "Lower Middle Income",
    middle_income: "Middle Income",
    upper_middle_income: "Upper Middle Income",
    high_income: "High Income",
};

export const INCOME_BRACKET_TEXT = {
    below_5000: "Below ₱5,000",
    "5001_10000": "₱5,001 - ₱10,000",
    "10001_20000": "₱10,001 - ₱20,000",
    "20001_40000": "₱20,001 - ₱40,000",
    "40001_70000": "₱40,001 - ₱70,000",
    "70001_120000": "₱70,001 - ₱120,000",
    above_120001: "₱120,001 and above",
};

export const INCOME_BRACKETS = {
    below_5000: {
        label: "Survival",
        className: "bg-red-100 text-red-700",
    },
    "5001_10000": {
        label: "Poor",
        className: "bg-orange-100 text-orange-700",
    },
    "10001_20000": {
        label: "Low Income",
        className: "bg-yellow-100 text-yellow-700",
    },
    "20001_40000": {
        label: "Lower Middle Income",
        className: "bg-lime-100 text-lime-700",
    },
    "40001_70000": {
        label: "Middle Income",
        className: "bg-green-100 text-green-700",
    },
    "70001_120000": {
        label: "Upper Middle Income",
        className: "bg-emerald-100 text-emerald-700",
    },
    above_120001: {
        label: "High Income",
        className: "bg-blue-100 text-blue-700",
    },
};
