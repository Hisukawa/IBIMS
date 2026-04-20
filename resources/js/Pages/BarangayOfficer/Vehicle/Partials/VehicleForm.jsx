// resources/js/Components/VehicleForm.jsx
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import {
    MoveRight,
    RotateCcw,
    CarFront,
    UserCircle2,
    Info,
    BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import RadioGroup from "@/Components/RadioGroup";

export default function VehicleForm({
    data,
    errors,
    vehicleDetails,
    residentsList,
    handleResidentChange,
    handleArrayValues,
    addVehicle,
    removeVehicle,
    reset,
    onSubmit,
}) {
    const vehicleCount = Array.isArray(data.vehicles)
        ? data.vehicles.length
        : 0;

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                        <CarFront className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                            {vehicleDetails
                                ? "Update Vehicle Information"
                                : "Register Vehicle Information"}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                            {vehicleDetails
                                ? "Review and update the recorded vehicle information for this resident."
                                : "Add vehicle records associated with the selected resident for profiling and barangay reference."}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                {data.resident_name || "No resident selected"}
                            </div>
                            <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
                                {vehicleCount} vehicle
                                {vehicleCount === 1 ? "" : "s"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resident Information */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h4 className="text-base font-semibold text-slate-900">
                        Resident Information
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                        Select a resident and review the basic profile details
                        before managing vehicle records.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
                    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                        <div className="relative">
                            <img
                                src={
                                    data.resident_image
                                        ? `/storage/${data.resident_image}`
                                        : "/images/default-avatar.jpg"
                                }
                                alt="Resident Image"
                                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                            />
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-medium text-white shadow">
                                Profile
                            </div>
                        </div>

                        <h5 className="mt-4 text-sm font-semibold text-slate-900">
                            {data.resident_name || "No resident selected"}
                        </h5>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            {data.resident_id
                                ? "Preview of the selected resident information."
                                : "Select a resident to display profile details."}
                        </p>
                    </div>

                    <div className="space-y-5 lg:col-span-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <DropdownInputField
                                label="Full Name"
                                name="resident_name"
                                value={data.resident_name || ""}
                                placeholder="Select a resident"
                                onChange={(e) => handleResidentChange(e)}
                                items={residentsList}
                                readOnly={vehicleDetails}
                            />
                            <InputError
                                message={errors.resident_id}
                                className="mt-2"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Choose the resident associated with the vehicle
                                record.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <InputField
                                    label="Birthdate"
                                    name="birthdate"
                                    value={data.birthdate || ""}
                                    readOnly={true}
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Resident's date of birth
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <InputField
                                    label="Purok Number"
                                    name="purok_number"
                                    value={data.purok_number}
                                    readOnly={true}
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Assigned purok information
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicle Details */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h4 className="text-base font-semibold text-slate-900">
                        Vehicle Details
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                        Enter the classification, purpose, and registration
                        status for each vehicle owned or used by the resident.
                    </p>
                </div>

                <div className="space-y-5 p-6">
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-700">
                        <div className="flex items-start gap-2">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                            <p>
                                Add one or more vehicle entries as needed. Make
                                sure all information is correct before saving.
                            </p>
                        </div>
                    </div>

                    {(data.vehicles || []).map((vehicle, vecIndex) => (
                        <div
                            key={vecIndex}
                            className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div>
                                    <div className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-slate-200">
                                        Vehicle #{vecIndex + 1}
                                    </div>
                                    <h5 className="mt-3 text-sm font-semibold text-slate-900">
                                        Vehicle Record
                                    </h5>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Fill in the details for this vehicle
                                        entry.
                                    </p>
                                </div>

                                {!vehicleDetails && (
                                    <button
                                        type="button"
                                        onClick={() => removeVehicle(vecIndex)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                        title="Remove"
                                    >
                                        <IoIosCloseCircleOutline className="text-lg" />
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-1 xl:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <DropdownInputField
                                        label="Vehicle Type"
                                        name="vehicle_type"
                                        value={vehicle.vehicle_type || ""}
                                        items={[
                                            "Motorcycle",
                                            "Tricycle",
                                            "Car",
                                            "Jeep",
                                            "Truck",
                                            "Bicycle",
                                        ]}
                                        onChange={(e) =>
                                            handleArrayValues(
                                                e,
                                                vecIndex,
                                                "vehicle_type",
                                                "vehicles",
                                            )
                                        }
                                        placeholder="Select type"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Select the kind of vehicle.
                                    </p>
                                    <InputError
                                        message={
                                            errors[
                                                `vehicles.${vecIndex}.vehicle_type`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <DropdownInputField
                                        label="Classification"
                                        name="vehicle_class"
                                        value={vehicle.vehicle_class || ""}
                                        items={[
                                            {
                                                label: "Private",
                                                value: "private",
                                            },
                                            {
                                                label: "Public",
                                                value: "public",
                                            },
                                        ]}
                                        onChange={(e) =>
                                            handleArrayValues(
                                                e,
                                                vecIndex,
                                                "vehicle_class",
                                                "vehicles",
                                            )
                                        }
                                        placeholder="Select class"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Identify whether the vehicle is private
                                        or public.
                                    </p>
                                    <InputError
                                        message={
                                            errors[
                                                `vehicles.${vecIndex}.vehicle_class`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <DropdownInputField
                                        label="Usage Purpose"
                                        name="usage_status"
                                        value={vehicle.usage_status || ""}
                                        items={[
                                            {
                                                label: "Personal",
                                                value: "personal",
                                            },
                                            {
                                                label: "Public Transport",
                                                value: "public_transport",
                                            },
                                            {
                                                label: "Business Use",
                                                value: "business_use",
                                            },
                                        ]}
                                        onChange={(e) =>
                                            handleArrayValues(
                                                e,
                                                vecIndex,
                                                "usage_status",
                                                "vehicles",
                                            )
                                        }
                                        placeholder="Select usage"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Specify the primary vehicle use.
                                    </p>
                                    <InputError
                                        message={
                                            errors[
                                                `vehicles.${vecIndex}.usage_status`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <RadioGroup
                                        label="Is Registered?"
                                        name="is_registered"
                                        options={[
                                            { label: "Yes", value: 1 },
                                            { label: "No", value: 0 },
                                        ]}
                                        selectedValue={
                                            vehicle.is_registered || ""
                                        }
                                        onChange={(e) =>
                                            handleArrayValues(
                                                e,
                                                vecIndex,
                                                "is_registered",
                                                "vehicles",
                                            )
                                        }
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Indicate the current registration
                                        status.
                                    </p>
                                    <InputError
                                        message={
                                            errors[
                                                `vehicles.${vecIndex}.is_registered`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {!vehicleDetails && (
                        <div className="flex justify-start">
                            <button
                                type="button"
                                onClick={() => addVehicle()}
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                title="Add vehicle"
                            >
                                <IoIosAddCircleOutline className="text-xl" />
                                Add Another Vehicle
                            </button>
                        </div>
                    )}

                    {vehicleCount === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                                <UserCircle2 className="h-8 w-8 text-slate-400" />
                            </div>
                            <h5 className="mt-4 text-sm font-semibold text-slate-900">
                                No vehicle entries yet
                            </h5>
                            <p className="mt-1 text-sm text-slate-500">
                                Start by adding a vehicle record for this
                                resident.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-slate-500">
                        {vehicleDetails
                            ? "Review the updated vehicle information carefully before saving changes."
                            : "Make sure each vehicle entry is complete and correctly categorized before submitting."}
                    </p>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset()}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>

                        <Button
                            className="bg-blue-700 hover:bg-blue-800"
                            type="submit"
                        >
                            {vehicleDetails ? "Update Vehicle" : "Save Vehicle"}
                            <MoveRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
