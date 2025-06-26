import React, { useContext } from "react";
import { StepperContext } from "@/context/StepperContext";
import * as CONSTANTS from "@/constants";
const Summary = ({ onBack, onSubmit }) => {
    const { userData } = useContext(StepperContext);
    const members = userData.members || [];

    const renderDetail = (label, value) => (
        <div className="flex flex-col min-w-[150px]">
            <span className="text-xs font-medium text-gray-600">{label}</span>
            <span className={`text-sm break-words ${!value ? "text-red-500" : "text-gray-900"}`}>
                {value || "N/A"}
            </span>

        </div>
    );

    return (
        <section className="space-y-8 p-4 bg-white rounded-md shadow-sm">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Review Your Information</h2>
                <p className="text-sm text-gray-600">Please review your details carefully before submission.</p>
            </div>

            {/* Household Address Section */}
            <section className="space-y-4 border border-gray-200 p-4 rounded-md">
                <h6 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-3 mb-2">
                    Household Address & Information
                </h6>

                <div className="flex flex-wrap gap-6">
                    {renderDetail("House/Lot/Unit No.", userData.housenumber)}
                    {renderDetail("Street Name", userData.street)}
                    {renderDetail("Subdivision/Village", userData.subdivision)}
                    {renderDetail("Purok/Zone/Sitio", userData.purok)}
                    {renderDetail("Family Type", CONSTANTS.FAMILY_TYPE_TEXT[userData.family_type])}
                    {renderDetail("Number of Household Members", userData.householdCount)}
                    {renderDetail("Family Name", userData.family_name)}
                </div>
            </section>



            {/* Household Members */}
            <section className="space-y-6">
                <h6 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-3">
                    Household Members
                </h6>

                {members.length === 0 ? (
                    <p className="text-gray-500 italic bg-gray-50 p-4 rounded text-sm text-center">
                        No household member information provided.
                    </p>
                ) : (
                    members.map((member, index) => (
                        <details key={index} className="border rounded-md shadow-sm bg-white">
                            <summary className="px-4 py-2 text-blue-700 font-semibold cursor-pointer">
                                Member {index + 1}: {`${member.firstname || ""} ${member.lastname || ""}`.trim() || "No Name Provided"}
                            </summary>
                            <div className="p-4 space-y-4">
                                <div className="border-b pb-4">
                                    <h5 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h5>

                                    <div className="flex flex-col sm:flex-row gap-6">

                                        {/* Left: Image */}
                                        <div className="flex-shrink-0">
                                            {member.resident_image ? (
                                                <img
                                                    src={
                                                        member.resident_image instanceof File
                                                            ? URL.createObjectURL(member.resident_image)
                                                            : member.resident_image
                                                    }
                                                    alt="Resident"
                                                    className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 flex items-center justify-center bg-gray-100 text-sm text-gray-500 rounded-md border border-gray-300">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Info beside the image */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-grow">
                                            {renderDetail("Full Name", `${member.firstname || ''} ${member.middlename || ''} ${member.lastname || ''} ${member.suffix || ''}`.trim())}
                                            {renderDetail("Birth Date", member.birthdate)}
                                            {renderDetail("Birth Place", member.birthplace)}
                                            {renderDetail("Civil Status", member.civil_status)}
                                            {renderDetail("Gender", CONSTANTS.RESIDENT_GENDER_TEXT2[member.gender])}
                                            {["female", "LGBTQIA+"].includes(CONSTANTS.RESIDENT_GENDER_TEXT2[member.gender]) &&
                                                ["Married", "Widowed", "Separated"].includes(CONSTANTS.RESIDENT_CIVIL_STATUS_TEXT[member.civil_status]) &&
                                                renderDetail("Maiden Middle Name", member.maiden_middle_name)}
                                            {renderDetail("Religion", member.religion)}
                                            {renderDetail("Ethnicity", member.ethnicity)}
                                            {renderDetail("Citizenship", member.citizenship)}
                                            {renderDetail("Contact Number", member.contactNumber)}
                                            {renderDetail("Email", member.email)}
                                            {renderDetail("4Ps Beneficiary", CONSTANTS.RESIDENT_4PS_TEXT[member.is_4ps_benificiary])}
                                            {renderDetail("Solo Parent", CONSTANTS.RESIDENT_SOLO_PARENT_TEXT[member.is_solo_parent])}
                                            {member.is_solo_parent == 1 && renderDetail("Solo Parent ID", member.solo_parent_id_number)}
                                            {renderDetail("Registered Voter", CONSTANTS.RESIDENT_REGISTER_VOTER_TEXT2[member.registered_voter])}
                                            {member.registered_voter == 1 && renderDetail("Voter ID", member.voter_id_number)}
                                            {member.registered_voter == 1 && renderDetail("Voting Status", CONSTANTS.RESIDENT_VOTING_STATUS_TEXT[member.voting_status])}
                                            {member.age >= 60 && renderDetail("Pensioner", CONSTANTS.SENIOR_PESIONER_TEXT[member.is_pensioner])}
                                            {member.age >= 60 && renderDetail("OSCA ID", member.osca_id_number)}
                                            {member.age >= 60 && renderDetail("Pension Type", member.pension_type)}
                                            {member.age >= 60 && renderDetail("Living Alone", CONSTANTS.SENIOR_LIVING_ALONE_TEXT[member.living_alone])}
                                        </div>
                                    </div>
                                </div>
                                {/* Vehicle Info Section */}
                                <div className="space-y-3">
                                    <h5 className="text-sm font-semibold text-gray-700">Vehicle Information</h5>

                                    {member.has_vehicle == 1 && member.vehicles?.length > 0 ? (
                                        <div className={`grid ${member.vehicles.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-4`}>
                                            {member.vehicles.map((vehicle, vIndex) => (
                                                <div key={vIndex} className="bg-blue-50 p-4 rounded border border-blue-100">
                                                    <h6 className="text-sm font-semibold text-blue-700 mb-2">
                                                        Vehicle {member.vehicles.length > 1 ? vIndex + 1 : ""}
                                                    </h6>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                        {renderDetail("Vehicle Type", vehicle.vehicle_type)}
                                                        {renderDetail("Classification", CONSTANTS.VEHICLE_CLASS_TEXT[vehicle.vehicle_class])}
                                                        {renderDetail("Usage Purpose", CONSTANTS.VEHICLE_USAGE_TEXT[vehicle.usage_status])}
                                                        {renderDetail("Quantity", vehicle.quantity)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No vehicle details provided.</p>
                                    )}
                                </div>


                                <div className="border-b pb-4">
                                    <h5 className="text-sm font-semibold text-gray-700 mb-3">Education & Medical Information</h5>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div className="space-y-2 border border-gray-200 p-4 rounded-md">
                                            <h6 className="text-sm font-semibold text-blue-700">Educational Background</h6>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {renderDetail("Highest Education", CONSTANTS.EDUCATION_LEVEL_TEXT[member.education])}
                                                {renderDetail("Education Status", CONSTANTS.EDUCATION_STATUS_TEXT[member.education_status])}
                                                {renderDetail("Out of School Children", CONSTANTS.EDUCATION_OSC_TEXT[member.osc])}
                                                {renderDetail("Out of School Youth", CONSTANTS.EDUCATION_OSY_TEXT[member.osy])}
                                                {renderDetail("Year Started", member.year_started)}
                                                {renderDetail("Year Ended", member.year_ended)}
                                                {renderDetail("Year Graduated", member.year_graduated)}
                                                {renderDetail("School Name", member.school_name)}
                                                {renderDetail("School Type", CONSTANTS.EDUCATION_SCHOOL_TYPE[member.school_type])}
                                                {renderDetail("Course/Strand", member.program)}
                                            </div>
                                        </div>

                                        {/* Right Column: Medical */}
                                        <div className="space-y-2 border border-gray-200 p-4 rounded-md">
                                            <h6 className="text-sm font-semibold text-blue-700">Medical Background</h6>

                                            {/* Main medical grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {renderDetail("Weight (kg)", member.weight_kg)}
                                                {renderDetail("Height (cm)", member.height_cm)}
                                                {renderDetail("Nutrition Status", member.nutrition_status)}
                                                {renderDetail("Blood Type", member.blood_type)}
                                                {renderDetail("PhilHealth", CONSTANTS.MEDICAL_PHILHEALTH_TEXT[member.has_philhealth])}
                                                {renderDetail("PhilHealth ID", member.philhealth_id_number)}
                                                {renderDetail("Consumes Alcohol", CONSTANTS.MEDICAL_ALCOHOL_TEXT[member.is_alcohol_user])}
                                                {renderDetail("Smoking", CONSTANTS.MEDICAL_SMOKE_TEXT[member.is_smoker])}
                                                {renderDetail("PWD", CONSTANTS.MEDICAL_PWD_TEXT[member.is_pwd])}
                                                {renderDetail("Emergency Contact Name", member.emergency_contact_name)}
                                                {renderDetail("Emergency Contact Number", member.emergency_contact_number)}
                                                {renderDetail("Emergency Contact Relationship", member.emergency_contact_relationship)}
                                            </div>

                                            {/* Disabilities Section */}
                                            <div className="mt-4">
                                                <h6 className="text-sm font-semibold text-gray-700 mb-2">Disability Information</h6>

                                                {/* PWD Number if exists */}
                                                {member.pwd_id_number && (
                                                    <div className="mb-2 text-sm text-gray-800">
                                                        <span className="font-medium text-gray-600 mr-1">PWD ID Number:</span>
                                                        <span>{member.pwd_id_number}</span>
                                                    </div>
                                                )}

                                                {member.disabilities && member.disabilities.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {member.disabilities.map((disability, disIndex) => (
                                                            <div
                                                                key={disIndex}
                                                                className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700"
                                                            >
                                                                {disability.disability_type || ""}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm italic text-gray-500">
                                                        No disability information provided.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* Form Division: Occupations */}
                                <div className="space-y-3">
                                    <h5 className="text-sm font-semibold text-gray-700">Occupations</h5>

                                    {member.occupations && member.occupations.length > 0 ? (
                                        <div className={`grid ${member.occupations.length > 1 ? "md:grid-cols-2" : "grid-cols-1"} gap-4`}>
                                            {member.occupations.map((occupation, occIndex) => (
                                                <div key={occIndex} className="bg-blue-50 p-4 rounded border border-blue-100">
                                                    <h6 className="text-sm font-semibold text-blue-700 mb-2">
                                                        Occupation {member.occupations.length > 1 ? occIndex + 1 : ""}
                                                    </h6>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ">
                                                        {renderDetail("Occupation", occupation.occupation)}
                                                        {renderDetail("Employment Status", CONSTANTS.RESIDENT_EMPLOYMENT_STATUS_TEXT[occupation.employment_status])}
                                                        {renderDetail("Employment Type", CONSTANTS.EMPLOYMENT_TYPE_TEXT[occupation.employment_type])}
                                                        {renderDetail("Occupation Status", CONSTANTS.OCCUPATION_STATUS_TEXT[occupation.occupation_status])}
                                                        {renderDetail("Work Arrangement", CONSTANTS.WORK_ARRANGEMENT_TEXT[occupation.work_arrangement])}
                                                        {renderDetail("Employer Name", occupation.employer)}
                                                        {renderDetail("Year Started", occupation.started_at)}
                                                        {renderDetail("Year Ended", occupation.ended_at)}
                                                        {renderDetail("Monthly Income", occupation.monthly_income)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No occupation data.</p>
                                    )}
                                </div>

                            </div>
                        </details>
                    ))
                )}
            </section>

            {/* House Info */}
            <section className="space-y-4 border border-gray-200 p-4 rounded-md">
                <h6 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-3 mb-2">
                    House Information
                </h6>

                {/* House Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {renderDetail("Ownership Type", CONSTANTS.HOUSEHOLD_OWNERSHIP_TEXT[userData.ownership_type])}
                    {renderDetail("House Condition", CONSTANTS.HOUSEHOLD_CONDITION_TEXT[userData.housing_condition])}
                    {renderDetail("House Structure", CONSTANTS.HOUSEHOLD_STRUCTURE_TEXT[userData.house_structure])}
                    {renderDetail("Year Establish", userData.year_establish)}
                    {renderDetail("No. of Rooms", userData.number_of_rooms)}
                    {renderDetail("No. of Floors", userData.number_of_floors)}
                    {renderDetail("Bath/Wash Area", CONSTANTS.HOUSEHOLD_BATH_WASH_TEXT[userData.bath_and_wash_area])}
                    {renderDetail("Toilet Type", CONSTANTS.HOUSEHOLD_TOILET_TYPE_TEXT[userData.toilet_type])}
                    {renderDetail("Electricity", CONSTANTS.HOUSEHOLD_ELECTRICITY_TYPE[userData.electricity_type])}
                    {renderDetail("Water Source", CONSTANTS.HOUSEHOLD_WATER_SOURCE_TEXT[userData.water_source_type])}
                    {renderDetail("Waste Disposal", CONSTANTS.HOUSEHOLD_WASTE_DISPOSAL_TEXT[userData.waste_management_type])}
                    {renderDetail("Internet", CONSTANTS.HOUSEHOLD_INTERNET_TYPE_TEXT[userData.type_of_internet])}
                </div>

                {/* Livestock and Pets */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {/* Livestock Section */}
                    <div>
                        <h6 className="text-md font-semibold text-gray-700 border-b pb-1 mb-2">Livestock Ownership</h6>
                        {userData.has_livestock == 1 && userData.livestocks?.length > 0 ? (
                            <div className="space-y-2">
                                {userData.livestocks.map((livestock, index) => (
                                    <div
                                        key={index}
                                        className="bg-sky-50 p-3 border border-sky-200 rounded-md flex flex-wrap gap-6"
                                    >
                                        {renderDetail("Livestock Type", livestock.livestock_type)}
                                        {renderDetail("Quantity", livestock.quantity)}
                                        {renderDetail("Purpose", CONSTANTS.PETS_PURPOSE_TEXT[livestock.purpose])}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic text-gray-500">No livestock information provided.</p>
                        )}
                    </div>

                    {/* Pet Section */}
                    <div>
                        <h6 className="text-md font-semibold text-gray-700 border-b pb-1 mb-2">Pet Ownership</h6>
                        {userData.has_pets == 1 && userData.pets?.length > 0 ? (
                            <div className="space-y-2">
                                {userData.pets.map((pet, index) => (
                                    <div
                                        key={index}
                                        className="bg-sky-50 p-3 border border-sky-200 rounded-md flex flex-wrap gap-6"
                                    >
                                        {renderDetail("Pet Type", pet.pet_type)}
                                        {renderDetail("Vaccinated for Rabies", CONSTANTS.PETS_VACCINE_TEXT[pet.is_vaccinated])}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic text-gray-500">No pet information provided.</p>
                        )}
                    </div>
                </div>
            </section>
        </section>
    );
};

export default Summary;
