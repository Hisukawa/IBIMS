import React from "react";

export default function HouseholdDetailsCard({
    household_details,
    CONSTANTS,
    formatBathWash,
    formatToilets,
    formatWater,
    formatElectricity,
    formatWaste,
}) {
    const quickStats = [
        {
            label: "Rooms",
            value: household_details?.number_of_rooms,
            color: "emerald",
        },
        {
            label: "Floors",
            value: household_details?.number_of_floors,
            color: "indigo",
        },
        {
            label: "Year Built",
            value: household_details?.year_established,
            color: "amber",
        },
        {
            label: "Ownership",
            value: CONSTANTS.HOUSEHOLD_OWNERSHIP_TEXT[
                household_details?.ownership_type
            ],
            color: "rose",
        },
    ];

    return (
        <div className="rounded-2xl  bg-white shadow-sm overflow-hidden">
            {/* HEADER */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 via-white to-blue-50 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            House #{household_details?.house_number || "—"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {household_details?.purok?.barangay
                                ?.barangay_name || "—"}
                            {" • "}
                            Purok{" "}
                            {household_details?.purok?.purok_number || "—"}
                            {" • "}
                            {household_details?.street?.street_name || "—"}{" "}
                            Street
                        </p>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-medium border border-indigo-200">
                        Household
                    </span>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 py-4 border-b bg-gray-50/50">
                {quickStats.map((item, i) => (
                    <div
                        key={i}
                        className={`rounded-xl border p-3 bg-white shadow-sm`}
                    >
                        <p className="text-[11px] uppercase text-gray-400">
                            {item.label}
                        </p>
                        <p
                            className={`mt-1 text-sm font-semibold text-${item.color}-600`}
                        >
                            {item.value || "—"}
                        </p>
                    </div>
                ))}
            </div>

            {/* CONTENT */}
            <div className="grid md:grid-cols-2 gap-4 p-5">
                {/* STRUCTURE */}
                <InfoSection title="Structure & Condition" color="emerald">
                    <DetailItem
                        label="Housing Condition"
                        value={
                            CONSTANTS.HOUSEHOLD_CONDITION_TEXT[
                                household_details?.housing_condition
                            ]
                        }
                    />
                    <DetailItem
                        label="House Structure"
                        value={
                            CONSTANTS.HOUSEHOLD_STRUCTURE_TEXT[
                                household_details?.house_structure
                            ]
                        }
                    />
                </InfoSection>

                {/* LOCATION */}
                <InfoSection title="Location" color="indigo">
                    <DetailItem
                        label="Coordinates"
                        value={
                            household_details?.latitude &&
                            household_details?.longitude
                                ? `${household_details.latitude}, ${household_details.longitude}`
                                : "—"
                        }
                    />
                </InfoSection>

                {/* UTILITIES */}
                <InfoSection
                    title="Utilities & Services"
                    color="amber"
                    className="md:col-span-2"
                >
                    <div className="grid md:grid-cols-2 gap-3">
                        <DetailItem
                            label="Bath & Wash Area"
                            value={formatBathWash(household_details)}
                        />
                        <DetailItem
                            label="Toilet Types"
                            value={formatToilets(household_details)}
                        />
                        <DetailItem
                            label="Water Sources"
                            value={formatWater(household_details)}
                        />
                        <DetailItem
                            label="Electricity"
                            value={formatElectricity(household_details)}
                        />
                        <DetailItem
                            label="Waste Management"
                            value={formatWaste(household_details)}
                        />
                    </div>
                </InfoSection>
            </div>
        </div>
    );
}

function InfoSection({ title, children, className = "", color = "gray" }) {
    return (
        <div
            className={`rounded-xl border bg-white p-4 shadow-sm ${className}`}
        >
            <h3
                className={`mb-3 text-sm font-semibold text-${color}-700 border-l-4 border-${color}-400 pl-2`}
            >
                {title}
            </h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="flex justify-between items-start gap-4 border-b border-gray-100 pb-2 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-800 text-right">
                {value || "—"}
            </span>
        </div>
    );
}
