import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import AdminLayout from "@/Layouts/AdminLayout";
import ActionMenu from "@/Components/ActionMenu";
import {
    Home,
    ListPlus,
    Search,
    CalendarDays,
    Package,
    ShieldCheck,
    SquarePen,
    Tag,
    Trash2,
    Truck,
} from "lucide-react";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import InventorySidebarModal from "./Partials/InventorySidebarModal";
import PageHeader from "@/Components/PageHeader";
import { Toaster, toast } from "sonner";
import TableSearchBar from "@/Components/TableSearchBar";

const InventoryIndex = ({
    inventory_items,
    categories,
    units,
    queryParams,
}) => {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Inventories", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [itemDetails, setItemDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [itemToDelete, setItemToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "item_name", label: "Item" },
        { key: "item_category", label: "Category" },
        { key: "quantity", label: "Quantity" },
        { key: "unit", label: "Unit" },
        { key: "status", label: "Status" },
        { key: "received_date", label: "Date Recieved" },
        { key: "supplier", label: "Supplier" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("inventory_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "inventory_visible_columns",
            JSON.stringify(visibleColumns),
        );
    }, [visibleColumns]);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["inventory_status", "item_category", "date_recieved"].includes(
                key,
            ) &&
            value &&
            value !== "",
    );
    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);
    const [showFilters, setShowFilters] = useState(hasActiveFilter);

    const searchFieldName = (field, value) => {
        if (value && value.trim() !== "") {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        if (queryParams.page) {
            delete queryParams.page;
        }
        router.get(route("inventory.index", queryParams));
    };

    const formatDate = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const statusStyles = {
        available: "bg-emerald-50 text-emerald-700 border-emerald-200",
        low_stock: "bg-amber-50 text-amber-700 border-amber-200",
        out_of_stock: "bg-red-50 text-red-700 border-red-200",
    };

    const categoryStyles = {
        food: "bg-orange-50 text-orange-700 border-orange-200",
        medicine: "bg-blue-50 text-blue-700 border-blue-200",
        equipment: "bg-violet-50 text-violet-700 border-violet-200",
        relief_goods: "bg-cyan-50 text-cyan-700 border-cyan-200",
        other: "bg-slate-50 text-slate-700 border-slate-200",
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

        item_name: (row) => (
            <div className="min-w-0 space-y-1">
                <div className="truncate text-sm font-semibold text-slate-900">
                    {row.item_name || "Unnamed Item"}
                </div>
            </div>
        ),

        item_category: (row) => (
            <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                    categoryStyles[row.item_category] ||
                    "bg-slate-50 text-slate-700 border-slate-200"
                }`}
            >
                <Tag className="h-3.5 w-3.5" />
                {formatLabel(row.item_category)}
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

        year_established: (row) => (
            <span className="text-sm font-medium text-slate-700">
                {row.year_established || "—"}
            </span>
        ),

        unit: (row) => (
            <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {row.unit || "—"}
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

        received_date: (row) => (
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{formatDate(row.received_date)}</span>
                </div>
                <div className="pl-5 text-xs text-slate-500">Received Date</div>
            </div>
        ),

        supplier: (row) => (
            <div className="min-w-0 space-y-1">
                <div className="truncate text-sm font-medium text-slate-800">
                    {row.supplier || "—"}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Truck className="h-3.5 w-3.5" />
                    <span>Supplier / Source</span>
                </div>
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
    const handleAddInstitution = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        inventory_items: [[]],
        _method: undefined,
        item_id: null,
    });

    const addItem = () => {
        setData("inventory_items", [...(data.inventory_items || []), {}]);
    };
    const removeItem = (instiIdx) => {
        const updated = [...(data.inventory_items || [])];
        updated.splice(instiIdx, 1);
        setData("inventory_items", updated);
        toast.warning("Item removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setItemDetails(null);
        reset();
        clearErrors();
    };

    const handleInventoryFieldChange = (value, instIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.inventory_items];

            // make sure the institution entry exists
            if (!updated[instIdx]) {
                updated[instIdx] = {};
            }

            updated[instIdx] = {
                ...updated[instIdx],
                [field]: value,
            };

            return { ...prevData, inventory_items: updated };
        });
    };
    const handleSubmitInventory = (e) => {
        e.preventDefault();
        post(route("inventory.store"), {
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
                `${APP_URL}/inventory/details/${id}`,
            );

            const inventory = response.data.item;
            //console.log(inventory);

            setItemDetails(inventory);
            setData({
                inventory_items: [
                    {
                        item_name: inventory.item_name || "",
                        item_category: inventory.item_category || "",
                        quantity: inventory.quantity || "",
                        unit: inventory.unit || "",
                        received_date: inventory.received_date || "",
                        supplier: inventory.supplier || "",
                        status: inventory.status || "",
                    },
                ],
                _method: "PUT",
                item_id: inventory.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching inventory details:", error);
        }
    };
    const handleUpdateInventory = (e) => {
        e.preventDefault();
        post(route("inventory.update", data.item_id), {
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

    // delete
    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("inventory.destroy", itemToDelete), {
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
            <Head title="Barangay Inventories" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="pt-4 mb-10">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        {/* Header */}
                        <PageHeader
                            title="Barangay Inventory Overview"
                            description="Review, filter, and manage barangay inventory items efficiently. Monitor stock levels, categories, and units with ease."
                            icon={Home}
                            iconWrapperClassName="bg-green-100 text-green-600 rounded-full"
                            containerClassName="bg-gray-50 border-transparent shadow-sm"
                            titleClassName="text-gray-900"
                            descriptionClassName="text-gray-500"
                            actions={
                                <Button
                                    onClick={handleAddInstitution}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <ListPlus className="mr-2 h-4 w-4" />
                                    Add Item
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
                                        url="barangay_inventory.index"
                                        queryParams={queryParams}
                                        field="name"
                                        label="Search Inventory"
                                        placeholder="Search Inventory Items"
                                    />
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "inventory_status",
                                        "item_category",
                                        "date_recieved",
                                    ]}
                                    inventory_items={inventory_items}
                                    clearRouteName="inventory.index"
                                    clearRouteParams={{}}
                                    showFilters={showFilters}
                                    types={categories}
                                />
                            )}
                            <DynamicTable
                                passedData={inventory_items}
                                queryParams={queryParams}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                </div>
                <InventorySidebarModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    modalState={modalState}
                    itemDetails={itemDetails}
                    data={data}
                    errors={errors}
                    handleSubmitInventory={handleSubmitInventory}
                    handleUpdateInventory={handleUpdateInventory}
                    handleInventoryFieldChange={handleInventoryFieldChange}
                    removeItem={removeItem}
                    addItem={addItem}
                    reset={reset}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={confirmDelete}
                    residentId={itemToDelete}
                />
            </div>
        </AdminLayout>
    );
};

export default InventoryIndex;
