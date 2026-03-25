import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import {
    Home,
    ListPlus,
    CalendarDays,
    Map,
    Route,
    Ruler,
    ShieldCheck,
    SquarePen,
    Trash2,
    Wrench,
} from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { ROAD_TYPE_TEXT } from "@/constants";
import { Toaster, toast } from "sonner";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import RoadSidebarModal from "./Partials/RoadSidebarModal";
import PageHeader from "@/Components/PageHeader";
import TableSearchBar from "@/Components/TableSearchBar";

const BarangayRoads = ({ roads, types, maintains, queryParams }) => {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Roads", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [roadDetails, setRoadDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [roadToDelete, setRoadToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "image", label: "Road Image" },
        { key: "road_type", label: "Road Type" },
        { key: "maintained_by", label: "Maintained By" },
        { key: "length", label: "Length" },
        { key: "status", label: "Status" },
        { key: "condition", label: "Condition" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("roads_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    const hasActiveFilter = Object.entries(queryParams).some(
        ([key, value]) =>
            [
                "road_type",
                "maintained_by",
                "road_status",
                "road_condition",
            ].includes(key) &&
            value &&
            value !== "",
    );

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);
    useEffect(() => {
        localStorage.setItem(
            "roads_visible_columns",
            JSON.stringify(visibleColumns),
        );
    }, [visibleColumns]);
    const searchFieldName = (field, value) => {
        if (value && value.trim() !== "") {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        if (queryParams.page) {
            delete queryParams.page;
        }
        router.get(route("barangay_road.index", queryParams));
    };

    const formatDateTime = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const conditionStyles = {
        good: "bg-emerald-50 text-emerald-700 border-emerald-200",
        fair: "bg-amber-50 text-amber-700 border-amber-200",
        poor: "bg-red-50 text-red-700 border-red-200",
        under_construction: "bg-blue-50 text-blue-700 border-blue-200",
        impassable: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const statusStyles = {
        active: "bg-blue-50 text-blue-700 border-blue-200",
        under_maintenance: "bg-orange-50 text-orange-700 border-orange-200",
        closed: "bg-slate-100 text-slate-700 border-slate-200",
        inactive: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const formatLabel = (value) => {
        if (!value) return "—";

        return value
            .toString()
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const columnRenderers = {
        id: (row) => (
            <div className="flex items-center">
                <span className="inline-flex min-w-[42px] items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    #{row.id}
                </span>
            </div>
        ),

        image: (row) => (
            <div className="flex items-center justify-center py-1">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <img
                        src={
                            row.road_image
                                ? `/storage/${row.road_image}`
                                : "/images/default-avatar.jpg"
                        }
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default-avatar.jpg";
                        }}
                        alt={row.road_type || "Road"}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        ),

        road_type: (row) => (
            <div className="min-w-0 space-y-1">
                <div className="truncate text-sm font-semibold text-slate-900">
                    {ROAD_TYPE_TEXT[row.road_type] || "—"}
                </div>
            </div>
        ),

        maintained_by: (row) => (
            <div className="min-w-0 space-y-1">
                <div className="truncate text-sm font-medium text-slate-800">
                    {row.maintained_by || "—"}
                </div>
            </div>
        ),

        length: (row) => (
            <div className="flex items-center">
                <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
                    <Ruler className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-800">
                        {row.length != null ? `${row.length} Km` : "—"}
                    </span>
                </div>
            </div>
        ),

        condition: (row) => (
            <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                    conditionStyles[row.condition] ||
                    "bg-slate-50 text-slate-700 border-slate-200"
                }`}
            >
                <Map className="h-3.5 w-3.5" />
                {formatLabel(row.condition)}
            </span>
        ),

        status: (row) => (
            <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                    statusStyles[row.status] ||
                    "bg-slate-50 text-slate-700 border-slate-200"
                }`}
            >
                <ShieldCheck className="h-3.5 w-3.5" />
                {formatLabel(row.status)}
            </span>
        ),

        created_at: (row) => (
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{formatDateTime(row.created_at)}</span>
                </div>
                <div className="pl-5 text-xs text-slate-500">Created</div>
            </div>
        ),

        updated_at: (row) => (
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{formatDateTime(row.updated_at)}</span>
                </div>
                <div className="pl-5 text-xs text-slate-500">Last Updated</div>
            </div>
        ),

        actions: (row) => (
            <div className="flex items-center justify-center">
                <ActionMenu
                    actions={[
                        {
                            label: "Edit",
                            icon: (
                                <SquarePen className="h-4 w-4 text-emerald-500" />
                            ),
                            onClick: () => handleEdit(row.id),
                        },
                        {
                            label: "Delete",
                            icon: <Trash2 className="h-4 w-4 text-red-500" />,
                            onClick: () => handleDeleteClick(row.id),
                        },
                    ]}
                />
            </div>
        ),
    };

    // add
    const handleAddRoad = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        roads: [[]],
        _method: undefined,
        road_id: null,
    });

    const addRoad = () => {
        setData("roads", [...(data.roads || []), {}]);
    };
    const removeRoad = (roadIdx) => {
        const updated = [...(data.roads || [])];
        updated.splice(roadIdx, 1);
        setData("roads", updated);
        toast.warning("Road removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setRoadDetails(null);
        reset();
        clearErrors();
    };
    const handleRoadFieldChange = (value, roadIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.roads];

            // if updating file input
            if (field === "road_image" && value instanceof File) {
                updated[roadIdx] = {
                    ...updated[roadIdx],
                    road_image: value, // store file for submission
                    previewImage: URL.createObjectURL(value), // generate preview URL
                };
            } else {
                // for other fields or preview assignment
                updated[roadIdx] = {
                    ...updated[roadIdx],
                    [field]: value,
                };
            }

            return { ...prevData, roads: updated };
        });
    };
    const handleSubmitRoad = (e) => {
        e.preventDefault();
        post(route("barangay_road.store"), {
            onError: (errors) => {
                //console.error("Validation Errors:", errors);

                const allErrors = Object.values(errors).join("<br />");
                toast.error("Validation Error", {
                    description: (
                        <span dangerouslySetInnerHTML={{ __html: allErrors }} />
                    ),
                    duration: 3000,
                    closeButton: true,
                });
            },
        });
    };

    // edit road
    const handleEdit = async (id) => {
        setModalState("edit");

        try {
            const response = await axios.get(
                `${APP_URL}/barangay_road/details/${id}`,
            );
            const road = response.data.road;
            // console.log(road);

            setRoadDetails(road);

            setData({
                roads: [
                    {
                        road_image: null, // keep original DB filename
                        previewImage: road.road_image
                            ? `/storage/${road.road_image}`
                            : null, // For showing in the form
                        road_type: road.road_type || "",
                        length: road.length || "",
                        condition: road.condition || "",
                        status: road.status || "",
                        maintained_by: road.maintained_by || "",
                    },
                ],
                _method: "PUT",
                road_id: road.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching road details:", error);
        }
    };
    const handleUpdateRoad = (e) => {
        e.preventDefault();
        post(route("barangay_road.update", roadDetails.id), {
            _method: "PUT",
            roads: data.roads,
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    // delete
    const handleDeleteClick = (id) => {
        setRoadToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("barangay_road.destroy", roadToDelete), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);

                const allErrors = Object.values(errors).join("<br />");
                toast.error("Validation Error", {
                    description: (
                        <span dangerouslySetInnerHTML={{ __html: allErrors }} />
                    ),
                    duration: 3000,
                    closeButton: true,
                });
            },
        });
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
            <Head title="Barangay Roads" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="pt-4 mb-10">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        {/* Header */}
                        <PageHeader
                            title="Barangay Roads Overview"
                            description="Review, filter, and manage existing barangay roads efficiently. Keep track of road types, conditions, and maintenance details."
                            icon={Home}
                            iconWrapperClassName="bg-indigo-100 text-indigo-600 rounded-full"
                            containerClassName="bg-gray-50 border-transparent shadow-sm"
                            titleClassName="text-gray-900"
                            descriptionClassName="text-gray-500"
                            actions={
                                <Button
                                    onClick={handleAddRoad}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <ListPlus className="mr-2 h-4 w-4" />
                                    Add Road
                                </Button>
                            }
                        />
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DynamicTableControls
                                        allColumns={allColumns}
                                        visibleColumns={visibleColumns}
                                        setVisibleColumns={setVisibleColumns}
                                        showFilters={showFilters}
                                        toggleShowFilters={() =>
                                            setShowFilters((prev) => !prev)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <TableSearchBar
                                        url="barangay_road.index"
                                        queryParams={queryParams}
                                        field="name"
                                        label="Search Roads"
                                        placeholder="Search road lengths"
                                    />
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "road_type",
                                        "maintained_by",
                                        "road_status",
                                        "road_condition",
                                    ]}
                                    types={types}
                                    names={maintains}
                                    clearRouteName="barangay_road.index"
                                    clearRouteParams={{}}
                                    showFilters={showFilters}
                                />
                            )}

                            <DynamicTable
                                queryParams={queryParams}
                                passedData={roads}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                    <RoadSidebarModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        modalState={modalState}
                        roadDetails={roadDetails}
                        data={data}
                        errors={errors}
                        handleSubmitRoad={handleSubmitRoad}
                        handleUpdateRoad={handleUpdateRoad}
                        handleRoadFieldChange={handleRoadFieldChange}
                        removeRoad={removeRoad}
                        addRoad={addRoad}
                        reset={reset}
                    />
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                        }}
                        onConfirm={confirmDelete}
                        residentId={roadToDelete}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default BarangayRoads;
