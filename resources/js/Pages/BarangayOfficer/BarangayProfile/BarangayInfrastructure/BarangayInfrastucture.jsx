import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import AdminLayout from "@/Layouts/AdminLayout";
import { Home, ListPlus, Search, SquarePen, Trash2 } from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";

import { Button } from "@/Components/ui/button";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import DynamicTable from "@/Components/DynamicTable";
import PageHeader from "@/Components/PageHeader";
import InfrastructureSidebarForm from "./Partials/InfrastructureSidebarForm";
import TableSearchBar from "@/Components/TableSearchBar";

export default function BarangayInfrastucture({
    infrastructure,
    types,
    categories,
    queryParams,
}) {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Infrastructures", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [infrastructureDetails, setInfrastructureDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [infraToDelete, setInfraToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "image", label: "Image" },
        { key: "infrastructure_type", label: "Type" },
        { key: "infrastructure_category", label: "Category" },
        { key: "quantity", label: "Quantity" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("infrastructures_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem(
            "infrastructures_visible_columns",
            JSON.stringify(visibleColumns),
        );
    }, [visibleColumns]);

    // Detect active filters
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "infra_type",
                "infra_category",
                "created_at",
                "updated_at",
            ].includes(key) &&
            value &&
            value !== "",
    );

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);
    const [showFilters, setShowFilters] = useState(hasActiveFilter);

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
        router.get(route("barangay_infrastructure.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
    };

    // columns renderers
    const formatDateTime = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const categoryStyles = {
        "Disaster and Community Facilities":
            "bg-amber-100 text-amber-800 border border-amber-200",
        "Health and Medical":
            "bg-emerald-100 text-emerald-800 border border-emerald-200",
        Educational: "bg-blue-100 text-blue-800 border border-blue-200",
        Agricultural: "bg-lime-100 text-lime-800 border border-lime-200",
    };

    const columnRenderers = {
        id: (row) => (
            <span className="inline-flex min-w-[40px] justify-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                #{row.id}
            </span>
        ),

        image: (row) => (
            <div className="flex items-center justify-center">
                <img
                    src={
                        row.infrastructure_image
                            ? `/storage/${row.infrastructure_image}`
                            : "/images/default-avatar.jpg"
                    }
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default-avatar.jpg";
                    }}
                    alt={row.infrastructure_type || "Infrastructure"}
                    className="h-16 w-16 min-h-16 min-w-16 rounded-xl border border-slate-200 object-cover shadow-sm"
                />
            </div>
        ),

        infrastructure_type: (row) => (
            <div className="min-w-[160px]">
                <p className="font-semibold leading-5 text-slate-900">
                    {row.infrastructure_type || "Unnamed Infrastructure"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    Barangay infrastructure record
                </p>
            </div>
        ),

        infrastructure_category: (row) => {
            const value = row.infrastructure_category || "Uncategorized";

            return (
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        categoryStyles[value] ||
                        "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                >
                    {value}
                </span>
            );
        },

        quantity: (row) => (
            <div className="flex items-center gap-2">
                <span className="inline-flex min-w-[48px] justify-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                    {row.quantity ?? "—"}
                </span>
            </div>
        ),

        created_at: (row) => (
            <div className="min-w-[150px]">
                <p className="text-sm font-medium text-slate-700">
                    {formatDateTime(row.created_at)}
                </p>
                <p className="mt-1 text-xs text-slate-400">Date created</p>
            </div>
        ),

        updated_at: (row) => (
            <div className="min-w-[150px]">
                <p className="text-sm font-medium text-slate-700">
                    {formatDateTime(row.updated_at)}
                </p>
                <p className="mt-1 text-xs text-slate-400">Last updated</p>
            </div>
        ),

        actions: (row) => (
            <div className="flex justify-center">
                <ActionMenu
                    actions={[
                        {
                            label: "Edit",
                            icon: (
                                <SquarePen className="h-4 w-4 text-emerald-600" />
                            ),
                            onClick: () => handleEdit(row.id),
                        },
                        {
                            label: "Delete",
                            icon: <Trash2 className="h-4 w-4 text-red-600" />,
                            onClick: () => handleDeleteClick(row.id),
                        },
                    ]}
                />
            </div>
        ),
    };

    // add
    const handleAddInfrastructure = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        infrastructures: [[]],
        _method: undefined,
        infrastructure_id: null,
    });

    const addInfrastructure = () => {
        setData("infrastructures", [...(data.infrastructures || []), {}]);
    };

    const removeInfrastructure = (infraIdx) => {
        const updated = [...(data.infrastructures || [])];
        updated.splice(infraIdx, 1);
        setData("infrastructures", updated);
        toast.warning("Infrastructure removed.", {
            duration: 2000,
        });
    };

    const handleInfrastructureFieldChange = (value, infraIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.infrastructures];

            // if updating file input
            if (field === "infrastructure_image" && value instanceof File) {
                updated[infraIdx] = {
                    ...updated[infraIdx],
                    infrastructure_image: value, // store file for submission
                    previewImage: URL.createObjectURL(value), // generate preview URL
                };
            } else {
                // for other fields or preview assignment
                updated[infraIdx] = {
                    ...updated[infraIdx],
                    [field]: value,
                };
            }

            return { ...prevData, infrastructures: updated };
        });
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setInfrastructureDetails(null);
        reset();
        clearErrors();
    };

    const infrastructure_types = [
        { label: "Evacuation Center", value: "Evacuation Center" },
        { label: "Flood Control", value: "Flood Control" },
        {
            label: "Rain Water Harvester (Communal)",
            value: "Rain Water Harvester (Communal)",
        },
        {
            label: "Barangay Disaster Operation Center",
            value: "Barangay Disaster Operation Center",
        },
        {
            label: "Public Comfort Room/Toilet",
            value: "Public Comfort Room/Toilet",
        },
        { label: "Community Garden", value: "Community Garden" },
        { label: "Barangay Health Center", value: "Barangay Health Center" },
        { label: "Hospital", value: "Hospital" },
        { label: "Maternity Clinic", value: "Maternity Clinic" },
        { label: "Child Clinic", value: "Child Clinic" },
        { label: "Private Medical Clinic", value: "Private Medical Clinic" },
        { label: "Barangay Drug Store", value: "Barangay Drug Store" },
        {
            label: "City/Municipal Public Drug Store",
            value: "City/Municipal Public Drug Store",
        },
        { label: "Private Drug Store", value: "Private Drug Store" },
        {
            label: "Quarantine/Isolation Facility",
            value: "Quarantine/Isolation Facility",
        },
        {
            label: "Child Development Center",
            value: "Child Development Center",
        },
        { label: "Preschool", value: "Preschool" },
        { label: "Elementary", value: "Elementary" },
        { label: "Secondary", value: "Secondary" },
        { label: "Vocational", value: "Vocational" },
        { label: "College/University", value: "College/University" },
        { label: "Islamic School", value: "Islamic School" },
        { label: "Rice Mill", value: "Rice Mill" },
        { label: "Corn Mill", value: "Corn Mill" },
        { label: "Feed Mill", value: "Feed Mill" },
        {
            label: "Agricultural Produce Market",
            value: "Agricultural Produce Market",
        },
    ];

    const handleSubmitInfrastruture = (e) => {
        e.preventDefault();
        post(route("barangay_infrastructure.store"), {
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
                `${APP_URL}/barangay_infrastructure/details/${id}`,
            );
            const infrastructure = response.data.infra;
            setInfrastructureDetails(infrastructure);
            setData({
                infrastructures: [
                    {
                        infrastructure_image: null, // do not pass existing image
                        previewImage: infrastructure.infrastructure_image
                            ? `/storage/${infrastructure.infrastructure_image}`
                            : null, // show existing image in preview
                        infrastructure_type:
                            infrastructure.infrastructure_type || "",
                        infrastructure_category:
                            infrastructure.infrastructure_category || "",
                        quantity: infrastructure.quantity || "",
                    },
                ],
                _method: "PUT",
                infrastructure_id: infrastructure.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching infrastructure details:", error);
        }
    };

    const handleUpdateInfrastruture = (e) => {
        e.preventDefault();
        post(route("barangay_infrastructure.update", data.infrastructure_id), {
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
        setInfraToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("barangay_infrastructure.destroy", infraToDelete), {
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
                        {/* Header */}
                        <PageHeader
                            title="Barangay Infrastructure Overview"
                            description="Review, filter, and manage existing barangay infrastructures efficiently."
                            icon={Home}
                            iconWrapperClassName="bg-indigo-100 text-indigo-600"
                            actions={
                                <Button
                                    onClick={handleAddInfrastructure}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <ListPlus className="mr-2 h-4 w-4" />
                                    Add Infrastructure
                                </Button>
                            }
                        />

                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="flex flex-wrap justify-between gap-2 mb-4">
                                <DynamicTableControls
                                    allColumns={allColumns}
                                    visibleColumns={visibleColumns}
                                    setVisibleColumns={setVisibleColumns}
                                    showFilters={showFilters}
                                    toggleShowFilters={() =>
                                        setShowFilters((prev) => !prev)
                                    }
                                />

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                                        <TableSearchBar
                                            url="barangay_infrastructure.index"
                                            queryParams={queryParams}
                                            label="Search infrastructure name"
                                            field="name"
                                            className="w-full sm:min-w-[280px]"
                                        />
                                    </div>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "infra_type",
                                        "infra_category",
                                        "created_at",
                                        "updated_at",
                                    ]}
                                    categories={categories}
                                    types={types}
                                    clearRouteName="barangay_infrastructure.index"
                                    clearRouteParams={{}}
                                    showFilters={showFilters}
                                />
                            )}

                            <DynamicTable
                                queryParams={queryParams}
                                passedData={infrastructure}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                </div>

                <InfrastructureSidebarForm
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    modalState={modalState}
                    infrastructureDetails={infrastructureDetails}
                    data={data}
                    errors={errors}
                    infrastructure_types={infrastructure_types}
                    handleSubmitInfrastruture={handleSubmitInfrastruture}
                    handleUpdateInfrastruture={handleUpdateInfrastruture}
                    handleInfrastructureFieldChange={
                        handleInfrastructureFieldChange
                    }
                    removeInfrastructure={removeInfrastructure}
                    addInfrastructure={addInfrastructure}
                    reset={reset}
                />

                {/* Delete Confirmation */}
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    residentId={infraToDelete}
                />
            </div>
        </AdminLayout>
    );
}
