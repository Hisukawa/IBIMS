// import { useMemo, useState } from "react";
// import { FaPhone, FaEnvelope, FaHeart } from "react-icons/fa";
// import { FaLocationDot, FaPeopleGroup } from "react-icons/fa6";
// import { IoBookSharp, IoPerson } from "react-icons/io5";
// import { MdWork } from "react-icons/md";
// import { RiWheelchairFill } from "react-icons/ri";
// import { HeartPulse } from "lucide-react";
// import * as CONSTANTS from "@/constants";

// function DetailItem({ label, value, className = "" }) {
//     return (
//         <div
//             className={`grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 ${className}`}
//         >
//             <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//                 {label}
//             </span>
//             <span className="text-sm text-slate-800 break-words">
//                 {value || (
//                     <span className="italic text-slate-400">Not available</span>
//                 )}
//             </span>
//         </div>
//     );
// }

// function InfoCard({ icon, title, children }) {
//     return (
//         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <div className="mb-4 flex items-center gap-2">
//                 <span className="text-blue-700 text-lg">{icon}</span>
//                 <h3 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
//                     {title}
//                 </h3>
//             </div>
//             <div className="space-y-3">{children}</div>
//         </div>
//     );
// }

// function StatCard({ label, value }) {
//     return (
//         <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
//             <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                 {label}
//             </p>
//             <p className="mt-1 text-sm font-semibold text-slate-800">
//                 {value || "N/A"}
//             </p>
//         </div>
//     );
// }

// function TabButton({ active, onClick, children }) {
//     return (
//         <button
//             onClick={onClick}
//             className={[
//                 "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
//                 active
//                     ? "bg-blue-600 text-white shadow-sm"
//                     : "bg-slate-100 text-slate-600 hover:bg-slate-200",
//             ].join(" ")}
//         >
//             {children}
//         </button>
//     );
// }

// function EmptyState({ message }) {
//     return (
//         <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm italic text-slate-500">
//             {message}
//         </div>
//     );
// }

// export default function PersonDetailContent({ person, deceased = false }) {
//     const [activeTab, setActiveTab] = useState("education");

//     if (!person) {
//         return (
//             <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
//                 No data found.
//             </div>
//         );
//     }

//     function calculateAge(birthdate) {
//         if (!birthdate) return "N/A";
//         const today = new Date();
//         const birth = new Date(birthdate);
//         let age = today.getFullYear() - birth.getFullYear();
//         const m = today.getMonth() - birth.getMonth();

//         if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
//             age--;
//         }

//         return age;
//     }

//     function formatCardNumber(number) {
//         if (!number) return "";
//         return number.replace(/(\d{4})(?=\d)/g, "$1-");
//     }

//     const fullName = useMemo(() => {
//         return [
//             person.lastname + ",",
//             person.firstname,
//             person.middlename,
//             person.suffix,
//         ]
//             .filter(Boolean)
//             .join(" ");
//     }, [person]);

//     const fullAddress = useMemo(() => {
//         return [
//             person.street?.street_name,
//             person.purok_number ? `Purok ${person.purok_number}` : null,
//             person.barangay?.barangay_name,
//             person.barangay?.city,
//         ]
//             .filter(Boolean)
//             .join(", ");
//     }, [person]);

//     const tabs = [
//         { key: "education", label: "Education" },
//         { key: "occupation", label: "Occupation" },
//         { key: "medical", label: "Medical" },
//         { key: "social", label: "Social Welfare" },
//         ...(person.seniorcitizen
//             ? [{ key: "senior", label: "Senior Citizen" }]
//             : []),
//     ];

