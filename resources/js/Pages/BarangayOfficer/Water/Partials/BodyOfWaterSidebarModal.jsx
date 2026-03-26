import { Button } from "@/components/ui/button";
import SidebarModal from "@/Components/SidebarModal";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import { Droplets, MoveRight, RotateCcw, Plus, Trash2 } from "lucide-react";

export default function BodyOfWaterSidebarModal({
    isOpen,
    onClose,
    modalState,
    waterDetails,
    data,
    errors,
    types,
    handleSubmitWater,
    handleUpdateWater,
    handleWaterFieldChange,
    addWater,
    removeWater,
    reset,
}) {
    const isEdit = !!waterDetails;

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Body of Water" : "Add Body of Water"}
        >
            <div className="w-full space-y-6 bg-white p-1 text-sm text-slate-800">
                <form
                    onSubmit={isEdit ? handleUpdateWater : handleSubmitWater}
                    className="space-y-6"
                >
                    {/* Header / Intro */}
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100">
                                <Droplets className="h-6 w-6 text-cyan-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    {isEdit
                                        ? "Update Body of Water"
                                        : "Register Body of Water"}
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {isEdit
                                        ? "Edit the existing body of water information for this barangay."
                                        : "Add and manage bodies of water located within the barangay for environmental profiling, planning, and hazard assessment."}
                                </p>

                                <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                    {Array.isArray(data.bodiesOfWater) &&
                                    data.bodiesOfWater.length > 0
                                        ? `${data.bodiesOfWater.length} entr${
                                              data.bodiesOfWater.length > 1
                                                  ? "ies"
                                                  : "y"
                                          }`
                                        : "No entries yet"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Section */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h4 className="text-base font-semibold text-slate-900">
                                Water Body Information
                            </h4>
                            <p className="mt-1 text-sm text-slate-500">
                                Provide the name and type of each body of water
                                found in the barangay. Add multiple entries when
                                needed.
                            </p>
                        </div>

                        <div className="space-y-5 p-6">
                            {Array.isArray(data.bodiesOfWater) &&
                            data.bodiesOfWater.length > 0 ? (
                                data.bodiesOfWater.map((water, idx) => (
                                    <div
                                        key={idx}
                                        className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h5 className="text-sm font-semibold text-slate-900">
                                                    Water Entry #{idx + 1}
                                                </h5>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Enter the identifying
                                                    details of this water
                                                    resource.
                                                </p>
                                            </div>

                                            {!isEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeWater(idx)
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                <InputField
                                                    label="Name of Body of Water"
                                                    name="name"
                                                    value={water.name || ""}
                                                    onChange={(e) =>
                                                        handleWaterFieldChange(
                                                            e.target.value,
                                                            idx,
                                                            "name",
                                                        )
                                                    }
                                                    placeholder="e.g., Cagayan River, San Pablo Creek"
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Enter the official, known,
                                                    or local name of the body of
                                                    water.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `bodiesOfWater.${idx}.name`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                <DropdownInputField
                                                    label="Type of Water Body"
                                                    name="type"
                                                    value={water.type || ""}
                                                    onChange={(e) =>
                                                        handleWaterFieldChange(
                                                            e.target.value,
                                                            idx,
                                                            "type",
                                                        )
                                                    }
                                                    items={types}
                                                    placeholder="Select type"
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Choose the category that
                                                    best describes this body of
                                                    water.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `bodiesOfWater.${idx}.type`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                                    <Droplets className="mx-auto h-10 w-10 text-slate-400" />
                                    <h5 className="mt-3 text-sm font-semibold text-slate-900">
                                        No water entries yet
                                    </h5>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Start by adding a body of water for this
                                        barangay.
                                    </p>
                                </div>
                            )}

                            {!isEdit && (
                                <div className="flex justify-start">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addWater}
                                        className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Another Body of Water
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-5 text-slate-500">
                                {isEdit
                                    ? "Review the updated details carefully before saving changes."
                                    : "Make sure all entries are complete and accurate before submitting."}
                            </p>

                            <div className="flex items-center justify-end gap-2">
                                {!isEdit && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => reset()}
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    className="bg-cyan-700 hover:bg-cyan-800"
                                    type="submit"
                                >
                                    {isEdit
                                        ? "Update Water Entry"
                                        : "Save Water Entry"}
                                    <MoveRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </SidebarModal>
    );
}
