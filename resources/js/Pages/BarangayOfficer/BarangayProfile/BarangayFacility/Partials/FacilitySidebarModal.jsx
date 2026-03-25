import { Button } from "@/components/ui/button";
import SidebarModal from "@/components/SidebarModal";
import InputLabel from "@/components/InputLabel";
import InputError from "@/components/InputError";
import InputField from "@/components/InputField";
import DropdownInputField from "@/components/DropdownInputField";

import {
    Building2,
    ImagePlus,
    Info,
    RotateCcw,
    Save,
    Trash2,
    Warehouse,
} from "lucide-react";
import { IoIosAddCircleOutline, IoIosArrowForward } from "react-icons/io";

export default function FacilitySidebarModal({
    isOpen,
    onClose,
    modalState,
    facilityDetails,
    data,
    errors,
    handleSubmitFacility,
    handleUpdateFacility,
    handleFacilityFieldChange,
    removeFacility,
    addFacility,
    reset,
}) {
    const isEdit = modalState === "edit" || facilityDetails !== null;

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Facility" : "Add Facility"}
        >
            <div className="space-y-6 bg-white p-1 text-sm text-slate-800">
                <form
                    onSubmit={
                        facilityDetails
                            ? handleUpdateFacility
                            : handleSubmitFacility
                    }
                    className="space-y-6"
                >
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    {isEdit
                                        ? "Update Barangay Facility Information"
                                        : "Add Barangay Facility Information"}
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Provide complete details about existing
                                    barangay facilities, including photo, name,
                                    type, and quantity for proper record
                                    management.
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
                                    Facility Records
                                </p>
                                <p className="mt-1 text-xs leading-5 text-blue-700">
                                    Add one or more facilities and include the
                                    corresponding image, facility type, and
                                    quantity to maintain accurate barangay
                                    infrastructure data.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {Array.isArray(data.facilities) &&
                            data.facilities.map((facility, facIdx) => (
                                <div
                                    key={facIdx}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                                <Warehouse className="h-4 w-4 text-blue-600" />
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">
                                                    Facility #{facIdx + 1}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Enter the facility details
                                                    below.
                                                </p>
                                            </div>
                                        </div>

                                        {facilityDetails === null && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFacility(facIdx)
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-6">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                                            <div className="mb-3 flex items-center gap-2">
                                                <ImagePlus className="h-4 w-4 text-slate-500" />
                                                <InputLabel
                                                    htmlFor={`facility_image_${facIdx}`}
                                                    value="Facility Photo"
                                                />
                                            </div>

                                            <div className="flex justify-center">
                                                <img
                                                    src={
                                                        facility.previewImage ||
                                                        "/images/default-avatar.jpg"
                                                    }
                                                    alt="Facility"
                                                    className="h-36 w-full rounded-xl border border-slate-200 object-cover shadow-sm"
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <input
                                                    id={`facility_image_${facIdx}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file) {
                                                            handleFacilityFieldChange(
                                                                file,
                                                                facIdx,
                                                                "facility_image",
                                                            );
                                                        }
                                                    }}
                                                    className="block w-full text-sm text-slate-500
                                                        file:mr-3 file:rounded-lg file:border-0
                                                        file:bg-blue-50 file:px-4 file:py-2
                                                        file:text-sm file:font-medium
                                                        file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Upload a clear image of the
                                                    facility.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `facilities.${facIdx}.facility_image`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-5 md:col-span-4">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <InputField
                                                    label="Facility Name"
                                                    type="text"
                                                    name={`facilities.${facIdx}.name`}
                                                    value={facility.name || ""}
                                                    onChange={(e) =>
                                                        handleFacilityFieldChange(
                                                            e.target.value,
                                                            facIdx,
                                                            "name",
                                                        )
                                                    }
                                                    placeholder="Enter facility name"
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Enter the official or common
                                                    name of the facility.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `facilities.${facIdx}.name`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <DropdownInputField
                                                        label="Facility Type"
                                                        name={`facilities.${facIdx}.facility_type`}
                                                        value={
                                                            facility.facility_type ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleFacilityFieldChange(
                                                                e.target.value,
                                                                facIdx,
                                                                "facility_type",
                                                            )
                                                        }
                                                        items={[
                                                            {
                                                                label: "Government",
                                                                value: "government",
                                                            },
                                                            {
                                                                label: "Protection",
                                                                value: "protection",
                                                            },
                                                            {
                                                                label: "Security",
                                                                value: "security",
                                                            },
                                                            {
                                                                label: "Finance",
                                                                value: "finance",
                                                            },
                                                            {
                                                                label: "Service",
                                                                value: "service",
                                                            },
                                                            {
                                                                label: "Commerce",
                                                                value: "commerce",
                                                            },
                                                        ]}
                                                        placeholder="Select facility type"
                                                    />
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        Choose the category that
                                                        best describes the
                                                        facility.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `facilities.${facIdx}.facility_type`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <InputField
                                                        type="number"
                                                        label="Quantity"
                                                        name={`facilities.${facIdx}.quantity`}
                                                        value={
                                                            facility.quantity ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleFacilityFieldChange(
                                                                e.target.value,
                                                                facIdx,
                                                                "quantity",
                                                            )
                                                        }
                                                        placeholder="Enter quantity"
                                                    />
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        Specify how many of this
                                                        facility are available.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `facilities.${facIdx}.quantity`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                {facilityDetails === null && (
                                    <button
                                        type="button"
                                        onClick={addFacility}
                                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <IoIosAddCircleOutline className="text-xl" />
                                        Add Facility
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {facilityDetails === null && (
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
                                    {facilityDetails ? "Update" : "Save"}
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