//     return (
//         <div className="w-full space-y-5 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg">
//             {deceased && (
//                 <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 shadow-sm">
//                     <HeartPulse className="mt-0.5 h-5 w-5 text-red-500" />
//                     <div>
//                         <p className="text-sm font-bold text-red-700">
//                             Deceased Resident
//                         </p>
//                         <p className="text-sm text-red-600">
//                             This record is marked as deceased and is maintained
//                             for documentation purposes.
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {/* Header */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                 <div className="flex flex-col gap-5 md:flex-row md:items-center">
//                     <img
//                         src={
//                             person?.resident_picture_path == null
//                                 ? "/images/default-avatar.jpg"
//                                 : `/storage/${person.resident_picture_path}`
//                         }
//                         alt={`${person?.firstname}'s photo`}
//                         className="h-24 w-24 rounded-2xl object-cover border-4 border-slate-100 shadow-sm"
//                     />

//                     <div className="min-w-0 flex-1">
//                         <h2 className="text-2xl font-bold text-slate-900">
//                             {fullName}
//                         </h2>
//                         <p className="mt-1 text-sm text-slate-500">
//                             Resident Information Overview
//                         </p>

//                         <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 md:flex-row md:flex-wrap md:items-center md:gap-4">
//                             <div className="flex items-center gap-2">
//                                 <FaEnvelope className="text-blue-600" />
//                                 <span>
//                                     {person.email || "No email provided"}
//                                 </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <FaPhone className="text-blue-600" />
//                                 <span>
//                                     {person.contact_number ||
//                                         "No contact number"}
//                                 </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <FaLocationDot className="text-blue-600" />
//                                 <span>
//                                     {fullAddress || "No address available"}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
//                     <StatCard label="Gender" value={person.gender} />
//                     <StatCard
//                         label="Age"
//                         value={calculateAge(person.birthdate)}
//                     />
//                     <StatCard
//                         label="Civil Status"
//                         value={person.civil_status}
//                     />
//                     <StatCard label="Nationality" value={person.citizenship} />
//                 </div>
//             </div>

//             {/* Personal Info */}
//             <InfoCard title="Personal Information" icon={<IoPerson />}>
//                 <DetailItem label="Birthdate" value={person.birthdate} />
//                 <DetailItem label="Birthplace" value={person.birthplace} />
//                 <DetailItem label="Religion" value={person.religion} />
//                 <DetailItem label="Ethnicity" value={person.ethnicity} />
//             </InfoCard>

//             {/* Residency + Emergency */}
//             <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//                 <InfoCard title="Residency" icon={<FaLocationDot />}>
//                     <DetailItem label="Address" value={fullAddress} />
//                     <DetailItem
//                         label="Residency Type"
//                         value={person.residency_type}
//                     />
//                     <DetailItem
//                         label="Residency Date"
//                         value={person.residency_date}
//                     />
//                 </InfoCard>

//                 <InfoCard title="Emergency Contact" icon={<FaPhone />}>
//                     <DetailItem
//                         label="Name"
//                         value={
//                             person.medical_information?.emergency_contact_name
//                         }
//                     />
//                     <DetailItem
//                         label="Contact No."
//                         value={
//                             person.medical_information?.emergency_contact_number
//                         }
//                     />
//                     <DetailItem
//                         label="Relationship"
//                         value={
//                             person.medical_information
//                                 ?.emergency_contact_relationship
//                         }
//                     />
//                 </InfoCard>
//             </div>

//             {/* Tabs */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <div className="flex flex-wrap gap-2">
//                     {tabs.map((tab) => (
//                         <TabButton
//                             key={tab.key}
//                             active={activeTab === tab.key}
//                             onClick={() => setActiveTab(tab.key)}
//                         >
//                             {tab.label}
//                         </TabButton>
//                     ))}
//                 </div>

//                 <div className="mt-5">
//                     {activeTab === "education" && (
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-2 text-blue-700">
//                                 <IoBookSharp />
//                                 <h3 className="text-base font-bold">
//                                     Education History
//                                 </h3>
//                             </div>

//                             {Array.isArray(person.educational_histories) &&
//                             person.educational_histories.length > 0 ? (
//                                 person.educational_histories.map(
//                                     (edu, index) => (
//                                         <div
//                                             key={index}
//                                             className="rounded-xl border border-slate-200 bg-slate-50 p-4"
//                                         >
//                                             <div className="space-y-3">
//                                                 <DetailItem
//                                                     label="Attainment"
//                                                     value={
//                                                         CONSTANTS
//                                                             .EDUCATION_LEVEL_TEXT[
//                                                             edu
//                                                                 .educational_attainment
//                                                         ]
//                                                     }
//                                                 />
//                                                 <DetailItem
//                                                     label="Status"
//                                                     value={edu.education_status}
//                                                 />
//                                                 <DetailItem
//                                                     label="School"
//                                                     value={edu.school_name}
//                                                 />
//                                                 <DetailItem
//                                                     label="Type"
//                                                     value={edu.school_type}
//                                                 />
//                                                 {edu.program && (
//                                                     <DetailItem
//                                                         label="Program"
//                                                         value={edu.program}
//                                                     />
//                                                 )}
//                                                 <DetailItem
//                                                     label="School Years"
//                                                     value={`${edu.year_started || ""} – ${edu.year_ended || "Present"}`}
//                                                 />
//                                             </div>
//                                         </div>
//                                     ),
//                                 )
//                             ) : (
//                                 <EmptyState message="No education records available." />
//                             )}
//                         </div>
//                     )}

//                     {activeTab === "occupation" && (
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-2 text-blue-700">
//                                 <MdWork />
//                                 <h3 className="text-base font-bold">
//                                     Occupation History
//                                 </h3>
//                             </div>

//                             {Array.isArray(person.occupations) &&
//                             person.occupations.length > 0 ? (
//                                 person.occupations.map((job, index) => (
//                                     <div
//                                         key={index}
//                                         className="rounded-xl border border-slate-200 bg-slate-50 p-4"
//                                     >
//                                         <div className="space-y-3">
//                                             <DetailItem
//                                                 label="Occupation"
//                                                 value={job.occupation}
//                                             />
//                                             <DetailItem
//                                                 label="Status"
//                                                 value={job.occupation_status}
//                                             />
//                                             <DetailItem
//                                                 label="Employer"
//                                                 value={job.employer || "N/A"}
//                                             />
//                                             <DetailItem
//                                                 label="Type"
//                                                 value={
//                                                     CONSTANTS
//                                                         .EMPLOYMENT_TYPE_TEXT[
//                                                         job.employment_type
//                                                     ]
//                                                 }
//                                             />
//                                             <DetailItem
//                                                 label="Monthly Income"
//                                                 value={job.monthly_income}
//                                             />
//                                             <DetailItem
//                                                 label="Work Arrangement"
//                                                 value={job.work_arrangement}
//                                             />
//                                             <DetailItem
//                                                 label="Years Active"
//                                                 value={`${job.started_at || "N/A"} – ${job.ended_at || "Present"}`}
//                                             />
//                                             <DetailItem
//                                                 label="OFW"
//                                                 value={
//                                                     job.is_ofw === 1
//                                                         ? "Yes"
//                                                         : "No"
//                                                 }
//                                             />
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <EmptyState message="No occupation records available." />
//                             )}
//                         </div>
//                     )}

//                     {activeTab === "medical" && (
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-2 text-blue-700">
//                                 <FaHeart />
//                                 <h3 className="text-base font-bold">
//                                     Medical Information
//                                 </h3>
//                             </div>

//                             {person.medical_information ? (
//                                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
//                                     <DetailItem
//                                         label="Blood Type"
//                                         value={
//                                             person.medical_information
//                                                 .blood_type
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="BMI"
//                                         value={person.medical_information.bmi}
//                                     />
//                                     <DetailItem
//                                         label="Height (cm)"
//                                         value={
//                                             person.medical_information.height_cm
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="Weight (kg)"
//                                         value={
//                                             person.medical_information.weight_kg
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="Nutrition Status"
//                                         value={
//                                             CONSTANTS.BMI_STATUS[
//                                                 person.medical_information
//                                                     .nutrition_status
//                                             ]
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="Smoker"
//                                         value={
//                                             person.medical_information.is_smoker
//                                                 ? "Yes"
//                                                 : "No"
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="Alcohol User"
//                                         value={
//                                             person.medical_information
//                                                 .is_alcohol_user
//                                                 ? "Yes"
//                                                 : "No"
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="Is PWD"
//                                         value={person.is_pwd ? "Yes" : "No"}
//                                     />
//                                 </div>
//                             ) : (
//                                 <EmptyState message="No medical info available." />
//                             )}

//                             {person.is_pwd === 1 && (
//                                 <div className="rounded-xl border border-slate-200 bg-white p-4">
//                                     <div className="mb-3 flex items-center gap-2 text-blue-700">
//                                         <RiWheelchairFill />
//                                         <h4 className="text-sm font-bold">
//                                             Disability Information
//                                         </h4>
//                                     </div>

//                                     {person.disabilities?.length > 0 ? (
//                                         <div className="flex flex-wrap gap-2">
//                                             {person.disabilities.map(
//                                                 (disability, index) => (
//                                                     <span
//                                                         key={index}
//                                                         className="rounded-full bg-blue-50 px-3 py-1 text-sm capitalize text-blue-700 border border-blue-100"
//                                                     >
//                                                         {
//                                                             disability.disability_type
//                                                         }
//                                                     </span>
//                                                 ),
//                                             )}
//                                         </div>
//                                     ) : (
//                                         <EmptyState message="No disabilities recorded." />
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {activeTab === "social" && (
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-2 text-blue-700">
//                                 <FaPeopleGroup />
//                                 <h3 className="text-base font-bold">
//                                     Social Welfare Profile
//                                 </h3>
//                             </div>

//                             {person.socialwelfareprofile ? (
//                                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
//                                     <DetailItem
//                                         label="4Ps Beneficiary"
//                                         value={
//                                             person.socialwelfareprofile
//                                                 .is_4ps_beneficiary
//                                                 ? "Yes"
//                                                 : "No"
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="PhilHealth Beneficiary"
//                                         value={
//                                             person.medical_information
//                                                 ?.has_philhealth
//                                                 ? "Yes"
//                                                 : "No"
//                                         }
//                                     />
//                                     {person.medical_information
//                                         ?.has_philhealth === 1 && (
//                                         <DetailItem
//                                             label="PhilHealth ID"
//                                             value={
//                                                 person.medical_information
//                                                     ?.philhealth_id_number ||
//                                                 "N/A"
//                                             }
//                                         />
//                                     )}
//                                     <DetailItem
//                                         label="Solo Parent"
//                                         value={
//                                             person.socialwelfareprofile
//                                                 .is_solo_parent
//                                                 ? "Yes"
//                                                 : "No"
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="PhilSys Card Number"
//                                         value={
//                                             person.socialwelfareprofile
//                                                 .philsys_card_no
//                                                 ? formatCardNumber(
//                                                       person
//                                                           .socialwelfareprofile
//                                                           .philsys_card_no,
//                                                   )
//                                                 : ""
//                                         }
//                                     />
//                                     {person.socialwelfareprofile
//                                         .is_solo_parent === 1 && (
//                                         <DetailItem
//                                             label="Solo Parent ID"
//                                             value={
//                                                 person.socialwelfareprofile
//                                                     .solo_parent_id_number
//                                             }
//                                         />
//                                     )}
//                                 </div>
//                             ) : (
//                                 <EmptyState message="No social welfare info available." />
//                             )}
//                         </div>
//                     )}

//                     {activeTab === "senior" && (
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-2 text-blue-700">
//                                 <IoPerson />
//                                 <h3 className="text-base font-bold">
//                                     Senior Citizen Information
//                                 </h3>
//                             </div>

//                             {person.seniorcitizen ? (
//                                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
//                                     <DetailItem
//                                         label="OSCA ID Number"
//                                         value={
//                                             person.seniorcitizen.osca_id_number
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="Is Pensioner"
//                                         value={
//                                             person.seniorcitizen.is_pensioner
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="Pension Type"
//                                         value={
//                                             person.seniorcitizen.pension_type
//                                         }
//                                     />
//                                     <DetailItem
//                                         label="Living Alone"
//                                         value={
//                                             person.seniorcitizen.living_alone
//                                                 ? "Yes"
//                                                 : "No"
//                                         }
//                                     />
//                                 </div>
//                             ) : (
//                                 <EmptyState message="No senior info available." />
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export const personDetailTitle = "Resident Details";

import { useMemo, useState } from "react";
import { FaPhone, FaEnvelope, FaHeart } from "react-icons/fa";
import { FaLocationDot, FaPeopleGroup } from "react-icons/fa6";
import { IoBookSharp, IoPerson } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { RiWheelchairFill } from "react-icons/ri";
import { HeartPulse } from "lucide-react";
import * as CONSTANTS from "@/constants";

function DetailItem({ label, value, className = "" }) {
    return (
        <div
            className={`grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 ${className}`}
        >
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </span>
            <span className="text-sm text-slate-800 break-words">
                {value || (
                    <span className="italic text-slate-400">Not available</span>
                )}
            </span>
        </div>
    );
}

function InfoCard({ icon, title, children }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <span className="text-blue-700 text-lg">{icon}</span>
                <h3 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
                    {title}
                </h3>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
                {value || "N/A"}
            </p>
        </div>
    );
}

function TabButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={[
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function EmptyState({ message }) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm italic text-slate-500">
            {message}
        </div>
    );
}

export default function PersonDetailContent({ person, deceased = false }) {
    const [activeTab, setActiveTab] = useState("education");

    if (!person) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                No data found.
            </div>
        );
    }

    function calculateAge(birthdate) {
        if (!birthdate) return "N/A";
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }

    function formatCardNumber(number) {
        if (!number) return "";
        return number.replace(/(\d{4})(?=\d)/g, "$1-");
    }

    const fullName = useMemo(() => {
        return [
            person.lastname + ",",
            person.firstname,
            person.middlename,
            person.suffix,
        ]
            .filter(Boolean)
            .join(" ");
    }, [person]);

    const fullAddress = useMemo(() => {
        return [
            person.street?.street_name,
            person.purok_number ? `Purok ${person.purok_number}` : null,
            person.barangay?.barangay_name,
            person.barangay?.city,
        ]
            .filter(Boolean)
            .join(", ");
    }, [person]);

    const tabs = [
        { key: "education", label: "Education" },
        { key: "occupation", label: "Occupation" },
        { key: "medical", label: "Medical" },
        { key: "social", label: "Social Welfare" },
        ...(person.seniorcitizen
            ? [{ key: "senior", label: "Senior Citizen" }]
            : []),
    ];

    return (
        <div className="w-full space-y-5 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg">
            {deceased && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 shadow-sm">
                    <HeartPulse className="mt-0.5 h-5 w-5 text-red-500" />
                    <div>
                        <p className="text-sm font-bold text-red-700">
                            Deceased Resident
                        </p>
                        <p className="text-sm text-red-600">
                            This record is marked as deceased and is maintained
                            for documentation purposes.
                        </p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <img
                        src={
                            person?.resident_picture_path == null
                                ? "/images/default-avatar.jpg"
                                : `/storage/${person.resident_picture_path}`
                        }
                        alt={`${person?.firstname}'s photo`}
                        className="h-24 w-24 rounded-2xl object-cover border-4 border-slate-100 shadow-sm"
                    />

                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold text-slate-900">
                            {fullName}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Resident Information Overview
                        </p>

                        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 md:flex-row md:flex-wrap md:items-center md:gap-4">
                            <div className="flex items-center gap-2">
                                <FaEnvelope className="text-blue-600" />
                                <span>
                                    {person.email || "No email provided"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaPhone className="text-blue-600" />
                                <span>
                                    {person.contact_number ||
                                        "No contact number"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaLocationDot className="text-blue-600" />
                                <span>
                                    {fullAddress || "No address available"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <StatCard label="Gender" value={person.gender} />
                    <StatCard
                        label="Age"
                        value={calculateAge(person.birthdate)}
                    />
                    <StatCard
                        label="Civil Status"
                        value={person.civil_status}
                    />
                    <StatCard label="Nationality" value={person.citizenship} />
                </div>
            </div>

            {/* Personal Info */}
            <InfoCard title="Personal Information" icon={<IoPerson />}>
                <DetailItem label="Birthdate" value={person.birthdate} />
                <DetailItem label="Birthplace" value={person.birthplace} />
                <DetailItem label="Religion" value={person.religion} />
                <DetailItem label="Ethnicity" value={person.ethnicity} />
            </InfoCard>

            {/* Residency + Emergency */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InfoCard title="Residency" icon={<FaLocationDot />}>
                    <DetailItem label="Address" value={fullAddress} />
                    <DetailItem
                        label="Residency Type"
                        value={person.residency_type}
                    />
                    <DetailItem
                        label="Residency Date"
                        value={person.residency_date}
                    />
                </InfoCard>

                <InfoCard title="Emergency Contact" icon={<FaPhone />}>
                    <DetailItem
                        label="Name"
                        value={
                            person.medical_information?.emergency_contact_name
                        }
                    />
                    <DetailItem
                        label="Contact No."
                        value={
                            person.medical_information?.emergency_contact_number
                        }
                    />
                    <DetailItem
                        label="Relationship"
                        value={
                            person.medical_information
                                ?.emergency_contact_relationship
                        }
                    />
                </InfoCard>
            </div>

            {/* Tabs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.key}
                            active={activeTab === tab.key}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </TabButton>
                    ))}
                </div>

                <div className="mt-5">
                    {activeTab === "education" && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-700">
                                <IoBookSharp />
                                <h3 className="text-base font-bold">
                                    Education History
                                </h3>
                            </div>

                            {Array.isArray(person.educational_histories) &&
                            person.educational_histories.length > 0 ? (
                                person.educational_histories.map(
                                    (edu, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                        >
                                            <div className="space-y-3">
                                                <DetailItem
                                                    label="Attainment"
                                                    value={
                                                        CONSTANTS
                                                            .EDUCATION_LEVEL_TEXT[
                                                            edu
                                                                .educational_attainment
                                                        ]
                                                    }
                                                />
                                                <DetailItem
                                                    label="Status"
                                                    value={edu.education_status}
                                                />
                                                <DetailItem
                                                    label="School"
                                                    value={edu.school_name}
                                                />
                                                <DetailItem
                                                    label="Type"
                                                    value={edu.school_type}
                                                />
                                                {edu.program && (
                                                    <DetailItem
                                                        label="Program"
                                                        value={edu.program}
                                                    />
                                                )}
                                                <DetailItem
                                                    label="School Years"
                                                    value={`${edu.year_started || ""} – ${edu.year_ended || "Present"}`}
                                                />
                                            </div>
                                        </div>
                                    ),
                                )
                            ) : (
                                <EmptyState message="No education records available." />
                            )}
                        </div>
                    )}

                    {activeTab === "occupation" && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-700">
                                <MdWork />
                                <h3 className="text-base font-bold">
                                    Occupation History
                                </h3>
                            </div>

                            {Array.isArray(person.occupations) &&
                            person.occupations.length > 0 ? (
                                person.occupations.map((job, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div className="space-y-3">
                                            <DetailItem
                                                label="Occupation"
                                                value={job.occupation}
                                            />
                                            <DetailItem
                                                label="Status"
                                                value={job.occupation_status}
                                            />
                                            <DetailItem
                                                label="Employer"
                                                value={job.employer || "N/A"}
                                            />
                                            <DetailItem
                                                label="Type"
                                                value={
                                                    CONSTANTS
                                                        .EMPLOYMENT_TYPE_TEXT[
                                                        job.employment_type
                                                    ]
                                                }
                                            />
                                            <DetailItem
                                                label="Monthly Income"
                                                value={job.monthly_income}
                                            />
                                            <DetailItem
                                                label="Work Arrangement"
                                                value={job.work_arrangement}
                                            />
                                            <DetailItem
                                                label="Years Active"
                                                value={`${job.started_at || "N/A"} – ${job.ended_at || "Present"}`}
                                            />
                                            <DetailItem
                                                label="OFW"
                                                value={
                                                    job.is_ofw === 1
                                                        ? "Yes"
                                                        : "No"
                                                }
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState message="No occupation records available." />
                            )}
                        </div>
                    )}

                    {activeTab === "medical" && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-700">
                                <FaHeart />
                                <h3 className="text-base font-bold">
                                    Medical Information
                                </h3>
                            </div>

                            {person.medical_information ? (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                    <DetailItem
                                        label="Blood Type"
                                        value={
                                            person.medical_information
                                                .blood_type
                                        }
                                    />
                                    <DetailItem
                                        label="BMI"
                                        value={person.medical_information.bmi}
                                    />
                                    <DetailItem
                                        label="Height (cm)"
                                        value={
                                            person.medical_information.height_cm
                                        }
                                    />
                                    <DetailItem
                                        label="Weight (kg)"
                                        value={
                                            person.medical_information.weight_kg
                                        }
                                    />
                                    <DetailItem
                                        label="Nutrition Status"
                                        value={
                                            CONSTANTS.BMI_STATUS[
                                                person.medical_information
                                                    .nutrition_status
                                            ]
                                        }
                                    />
                                    <DetailItem
                                        label="Smoker"
                                        value={
                                            person.medical_information.is_smoker
                                                ? "Yes"
                                                : "No"
                                        }
                                    />
                                    <DetailItem
                                        label="Alcohol User"
                                        value={
                                            person.medical_information
                                                .is_alcohol_user
                                                ? "Yes"
                                                : "No"
                                        }
                                    />
                                    <DetailItem
                                        label="Is PWD"
                                        value={person.is_pwd ? "Yes" : "No"}
                                    />
                                </div>
                            ) : (
                                <EmptyState message="No medical info available." />
                            )}

                            {person.is_pwd === 1 && (
                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <div className="mb-3 flex items-center gap-2 text-blue-700">
                                        <RiWheelchairFill />
                                        <h4 className="text-sm font-bold">
                                            Disability Information
                                        </h4>
                                    </div>

                                    {person.disabilities?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {person.disabilities.map(
                                                (disability, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-full bg-blue-50 px-3 py-1 text-sm capitalize text-blue-700 border border-blue-100"
                                                    >
                                                        {
                                                            disability.disability_type
                                                        }
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <EmptyState message="No disabilities recorded." />
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "social" && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-700">
                                <FaPeopleGroup />
                                <h3 className="text-base font-bold">
                                    Social Welfare Profile
                                </h3>
                            </div>

                            {person.socialwelfareprofile ? (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                    <DetailItem
                                        label="4Ps Beneficiary"
                                        value={
                                            person.socialwelfareprofile
                                                .is_4ps_beneficiary
                                                ? "Yes"
                                                : "No"
                                        }
                                    />
                                    <DetailItem
                                        label="PhilHealth Beneficiary"
                                        value={
                                            person.medical_information
                                                ?.has_philhealth
                                                ? "Yes"
                                                : "No"
                                        }
                                    />
                                    {person.medical_information
                                        ?.has_philhealth === 1 && (
                                        <DetailItem
                                            label="PhilHealth ID"
                                            value={
                                                person.medical_information
                                                    ?.philhealth_id_number ||
                                                "N/A"
                                            }
                                        />
                                    )}
                                    <DetailItem
                                        label="Solo Parent"
                                        value={
                                            person.socialwelfareprofile
                                                .is_solo_parent
                                                ? "Yes"
                                                : "No"
                                        }
                                    />
                                    <DetailItem
                                        label="PhilSys Card Number"
                                        value={
                                            person.socialwelfareprofile
                                                .philsys_card_no
                                                ? formatCardNumber(
                                                      person
                                                          .socialwelfareprofile
                                                          .philsys_card_no,
                                                  )
                                                : ""
                                        }
                                    />
                                    {person.socialwelfareprofile
                                        .is_solo_parent === 1 && (
                                        <DetailItem
                                            label="Solo Parent ID"
                                            value={
                                                person.socialwelfareprofile
                                                    .solo_parent_id_number
                                            }
                                        />
                                    )}
                                </div>
                            ) : (
                                <EmptyState message="No social welfare info available." />
                            )}
                        </div>
                    )}

                    {activeTab === "senior" && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-700">
                                <IoPerson />
                                <h3 className="text-base font-bold">
                                    Senior Citizen Information
                                </h3>
                            </div>

                            {person.seniorcitizen ? (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                    <DetailItem
                                        label="OSCA ID Number"
                                        value={
                                            person.seniorcitizen.osca_id_number
                                        }
                                    />
                                    <DetailItem
                                        label="Is Pensioner"
                                        value={
                                            person.seniorcitizen.is_pensioner
                                        }
                                    />
                                    <DetailItem
                                        label="Pension Type"
                                        value={
                                            person.seniorcitizen.pension_type
                                        }
                                    />
                                    <DetailItem
                                        label="Living Alone"
                                        value={
                                            person.seniorcitizen.living_alone
                                                ? "Yes"
                                                : "No"
                                        }
                                    />
                                </div>
                            ) : (
                                <EmptyState message="No senior info available." />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export const personDetailTitle = "Resident Details";
