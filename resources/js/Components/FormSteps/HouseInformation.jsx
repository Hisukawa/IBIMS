import { useContext } from 'react';
import { StepperContext } from '@/context/StepperContext';
import DropdownInputField from '../DropdownInputField';
import RadioGroup from '../RadioGroup';
import YearDropdown from '../YearDropdown';
import InputField from '../InputField';
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

function HouseInformation() {
    const { userData, setUserData } = useContext(StepperContext);
    const livestocks = userData.livestocks || [];
    const pets = userData.pets || [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLivestockChange = (livestocksIndex, e) => {
        const { name, value } = e.target;
        const updatedLivestocks = [...livestocks];
        updatedLivestocks[livestocksIndex] = {
            ...updatedLivestocks[livestocksIndex],
            [name]: value
        };
        setUserData(prev => ({ ...prev, livestocks: updatedLivestocks }));
    };

    const addLivestocks = () => {
        const updatedLivestocks = [...livestocks, {}];
        setUserData(prev => ({ ...prev, livestocks: updatedLivestocks }));
    };

    const removeLivestocks = (livestockIndex) => {
        const updatedLivestocks = [...(userData.livestocks || [])];
        updatedLivestocks.splice(livestockIndex, 1);
        setUserData(prev => ({
            ...prev,
            livestocks: updatedLivestocks
        }));
    };

    const handlePetsChange = (petsIndex, e) => {
        const { name, value } = e.target;
        const updatedPets = [...pets];
        updatedPets[petsIndex] = { ...updatedPets[petsIndex], [name]: value };
        setUserData(prev => ({ ...prev, pets: updatedPets }));
    };

    const addPets = () => {
        const updatedPets = [...pets, {}];
        setUserData(prev => ({ ...prev, pets: updatedPets }));
    };

    const removePets = (petsIndex) => {
        const updatedPets = [...(userData.pets || [])];
        updatedPets.splice(petsIndex, 1);
        setUserData(prev => ({ ...prev, pets: updatedPets }));
    };

    // Add to dynamic field
    const addDynamicField = (field, defaultValue = {}) => {
        const currentArray = userData[field] || [];
        const updatedArray = [...currentArray, defaultValue];
        setUserData((prev) => ({ ...prev, [field]: updatedArray }));
    };

    // Remove from dynamic field
    const removeDynamicField = (field, index) => {
        const currentArray = [...(userData[field] || [])];
        currentArray.splice(index, 1);
        setUserData((prev) => ({ ...prev, [field]: currentArray }));
    };

    // Handle change in dynamic field
    const handleDynamicFieldChange = (field, index, e) => {
        const { name, value } = e.target;
        const currentArray = [...(userData[field] || [])];
        currentArray[index] = {
            ...currentArray[index],
            [name]: value,
        };
        setUserData((prev) => ({ ...prev, [field]: currentArray }));
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">House Information</h2>
            <p className="text-sm text-gray-600 mb-3">
                Please provide the necessary house information to continue.
            </p>

            <div className="grid md:grid-cols-4 gap-4">
                <DropdownInputField
                    label="Ownership Type"
                    name="ownership_type"
                    value={userData.ownership_type || ''}
                    onChange={handleChange}
                    placeholder="Select or enter ownership type"
                    items={[
                        { label: 'Owned', value: 'owned' },
                        { label: 'Rented', value: 'rented' },
                        { label: 'Shared', value: 'shared' },
                        { label: 'Government-provided', value: 'government_provided' },
                        { label: 'Inherited', value: 'inherited' },
                    ]}

                />
                <DropdownInputField
                    label="Housing Condition"
                    name="housing_condition"
                    value={userData.housing_condition || ''}
                    onChange={handleChange}
                    placeholder="Select house condition"
                    items={[
                        { label: 'Good', value: 'good' },
                        { label: 'Needs Repair', value: 'needs_repair' },
                        { label: 'Dilapidated', value: 'dilapidated' },
                    ]}

                />
                <DropdownInputField
                    label="House Structure"
                    name="house_structure"
                    value={userData.house_structure}
                    onChange={handleChange}
                    placeholder="Select or Enter house structure"
                    items={[
                        { label: 'Concrete', value: 'concrete' },
                        { label: 'Semi-concrete', value: 'semi_concrete' },
                        { label: 'Wood', value: 'wood' },
                        { label: 'Makeshift', value: 'makeshift' },
                    ]}

                />
                <YearDropdown
                    label="Year Establish"
                    name="year_establish"
                    value={userData.year_establish}
                    onChange={handleChange}
                    placeholder="Select year"
                />
                <InputField
                    type="number"
                    label="Number of Rooms"
                    name="number_of_rooms"
                    value={userData.number_of_rooms || ''}
                    onChange={handleChange}
                    placeholder="Enter number of rooms"
                />
                <InputField
                    type="number"
                    label="Number of Floors"
                    name="number_of_floors"
                    value={userData.number_of_floors || ''}
                    onChange={handleChange}
                    placeholder="Enter number of floors"
                />


                <DropdownInputField
                    label="Bath and Wash Area"
                    name="bath_and_wash_area"
                    value={userData.bath_and_wash_area || ''}
                    onChange={handleChange}
                    placeholder="Select or Enter"
                    items={[
                        { label: 'With own sink and bath', value: 'with_own_sink_and_bath' },
                        { label: 'With own sink only', value: 'with_own_sink_only' },
                        { label: 'With own bath only', value: 'with_own_bath_only' },
                        { label: 'Shared or communal', value: 'shared_or_communal' },
                        { label: 'None', value: 'none' }
                    ]}
                />


                <DropdownInputField
                    label="Internet Connection Type"
                    name="type_of_internet"
                    value={userData.type_of_internet || ''}
                    onChange={handleChange}
                    placeholder="Select internet connection type"
                    items={[
                        { label: 'Mobile Data', value: 'mobile_data' },
                        { label: 'Wireless Fidelity (Wi-Fi)', value: 'wireless_fidelity' },
                        { label: 'None', value: 'none' }
                    ]}
                />
                {/* Toilets */}
                <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-0 mt-4">
                        Type of Toilet(s)
                    </label>
                    <div className="flex flex-col gap-2">
                        {(userData.toilets || []).map((toilet, idx) => (
                            <div key={idx} className="flex items-center gap-2 w-full">
                                <DropdownInputField
                                    name="toilet_type"
                                    value={toilet.toilet_type || ""}
                                    onChange={(e) => handleDynamicFieldChange("toilets", idx, e)}
                                    placeholder="Select or enter toilet type"
                                    items={[
                                        { label: "Water sealed", value: "water_sealed" },
                                        { label: "Compost pit toilet", value: "compost_pit_toilet" },
                                        { label: "Shared communal public toilet", value: "shared_communal_public_toilet" },
                                        { label: "Shared or communal", value: "shared_or_communal" },
                                        { label: "No latrine", value: "no_latrine" },
                                    ]}
                                />
                                {userData.toilets.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDynamicField("toilets", idx)}
                                        className="text-red-500 hover:text-red-700 text-xl"
                                    >
                                        <IoIosCloseCircleOutline />
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="flex items-center gap-2 mt-3">
                            <button
                                type="button"
                                onClick={() => addDynamicField("toilets", { toilet_type: "" })}
                                className="text-blue-600 hover:text-blue-800 text-3xl"
                            >
                                <IoIosAddCircleOutline />
                            </button>
                            <span className="text-sm text-gray-600">Add another type of toilet</span>
                        </div>
                    </div>
                </div>

                {/* Electricity */}
                <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-0 mt-4">
                        Electricity Source(s)
                    </label>
                    <div className="flex flex-col gap-2">
                        {(userData.electricity_types || []).map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-2 w-full">
                                <DropdownInputField
                                    name="electricity_type"
                                    value={entry.electricity_type || ""}
                                    onChange={(e) => handleDynamicFieldChange("electricity_types", idx, e)}
                                    placeholder="Select electricity source"
                                    items={[
                                        { label: "ISELCO II", value: "distribution_company_iselco_ii" },
                                        { label: "Generator", value: "generator" },
                                        { label: "Solar / Renewable", value: "solar_renewable_energy_source" },
                                        { label: "Battery", value: "battery" },
                                        { label: "None", value: "none" },
                                    ]}
                                />
                                {userData.electricity_types.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDynamicField("electricity_types", idx)}
                                        className="text-red-500 hover:text-red-700 text-xl"
                                    >
                                        <IoIosCloseCircleOutline />
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="flex items-center gap-2 mt-3">
                            <button
                                type="button"
                                onClick={() => addDynamicField("electricity_types", { electricity_type: "" })}
                                className="text-blue-600 hover:text-blue-800 text-3xl"
                            >
                                <IoIosAddCircleOutline />
                            </button>
                            <span className="text-sm text-gray-600">Add electricity source</span>
                        </div>
                    </div>
                </div>

                {/* Water Source */}
                <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-0 mt-4">
                        Water Source(s)
                    </label>
                    <div className="flex flex-col gap-2">
                        {(userData.water_source_types || []).map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-2 w-full">
                                <DropdownInputField
                                    name="water_source_type"
                                    value={entry.water_source_type || ""}
                                    onChange={(e) => handleDynamicFieldChange("water_source_types", idx, e)}
                                    placeholder="Select water source"
                                    items={[
                                        { label: "Level II", value: "level_ii_water_system" },
                                        { label: "Level III", value: "level_iii_water_system" },
                                        { label: "Deep Well", value: "deep_well_level_i" },
                                        { label: "Artesian Well", value: "artesian_well_level_i" },
                                        { label: "Shallow Well", value: "shallow_well_level_i" },
                                        { label: "Refill Source", value: "commercial_water_refill_source" },
                                        { label: "None", value: "none" },
                                    ]}
                                />
                                {userData.water_source_types.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDynamicField("water_source_types", idx)}
                                        className="text-red-500 hover:text-red-700 text-xl"
                                    >
                                        <IoIosCloseCircleOutline />
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="flex items-center gap-2 mt-3">
                            <button
                                type="button"
                                onClick={() => addDynamicField("water_source_types", { water_source_type: "" })}
                                className="text-blue-600 hover:text-blue-800 text-3xl"
                            >
                                <IoIosAddCircleOutline />
                            </button>
                            <span className="text-sm text-gray-600">Add water source</span>
                        </div>
                    </div>
                </div>

                {/* Waste Management */}
                <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-0 mt-4">
                        Waste Disposal Method(s)
                    </label>
                    <div className="flex flex-col gap-2">
                        {(userData.waste_management_types || []).map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-2 w-full">
                                <DropdownInputField
                                    name="waste_management_type"
                                    value={entry.waste_management_type || ""}
                                    onChange={(e) => handleDynamicFieldChange("waste_management_types", idx, e)}
                                    placeholder="Select waste disposal method"
                                    items={[
                                        { label: "Open Dump", value: "open_dump_site" },
                                        { label: "Sanitary Landfill", value: "sanitary_landfill" },
                                        { label: "Compost Pits", value: "compost_pits" },
                                        { label: "Material Recovery", value: "material_recovery_facility" },
                                        { label: "Garbage Collected", value: "garbage_is_collected" },
                                        { label: "None", value: "none" },
                                    ]}
                                />
                                {userData.waste_management_types.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDynamicField("waste_management_types", idx)}
                                        className="text-red-500 hover:text-red-700 text-xl"
                                    >
                                        <IoIosCloseCircleOutline />
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="flex items-center gap-2 mt-3">
                            <button
                                type="button"
                                onClick={() => addDynamicField("waste_management_types", { waste_management_type: "" })}
                                className="text-blue-600 hover:text-blue-800 text-3xl"
                            >
                                <IoIosAddCircleOutline />
                            </button>
                            <span className="text-sm text-gray-600">Add waste disposal method</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* livestock info */}
                <div>
                    <div>
                        <hr className="h-[2px] bg-sky-500 border-0 mt-7" />
                        <p className="font-bold text-lg mt-3 text-gray-800">Livestock Ownership Details</p>
                    </div>
                    <div className="grid md:grid-cols-1 gap-4">
                        <div>
                            <RadioGroup
                                label="Do you have a livestock?"
                                name="has_livestock"
                                options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                selectedValue={userData.has_livestock || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            {userData.has_livestock == 1 ? (
                                <>
                                    {livestocks.length === 0 && (
                                        <p className="text-sm text-gray-500 italic mt-2">No livestock added yet.</p>
                                    )}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {livestocks.map((livestock, livIndex) => (
                                            <div
                                                key={livIndex}
                                                className="relative mb-4 p-4 bg-sky-100 border rounded-md"
                                            >
                                                <DropdownInputField
                                                    label="Livestock animal"
                                                    name="livestock_type"
                                                    value={livestock.livestock_type || ''}
                                                    onChange={(e) => handleLivestockChange(livIndex, e)}
                                                    placeholder="Select or enter type of animal"
                                                    items={['cattle', 'carabao', 'goat', 'pig', 'chicken', 'duck', 'sheep', 'horse']}
                                                />
                                                <InputField
                                                    label="Quantity"
                                                    name="quantity"
                                                    value={livestock.quantity || ''}
                                                    onChange={(e) => handleLivestockChange(livIndex, e)}
                                                    placeholder="Enter quantity"
                                                    type="number"
                                                />
                                                <DropdownInputField
                                                    label="Purpose"
                                                    name="purpose"
                                                    value={livestock.purpose || ''}
                                                    onChange={(e) => handleLivestockChange(livIndex, e)}
                                                    placeholder="Select purpose"
                                                    items={[{ label: 'Personal Consumption', value: 'personal_consumption' },
                                                    { label: 'Commercial', value: 'commercial' },
                                                    { label: 'Both', value: "both" }]}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeLivestocks(livIndex)}
                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl"
                                                    title="Remove livestock"
                                                >
                                                    <IoIosCloseCircleOutline className="text-2xl" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addLivestocks}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base mt-2 font-medium"
                                        title="Add livestock"
                                    >
                                        <IoIosAddCircleOutline className="text-2xl" />
                                        Add Livestock
                                    </button>
                                </>
                            ) : userData.has_livestock == 0 ? (
                                <p className="text-sm text-gray-500 italic mt-2">No livestock declared.</p>
                            ) : null}

                        </div>
                    </div>
                </div>
                {/* pets info */}
                <div>
                    <div>
                        <hr className="h-[2px] bg-sky-500 border-0 mt-7" />
                        <p className="font-bold text-md mt-3 text-gray-800">Pet Ownership Details</p>
                    </div>
                    <div className="grid md:grid-cols-1 gap-4">
                        <div>
                            <RadioGroup
                                label="Do you have a Pets?"
                                name="has_pets"
                                options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                selectedValue={userData.has_pets || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            {userData.has_pets == 1 ? (
                                <>
                                    {pets.length === 0 && (
                                        <p className="text-sm text-gray-500 italic mt-2">No pet added yet.</p>
                                    )}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {pets.map((pet, petIndex) => (
                                            <div key={petIndex} className="relative mb-4 p-4 bg-sky-100 border rounded-md"  >
                                                <DropdownInputField
                                                    label="Type of Pet"
                                                    name="pet_type"
                                                    value={pet.pet_type || ''}
                                                    onChange={(e) => handlePetsChange(petIndex, e)}
                                                    placeholder="Select or enter type of pet"
                                                    items={['dog', 'cat', 'rabbit']}
                                                />
                                                <RadioGroup
                                                    label="Is the pet vaccinated for rabies?"
                                                    name="is_vaccinated"
                                                    options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                                    selectedValue={pet.is_vaccinated || ''}
                                                    onChange={(e) => handlePetsChange(petIndex, e)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePets(petIndex)}
                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl"
                                                    title="Remove pet"
                                                >
                                                    <IoIosCloseCircleOutline className="text-2xl" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addPets}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base mt-2 font-medium"
                                            title="Add pet"
                                        >
                                            <IoIosAddCircleOutline className="text-2xl" />
                                            Add Pet
                                        </button>
                                    </div>
                                </>
                            ) : userData.has_pets == 0 ? (
                                <p className="text-sm text-gray-500 italic mt-2">No pet declared.</p>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default HouseInformation;
