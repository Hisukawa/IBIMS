import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import DynamicTable from "@/Components/DynamicTable";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { useState, useEffect } from "react";
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import * as CONSTANTS from "@/constants";
import {
    Eye,
    SquarePen,
    Trash2,
    Network,
    Search,
    Share2,
    X,
} from "lucide-react";
import ActionMenu from "@/Components/ActionMenu"; // You forgot to import this before
import useAppUrl from "@/hooks/useAppUrl";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import { Toaster, toast } from "sonner";

export default function Index({
    household_details,
    household_members,
    queryParams: initialQueryParams = null,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Households",
            href: route("household.index"),
            showOnMobile: false,
        },
        {
            label: "Household Details",
            showOnMobile: true,
        },
    ];

    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const {
        data: head,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["head", household_details.id], // reactive to household ID
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/household/getlatesthead/${household_details.id}`
            );
            return data?.head || null; // return null if no head
        },
        enabled: !!household_details?.id, // avoid fetching if id is undefined
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const queryParams = initialQueryParams || {};
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
        router.get(
            route("household.show", {
                household: household_details.id,
                ...queryParams,
            })
        );
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
    };

    const allColumns = [
        { key: "resident_id", label: "Resident ID" },
        { key: "name", label: "Resident Name" },
        { key: "sex", label: "Sex" },
        { key: "relationship_to_head", label: "Relationship to Head" },
        { key: "household_position", label: "Household Position" },
        { key: "employment_status", label: "Employment Status" },
        { key: "registered_voter", label: "Register Voter" },
        { key: "is_pwd", label: "Is PWD" },
        { key: "actions", label: "Actions" },
    ];
    // === FOR RESIDENT SIDE MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const handleView = async (resident) => {
        try {
            const response = await axios.get(
                `${APP_URL}/resident/showresident/${resident}`
            );
            setSelectedResident(response.data.resident);
        } catch (error) {
            console.error("Error fetching placeholders:", error);
        }
        setIsModalOpen(true);
    };
    // ===

    // === BEING ADDED

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );

    useEffect(() => {
        if (visibleColumns.length === 0) {
            setVisibleColumns(allColumns.map((col) => col.key));
        }
    }, []);

    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "gender",
                "age_group",
                "relation",
                "household_position",
                "estatus",
                "voter_status",
                "is_pwd",
            ].includes(key) &&
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

    const handleEdit = (id) => {
        router.get(route("resident.edit", id));
    };

    // ==== delete modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [residentToDelete, setResidentToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setResidentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.get(route("household.remove", residentToDelete));
        setIsDeleteModalOpen(false);
    };

    const calculateAge = (birthdate) => {
        if (!birthdate) return "Unknown";
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const columnRenderers = {
        resident_id: (member) => member.resident.id,
        name: (member) =>
            `${member.resident.firstname} ${member.resident.middlename ?? ""} ${
                member.resident.lastname ?? ""
            } ${member.resident.suffix ?? ""}`,
        sex: (member) => {
            const genderKey = member.resident.sex;
            const label =
                CONSTANTS.RESIDENT_GENDER_TEXT2[genderKey] ?? "Unknown";
            const className =
                CONSTANTS.RESIDENT_GENDER_COLOR_CLASS[genderKey] ??
                "bg-gray-300";

            return (
                <span
                    className={`py-1 px-2 rounded-xl text-sm font-medium ${className}`}
                >
                    {label}
                </span>
            );
        },
        age: (member) => {
            const age = calculateAge(member.resident.birthdate);

            if (typeof age !== "number") return "Unknown";
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                        {age} years old
                    </span>
                    {age > 60 && (
                        <span className="text-xs text-rose-600 font-semibold">
                            Senior Citizen
                        </span>
                    )}
                </div>
            );
        },
        relationship_to_head: (member) =>
            CONSTANTS.RELATIONSHIP_TO_HEAD_TEXT[member.relationship_to_head] ||
            "",
        household_position: (member) =>
            CONSTANTS.HOUSEHOLD_POSITION_TEXT[member.household_position] || "",
        employment_status: (member) =>
            CONSTANTS.RESIDENT_EMPLOYMENT_STATUS_TEXT[
                member.resident.employment_status
            ],
        registered_voter: (member) => {
            const status = member.resident?.registered_voter ?? 0;
            const label =
                CONSTANTS.RESIDENT_REGISTER_VOTER_TEXT[status] ?? "Unknown";

            const className =
                CONSTANTS.RESIDENT_REGISTER_VOTER_CLASS[status] ??
                "p-1 bg-gray-300 text-black rounded-lg";

            return <span className={className}>{label}</span>;
        },
        is_pwd: (member) => CONSTANTS.MEDICAL_PWD_TEXT[member.resident?.is_pwd],
        actions: (member) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(member.resident_id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(member.resident_id),
                    },
                    {
                        label: "Remove",
                        icon: <X className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(member.resident_id),
                    },
                ]}
            />
        ),
    };

    useEffect(() => {
        if (success) {
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
            <Head title="Family" />
            <Toaster richColors />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            {/* <pre>{JSON.stringify(household_members, undefined, 3)}</pre> */}
            <div className="bg-white shadow-md rounded-lg m-5 border border-gray-200">
                {/* Header */}
                <div className="px-4 py-4 border-b bg-gray-100 rounded-t-lg">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        House #{household_details.house_number}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {household_details?.purok?.barangay?.barangay_name ||
                            ""}{" "}
                        • Purok {household_details?.purok?.purok_number || ""} •{" "}
                        {household_details?.street?.street_name || ""} Street
                    </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                    {[
                        {
                            label: "Ownership Type",
                            value: CONSTANTS.HOUSEHOLD_OWNERSHIP_TEXT[
                                household_details.ownership_type
                            ],
                        },
                        {
                            label: "Housing Condition",
                            value: CONSTANTS.HOUSEHOLD_CONDITION_TEXT[
                                household_details.housing_condition
                            ],
                        },
                        {
                            label: "Year Established",
                            value: household_details.year_established,
                        },
                        {
                            label: "House Structure",
                            value: CONSTANTS.HOUSEHOLD_STRUCTURE_TEXT[
                                household_details.house_structure
                            ],
                        },
                        {
                            label: "Bath & Wash Area",
                            value: Array.isArray(
                                household_details.bath_and_wash_area
                            )
                                ? household_details.bath_and_wash_area
                                      .map(
                                          (item) =>
                                              CONSTANTS
                                                  .HOUSEHOLD_BATH_WASH_TEXT[
                                                  item
                                              ] || item
                                      )
                                      .join(", ")
                                : typeof household_details.bath_and_wash_area ===
                                  "object"
                                ? Object.values(
                                      household_details.bath_and_wash_area
                                  )
                                      .map(
                                          (item) =>
                                              CONSTANTS
                                                  .HOUSEHOLD_BATH_WASH_TEXT[
                                                  item
                                              ] || item
                                      )
                                      .join(", ")
                                : CONSTANTS.HOUSEHOLD_BATH_WASH_TEXT[
                                      household_details.bath_and_wash_area
                                  ] || household_details.bath_and_wash_area,
                        },
                        {
                            label: "Rooms",
                            value: household_details.number_of_rooms,
                        },
                        {
                            label: "Floors",
                            value: household_details.number_of_floors,
                        },
                        {
                            label: "Coordinates",
                            value: `${household_details.latitude}, ${household_details.longitude}`,
                        },
                        {
                            label: "Toilet Types",
                            value:
                                household_details.toilets?.length > 0
                                    ? household_details.toilets
                                          .map(
                                              (t) =>
                                                  CONSTANTS
                                                      .HOUSEHOLD_TOILET_TYPE_TEXT[
                                                      t.toilet_type
                                                  ] || t.toilet_type
                                          )
                                          .join(", ")
                                    : "None",
                        },
                        {
                            label: "Waste Management Types",
                            value:
                                household_details.waste_management_types
                                    ?.length > 0
                                    ? household_details.waste_management_types
                                          .map(
                                              (item) =>
                                                  CONSTANTS
                                                      .HOUSEHOLD_WASTE_DISPOSAL_TEXT[
                                                      item.waste_management_type
                                                  ] ||
                                                  item.waste_management_type
                                          )
                                          .join(", ")
                                    : "None",
                        },
                        {
                            label: "Water Source Types",
                            value:
                                household_details.water_source_types?.length > 0
                                    ? household_details.water_source_types
                                          .map(
                                              (w) =>
                                                  CONSTANTS
                                                      .HOUSEHOLD_WATER_SOURCE_TEXT[
                                                      w.water_source_type
                                                  ] || w.water_source_type
                                          )
                                          .join(", ")
                                    : "None",
                        },
                        {
                            label: "Electricity Types",
                            value:
                                household_details.electricity_types?.length > 0
                                    ? household_details.electricity_types
                                          .map(
                                              (e) =>
                                                  CONSTANTS
                                                      .HOUSEHOLD_ELECTRICITY_TYPE[
                                                      e.electricity_type
                                                  ] || e.electricity_type
                                          )
                                          .join(", ")
                                    : "None",
                        },
                    ].map(({ label, value }, index) => (
                        <div
                            key={index}
                            className="flex justify-between border-b pb-2"
                        >
                            <span className="text-sm font-medium text-gray-700">
                                {label}:
                            </span>
                            <span className="text-sm text-gray-900 text-right max-w-[60%]">
                                {value || "—"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4">
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
                            {/* Right Controls */}
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-[300px] max-w-lg items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search for Household Member Name"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            onKeyPressed("name", e)
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

                                <Link href={route("family.create")}>
                                    <div className="relative group z-50">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Add Relationship
                                        </div>
                                    </div>
                                </Link>

                                {head && (
                                    <Link
                                        href={route(
                                            "resident.familytree",
                                            head.resident_id
                                        )}
                                    >
                                        <div className="relative group z-50">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                            >
                                                <Network className="w-4 h-4" />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Family Tree
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {showFilters && (
                            <FilterToggle
                                queryParams={queryParams}
                                searchFieldName={searchFieldName}
                                visibleFilters={[
                                    "gender",
                                    "age_group",
                                    "relation",
                                    "household_position",
                                    "estatus",
                                    "voter_status",
                                    "is_pwd",
                                ]}
                                showFilters={true}
                                clearRouteName="household.show"
                                clearRouteParams={{
                                    household: household_details.id,
                                }}
                            />
                        )}

                        {/* Data Table */}
                        <DynamicTable
                            passedData={household_members}
                            columnRenderers={columnRenderers}
                            allColumns={allColumns}
                            is_paginated={isPaginated}
                            toggleShowAll={() => setShowAll(!showAll)}
                            showAll={showAll}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />
                    </div>
                </div>
            </div>
            <SidebarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Resident Details"
            >
                {selectedResident && (
                    <PersonDetailContent person={selectedResident} />
                )}
            </SidebarModal>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                }}
                onConfirm={confirmDelete}
                residentId={residentToDelete}
                title={"Confirm Removal"}
                message={
                    "Are you sure you want to remove resident from this household? This action cannot be undone."
                }
                buttonLabel={"I UNDERSTAND, REMOVE"}
            />
        </AdminLayout>
    );
}
