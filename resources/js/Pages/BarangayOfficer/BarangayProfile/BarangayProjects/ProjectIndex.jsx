import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Home,
    ListPlus,
    SquarePen,
    Trash2,
    CalendarDays,
    Landmark,
    PhilippinePeso,
    Tag,
} from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Button } from "@/Components/ui/button";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { PROJECT_STATUS_CLASS, PROJECT_STATUS_TEXT } from "@/constants";
import { Toaster, toast } from "sonner";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import ProjectSidebarModal from "./Partials/ProjectSidebarModal";
import PageHeader from "@/Components/PageHeader";
import TableSearchBar from "@/Components/TableSearchBar";

const ProjectIndex = ({ projects, institutions, categories, queryParams }) => {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Infrastructures", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [projectDetails, setProjectDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [projectToDelete, setProjectToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "title", label: "Title" },
        { key: "image", label: "Project Image" },
        { key: "description", label: "Description" },
        { key: "status", label: "Status" },
        { key: "category", label: "Category" },
        { key: "responsible_institution", label: "Responsible Institution" },
        { key: "budget", label: "Budget" },
        { key: "funding_source", label: "Funding Source" },
        { key: "start_date", label: "Start Date" },
        { key: "end_date", label: "End Date" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("projects_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem(
            "projects_visible_columns",
            JSON.stringify(visibleColumns),
        );
    }, [visibleColumns]);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "project_status",
                "project_category",
                "responsible_inti",
                "start_date",
                "end_date",
            ].includes(key) &&
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
        router.get(route("barangay_project.index", queryParams));
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === "") return "—";
        return `₱${parseFloat(value).toLocaleString()}`;
    };

    const formatDate = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const truncateText = (text, max = 60) => {
        if (!text) return "—";
        return text.length > max ? `${text.substring(0, max)}...` : text;
    };

    const categoryStyles = {
        infrastructure: "bg-blue-50 text-blue-700 border-blue-200",
        health: "bg-emerald-50 text-emerald-700 border-emerald-200",
        education: "bg-violet-50 text-violet-700 border-violet-200",
        livelihood: "bg-amber-50 text-amber-700 border-amber-200",
        others: "bg-slate-50 text-slate-700 border-slate-200",
    };

    const columnRenderers = {
        id: (row) => (
            <div className="flex items-center">
                <span className="inline-flex min-w-[42px] items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    #{row.id}
                </span>
            </div>
        ),

        image: (row) => (
            <div className="flex items-center justify-center py-1">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <img
                        src={
                            row.project_image
                                ? `/storage/${row.project_image}`
                                : "/images/default-avatar.jpg"
                        }
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default-avatar.jpg";
                        }}
                        alt={row.title || "Project"}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        ),

        title: (row) => (
            <div className="min-w-0 space-y-1">
                <div className="truncate text-sm font-semibold text-slate-900 text-wrap">
                    {row.title || "Untitled Project"}
                </div>
            </div>
        ),

        description: (row) => (
            <div className="max-w-[260px] text-sm leading-5 text-slate-600">
                {truncateText(row.description, 70)}
            </div>
        ),

        status: (row) => {
            const statusKey = row.status?.toLowerCase();

            return (
                <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        PROJECT_STATUS_CLASS[statusKey] ||
                        "bg-slate-100 text-slate-700"
                    }`}
                >
                    {PROJECT_STATUS_TEXT[statusKey] || row.status || "—"}
                </span>
            );
        },

        category: (row) => (
            <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                    categoryStyles[row.category?.toLowerCase()] ||
                    "bg-slate-50 text-slate-700 border-slate-200"
                }`}
            >
                <Tag className="h-3.5 w-3.5" />
                {row.category || "—"}
            </span>
        ),

        responsible_institution: (row) => (
            <div className="min-w-0 space-y-1">
                <div className="truncate text-sm font-medium text-slate-800">
                    {row.responsible_institution || "—"}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Landmark className="h-3.5 w-3.5" />
                    <span>Responsible Office</span>
                </div>
            </div>
        ),

        budget: (row) => (
            <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5">
                <PhilippinePeso className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">
                    {formatCurrency(row.budget)}
                </span>
            </div>
        ),

        funding_source: (row) => (
            <div className="max-w-[220px] truncate text-sm text-slate-600">
                {row.funding_source || "—"}
            </div>
        ),

        start_date: (row) => (
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{formatDate(row.start_date)}</span>
                </div>
                <div className="pl-5 text-xs text-slate-500">Start Date</div>
            </div>
        ),

        end_date: (row) => (
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{formatDate(row.end_date)}</span>
                </div>
                <div className="pl-5 text-xs text-slate-500">End Date</div>
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
    const handleAddProject = () => {
        setModalState("add");
        setIsModalOpen(true);
    };
    const { data, setData, post, errors, reset, clearErrors } = useForm({
        projects: [[]],
        _method: undefined,
        project_id: null,
    });
    const addProject = () => {
        setData("projects", [...(data.projects || []), {}]);
    };
    const removeProject = (projectIdx) => {
        const updated = [...(data.projects || [])];
        updated.splice(projectIdx, 1);
        setData("projects", updated);
        toast.warning("Project removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setProjectDetails(null);
        setProjectToDelete(null);
        reset();
        clearErrors();
    };

    const handleProjectFieldChange = (value, projIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.projects];

            // if updating file input
            if (field === "project_image" && value instanceof File) {
                updated[projIdx] = {
                    ...updated[projIdx],
                    project_image: value, // store file for submission
                    previewImage: URL.createObjectURL(value), // generate preview URL
                };
            } else {
                // for other fields or preview assignment
                updated[projIdx] = {
                    ...updated[projIdx],
                    [field]: value,
                };
            }

            return { ...prevData, projects: updated };
        });
    };

    const handleSubmitProject = (e) => {
        e.preventDefault();
        post(route("barangay_project.store"), {
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
                `${APP_URL}/barangay_project/details/${id}`,
            );

            const project = response.data.project;
            // console.log(project);

            setProjectDetails(project); // store for modal display if needed

            setData({
                projects: [
                    {
                        title: project.title || "",
                        description: project.description || "",
                        project_image: null, // keep original DB filename
                        previewImage: project.project_image
                            ? `/storage/${project.project_image}`
                            : null, // For showing in the form
                        status: project.status || "planning",
                        category: project.category || "",
                        responsible_institution:
                            project.responsible_institution || "",
                        budget: project.budget || 0,
                        funding_source: project.funding_source || "",
                        start_date: project.start_date || "",
                        end_date: project.end_date || "",
                    },
                ],
                _method: "PUT",
                project_id: project.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching project details:", error);
        }
    };
    const handleUpdateProject = (e) => {
        e.preventDefault();
        post(route("barangay_project.update", data.project_id), {
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

    // delete
    const handleDeleteClick = (id) => {
        setProjectToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("barangay_project.destroy", projectToDelete), {
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
            <Head title="Barangay Infrastructure" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="pt-4 mb-10">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        <PageHeader
                            title="Barangay Projects Overview"
                            description="Review, filter, and manage ongoing and completed projects implemented by barangay institutions."
                            icon={Home}
                            iconWrapperClassName="bg-indigo-100 text-indigo-600 rounded-full"
                            containerClassName="bg-gray-50 border-transparent shadow-sm"
                            titleClassName="text-gray-900"
                            descriptionClassName="text-gray-500"
                            actions={
                                <Button
                                    onClick={handleAddProject}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <ListPlus className="mr-2 h-4 w-4" />
                                    Add Project
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
                                        url="barangay_project.index"
                                        queryParams={queryParams}
                                        field="name"
                                        label="Search Projects"
                                        placeholder="Search title or description"
                                        className="w-full sm:w-[300px]"
                                    />
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "project_status",
                                        "project_category",
                                        "responsible_inti",
                                        "start_date",
                                        "end_date",
                                    ]}
                                    categories={categories}
                                    institutions={institutions}
                                    clearRouteName="barangay_project.index"
                                    clearRouteParams={{}}
                                    showFilters={showFilters}
                                />
                            )}
                            <DynamicTable
                                queryParams={queryParams}
                                passedData={projects}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                </div>
                <ProjectSidebarModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    modalState={modalState}
                    projectDetails={projectDetails}
                    data={data}
                    errors={errors}
                    handleSubmitProject={handleSubmitProject}
                    handleUpdateProject={handleUpdateProject}
                    handleProjectFieldChange={handleProjectFieldChange}
                    removeProject={removeProject}
                    addProject={addProject}
                    reset={reset}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={confirmDelete}
                    residentId={projectToDelete}
                />
            </div>
        </AdminLayout>
    );
};

export default ProjectIndex;
