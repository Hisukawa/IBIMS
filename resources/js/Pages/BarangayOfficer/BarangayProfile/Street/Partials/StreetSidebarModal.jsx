import SidebarModal from "@/Components/SidebarModal";
import InputField from "@/Components/InputField";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import { MapPinned, RotateCcw, MoveRight } from "lucide-react";

export default function StreetSidebarModal({
    isOpen,
    onClose,
    modalState = "add",
    streetDetails,
    data,
    setData,
    errors,
    purok_numbers = [],
    handleSubmitStreet,
    handleUpdateStreet,
    reset,
}) {
    const isEdit = !!streetDetails;

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Street" : "Add Street"}
        >
            <div className="w-full space-y-6 bg-white p-1 text-sm text-slate-800">
                <form
                    onSubmit={isEdit ? handleUpdateStreet : handleSubmitStreet}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                <MapPinned className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    {isEdit
                                        ? "Update Street Information"
                                        : "Register New Street"}
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {isEdit
                                        ? "Modify the street details and assign it to the appropriate purok."
                                        : "Add a new street record for your barangay and link it to its corresponding purok."}
                                </p>

                                <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                    {isEdit
                                        ? "Editing existing street"
                                        : "Creating new street entry"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Section */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h4 className="text-base font-semibold text-slate-900">
                                Street Details
                            </h4>
                            <p className="mt-1 text-sm text-slate-500">
                                Enter the street name and select the purok where
                                it belongs.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-6">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <InputField
                                    label="Street Name"
                                    name="street_name"
                                    value={data.street_name || ""}
                                    onChange={(e) =>
                                        setData("street_name", e.target.value)
                                    }
                                    placeholder="Enter street name"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Use the official or commonly recognized name
                                    of the street.
                                </p>
                                <InputError
                                    message={errors.street_name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <DropdownInputField
                                    label="Purok"
                                    name="purok_id"
                                    value={data.purok_id || ""}
                                    onChange={(e) =>
                                        setData("purok_id", e.target.value)
                                    }
                                    placeholder="Select purok"
                                    items={purok_numbers}
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Assign this street to the correct purok for
                                    better barangay mapping and organization.
                                </p>
                                <InputError
                                    message={errors.purok_id}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-5 text-slate-500">
                                {isEdit
                                    ? "Double-check the updated details before saving."
                                    : "Make sure the street name and purok assignment are correct before submitting."}
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
                                    className="bg-blue-700 hover:bg-blue-800"
                                    type="submit"
                                >
                                    {isEdit ? "Update Street" : "Save Street"}
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
