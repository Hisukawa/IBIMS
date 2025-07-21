import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import {
    Search,
    UserRoundPlus,
    HousePlus,
    SquarePen,
    Trash2,
    Network,
    SquarePlus,
} from "lucide-react";
import {
    HOUSEHOLD_CONDITION_TEXT,
    HOUSEHOLD_OWNERSHIP_TEXT,
    HOUSEHOLD_STRUCTURE_TEXT,
    HOUSING_CONDITION_COLOR,
    VEHICLE_CLASS_TEXT,
    VEHICLE_USAGE_TEXT,
    VEHICLE_USAGE_STYLES,
} from "@/constants";


export default function Index({
    vehicles,
    vehicle_types,
    puroks,
    queryParams,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Vehicles", showOnMobile: true },
    ];
    queryParams = queryParams || {};

    const [query, setQuery] = useState(queryParams["name"] ?? "");

    const handleSubmit = (e) => {
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

    const allColumns = [
        { key: "id", label: "Vehicle ID" },
        { key: "name", label: "Owner Name" },
        { key: "vehicle_type", label: "Vehicle Type" },
        { key: "vehicle_class", label: "Class" },
        { key: "usage_status", label: "Usage" },
        { key: "quantity", label: "Quantity" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];

    // === BEING ADDED

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["purok", "v_type", "v_class", "usage"].includes(
                key
            ) &&
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

    // === AP TO HERE

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
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${VEHICLE_USAGE_STYLES[row.usage_status]
                        }`}
                >
                    {statusLabel}
                </span>
            );
        },

        quantity: (row) => row.quantity,

        purok_number: (row) => row.purok_number,
        actions: (house) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(house.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(house.id),
                    },
                ]}
            />
        ),
    };

    return (
        <AdminLayout>
            <Head title="Vehicles" />
            <div>
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
                                        onSubmit={handleSubmit}
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
                                                onKeyPressed("name", e.target.value)
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
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
