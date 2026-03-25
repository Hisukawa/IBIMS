import SidebarModal from "@/components/SidebarModal";
import { Button } from "@/components/ui/button";
import InputLabel from "@/components/InputLabel";
import InputError from "@/components/InputError";
import InputField from "@/components/InputField";
import DropdownInputField from "@/components/DropdownInputField";
import SelectField from "@/components/SelectField";

import {
    Info,
    ImagePlus,
    Map,
    Route,
    Ruler,
    ShieldCheck,
    Wrench,
    RotateCcw,
    Save,
    Trash2,
} from "lucide-react";
import { IoIosAddCircleOutline, IoIosArrowForward } from "react-icons/io";

export default function RoadSidebarModal({
    isOpen,
    onClose,
    modalState,
    roadDetails,
    data,
    errors,
    handleSubmitRoad,
    handleUpdateRoad,
    handleRoadFieldChange,
    removeRoad,
    addRoad,
    reset,
}) {
    const isEdit = modalState === "edit" || roadDetails !== null;

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Road" : "Add Road"}
        >
            <div className="space-y-6 bg-white p-1 text-sm text-slate-800">
                <form
                    onSubmit={roadDetails ? handleUpdateRoad : handleSubmitRoad}
                    className="space-y-6"
                >
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                <Route className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    {isEdit
                                        ? "Update Barangay Road Information"
                                        : "Add Barangay Road Information"}
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Record road details including image, type,
                                    length, condition, status, and maintenance
                                    information for proper barangay road
                                    monitoring.
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
                                    Road Records
                                </p>
                                <p className="mt-1 text-xs leading-5 text-blue-700">
                                    Add one or more roads and provide their road
                                    type, total length, condition, status, and
                                    maintenance details to keep infrastructure
                                    records complete and updated.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {Array.isArray(data.roads) &&
                            data.roads.map((road, roadIdx) => (
                                <div
                                    key={roadIdx}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                                <Map className="h-4 w-4 text-blue-600" />
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">
                                                    Road #{roadIdx + 1}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Enter the road details
                                                    below.
                                                </p>
                                            </div>
                                        </div>

                                        {roadDetails === null && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeRoad(roadIdx)
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
                                                    htmlFor={`road_image_${roadIdx}`}
                                                    value="Road Image"
                                                />
                                            </div>

                                            <div className="flex justify-center">
                                                <img
                                                    src={
                                                        road.previewImage ||
                                                        "/images/default-avatar.jpg"
                                                    }
                                                    alt="Road"
                                                    className="h-36 w-full rounded-xl border border-slate-200 object-cover shadow-sm"
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <input
                                                    id={`road_image_${roadIdx}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file) {
                                                            handleRoadFieldChange(
                                                                file,
                                                                roadIdx,
                                                                "road_image",
                                                            );
                                                        }
                                                    }}
                                                    className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Upload a clear road image
                                                    for identification and
                                                    record purposes.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `roads.${roadIdx}.road_image`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-5 md:col-span-4">
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <DropdownInputField
                                                        label="Road Type"
                                                        name={`roads.${roadIdx}.road_type`}
                                                        value={
                                                            road.road_type || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleRoadFieldChange(
                                                                e.target.value,
                                                                roadIdx,
                                                                "road_type",
                                                            )
                                                        }
                                                        placeholder="Select road type"
                                                        items={[
                                                            {
                                                                label: "Asphalt",
                                                                value: "asphalt",
                                                            },
                                                            {
                                                                label: "Concrete",
                                                                value: "concrete",
                                                            },
                                                            {
                                                                label: "Gravel",
                                                                value: "gravel",
                                                            },
                                                            {
                                                                label: "Natural Earth Surface",
                                                                value: "natural_earth_surface",
                                                            },
                                                        ]}
                                                    />
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        Select the surface type
                                                        of the road.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `roads.${roadIdx}.road_type`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <InputField
                                                        label="Length (km)"
                                                        name={`roads.${roadIdx}.length`}
                                                        type="number"
                                                        step="0.01"
                                                        value={
                                                            road.length || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleRoadFieldChange(
                                                                e.target.value,
                                                                roadIdx,
                                                                "length",
                                                            )
                                                        }
                                                        placeholder="e.g. 2.50"
                                                    />
                                                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                        <Ruler className="h-3.5 w-3.5" />
                                                        Total measured road
                                                        length in kilometers.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `roads.${roadIdx}.length`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <DropdownInputField
                                                        label="Condition"
                                                        name={`roads.${roadIdx}.condition`}
                                                        value={
                                                            road.condition || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleRoadFieldChange(
                                                                e.target.value,
                                                                roadIdx,
                                                                "condition",
                                                            )
                                                        }
                                                        placeholder="Select condition"
                                                        items={[
                                                            {
                                                                label: "Good",
                                                                value: "good",
                                                            },
                                                            {
                                                                label: "Fair",
                                                                value: "fair",
                                                            },
                                                            {
                                                                label: "Poor",
                                                                value: "poor",
                                                            },
                                                            {
                                                                label: "Under Construction",
                                                                value: "under_construction",
                                                            },
                                                            {
                                                                label: "Impassable",
                                                                value: "impassable",
                                                            },
                                                        ]}
                                                    />
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        Indicate the current
                                                        physical condition of
                                                        the road.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `roads.${roadIdx}.condition`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <SelectField
                                                        label="Status"
                                                        name={`roads.${roadIdx}.status`}
                                                        value={
                                                            road.status || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleRoadFieldChange(
                                                                e.target.value,
                                                                roadIdx,
                                                                "status",
                                                            )
                                                        }
                                                        items={[
                                                            {
                                                                label: "Active",
                                                                value: "active",
                                                            },
                                                            {
                                                                label: "Inactive",
                                                                value: "inactive",
                                                            },
                                                        ]}
                                                    />
                                                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                        <ShieldCheck className="h-3.5 w-3.5" />
                                                        Availability status of
                                                        the road.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `roads.${roadIdx}.status`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <InputField
                                                    label="Maintained By"
                                                    name={`roads.${roadIdx}.maintained_by`}
                                                    value={
                                                        road.maintained_by || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleRoadFieldChange(
                                                            e.target.value,
                                                            roadIdx,
                                                            "maintained_by",
                                                        )
                                                    }
                                                    placeholder="e.g. Barangay Government"
                                                />
                                                <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                    <Wrench className="h-3.5 w-3.5" />
                                                    Office, agency, or group
                                                    responsible for road
                                                    maintenance.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `roads.${roadIdx}.maintained_by`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                {roadDetails === null && (
                                    <button
                                        type="button"
                                        onClick={addRoad}
                                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <IoIosAddCircleOutline className="text-xl" />
                                        Add Road
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {roadDetails === null && (
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
                                    {roadDetails ? "Update" : "Save"}
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
