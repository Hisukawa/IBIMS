import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";
import useAppUrl from "@/hooks/useAppUrl";
import ActionMenu from "@/Components/ActionMenu";
import { ListPlus, SquarePen, Trash2, UsersRound } from "lucide-react";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Button } from "@/Components/ui/button";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { INSTITUTION_STATUS_TEXT, INSTITUTION_TYPE_TEXT } from "@/constants";
import { Toaster, toast } from "sonner";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import PageHeader from "@/Components/PageHeader";
import TableSearchBar from "@/Components/TableSearchBar";
import InstitutionSidebarForm from "./Partials/InstitutionSidebarForm";

const InstitutionIndex = ({ institutions, institutionNames, queryParams }) => {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Insititutions", showOnMobile: true },
    ];

    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [institutionDetails, setInstitutionDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [institutionToDelete, setInstitutionToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "type", label: "Institution Type" },
        { key: "head", label: "Head of Institution" },
        { key: "description", label: "Description" },
        { key: "year_established", label: "Year Established" },
        { key: "status", label: "Status" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("instutions_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem(
            "instutions_visible_columns",
            JSON.stringify(visibleColumns),
        );
    }, [visibleColumns]);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["institution"].includes(key) && value && value !== "",
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
        router.get(route("barangay_institution.index", queryParams));
    };

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => (
            <Link href={route("barangay_institution.show", row.id)}>
                <span className="font-medium text-gray-900 hover:text-blue-500 hover:underline">
                    {row.name || "—"}
                </span>
            </Link>
        ),

        type: (row) => (
            <span className="text-sm text-gray-700">
                {INSTITUTION_TYPE_TEXT[row.type] || "—"}
            </span>
        ),

        head: (row) => {
            const res = row?.head?.resident;
            if (!res) return "No assigned head";

            const fullName = `${res.firstname} ${res.middlename ?? ""} ${
                res.lastname
            } ${res.suffix ?? ""}`.trim();
            const contact = res.contact_number
                ? res.contact_number
                : "No contact";

            return (
                <div className="flex flex-col text-sm text-gray-700">
                    <span className="font-medium text-gray-900">
                        {fullName}
                    </span>
                    <span className="text-gray-500">{contact}</span>
                </div>
            );
        },

        description: (row) => (
            <span className="text-sm text-gray-500 line-clamp-2">
                {row.description || "—"}
            </span>
        ),

        year_established: (row) => (
            <span className="text-sm text-gray-700">
                {row.year_established || "—"}
            </span>
        ),

        status: (row) => {
            const statusColors = {
                active: "bg-green-100 text-green-800",
                inactive: "bg-yellow-100 text-yellow-800",
                dissolved: "bg-red-100 text-red-800",
            };
            return (
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[row.status] || "bg-gray-100 text-gray-800"
                    }`}
                >
                    {INSTITUTION_STATUS_TEXT[row.status] || "—"}
                </span>
            );
        },

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(row.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.id),
                    },
                ]}
            />
        ),
    };

    // add
    const handleAddInstitution = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        institutions: [[]],
        _method: undefined,
        institution_id: null,
    });

    const addInstitution = () => {
        setData("institutions", [...(data.institutions || []), {}]);
    };
    const removeInstitution = (instiIdx) => {
        const updated = [...(data.institutions || [])];
        updated.splice(instiIdx, 1);
        setData("institutions", updated);
        toast.warning("Institution removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setInstitutionDetails(null);
        reset();
        clearErrors();
    };

    const handleInstitutionFieldChange = (value, instIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.institutions];

            // make sure the institution entry exists
            if (!updated[instIdx]) {
                updated[instIdx] = {};
            }

            updated[instIdx] = {
                ...updated[instIdx],
                [field]: value,
            };

            return { ...prevData, institutions: updated };
        });
    };
    const handleSubmitInstitution = (e) => {
        e.preventDefault();
        post(route("barangay_institution.store"), {
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
                `${APP_URL}/barangay_institution/details/${id}`,
            );
            const institution = response.data.institution;
            // console.log(institution);
            setInstitutionDetails(institution);
            setData({
                institutions: [
                    {
                        name: institution.name || "",
                        type: institution.type || "",
                        status: institution.status || "",
                        description: institution.description || "",
                        year_established: institution.year_established || "",
                    },
                ],
                _method: "PUT",
                institution_id: institution.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching institution details:", error);
        }
    };
    const handleUpdateInstitution = (e) => {
        e.preventDefault();
        post(route("barangay_institution.update", data.institution_id), {
            onError: (errors) => {
                //console.error("Validation Errors:", errors);

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
        setInstitutionToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(
            route("barangay_institution.destroy", institutionToDelete),
            {
                onError: (errors) => {
                    console.error("Validation Errors:", errors);

                    const allErrors = Object.values(errors).join("<br />");
                    toast.error("Validation Error", {
                        description: (
                            <span
                                dangerouslySetInnerHTML={{ __html: allErrors }}
                            />
                        ),
                        duration: 3000,
                        closeButton: true,
                    });
                },
            },
        );
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
                {/* <pre>{JSON.stringify(institutions, undefined, 2)}</pre> */}
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        <PageHeader
                            title="Barangay Institution Overview"
                            description="Review, filter, and manage existing barangay institutions efficiently."
                            icon={UsersRound}
                            iconWrapperClassName="bg-green-100 text-green-600"
                            actions={
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={handleAddInstitution}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <ListPlus className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            Add Institution
                                        </span>
                                    </Button>
                                </div>
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
                                        url="barangay_institution.index"
                                        queryParams={queryParams}
                                        field="name"
                                        placeholder="Search institutions"
                                        className="w-[260px]"
                                    />
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={["institution"]}
                                    institutions={institutionNames}
                                    clearRouteName="barangay_institution.index"
                                    clearRouteParams={{}}
                                    showFilters={showFilters}
                                />
                            )}
                            <DynamicTable
                                queryParams={queryParams}
                                passedData={institutions}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                </div>
                <InstitutionSidebarForm
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    modalState={modalState}
                    institutionDetails={institutionDetails}
                    data={data}
                    errors={errors}
                    handleSubmitInstitution={handleSubmitInstitution}
                    handleUpdateInstitution={handleUpdateInstitution}
                    handleInstitutionFieldChange={handleInstitutionFieldChange}
                    removeInstitution={removeInstitution}
                    addInstitution={addInstitution}
                    reset={reset}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={confirmDelete}
                    residentId={institutionToDelete}
                />
            </div>
        </AdminLayout>
    );
};

export default InstitutionIndex;
