import SidebarModal from "@/Components/SidebarModal";
import InputField from "@/Components/InputField";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import { Mountain, Plus, Trash2, RotateCcw, MoveRight } from "lucide-react";

export default function BodyOfLandSidebarModal({
    isOpen,
    onClose,
    modalState = "add",
    landDetails,
    data,
    errors,
    landTypes,
    handleSubmitLand,
    handleUpdateLand,
    handleLandFieldChange,
    addLand,
    removeLand,
    reset,
}) {
    const isEdit = !!landDetails;

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Body of Land" : "Add Body of Land"}
        >
            <div className="w-full space-y-6 bg-white p-1 text-sm text-slate-800">
                <form
                    onSubmit={isEdit ? handleUpdateLand : handleSubmitLand}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                                <Mountain className="h-6 w-6 text-emerald-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    {isEdit
                                        ? "Update Body of Land"
                                        : "Register Body of Land"}
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {isEdit
                                        ? "Edit the existing body of land information for this barangay."
                                        : "Provide accurate information about land formations within your barangay to support environmental profiling, land-use planning, and local resource management."}
                                </p>

                                <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                    {Array.isArray(data.bodiesOfLand) &&
                                    data.bodiesOfLand.length > 0
                                        ? `${data.bodiesOfLand.length} entr${
                                              data.bodiesOfLand.length > 1
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
                                Land Formation Information
                            </h4>
                            <p className="mt-1 text-sm text-slate-500">
                                Add the name and type of each body of land found
                                within the barangay. Multiple entries can be
                                added as needed.
                            </p>
                        </div>

                        <div className="space-y-5 p-6">
                            {Array.isArray(data.bodiesOfLand) &&
                            data.bodiesOfLand.length > 0 ? (
                                data.bodiesOfLand.map((land, idx) => (
                                    <div
                                        key={idx}
                                        className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h5 className="text-sm font-semibold text-slate-900">
                                                    Land Entry #{idx + 1}
                                                </h5>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Enter the identifying
                                                    details of this land
                                                    formation.
                                                </p>
                                            </div>

                                            {!isEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeLand(idx)
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
                                                    label="Name of Body of Land"
                                                    name="name"
                                                    value={land.name || ""}
                                                    onChange={(e) =>
                                                        handleLandFieldChange(
                                                            e.target.value,
                                                            idx,
                                                            "name",
                                                        )
                                                    }
                                                    placeholder="e.g., Mountain A, Hill B, Barangay Field"
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Enter the official, common,
                                                    or local name of the land
                                                    formation.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `bodiesOfLand.${idx}.name`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                                <DropdownInputField
                                                    label="Type of Land Body"
                                                    name="type"
                                                    value={land.type || ""}
                                                    onChange={(e) =>
                                                        handleLandFieldChange(
                                                            e.target.value,
                                                            idx,
                                                            "type",
                                                        )
                                                    }
                                                    items={landTypes}
                                                    placeholder="Select type"
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Choose the classification
                                                    that best describes this
                                                    body of land.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `bodiesOfLand.${idx}.type`
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
                                    <Mountain className="mx-auto h-10 w-10 text-slate-400" />
                                    <h5 className="mt-3 text-sm font-semibold text-slate-900">
                                        No land entries yet
                                    </h5>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Start by adding a body of land for this
                                        barangay.
                                    </p>
                                </div>
                            )}

                            {!isEdit && (
                                <div className="flex justify-start">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addLand}
                                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Another Body of Land
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-5 text-slate-500">
                                {isEdit
                                    ? "Review the updated details before saving changes."
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
                                    className="bg-emerald-700 hover:bg-emerald-800"
                                    type="submit"
                                >
                                    {isEdit
                                        ? "Update Land Entry"
                                        : "Save Land Entry"}
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
