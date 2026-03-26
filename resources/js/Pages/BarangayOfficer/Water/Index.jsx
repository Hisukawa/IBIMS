import React, { useState, useEffect } from "react";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import AdminLayout from "@/Layouts/AdminLayout";
import { ListPlus, SquarePen, Trash2, Waves } from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import { Button } from "@/Components/ui/button";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";
import BodyOfWaterSidebarModal from "./Partials/BodyOfWaterSidebarModal";
import PageHeader from "@/Components/PageHeader";
import TableSearchBar from "@/Components/TableSearchBar";

export default function Index({ bodiesOfWater, queryParams }) {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Bodies of Water", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [waterDetails, setWaterDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "exists", label: "Exists" },
        { key: "created_at", label: "Created At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("water_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem(
            "water_visible_columns",
            JSON.stringify(visibleColumns),
        );
    }, [visibleColumns]);

    // Detect active filters
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) => [].includes(key) && value && value !== "",
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
        router.get(route("water.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
    };

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => (
            <span className="font-medium text-gray-900">{row.name || "—"}</span>
        ),

        type: (row) => (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {row.type || "—"}
            </span>
        ),

        exists: (row) => (
            <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    row.exists
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                }`}
            >
                {row.exists ? "Yes" : "No"}
            </span>
        ),

        created_at: (row) => (
            <span className="text-sm text-gray-500">
                {row.created_at
                    ? new Date(row.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "—"}
            </span>
        ),

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEditWater(row.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.id),
                    },
                ]}
            />
        ),
    };
    const types = [
        "Sea",
        "River",
        "Gulf (Inlet)",
        "Lake",
        "Spring",
        "Falls",
        "Creek",
    ];

    const handleAddBodyOfWater = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        bodiesOfWater: [{}], // camelCase matches modal
        _method: undefined,
        water_id: null,
    });

    const handleWaterFieldChange = (value, index, field) => {
        const updated = [...(data.bodiesOfWater || [])];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setData("bodiesOfWater", updated);
    };

    const addWater = () => {
        setData("bodiesOfWater", [
            ...(data.bodiesOfWater || []),
            { name: "", type: "", exists: false },
        ]);
    };

    const removeWater = (index) => {
        const updated = [...(data.bodiesOfWater || [])];
        updated.splice(index, 1);
        setData("bodiesOfWater", updated);

        toast.warning("Body of Water removed.", {
            duration: 2000,
        });
    };

    const handleSubmitWater = (e) => {
        e.preventDefault();
        post(route("water.store"), {
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
    const handleEditWater = async (id) => {
        setModalState("edit");

        try {
            const response = await axios.get(`${APP_URL}/water/details/${id}`);
            const water = response.data.water;
            // console.log(water);
            setWaterDetails(water);
            setData({
                bodiesOfWater: [
                    // ✅ use camelCase — same as form
                    {
                        name: water.name || "",
                        type: water.type || "",
                    },
                ],
                _method: "PUT",
                water_id: water.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching water details:", error);
        }
    };

    const handleUpdateWater = (e) => {
        e.preventDefault();
        post(route("water.update", data.water_id), {
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
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("water.destroy", recordToDelete), {
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
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setWaterDetails(null);
        reset();
        clearErrors();
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
                            title="Bodies of Water Overview"
                            description="View, filter, and manage rivers, lakes, seas, and other bodies of water within your barangay."
                            icon={Waves}
                            iconWrapperClassName="bg-blue-100 text-blue-600 rounded-full"
                            containerClassName="border-0 bg-gray-50 shadow-sm"
                            titleClassName="text-gray-900"
                            descriptionClassName="text-gray-500"
                            actions={
                                <Button
                                    variant="outline"
                                    onClick={handleAddBodyOfWater}
                                    className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                >
                                    <ListPlus className="w-4 h-4" />
                                    Add Body of Water
                                </Button>
                            }
                        />

                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="flex flex-wrap justify-end gap-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <TableSearchBar
                                        url="water.index"
                                        queryParams={queryParams}
                                        label="Search name"
                                        field="search"
                                        placeholder="Search name"
                                        className="w-[300px] max-w-lg"
                                    />
                                </div>
                            </div>

                            <DynamicTable
                                queryParams={queryParams}
                                passedData={bodiesOfWater}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                </div>
                <BodyOfWaterSidebarModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    modalState={modalState}
                    waterDetails={waterDetails}
                    data={data}
                    errors={errors}
                    types={types}
                    handleSubmitWater={handleSubmitWater}
                    handleUpdateWater={handleUpdateWater}
                    handleWaterFieldChange={handleWaterFieldChange}
                    addWater={addWater}
                    removeWater={removeWater}
                    reset={reset}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={confirmDelete}
                    residentId={recordToDelete}
                />
            </div>
        </AdminLayout>
    );
}
