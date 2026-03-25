import SidebarModal from "@/components/SidebarModal";
import { Button } from "@/components/ui/button";
import InputLabel from "@/components/InputLabel";
import InputError from "@/components/InputError";
import InputField from "@/components/InputField";
import DropdownInputField from "@/components/DropdownInputField";
import SelectField from "@/components/SelectField";

import {
    FolderKanban,
    ImagePlus,
    Info,
    Landmark,
    CalendarDays,
    BadgeDollarSign,
    RotateCcw,
    Save,
    Trash2,
} from "lucide-react";
import { IoIosAddCircleOutline, IoIosArrowForward } from "react-icons/io";
import { Textarea } from "@/Components/ui/textarea";

export default function ProjectSidebarModal({
    isOpen,
    onClose,
    modalState,
    projectDetails,
    data,
    errors,
    handleSubmitProject,
    handleUpdateProject,
    handleProjectFieldChange,
    removeProject,
    addProject,
    reset,
}) {
    const isEdit = modalState === "edit" || projectDetails !== null;

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Project" : "Add Project"}
        >
            <div className="space-y-6 bg-white p-1 text-sm text-slate-800">
                <form
                    onSubmit={
                        projectDetails
                            ? handleUpdateProject
                            : handleSubmitProject
                    }
                    className="space-y-6"
                >
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                <FolderKanban className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    {isEdit
                                        ? "Update Barangay Development Project"
                                        : "Add Barangay Development Project"}
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Provide complete project information,
                                    including category, status, funding,
                                    schedule, and responsible institution for
                                    proper barangay project monitoring.
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
                                    Project Records
                                </p>
                                <p className="mt-1 text-xs leading-5 text-blue-700">
                                    Add one or more development projects and
                                    include the necessary details to keep
                                    barangay planning and implementation records
                                    organized and updated.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {Array.isArray(data.projects) &&
                            data.projects.map((project, projIdx) => (
                                <div
                                    key={projIdx}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                                <FolderKanban className="h-4 w-4 text-blue-600" />
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">
                                                    Project #{projIdx + 1}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Enter the project details
                                                    below.
                                                </p>
                                            </div>
                                        </div>

                                        {projectDetails === null && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeProject(projIdx)
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
                                                    htmlFor={`project_image_${projIdx}`}
                                                    value="Project Photo"
                                                />
                                            </div>

                                            <div className="flex justify-center">
                                                <img
                                                    src={
                                                        project.previewImage ||
                                                        "/images/default-avatar.jpg"
                                                    }
                                                    alt="Project"
                                                    className="h-36 w-full rounded-xl border border-slate-200 object-cover shadow-sm"
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <input
                                                    id={`project_image_${projIdx}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file) {
                                                            handleProjectFieldChange(
                                                                file,
                                                                projIdx,
                                                                "project_image",
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
                                                    Upload a clear image related
                                                    to the project.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `projects.${projIdx}.project_image`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-5 md:col-span-4">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <InputField
                                                    label="Project Title"
                                                    name={`projects.${projIdx}.title`}
                                                    value={project.title || ""}
                                                    onChange={(e) =>
                                                        handleProjectFieldChange(
                                                            e.target.value,
                                                            projIdx,
                                                            "title",
                                                        )
                                                    }
                                                    placeholder="e.g. Barangay Health Center Construction"
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Enter the official title or
                                                    name of the project.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `projects.${projIdx}.title`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <DropdownInputField
                                                    label="Category"
                                                    name={`projects.${projIdx}.category`}
                                                    value={
                                                        project.category || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleProjectFieldChange(
                                                            e.target.value,
                                                            projIdx,
                                                            "category",
                                                        )
                                                    }
                                                    placeholder="Select category"
                                                    items={[
                                                        {
                                                            label: "Infrastructure",
                                                            value: "infrastructure",
                                                        },
                                                        {
                                                            label: "Health",
                                                            value: "health",
                                                        },
                                                        {
                                                            label: "Education",
                                                            value: "education",
                                                        },
                                                        {
                                                            label: "Livelihood",
                                                            value: "livelihood",
                                                        },
                                                        {
                                                            label: "Others",
                                                            value: "others",
                                                        },
                                                    ]}
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Select the category that
                                                    best matches this project.
                                                </p>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `projects.${projIdx}.category`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <Textarea
                                                label="Description"
                                                name={`projects.${projIdx}.description`}
                                                value={
                                                    project.description || ""
                                                }
                                                onChange={(e) =>
                                                    handleProjectFieldChange(
                                                        e.target.value,
                                                        projIdx,
                                                        "description",
                                                    )
                                                }
                                                className="text-gray-600"
                                                placeholder="Brief description of the project..."
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Provide a concise explanation of
                                                the project scope and purpose.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `projects.${projIdx}.description`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <SelectField
                                                label="Status"
                                                name={`projects.${projIdx}.status`}
                                                value={project.status || ""}
                                                onChange={(e) =>
                                                    handleProjectFieldChange(
                                                        e.target.value,
                                                        projIdx,
                                                        "status",
                                                    )
                                                }
                                                items={[
                                                    {
                                                        label: "Planning",
                                                        value: "planning",
                                                    },
                                                    {
                                                        label: "Ongoing",
                                                        value: "ongoing",
                                                    },
                                                    {
                                                        label: "Completed",
                                                        value: "completed",
                                                    },
                                                    {
                                                        label: "Cancelled",
                                                        value: "cancelled",
                                                    },
                                                ]}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `projects.${projIdx}.status`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="md:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <DropdownInputField
                                                label="Responsible Institution"
                                                name={`projects.${projIdx}.responsible_institution`}
                                                value={
                                                    project.responsible_institution ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleProjectFieldChange(
                                                        e.target.value,
                                                        projIdx,
                                                        "responsible_institution",
                                                    )
                                                }
                                                placeholder="Enter institution"
                                            />
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <Landmark className="h-3.5 w-3.5" />
                                                Institution or office in charge
                                                of this project.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `projects.${projIdx}.responsible_institution`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <InputField
                                                type="number"
                                                step="0.01"
                                                label="Budget (₱)"
                                                name={`projects.${projIdx}.budget`}
                                                value={project.budget || ""}
                                                onChange={(e) =>
                                                    handleProjectFieldChange(
                                                        e.target.value,
                                                        projIdx,
                                                        "budget",
                                                    )
                                                }
                                                placeholder="e.g. 500000"
                                            />
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <BadgeDollarSign className="h-3.5 w-3.5" />
                                                Estimated or approved project
                                                budget.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `projects.${projIdx}.budget`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="md:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <InputField
                                                label="Funding Source"
                                                name={`projects.${projIdx}.funding_source`}
                                                value={
                                                    project.funding_source || ""
                                                }
                                                onChange={(e) =>
                                                    handleProjectFieldChange(
                                                        e.target.value,
                                                        projIdx,
                                                        "funding_source",
                                                    )
                                                }
                                                placeholder="e.g. LGU, NGO, National Government"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `projects.${projIdx}.funding_source`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="md:col-span-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <InputField
                                                type="date"
                                                label="Start Date"
                                                name={`projects.${projIdx}.start_date`}
                                                value={project.start_date || ""}
                                                onChange={(e) =>
                                                    handleProjectFieldChange(
                                                        e.target.value,
                                                        projIdx,
                                                        "start_date",
                                                    )
                                                }
                                            />
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                Planned or actual project start
                                                date.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `projects.${projIdx}.start_date`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="md:col-span-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <InputField
                                                type="date"
                                                label="End Date"
                                                name={`projects.${projIdx}.end_date`}
                                                value={project.end_date || ""}
                                                onChange={(e) =>
                                                    handleProjectFieldChange(
                                                        e.target.value,
                                                        projIdx,
                                                        "end_date",
                                                    )
                                                }
                                            />
                                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                Expected or completed end date.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `projects.${projIdx}.end_date`
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
                                {projectDetails === null && (
                                    <button
                                        type="button"
                                        onClick={addProject}
                                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <IoIosAddCircleOutline className="text-xl" />
                                        Add Project
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {projectDetails === null && (
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
                                    {projectDetails ? "Update" : "Save"}
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
