import { useContext, useEffect, useState } from "react";
import { StepperContext } from "@/context/StepperContext";
import InputField from "@/Components/InputField";
import DropdownInputField from "../DropdownInputField";
import SelectField from "../SelectField";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";

const Address = ({ puroks, streets }) => {
    const { userData, setUserData, errors } = useContext(StepperContext);
    // const [latestHouseNumber, setLatestHouseNumber] = useState(null);
    const APP_URL = useAppUrl();
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "street") {
            const streetId = Number(value);
            const street = streets.find((s) => s.id === streetId);

            if (street) {
                setUserData((prev) => ({
                    ...prev,
                    street: street.id,
                    street_name: street.street_name,
                    purok_id: street.purok?.id || null,
                    purok: street.purok?.purok_number || "",
                }));
            }
            return;
        }

        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const purok_numbers = puroks.map((purok) => ({
        label: "Purok " + purok,
        value: purok.toString(),
    }));

    const streetList = streets.map((street) => ({
        label: street.street_name,
        value: street.id.toString(),
    }));

    useEffect(() => {
        const fetchLatestHouseNumber = async () => {
            try {
                const response = await axios.get(
                    `${APP_URL}/household/latest-house-number`
                );
                if (response.data.success) {
                    const latest = response.data.house_number;

                    // If no housenumber is set yet, auto-fill it
                    setUserData((prev) => ({
                        ...prev,
                        housenumber: prev.housenumber || latest,
                    }));
                } else {
                    toast.error("Failed to fetch latest house number");
                }
            } catch (error) {
                console.error("Error fetching house number:", error);
                toast.error("Error fetching latest house number", {
                    description: error.message,
                });
            }
        };

        fetchLatestHouseNumber();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                Household Address Information
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Please provide your complete address information to continue.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <InputField
                        type="text"
                        label="House/Unit No./Lot/Blk No."
                        name="housenumber"
                        value={userData.housenumber.toString() || ""}
                        onChange={handleChange}
                        placeholder="e.g., Lot 12 Blk 7 or Unit 3A"
                        required
                    />
                    {errors.housenumber && (
                        <p className="text-red-500 text-sm">
                            {errors.housenumber}
                        </p>
                    )}
                </div>

                <div>
                    <DropdownInputField
                        type="text"
                        label="Street Name"
                        name="street"
                        value={userData.street_name || ""}
                        onChange={handleChange}
                        placeholder="e.g., Rizal St., Mabini Avenue"
                        items={streetList}
                        required
                    />
                    {errors.street && (
                        <p className="text-red-500 text-sm">{errors.street}</p>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <InputField
                        type="text"
                        label="Subdivision/Village/Compound"
                        name="subdivision"
                        value={userData.subdivision || ""}
                        onChange={handleChange}
                        placeholder="e.g., Villa Gloria Subdivision"
                    />
                    {errors.subdivision && (
                        <p className="text-red-500 text-sm">
                            {errors.subdivision}
                        </p>
                    )}
                </div>

                <div>
                    <SelectField
                        type="text"
                        label="Purok/Zone/Sitio/Cabisera"
                        name="purok"
                        value={userData.purok || ""}
                        onChange={handleChange}
                        placeholder="e.g., Purok 5, Sitio Lupa"
                        items={purok_numbers}
                        required
                    />
                    {errors.purok && (
                        <p className="text-red-500 text-sm">{errors.purok}</p>
                    )}
                </div>

                {/* <InputField type="text" label="Barangay Name" name="barangay" value={userData.barangay || ''} onChange={handleChange} placeholder="e.g., San Felipe" />
                <InputField type="text" label="City" name="city" value={userData.city || ''} onChange={handleChange} placeholder="e.g., City of Ilagan" /> */}
            </div>

            {/* <div className="grid md:grid-cols-3 gap-4">
                <InputField type="text" label="Province" name="province" value={userData.province || ''} onChange={handleChange} placeholder="e.g., Isabela" />
                <InputField type="text" label="Region" name="region" value={userData.region || ''} onChange={handleChange} placeholder="Region II" />
                <InputField type="text" label="Zip Code" name="zip_code" value={userData.zip_code || ''} onChange={handleChange} placeholder="e.g., 3300" />
            </div> */}
        </div>
    );
};

export default Address;
