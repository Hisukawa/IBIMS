import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import { Button } from "@/Components/ui/button";
import {
    RESIDENT_GENDER_TEXT2,
    RESIDENT_RECIDENCY_TYPE_TEXT,
} from "@/constants";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import { RotateCcw } from "lucide-react";
import HouseForm from "./Partials/HouseForm";

export default function Create({
    auth,
    puroks,
    streets,
    barangays,
    residents,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Households",
            href: route("household.index"),
            showOnMobile: false,
        },
        { label: "Create a Household", showOnMobile: true },
    ];
    const { error } = usePage().props.errors;
    const { data, setData, post, errors, reset } = useForm({
        resident_id: null,
        is_main_house: 1,
        resident_name: "",
        birthdate: "",
        gender: "",
        resident_image: null,
        purok_id: null,
        street_id: null,
        street_name: null,
        residency_date: null,
        residency_type: null,
        subdivision: "",
        housenumber: null,
        latitude: "",
        longitude: "",
        ownership_type: "",
        housing_condition: "",
        house_structure: null,
        year_established: null,
        number_of_rooms: null,
        number_of_floors: null,
        bath_and_wash_area: null,
        waste_management_types: [{ waste_management_type: "" }],
        toilets: [{ toilet_type: "" }],
        electricity_types: [{ electricity_type: "" }],
        water_source_types: [{ water_source_type: "" }],
        type_of_internet: null,
        relationship_to_head: "",
        household_position: "",
        name_of_head: "",
        has_livestock: null,
        livestocks: [],
        has_pets: null,
        pets: [],
    });
    const handleResidentChange = useResidentChangeHandler(residents, setData);

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("household.store"), {
            onSuccess: () => reset(),
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    const handleArrayValues = (e, index, column, array) => {
        const updated = [...(data[array] || [])];
        updated[index] = {
            ...updated[index],
            [column]: e.target.value,
        };
        setData(array, updated);
    };

    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* <pre>{JSON.stringify(residents, undefined, 2)}</pre> */}
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className=" my-2 p-5">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <div>
                                <form onSubmit={onSubmit}>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-4">
                                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    Household Head
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    You may select a household
                                                    head now, or add residents
                                                    to this household later.
                                                </p>
                                            </div>

                                            <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                Optional
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
                                            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-1">
                                                <InputLabel
                                                    htmlFor="resident_image"
                                                    value="Profile Photo"
                                                />

                                                <img
                                                    src={
                                                        data.resident_image
                                                            ? `/storage/${data.resident_image}`
                                                            : "/images/default-avatar.jpg"
                                                    }
                                                    alt="Resident"
                                                    className="mt-3 h-28 w-28 rounded-full border-4 border-white object-cover shadow-sm ring-1 ring-slate-200"
                                                />

                                                <p className="mt-3 text-center text-xs text-slate-500">
                                                    Image updates after
                                                    selecting a resident.
                                                </p>
                                            </div>

                                            <div className="space-y-4 md:col-span-5">
                                                <div>
                                                    <DropdownInputField
                                                        label="Select Household Head"
                                                        name="fullname"
                                                        value={
                                                            data.resident_name ||
                                                            ""
                                                        }
                                                        placeholder="Search or select a resident"
                                                        onChange={(e) =>
                                                            handleResidentChange(
                                                                e,
                                                            )
                                                        }
                                                        items={residentsList}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.resident_id
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                                    <InputField
                                                        label="Birthdate"
                                                        name="birthdate"
                                                        value={
                                                            data.birthdate || ""
                                                        }
                                                        placeholder="Auto-filled"
                                                        readOnly
                                                    />

                                                    <InputField
                                                        label="Sex"
                                                        name="sex"
                                                        value={
                                                            RESIDENT_GENDER_TEXT2[
                                                                data.sex || ""
                                                            ] || ""
                                                        }
                                                        placeholder="Auto-filled"
                                                        readOnly
                                                    />

                                                    <InputField
                                                        label="Residency Date"
                                                        name="residency_date"
                                                        value={
                                                            data.residency_date ||
                                                            ""
                                                        }
                                                        placeholder="Auto-filled"
                                                        readOnly
                                                    />

                                                    <InputField
                                                        label="Residency Type"
                                                        name="residency_type"
                                                        value={
                                                            RESIDENT_RECIDENCY_TYPE_TEXT[
                                                                data.residency_type ||
                                                                    ""
                                                            ] || ""
                                                        }
                                                        placeholder="Auto-filled"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <HouseForm
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        handleArrayValues={handleArrayValues}
                                        puroks={puroks}
                                        streets={streets}
                                        households={[]}
                                        head={true}
                                    />
                                    {/* Submit Button */}
                                    <div className="flex w-full justify-end items-center mt-7 gap-4">
                                        <Button
                                            type="button"
                                            onClick={() => reset()}
                                        >
                                            <RotateCcw /> Reset
                                        </Button>
                                        <Button
                                            className="w-40 bg-blue-700 hover:bg-blue-400"
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
