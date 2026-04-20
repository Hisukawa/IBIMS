import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FileCheck2,
    FilePlus2,
    FileText,
    ListPlus,
    Search,
    Trash2,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import InputField from "@/Components/InputField";
import useAppUrl from "@/hooks/useAppUrl";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import SidebarModal from "@/Components/SidebarModal";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import { useMemo } from "react";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import SelectField from "@/Components/SelectField";
import { SPECIFIC_PURPOSE_TEXT } from "@/constants";
import DocumentFormModal from "./Partials/DocumentFormModal";
import PageHeader from "@/Components/PageHeader";

export default function Index({ documents, queryParams }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Documents", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [residentToDelete, setResidentToDelete] = useState(null);

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        searchFieldName("name", query);
    };
    const searchFieldName = (field, value) => {
        if (value && value.trim() !== "") {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        if (queryParams.page) {
            delete queryParams.page;
        }
        router.get(route("document.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         console.log("Selected file:", file);
    //         const formData = new FormData();
    //         formData.append("file", file);

    //         router.post(route("document.store"), formData, {
    //             forceFormData: true,
    //             onSuccess: () => {
    //                 console.log("Upload successful!");
    //             },
    //             onError: (errors) => {
    //                 console.error("Upload failed:", errors);
    //             },
    //         });
    //     }
    // };

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Document Name" },
        { key: "specific_purpose", label: "Specific Purpose" },
        { key: "created_at", label: "Date Added" },
        { key: "actions", label: "Actions" },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const columnRenderers = {
        id: (row) => row.id,
        name: (row) => row.name,
        specific_purpose: (row) => SPECIFIC_PURPOSE_TEXT[row.specific_purpose],
        created_at: (row) => new Date(row.created_at).toLocaleDateString(),
        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.id),
                    },
                ]}
            />
        ),
    };

    const handleAddDocument = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        reset();
    };

    const { data, setData, post, errors, processing, reset } = useForm({
        name: "",
        description: "",
        file: null,
    });

    const handleSubmitDocument = (e) => {
        e.preventDefault();

        post(route("document.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);

                // Optional: Show toast
                toast.error("Action Failed", {
                    description: errors
                        ? JSON.stringify(errors)
                        : "Unable to add document.",
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    const handleDeleteClick = (id) => {
        setResidentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Memoize confirmDelete to ensure it's stable
    const confirmDelete = useMemo(
        () => () => {
            if (residentToDelete) {
                router.delete(route("document.destroy", residentToDelete), {
                    onSuccess: () => {
                        toast.success("Document deleted successfully!");
                        setIsDeleteModalOpen(false);
                        setResidentToDelete(null);
                    },
                    onError: (err) => {
                        toast.error("Failed to delete resident.", {
                            description: err.message,
                        });
                        setIsDeleteModalOpen(false);
                    },
                });
            }
        },
        [residentToDelete],
    );

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
            toast.error("Action Failed", {
                description:
                    typeof error === "string"
                        ? error
                        : "An unexpected error occurred.",
                duration: 3000,
                closeButton: true,
            });

            if (props.setError) props.setError(null);
        }
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Documents Dashboard" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-lg">
                            <PageHeader
                                title="Documents"
                                description={
                                    <>
                                        Manage and organize{" "}
                                        <span className="font-medium">
                                            documents
                                        </span>{" "}
                                        within the system. Use the tools below
                                        to{" "}
                                        <span className="font-medium">
                                            upload, search, view, and delete
                                        </span>{" "}
                                        records for administration and file
                                        management.
                                    </>
                                }
                                icon={FileText}
                                actions={
                                    <Button
                                        onClick={handleAddDocument}
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <ListPlus className="mr-2 h-4 w-4" />
                                        Add Document
                                    </Button>
                                }
                            />

                            <div className="mb-0 flex w-full flex-wrap items-start justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Optional controls area if you want future filters/buttons */}
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex w-full items-center gap-2 sm:w-[380px]"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search document name"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed("name", e)
                                            }
                                            className="w-full"
                                        />
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            <DynamicTable
                                passedData={documents}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
                                is_paginated={isPaginated}
                                toggleShowAll={() => setShowAll(!showAll)}
                                showAll={showAll}
                                visibleColumns={allColumns.map(
                                    (col) => col.key,
                                )}
                            />
                        </div>
                    </div>
                </div>

                <DocumentFormModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    title="Add Document"
                    handleSubmitDocument={handleSubmitDocument}
                    fileInputRef={fileInputRef}
                    handleDivClick={handleDivClick}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />

                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    residentId={residentToDelete}
                    title="Delete Document"
                    description="This action requires password confirmation before removing the selected document from the system."
                    message="Are you sure you want to delete this document? Once deleted, the record and its associated file reference can no longer be recovered."
                    buttonLabel="DELETE DOCUMENT"
                    cancelLabel="Keep Document"
                    processingText="Verifying..."
                    itemName={
                        documents?.data?.find(
                            (doc) => doc.id === residentToDelete,
                        )?.name ||
                        documents?.find?.((doc) => doc.id === residentToDelete)
                            ?.name ||
                        ""
                    }
                    itemLabel="Selected Document"
                    note="Only delete this document if it is incorrect, duplicated, outdated, or no longer needed in the records."
                    passwordLabel="Account Password"
                    passwordPlaceholder="Enter your password to confirm deletion"
                    passwordHelpText="For security purposes, please enter your current account password before deleting this document."
                    showSecurityNote={true}
                    danger={true}
                />
            </div>
        </AdminLayout>
    );
}
