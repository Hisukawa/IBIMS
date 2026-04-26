import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import Section5 from "@/Components/ResidentInput/Section5";
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

export default function Edit({
    auth,
    puroks,
    streets,
    barangays,
    residents,
    household,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Households",
            href: route("household.index"),
            showOnMobile: false,
        },
        { label: "Edit Household", showOnMobile: true },
    ];
    const { error } = usePage().props.errors;
    const { data, setData, post, errors, reset } = useForm({
        resident_id: null,
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
        latitude: "",
        longitude: "",
        is_main_house: 1,
        pets: [],
        household_id: null,
        _method: "PUT",
    });
    useEffect(() => {
        if (!household) return;

        const latestHead = household.household_residents?.[0] ?? null;
        const resident = latestHead?.resident ?? null;

        setData({
            resident_id: resident?.id || null,
            resident_name: resident
                ? `${resident.firstname || ""} ${resident.middlename || ""} ${resident.lastname || ""}`.trim()
                : "",
            birthdate: resident?.birthdate || "",
            gender: resident?.gender || "",
            sex: resident?.gender || "",
            resident_image: resident?.resident_picture_path || null,

            purok_id: household.purok_id || null,
            street_id: household.street_id || null,
            street_name: household.street?.street_name || "",
            residency_date: resident?.residency_date || "",
            residency_type: resident?.residency_type || "",

            subdivision: household.subdivision || "",
            housenumber: household.house_number
                ? household.house_number.toString()
                : "",
            ownership_type: household.ownership_type || "",
            housing_condition: household.housing_condition || "",
            house_structure: household.house_structure || "",
            year_established: household.year_established || "",
            number_of_rooms: household.number_of_rooms || "",
            number_of_floors: household.number_of_floors || "",
            bath_and_wash_area: household.bath_and_wash_area || "",

            waste_management_types: household.waste_management_types?.map(
                (w) => ({
                    waste_management_type: w.waste_management_type,
                }),
            ) || [{ waste_management_type: "" }],

            toilets: household.toilets?.map((t) => ({
                toilet_type: t.toilet_type,
            })) || [{ toilet_type: "" }],

            electricity_types: household.electricity_types?.map((e) => ({
                electricity_type: e.electricity_type,
            })) || [{ electricity_type: "" }],

            water_source_types: household.water_source_types?.map((w) => ({
                water_source_type: w.water_source_type,
            })) || [{ water_source_type: "" }],

            type_of_internet:
                household.internet_accessibility?.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at),
                )[0]?.type_of_internet || null,

            relationship_to_head: latestHead?.relationship_to_head || "",
            household_position: latestHead?.household_position || "",
            name_of_head: resident
                ? `${resident.firstname || ""} ${resident.lastname || ""}`.trim()
                : "",

            has_livestock: household.livestocks?.length > 0 ? "1" : "0",
            livestocks: household.livestocks || [],

            has_pets: household.pets?.length > 0 ? "1" : "0",
            pets: household.pets || [],

            household_id: household.id,
            latitude: household.latitude ?? "",
            longitude: household.longitude ?? "",
            is_main_house: household.is_main_house ?? 1,

            _method: "PUT",
        });
    }, [household]);
    const handleResidentChange = useResidentChangeHandler(residents, setData);

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("household.update", data.household_id), {
            //onFinish: () => reset(),
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
                    {/* <pre>{JSON.stringify(latestHead, undefined, 2)}</pre> */}
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className=" my-2 p-5">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <div>
                                <form onSubmit={onSubmit}>
                                    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    Household Head
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    You may keep the current
                                                    household head, select a new
                                                    one, or leave this empty and
                                                    assign a resident later.
                                                </p>
                                            </div>

                                            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
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
                                                    {data.resident_name
                                                        ? "Current selected household head."
                                                        : "No household head selected."}
                                                </p>
                                            </div>

                                            <div className="space-y-4 md:col-span-5">
                                                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                                                    <div>
                                                        <DropdownInputField
                                                            label="Select Household Head"
                                                            name="fullname"
                                                            value={
                                                                data.resident_name ||
                                                                ""
                                                            }
                                                            placeholder="Optional: search or select a resident"
                                                            onChange={(e) =>
                                                                handleResidentChange(
                                                                    e,
                                                                )
                                                            }
                                                            items={
                                                                residentsList
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.resident_id
                                                            }
                                                            className="mt-1"
                                                        />
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setData((prev) => ({
                                                                ...prev,
                                                                resident_id:
                                                                    null,
                                                                resident_name:
                                                                    "",
                                                                birthdate: "",
                                                                sex: "",
                                                                gender: "",
                                                                resident_image:
                                                                    null,
                                                                residency_date:
                                                                    "",
                                                                residency_type:
                                                                    "",
                                                                name_of_head:
                                                                    "",
                                                            }))
                                                        }
                                                    >
                                                        Clear
                                                    </Button>
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
                                                                data.sex ||
                                                                    data.gender ||
                                                                    ""
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
                                        handleArrayValues={handleArrayValues}
                                        errors={errors}
                                        puroks={puroks}
                                        streets={streets}
                                        households={[]}
                                        head={true}
                                    />
                                    {/* Submit Button */}
                                    <div className="flex w-full justify-end items-center mt-7 gap-4">
                                        <Button
                                            className="w-40 bg-blue-700 hover:bg-blue-400"
                                            type="submit"
                                        >
                                            Update
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
