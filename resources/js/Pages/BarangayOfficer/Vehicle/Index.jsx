import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    SquarePen,
    Trash2,
    SquarePlus,
    MoveRight,
    RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import {
    VEHICLE_CLASS_TEXT,
    VEHICLE_USAGE_TEXT,
    VEHICLE_USAGE_STYLES,
} from "@/constants";
import SidebarModal from "@/Components/SidebarModal";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import InputLabel from "@/Components/InputLabel";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import RadioGroup from "@/Components/RadioGroup";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";

export default function Index({
    vehicles,
    vehicle_types,
    puroks,
    queryParams,
    residents,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Vehicles", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [modalState, setModalState] = useState(null);
    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [residentToDelete, setResidentToDelete] = useState(null); //delete

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: null,
        purok_number: null,
        has_vehicle: null,
        vehicles: [[]],
        vehicle_id: null,
        _method: undefined,
    });
    const handleResidentChange = useResidentChangeHandler(residents, setData);

    const handleArrayValues = (e, index, column, array) => {
        const updated = [...(data[array] || [])];
        updated[index] = {
            ...updated[index],
            [column]: e.target.value,
        };
        setData(array, updated);
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchFieldName("name", query);
    };
    const searchFieldName = (field, value) => {
        if (value && value.trim() !== "") {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        if (queryParams.page) {
            delete queryParams.page;
        }
        router.get(route("vehicle.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };
    const addVehicle = () => {
        setData("vehicles", [...(data.vehicles || []), {}]);
    };
    const removeVehicle = (vehicleIndex) => {
        const updated = [...(data.vehicles || [])];
        updated.splice(vehicleIndex, 1);
        setData("vehicles", updated);
        toast.warning("Vehicle removed.", {
            duration: 2000,
        });
    };
    const allColumns = [
        { key: "id", label: "Vehicle ID" },
        { key: "name", label: "Owner Name" },
        { key: "vehicle_type", label: "Vehicle Type" },
        { key: "vehicle_class", label: "Class" },
        { key: "usage_status", label: "Usage" },
        { key: "is_registered", label: "Is Registered?" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["purok", "v_type", "v_class", "usage"].includes(key) &&
            value &&
            value !== ""
    );

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const toggleShowFilters = () => setShowFilters((prev) => !prev);

    const handlePrint = () => {
        window.print();
    };

    const columnRenderers = {
        id: (row) => row.vehicle_id,

        name: (row) => (
            <span>
                {row.firstname} {row.middlename ?? ""} {row.lastname}{" "}
                {row.suffix ?? ""}
            </span>
        ),

        vehicle_type: (row) => (
            <span className="capitalize">{row.vehicle_type}</span>
        ),

        vehicle_class: (row) => VEHICLE_CLASS_TEXT[row.vehicle_class],

        usage_status: (row) => {
            const statusLabel = VEHICLE_USAGE_TEXT[row.usage_status];
            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        VEHICLE_USAGE_STYLES[row.usage_status]
                    }`}
                >
                    {statusLabel}
                </span>
            );
        },

        is_registered: (row) =>
            row.is_registered ? (
                <span className="text-green-600 font-medium">Yes</span>
            ) : (
                <span className="text-gray-500 font-medium">No</span>
            ),

        purok_number: (row) => row.purok_number,
        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(row.vehicle_id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.vehicle_id),
                    },
                ]}
            />
        ),
    };
    const handleAddVehicle = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    const onStoreSubmit = (e) => {
        e.preventDefault();
        post(route("vehicle.store"), {
            onError: (error) => console.log(error),
        });
    };

    const onUpdateSubmit = (e) => {
        e.preventDefault();
        post(route("vehicle.update", data.vehicle_id), {
            onError: (error) => console.log(error),
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState(null);
        setVehicleDetails(null);
        reset(); // Reset form data
        clearErrors(); // Clear validation errors
    };

    const handleEdit = async (id) => {
        setModalState("add");
        try {
            const response = await axios.get(
                `${APP_URL}/barangay_officer/vehicle/details/${id}`
            );
            const vehicle = response.data.vehicle;
            setVehicleDetails(vehicle);
            setData({
                resident_id: vehicle.resident.id,
                resident_name: `${vehicle.resident.firstname} ${
                    vehicle.resident.middlename ?? ""
                } ${vehicle.resident.lastname}`,
                resident_image: vehicle.resident.image ?? null,
                birthdate: vehicle.resident.birthdate ?? null,
                purok_number: vehicle.resident.purok_number ?? null,
                vehicles: [
                    {
                        usage_status: vehicle.usage_status || "",
                        vehicle_class: vehicle.vehicle_class || "",
                        vehicle_status: vehicle.vehicle_status || "",
                        vehicle_type: vehicle.vehicle_type || "",
                        is_registered: vehicle.is_registered
                            ? vehicle.is_registered.toString()
                            : "",
                    },
                ],
                _method: "PUT",
                vehicle_id: vehicle.id,
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching occupation details:", error);
        }
    };

    const handleDeleteClick = (id) => {
        setResidentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("vehicle.destroy", residentToDelete));
        setIsDeleteModalOpen(false);
    };

    useEffect(() => {
        if (success) {
            handleModalClose();
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.success = null;
    }, [success]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                description: "Operation failed!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.error = null;
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Vehicles" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(vehicles, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DynamicTableControls
                                        allColumns={allColumns}
                                        visibleColumns={visibleColumns}
                                        setVisibleColumns={setVisibleColumns}
                                        onPrint={handlePrint}
                                        showFilters={showFilters}
                                        toggleShowFilters={() =>
                                            setShowFilters((prev) => !prev)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex w-[300px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search Owners Name"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <div className="relative group z-50">
                                            <Button
                                                type="submit"
                                                className="border active:bg-blue-900 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center gap-2 bg-transparent"
                                                variant="outline"
                                            >
                                                <Search />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Search
                                            </div>
                                        </div>
                                        <Button
                                            className="bg-blue-700 hover:bg-blue-400 "
                                            onClick={handleAddVehicle}
                                            type={"button"}
                                        >
                                            <SquarePlus />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "purok",
                                        "v_type",
                                        "v_class",
                                        "usage",
                                    ]}
                                    vehicle_types={vehicle_types}
                                    puroks={puroks}
                                    showFilters={true}
                                    clearRouteName="vehicle.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                passedData={vehicles}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
                                is_paginated={isPaginated}
                                toggleShowAll={() => setShowAll(!showAll)}
                                showAll={showAll}
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                                // showTotal={true}
                            />
                            <SidebarModal
                                isOpen={isModalOpen}
                                onClose={() => {
                                    handleModalClose();
                                }}
                                title={
                                    vehicleDetails
                                        ? "Edit Vehicle Details"
                                        : "Add Vehicles"
                                }
                            >
                                {modalState === "add" && (
                                    <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
                                        <form
                                            onSubmit={
                                                vehicleDetails
                                                    ? onUpdateSubmit
                                                    : onStoreSubmit
                                            }
                                        >
                                            <h3 className="text-xl font-medium text-gray-700 mb-8">
                                                Vehicle Info
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5 w-full">
                                                <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
                                                    <InputLabel
                                                        htmlFor={`resident_image`}
                                                        value="Profile Photo"
                                                    />
                                                    <img
                                                        src={
                                                            data.resident_image
                                                                ? `/storage/${data.resident_image}`
                                                                : "/images/default-avatar.jpg"
                                                        }
                                                        alt={`Resident Image`}
                                                        className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                                    />
                                                </div>
                                                <div className="md:col-span-4 space-y-2">
                                                    <div className="w-full">
                                                        <DropdownInputField
                                                            label="Full Name"
                                                            name="resident_name"
                                                            value={
                                                                data.resident_name ||
                                                                ""
                                                            }
                                                            placeholder="Select a resident"
                                                            onChange={(e) =>
                                                                handleResidentChange(
                                                                    e
                                                                )
                                                            }
                                                            items={
                                                                residentsList
                                                            }
                                                            readOnly={
                                                                vehicleDetails
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.resident_id
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <div>
                                                            <InputField
                                                                label="Birthdate"
                                                                name="birthdate"
                                                                value={
                                                                    data.birthdate ||
                                                                    ""
                                                                }
                                                                readOnly={true}
                                                            />
                                                        </div>

                                                        <div>
                                                            <InputField
                                                                label="Purok Number"
                                                                name="purok_number"
                                                                value={
                                                                    data.purok_number
                                                                }
                                                                readOnly={true}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4 mt-4">
                                                {(data.vehicles || []).map(
                                                    (vehicle, vecIndex) => (
                                                        <div
                                                            key={vecIndex}
                                                            className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                                        >
                                                            {/* Left: input fields */}
                                                            <div className="grid md:grid-cols-4 gap-4">
                                                                <div>
                                                                    <DropdownInputField
                                                                        label="Vehicle Type"
                                                                        name="vehicle_type"
                                                                        value={
                                                                            vehicle.vehicle_type ||
                                                                            ""
                                                                        }
                                                                        items={[
                                                                            "Motorcycle",
                                                                            "Tricycle",
                                                                            "Car",
                                                                            "Jeep",
                                                                            "Truck",
                                                                            "Bicycle",
                                                                        ]}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleArrayValues(
                                                                                e,
                                                                                vecIndex,
                                                                                "vehicle_type",
                                                                                "vehicles"
                                                                            )
                                                                        }
                                                                        placeholder="Select type"
                                                                    />
                                                                    <InputError
                                                                        message={
                                                                            errors[
                                                                                `vehicles.${vecIndex}.vehicle_type`
                                                                            ]
                                                                        }
                                                                        className="mt-2"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <DropdownInputField
                                                                        label="Classification"
                                                                        name="vehicle_class"
                                                                        value={
                                                                            vehicle.vehicle_class ||
                                                                            ""
                                                                        }
                                                                        items={[
                                                                            {
                                                                                label: "Private",
                                                                                value: "private",
                                                                            },
                                                                            {
                                                                                label: "Public",
                                                                                value: "public",
                                                                            },
                                                                        ]}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleArrayValues(
                                                                                e,
                                                                                vecIndex,
                                                                                "vehicle_class",
                                                                                "vehicles"
                                                                            )
                                                                        }
                                                                        placeholder="Select class"
                                                                    />
                                                                    <InputError
                                                                        message={
                                                                            errors[
                                                                                `vehicles.${vecIndex}.vehicle_class`
                                                                            ]
                                                                        }
                                                                        className="mt-2"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <DropdownInputField
                                                                        label="Usage Purpose"
                                                                        name="usage_status"
                                                                        value={
                                                                            vehicle.usage_status ||
                                                                            ""
                                                                        }
                                                                        items={[
                                                                            {
                                                                                label: "Personal",
                                                                                value: "personal",
                                                                            },
                                                                            {
                                                                                label: "Public Transport",
                                                                                value: "public_transport",
                                                                            },
                                                                            {
                                                                                label: "Business Use",
                                                                                value: "business_use",
                                                                            },
                                                                        ]}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleArrayValues(
                                                                                e,
                                                                                vecIndex,
                                                                                "usage_status",
                                                                                "vehicles"
                                                                            )
                                                                        }
                                                                        placeholder="Select usage"
                                                                    />
                                                                    <InputError
                                                                        message={
                                                                            errors[
                                                                                `vehicles.${vecIndex}.usage_status`
                                                                            ]
                                                                        }
                                                                        className="mt-2"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <RadioGroup
                                                                        label="Is Registered?"
                                                                        name="is_registered"
                                                                        options={[
                                                                            {
                                                                                label: "Yes",
                                                                                value: 1,
                                                                            },
                                                                            {
                                                                                label: "No",
                                                                                value: 0,
                                                                            },
                                                                        ]}
                                                                        selectedValue={
                                                                            vehicle.is_registered ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleArrayValues(
                                                                                e,
                                                                                vecIndex,
                                                                                "is_registered",
                                                                                "vehicles"
                                                                            )
                                                                        }
                                                                    />
                                                                    <InputError
                                                                        message={
                                                                            errors[
                                                                                `vehicles.${vecIndex}.is_registered`
                                                                            ]
                                                                        }
                                                                        className="mt-2"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Right: remove button */}
                                                            {vehicleDetails ? (
                                                                <div></div>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeVehicle(
                                                                            vecIndex
                                                                        )
                                                                    }
                                                                    className="absolute top-1 right-2 flex items-center gap-1 text-2xl text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                                                    title="Remove"
                                                                >
                                                                    <IoIosCloseCircleOutline />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                                <div className="flex justify-between items-center p-3">
                                                    {vehicleDetails ? (
                                                        <div></div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                addVehicle()
                                                            }
                                                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                                                            title="Add vehicle"
                                                        >
                                                            <IoIosAddCircleOutline className="text-4xl" />
                                                            <span className="ml-1">
                                                                Add Vehicle
                                                            </span>
                                                        </button>
                                                    )}

                                                    <div className="flex justify-end items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            onClick={() =>
                                                                reset()
                                                            }
                                                        >
                                                            <RotateCcw /> Reset
                                                        </Button>
                                                        <Button
                                                            className="bg-blue-700 hover:bg-blue-400 "
                                                            type={"submit"}
                                                        >
                                                            {vehicleDetails
                                                                ? "Update"
                                                                : "Add"}{" "}
                                                            <MoveRight />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </SidebarModal>
                            <DeleteConfirmationModal
                                isOpen={isDeleteModalOpen}
                                onClose={() => {
                                    setIsDeleteModalOpen(false);
                                }}
                                onConfirm={confirmDelete}
                                residentId={residentToDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
