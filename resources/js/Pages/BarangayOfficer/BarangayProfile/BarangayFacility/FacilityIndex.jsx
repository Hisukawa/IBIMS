import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Home,
    ListPlus,
    SquarePen,
    Trash2,
    CalendarDays,
    ImageOff,
    Package,
} from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Button } from "@/Components/ui/button";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import { Toaster, toast } from "sonner";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import FacilitySidebarModal from "./Partials/FacilitySidebarModal";
import PageHeader from "@/Components/PageHeader";
import TableSearchBar from "@/Components/TableSearchBar";

const FacilityIndex = ({ facilities, names, types, queryParams }) => {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Facilities", showOnMobile: true },
    ];

    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [facilityDetails, setFacilityDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [facilityToDelete, setFacilityToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "image", label: "Image" },
        { key: "name", label: "Name" },
        { key: "facility_type", label: "Facilitiy Type" },
        { key: "quantity", label: "Quantity" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("facilities_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "facilities_visible_columns",
            JSON.stringify(visibleColumns),
        );
    }, [visibleColumns]);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["faci_name", "faci_type"].includes(key) && value && value !== "",
    );

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);
    const [showFilters, setShowFilters] = useState(hasActiveFilter);

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
        router.get(route("barangay_facility.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
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

    const getFacilityTypeStyle = (type) => {
        const styles = {
            government: "bg-blue-50 text-blue-700 border-blue-200",
            protection: "bg-red-50 text-red-700 border-red-200",
            security: "bg-amber-50 text-amber-700 border-amber-200",
            finance: "bg-emerald-50 text-emerald-700 border-emerald-200",
            service: "bg-violet-50 text-violet-700 border-violet-200",
            commerce: "bg-cyan-50 text-cyan-700 border-cyan-200",
        };

        return styles[type] || "bg-slate-50 text-slate-700 border-slate-200";
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
            <div className="flex items-center py-1">
                <div className="h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <img
                        src={
                            row.facility_image
                                ? `/storage/${row.facility_image}`
                                : "/images/default-avatar.jpg"
                        }
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default-avatar.jpg";
                        }}
                        alt={row.name || "Facility"}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        ),

        name: (row) => (
            <div className="min-w-0 space-y-1">
                <div className="truncate text-sm font-semibold text-slate-900 text-wrap">
                    {row.name || "Unnamed Facility"}
                </div>
            </div>
        ),

        facility_type: (row) => (
            <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getFacilityTypeStyle(
                    row.facility_type,
                )}`}
            >
                {row.facility_type || "Unknown"}
            </span>
        ),

        quantity: (row) => (
            <div className="flex items-center">
                <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
                    <span className="text-xs text-slate-500">Qty</span>
                    <span className="text-sm font-semibold text-slate-800">
                        {row.quantity ?? "—"}
                    </span>
                </div>
            </div>
        ),

        created_at: (row) => (
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>
                        {row.created_at ? formatDateTime(row.created_at) : "—"}
                    </span>
                </div>
                <div className="pl-5 text-xs text-slate-500">Created</div>
            </div>
        ),

        updated_at: (row) => (
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>
                        {row.updated_at ? formatDateTime(row.updated_at) : "—"}
                    </span>
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
    const handleAddFacility = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        facilities: [[]],
        _method: undefined,
        facility_id: null,
    });

    const addFacility = () => {
        setData("facilities", [...(data.facilities || []), {}]);
    };

    const removeFacility = (facIdx) => {
        const updated = [...(data.facilities || [])];
        updated.splice(facIdx, 1);
        setData("facilities", updated);
        toast.warning("Facility removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setFacilityDetails(null);
        reset();
        clearErrors();
    };

    const handleFacilityFieldChange = (value, facIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.facilities];

            // if updating file input
            if (field === "facility_image" && value instanceof File) {
                updated[facIdx] = {
                    ...updated[facIdx],
                    facility_image: value, // store file for submission
                    previewImage: URL.createObjectURL(value), // generate preview URL
                };
            } else {
                // for other fields or preview assignment
                updated[facIdx] = {
                    ...updated[facIdx],
                    [field]: value,
                };
            }

            return { ...prevData, facilities: updated };
        });
    };

    const handleSubmitFacility = (e) => {
        e.preventDefault();
        post(route("barangay_facility.store"), {
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
    };
    // edit
    const handleEdit = async (id) => {
        setModalState("edit");

        try {
            const response = await axios.get(
                `${APP_URL}/barangay_facility/details/${id}`,
            );
            const facility = response.data.facility;

            // Set the form data
            setData({
                facilities: [
                    {
                        facility_image: null, // Do not send existing image by default
                        previewImage: facility.facility_image
                            ? `/storage/${facility.facility_image}`
                            : null, // For showing in the form
                        name: facility.name || "",
                        facility_type: facility.facility_type || "",
                        quantity: facility.quantity || 1,
                    },
                ],
                _method: "PUT",
                facility_id: facility.id,
            });

            setFacilityDetails(facility); // Keep original facility if needed elsewhere
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching facility details:", error);
        }
    };

    const handleUpdateFacility = (e) => {
        e.preventDefault();
        post(route("barangay_facility.update", data.facility_id), {
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
    };

    // delete
    const handleDeleteClick = (id) => {
        setFacilityToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("barangay_facility.destroy", facilityToDelete), {
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
            <Head title="Barangay Infrastructure" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="pt-4 mb-10">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        <PageHeader
                            title="Barangay Facilities Overview"
                            description="Review, filter, and manage all barangay facilities including health centers, schools, public spaces, and other essential services. Monitor their types, availability, and details efficiently to ensure proper community management."
                            icon={Home}
                            iconWrapperClassName="bg-indigo-100 text-indigo-600 rounded-full"
                            containerClassName="bg-gray-50 border-transparent shadow-sm"
                            titleClassName="text-gray-900"
                            descriptionClassName="text-gray-500"
                            actions={
                                <Button
                                    onClick={handleAddFacility}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <ListPlus className="mr-2 h-4 w-4" />
                                    Add Facility
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
                                        url="barangay_facility.index"
                                        queryParams={queryParams}
                                        field="name"
                                        label="Search Facility"
                                        placeholder="Search facility name"
                                        className="w-full sm:w-[300px]"
                                    />
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={["faci_name", "faci_type"]}
                                    showFilters={true}
                                    types={types}
                                    names={names}
                                    clearRouteName="barangay_facility.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                queryParams={queryParams}
                                passedData={facilities}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                </div>
                <FacilitySidebarModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    modalState={modalState}
                    facilityDetails={facilityDetails}
                    data={data}
                    errors={errors}
                    handleSubmitFacility={handleSubmitFacility}
                    handleUpdateFacility={handleUpdateFacility}
                    handleFacilityFieldChange={handleFacilityFieldChange}
                    removeFacility={removeFacility}
                    addFacility={addFacility}
                    reset={reset}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={confirmDelete}
                    residentId={facilityToDelete}
                />
            </div>
        </AdminLayout>
    );
};

export default FacilityIndex;
