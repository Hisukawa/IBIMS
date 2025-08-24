import { useCallback } from "react";

export default function useResidentChangeHandler(residents, setData) {
    const handleResidentChange = useCallback(
        (e) => {
            const resident_id = Number(e.target.value);
            const resident = residents.find((r) => r.id === resident_id);
            if (resident) {
                setData("resident_id", resident.id);
                setData(
                    "resident_name",
                    `${resident.firstname} ${resident.middlename} ${
                        resident.lastname
                    } ${resident.suffix ?? ""}`
                );
                setData("purok_number", resident.purok_number);
                setData("birthdate", resident.birthdate);
                setData("resident_image", resident.resident_picture_path);
                setData("gender", resident.gender);
                setData("sex", resident.sex);
                setData("residency_date", resident.residency_date);
                setData("residency_type", resident.residency_type);
                setData("employment_status", resident.employment_status);
                setData("contact_number", resident.contact_number);
                setData("email", resident.email);
            }
        },
        [residents, setData]
    );

    return handleResidentChange;
}
