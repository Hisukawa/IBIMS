import SidebarModal from "@/components/SidebarModal";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import InputError from "@/components/InputError";
import DropdownInputField from "@/components/DropdownInputField";
import SelectField from "@/components/SelectField";

import {
    Boxes,
    Info,
    Package,
    RotateCcw,
    Save,
    ShieldAlert,
    Trash2,
    Truck,
    CalendarDays,
} from "lucide-react";
import { IoIosAddCircleOutline, IoIosArrowForward } from "react-icons/io";

export default function InventorySidebarModal({
    isOpen,
    onClose,
    modalState,
    itemDetails,
    data,
    errors,
    handleSubmitInventory,
    handleUpdateInventory,
    handleInventoryFieldChange,
    removeItem,
    addItem,
    reset,
}) {
    const isEdit = modalState === "edit" || itemDetails !== null;

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Inventory Item" : "Add Inventory Item/s"}
        >
            <div className="space-y-6 bg-white p-1 text-sm text-slate-800">
                <form
                    onSubmit={
                        itemDetails
                            ? handleUpdateInventory
                            : handleSubmitInventory
                    }
                    className="space-y-6"
                >
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                <Boxes className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    {isEdit
                                        ? "Update Barangay Inventory"
                                        : "Add Barangay Inventory"}
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Record and manage barangay inventory items
                                    such as food, medicine, equipment, and
                                    relief goods for better stock monitoring and
                                    resource tracking.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-full bg-blue-100 p-2">
                                <Info className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-blue-900">
                                    Inventory Records
                                </p>
                                <p className="mt-1 text-xs leading-5 text-blue-700">
                                    Add one or more inventory items and provide
                                    their quantity, status, unit, supplier, and
                                    date received to keep barangay stock records
                                    complete and updated.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {Array.isArray(data.inventory_items) &&
                            data.inventory_items.map((inventory, invIdx) => (
                                <div
                                    key={invIdx}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                                <Package className="h-4 w-4 text-blue-600" />
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">
                                                    Inventory Item #{invIdx + 1}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Enter the inventory item
                                                    details below.
                                                </p>
                                            </div>
                                        </div>

                                        {itemDetails === null && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(invIdx)
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-6">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                                            <InputField
                                                label="Item Name"
                                                name={`inventory_items.${invIdx}.item_name`}
                                                value={
                                                    inventory.item_name || ""
                                                }
                                                onChange={(e) =>
                                                    handleInventoryFieldChange(
                                                        e.target.value,
                                                        invIdx,
                                                        "item_name",
                                                    )
                                                }
                                                placeholder="e.g. Rice, Medicine, Generator"
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Enter the official or common
                                                name of the inventory item.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `inventory_items.${invIdx}.item_name`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                                            <DropdownInputField
                                                label="Category"
                                                name={`inventory_items.${invIdx}.item_category`}
                                                value={
                                                    inventory.item_category ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInventoryFieldChange(
                                                        e.target.value,
                                                        invIdx,
                                                        "item_category",
                                                    )
                                                }
                                                placeholder="Select category"
                                                items={[
                                                    {
                                                        label: "Food",
                                                        value: "food",
                                                    },
                                                    {
                                                        label: "Medicine",
                                                        value: "medicine",
                                                    },
                                                    {
                                                        label: "Equipment",
                                                        value: "equipment",
                                                    },
                                                    {
                                                        label: "Relief Goods",
                                                        value: "relief_goods",
                                                    },
                                                    {
                                                        label: "Other",
                                                        value: "other",
                                                    },
                                                ]}
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Select the item classification
                                                for better record organization.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `inventory_items.${invIdx}.item_category`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                                            <InputField
                                                label="Quantity"
                                                name={`inventory_items.${invIdx}.quantity`}
                                                type="number"
                                                value={inventory.quantity || ""}
                                                onChange={(e) =>
                                                    handleInventoryFieldChange(
                                                        e.target.value,
                                                        invIdx,
                                                        "quantity",
                                                    )
                                                }
                                                placeholder="Enter quantity"
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Total available stock quantity.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `inventory_items.${invIdx}.quantity`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                                            <InputField
                                                label="Unit"
                                                name={`inventory_items.${invIdx}.unit`}
                                                value={inventory.unit || ""}
                                                onChange={(e) =>
                                                    handleInventoryFieldChange(
                                                        e.target.value,
                                                        invIdx,
                                                        "unit",
                                                    )
                                                }
                                                placeholder="e.g. kg, pcs, box"
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Unit of measurement or
                                                packaging.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `inventory_items.${invIdx}.unit`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                                            <SelectField
                                                label="Status"
                                                name={`inventory_items.${invIdx}.status`}
                                                value={inventory.status || ""}
                                                onChange={(e) =>
                                                    handleInventoryFieldChange(
                                                        e.target.value,
                                                        invIdx,
                                                        "status",
                                                    )
                                                }
                                                items={[
                                                    {
                                                        label: "Available",
                                                        value: "available",
                                                    },
                                                    {
                                                        label: "Low Stock",
                                                        value: "low_stock",
                                                    },
                                                    {
                                                        label: "Out of Stock",
                                                        value: "out_of_stock",
                                                    },
                                                ]}
                                            />
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <ShieldAlert className="h-3.5 w-3.5" />
                                                Current stock availability
                                                status.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `inventory_items.${invIdx}.status`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                                            <InputField
                                                label="Date Received"
                                                name={`inventory_items.${invIdx}.received_date`}
                                                type="date"
                                                value={
                                                    inventory.received_date ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInventoryFieldChange(
                                                        e.target.value,
                                                        invIdx,
                                                        "received_date",
                                                    )
                                                }
                                            />
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                Date when the item was received
                                                by the barangay.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `inventory_items.${invIdx}.received_date`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                                            <InputField
                                                label="Supplier"
                                                name={`inventory_items.${invIdx}.supplier`}
                                                value={inventory.supplier || ""}
                                                onChange={(e) =>
                                                    handleInventoryFieldChange(
                                                        e.target.value,
                                                        invIdx,
                                                        "supplier",
                                                    )
                                                }
                                                placeholder="e.g. Local Distributor, DOH"
                                            />
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <Truck className="h-3.5 w-3.5" />
                                                Source, provider, or distributor
                                                of the inventory item.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `inventory_items.${invIdx}.supplier`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                {itemDetails === null && (
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <IoIosAddCircleOutline className="text-xl" />
                                        Add Item
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {itemDetails === null && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => reset()}
                                        className="inline-flex items-center gap-2"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Reset
                                    </Button>
                                )}

                                <Button
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                    type="submit"
                                >
                                    <Save className="h-4 w-4" />
                                    {itemDetails ? "Update" : "Save"}
                                    <IoIosArrowForward />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </SidebarModal>
    );
}
