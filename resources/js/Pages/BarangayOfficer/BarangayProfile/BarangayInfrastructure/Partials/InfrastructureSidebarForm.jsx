import { Button } from "@/components/ui/button";
import SidebarModal from "@/Components/SidebarModal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import DropdownInputField from "@/Components/DropdownInputField";
import {
    Building2,
    ImagePlus,
    Info,
    RotateCcw,
    Save,
    Trash2,
} from "lucide-react";
import { IoIosAddCircleOutline, IoIosArrowForward } from "react-icons/io";

export default function InfrastructureSidebarForm({
    isOpen,
    onClose,
    modalState,
    infrastructureDetails,
    data,
    errors,
    infrastructure_types,
    handleSubmitInfrastruture,
    handleUpdateInfrastruture,
    handleInfrastructureFieldChange,
    removeInfrastructure,
    addInfrastructure,
    reset,
}) {
    const isEdit = infrastructureDetails !== null || modalState === "edit";

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Infrastructure" : "Add Infrastructure"}
        >
            <div className="space-y-6 bg-white p-1 text-sm text-slate-800">
                <form
                    onSubmit={
                        infrastructureDetails
                            ? handleUpdateInfrastruture
                            : handleSubmitInfrastruture
                    }
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
                                <Building2 className="h-6 w-6 text-indigo-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    {isEdit
                                        ? "Update Infrastructure Information"
                                        : "Add Infrastructure Information"}
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Provide the details of existing barangay
                                    facilities, utilities, and structures for
                                    proper monitoring and reporting.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info note */}
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-full bg-blue-100 p-2">
                                <Info className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-blue-900">
                                    Infrastructure Entry
                                </p>
                                <p className="mt-1 text-xs leading-5 text-blue-700">
                                    Add one or more infrastructure records with
                                    image, type, category, and quantity. Make
                                    sure all information is accurate before
                                    saving.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure items */}
                    <div className="space-y-5">
                        {Array.isArray(data.infrastructures) &&
                            data.infrastructures.map(
                                (infrastructure, infraIdx) => (
                                    <div
                                        key={infraIdx}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">
                                                    Infrastructure #
                                                    {infraIdx + 1}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Upload the image and fill in
                                                    the infrastructure details.
                                                </p>
                                            </div>

                                            {!isEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeInfrastructure(
                                                            infraIdx,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-6">
                                            {/* Image panel */}
                                            <div className="lg:col-span-2">
                                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                                    <div className="mb-4 flex items-center gap-2">
                                                        <div className="rounded-lg bg-indigo-100 p-2">
                                                            <ImagePlus className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                        <h5 className="text-sm font-semibold text-slate-900">
                                                            Infrastructure Photo
                                                        </h5>
                                                    </div>

                                                    <div className="flex flex-col items-center text-center">
                                                        <img
                                                            src={
                                                                infrastructure.previewImage
                                                                    ? infrastructure.previewImage
                                                                    : "/images/default-avatar.jpg"
                                                            }
                                                            alt="Infrastructure"
                                                            className="h-32 w-32 rounded-xl border border-slate-200 object-cover shadow-sm"
                                                        />

                                                        <label
                                                            htmlFor={`infrastructure_image_${infraIdx}`}
                                                            className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                                        >
                                                            Choose Photo
                                                        </label>

                                                        <input
                                                            id={`infrastructure_image_${infraIdx}`}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file =
                                                                    e.target
                                                                        .files[0];
                                                                if (file) {
                                                                    handleInfrastructureFieldChange(
                                                                        file,
                                                                        infraIdx,
                                                                        "infrastructure_image",
                                                                    );
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />

                                                        <p className="mt-3 text-xs leading-5 text-slate-500">
                                                            Upload a clear image
                                                            of the
                                                            infrastructure.
                                                        </p>

                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `infrastructures.${infraIdx}.infrastructure_image`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-4 lg:col-span-4">
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <DropdownInputField
                                                        label="Infrastructure Type"
                                                        name="infrastructure_type"
                                                        value={
                                                            infrastructure.infrastructure_type ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleInfrastructureFieldChange(
                                                                e.target.value,
                                                                infraIdx,
                                                                "infrastructure_type",
                                                            )
                                                        }
                                                        items={
                                                            infrastructure_types
                                                        }
                                                        placeholder="Select or enter infrastructure type"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `infrastructures.${infraIdx}.infrastructure_type`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                                                        <DropdownInputField
                                                            label="Infrastructure Category"
                                                            name="infrastructure_category"
                                                            value={
                                                                infrastructure.infrastructure_category ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleInfrastructureFieldChange(
                                                                    e.target
                                                                        .value,
                                                                    infraIdx,
                                                                    "infrastructure_category",
                                                                )
                                                            }
                                                            placeholder="Select or enter category"
                                                            items={[
                                                                {
                                                                    label: "Disaster and Community Facilities",
                                                                    value: "Disaster and Community Facilities",
                                                                },
                                                                {
                                                                    label: "Health and Medical",
                                                                    value: "Health and Medical",
                                                                },
                                                                {
                                                                    label: "Educational",
                                                                    value: "Educational",
                                                                },
                                                                {
                                                                    label: "Agricultural",
                                                                    value: "Agricultural",
                                                                },
                                                            ]}
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `infrastructures.${infraIdx}.infrastructure_category`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                        <InputField
                                                            type="number"
                                                            label="Quantity"
                                                            name="quantity"
                                                            value={
                                                                infrastructure.quantity ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleInfrastructureFieldChange(
                                                                    e.target
                                                                        .value,
                                                                    infraIdx,
                                                                    "quantity",
                                                                )
                                                            }
                                                            placeholder="Enter quantity"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `infrastructures.${infraIdx}.quantity`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                {!isEdit && (
                                    <button
                                        type="button"
                                        onClick={addInfrastructure}
                                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <IoIosAddCircleOutline className="text-xl" />
                                        Add Infrastructure
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {!isEdit && (
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
                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                                    type="submit"
                                >
                                    {infrastructureDetails ? "Update" : "Save"}
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
