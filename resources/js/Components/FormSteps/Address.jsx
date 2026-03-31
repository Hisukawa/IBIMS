import { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import InputField from "@/Components/InputField";
import DropdownInputField from "../DropdownInputField";
import SelectField from "../SelectField";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";

const Address = ({ puroks, streets }) => {
    const { userData, setUserData, errors } = useContext(StepperContext);
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
        label: `Purok ${purok}`,
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
                    `${APP_URL}/household/latest-house-number`,
                );

                if (response.data.success) {
                    const latest = response.data.house_number;

                    setUserData((prev) => ({
                        ...prev,
                        housenumber: prev.housenumber || latest,
                    }));
                }
            } catch (error) {
                console.error("Error fetching house number:", error);
            }
        };

        fetchLatestHouseNumber();
    }, [APP_URL, setUserData]);

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
                        Household Address Information
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                        Enter the complete household address details below to
                        continue the registration process.
                    </p>
                </div>

                <div className="space-y-8 px-6 py-6">
                    <div>
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Primary Address Details
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Provide the exact house number and street name.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                <InputField
                                    type="text"
                                    label="House/Unit No./Lot/Blk No."
                                    name="housenumber"
                                    value={userData.housenumber || ""}
                                    onChange={handleChange}
                                    placeholder="e.g., Lot 12 Blk 7 or Unit 3A"
                                    required
                                />
                                {errors.housenumber && (
                                    <p className="mt-2 text-sm font-medium text-red-500">
                                        {errors.housenumber}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                <DropdownInputField
                                    type="text"
                                    label="Street Name"
                                    name="street"
                                    value={userData.street_name || ""}
                                    onChange={handleChange}
                                    placeholder="e.g., Rizal St., Mabini Avenue"
                                    items={streetList}
                                />
                                {errors.street && (
                                    <p className="mt-2 text-sm font-medium text-red-500">
                                        {errors.street}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-2">
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Additional Location Details
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Add subdivision and purok information for a more
                                complete address.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                <InputField
                                    type="text"
                                    label="Subdivision/Village/Compound"
                                    name="subdivision"
                                    value={userData.subdivision || ""}
                                    onChange={handleChange}
                                    placeholder="e.g., Villa Gloria Subdivision"
                                />
                                {errors.subdivision && (
                                    <p className="mt-2 text-sm font-medium text-red-500">
                                        {errors.subdivision}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                <SelectField
                                    type="text"
                                    label="Purok/Zone/Sitio/Cabisera"
                                    name="purok"
                                    value={userData.purok || ""}
                                    onChange={handleChange}
                                    placeholder="Select purok"
                                    items={purok_numbers}
                                    required
                                />
                                {errors.purok && (
                                    <p className="mt-2 text-sm font-medium text-red-500">
                                        {errors.purok}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
                        <p className="text-sm text-slate-500">
                            Make sure the address details are accurate to avoid
                            duplicate household records and ensure proper
                            mapping.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Address;
