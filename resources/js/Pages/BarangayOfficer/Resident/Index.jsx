import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import ResidentTable from "@/Components/ResidentTable";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import ResidentFilterBar from "@/Components/ResidentFilterBar";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import {
    Search,
    UserRoundPlus,
    HousePlus,
    SquarePen,
    Trash2,
    Network,
    Eye,
} from "lucide-react";
import {
    RESIDENT_CIVIL_STATUS_TEXT,
    RESIDENT_EMPLOYMENT_STATUS_TEXT,
    RESIDENT_GENDER_COLOR_CLASS,
    RESIDENT_GENDER_TEXT2,
    RESIDENT_REGISTER_VOTER_CLASS,
    RESIDENT_REGISTER_VOTER_TEXT,
} from "@/constants";

export default function Index({
    residents,
    queryParams = null,
    puroks,
    success = null,
}) {
    queryParams = queryParams || {};

    useEffect(() => {
        if (success) {
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                className: "bg-green-100 text-green-800",
            });
        }
    }, [success]);

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
        router.get(route("resident.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
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

    const handleEdit = (id) => {
        router.get(route("resident.edit", id));
    };

    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Residents Table", showOnMobile: true },
    ];

    const allColumns = [
        { key: "resident_id", label: "ID" },
        { key: "resident_picture", label: "Resident Image" },
        { key: "name", label: "Name" },
        { key: "gender", label: "Gender" },
        { key: "age", label: "Age" },
        { key: "civil_status", label: "Civil Status" },
        { key: "employment_status", label: "Employment" },
        { key: "occupation", label: "Occupation" },
        { key: "citizenship", label: "Citizenship" },
        { key: "registered_voter", label: "Registered Voter" },
        { key: "contact_number", label: "Contact Number" },
        { key: "email", label: "Email" },
        { key: "purok_number", label: "Purok" },
        { key: "actions", label: "Actions" },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const handleView = (resident) => {
        setSelectedResident(resident);
        setIsModalOpen(true);
    };

    // === BEING ADDED

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );
    const [isPaginated, setIsPaginated] = useState(true);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "gender",
                "age_group",
                "purok",
                "estatus",
                "voter_status",
                "cstatus",
                "pwd",
                "fourps",
                "solo_parent"
            ].includes(key) &&
            value &&
            value !== "All"
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
        resident_id: (resident) => resident.id,

        resident_picture: (resident) => (
            <img
                src={
                    resident.resident_picture
                        ? `/storage/${resident.resident_picture}`
                        : "/images/default-avatar.jpg"
                }
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-avatar.jpg";
                }}
                alt="Resident"
                className="w-20 h-20 min-w-20 min-h-20 object-cover rounded-full border"
            />
        ),

        name: (resident) => (
            <div className="text-sm break-words whitespace-normal leading-snug">
                {`${resident.firstname} ${resident.middlename ?? ""} ${resident.lastname ?? ""
                    } ${resident.suffix ?? ""}`}
            </div>
        ),

        gender: (resident) => {
            const genderKey = resident.gender;
            const label = RESIDENT_GENDER_TEXT2[genderKey] ?? "Unknown";
            const className =
                RESIDENT_GENDER_COLOR_CLASS[genderKey] ?? "bg-gray-300";

            return (
                <span
                    className={`py-1 px-2 rounded-xl text-sm font-medium ${className}`}
                >
                    {label}
                </span>
            );
        },

        age: (resident) => {
            const age = calculateAge(resident.birthdate);

            if (typeof age !== "number") return "Unknown";

            return (
                <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-800">{age}</span>
                    {age > 60 && (
                        <span className="text-xs text-rose-600 font-semibold">
                            Senior Citizen
                        </span>
                    )}
                </div>
            );
        },

        civil_status: (resident) =>
            RESIDENT_CIVIL_STATUS_TEXT[resident.civil_status],

        employment_status: (resident) =>
            RESIDENT_EMPLOYMENT_STATUS_TEXT[resident.employment_status],

        occupation: (resident) => {
            const occ = resident.occupation;
            return occ ? (
                <span className="text-sm text-gray-700">
                    {resident.occupation}
                </span>
            ) : (
                <span className="text-gray-400 italic">
                    No occupation available
                </span>
            );
        },

        citizenship: (resident) => resident.citizenship,

        registered_voter: (resident) => (
            <span
                className={
                    RESIDENT_REGISTER_VOTER_CLASS[resident.registered_voter]
                }
            >
                {RESIDENT_REGISTER_VOTER_TEXT[resident.registered_voter]}
            </span>
        ),

        contact_number: (resident) => resident.contact_number,

        purok_number: (resident) => resident.purok_number,

        email: (resident) => resident.email,

        actions: (resident) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(resident),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(resident.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(resident.id),
                    },
                    {
                        label: "Family Tree",
                        icon: <Network className="w-4 h-4 text-blue-500" />,
                        href: route("resident.familytree", resident.id),
                        tooltip: "See Family Tree",
                    },
                ]}
            />
        ),
    };

    // Determine if showing all or paginated by checking queryParams.all
    const [showAll, setShowAll] = useState(queryParams.all === "true");

    // Update showAll state if queryParams change (for sync)
    useEffect(() => {
        setShowAll(queryParams.all === "true");
    }, [queryParams.all]);

    // Toggle handler to switch all param and reload
    const toggleShowAll = () => {
        let newQueryParams = { ...queryParams };

        if (showAll) {
            // Currently showing all, remove 'all' param to go back to paginated
            delete newQueryParams.all;
        } else {
            // Currently paginated, add 'all=true'
            newQueryParams.all = "true";
        }

        // Remove page param so it resets
        if (newQueryParams.page) {
            delete newQueryParams.page;
        }

        setShowAll(!showAll);
        router.get(route("resident.index", newQueryParams), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <div>
                <Toaster />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
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
                                        toggleShowFilters={() => setShowFilters((prev) => !prev)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex w-[300px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed("name", e.target.value)
                                            }
                                            className="ml-4"
                                        />
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
                                    </form>
                                    <Link href={route("resident.create")}>
                                        <div className="relative group z-50">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                            >
                                                <HousePlus className="w-4 h-4" />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Add Household
                                            </div>
                                        </div>
                                    </Link>
                                    <Link href={route("resident.createresident")}>
                                        <div className="relative group z-50">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                            >
                                                <UserRoundPlus className="w-4 h-4" />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Add Resident
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "gender",
                                        "age_group",
                                        "purok",
                                        "estatus",
                                        "voter_status",
                                        "cstatus",
                                        "pwd",
                                        "fourps",
                                        "solo_parent"
                                    ]}
                                    showFilters={true}
                                    puroks={puroks}
                                    clearRouteName="resident.index"
                                    clearRouteParams={{}}
                                />
                            )}

                            <DynamicTable
                                passedData={residents}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                is_paginated={isPaginated}
                                showAll={showAll}
                                toggleShowAll={() => setShowAll(!showAll)}
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                            // showTotal={true}
                            />
                        </div>
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

        </AdminLayout>
    );
}
