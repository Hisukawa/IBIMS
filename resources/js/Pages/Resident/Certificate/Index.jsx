import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Eye,
    FileInput,
    FilePlus2,
    FileText,
    FileUp,
    FileWarning,
    OctagonX,
    PrinterIcon,
    RotateCcw,
    Search,
    SquarePlus,
    Trash2,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import * as CONSTANTS from "@/constants";
import useAppUrl from "@/hooks/useAppUrl";
import axios from "axios";
import { Toaster, toast } from "sonner";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Input } from "@/Components/ui/input";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import SidebarModal from "@/Components/SidebarModal";
import ExportButton from "@/Components/ExportButton";
import Request from "./Request";

export default function Index({
    documents,
    residents,
    certificates,
    queryParams = null,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Certificate Issuance", showOnMobile: true },
    ];

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

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

    const APP_URL = useAppUrl();
    const defaultPlaceholders = [
        "fullname",
        "fullname_2",
        "day",
        "month",
        "year",
        "ctrl_no",
        "civil_status",
        "age",
        "civil_status_2",
        "purpose",
        "purpose_2",
        "purok",
        "day_2",
        "month_2",
        "year_2",
        "issued_on",
    ];

    const { data, setData, post, errors, setError, reset, clearErrors } =
        useForm({
            resident_id: null,
            resident_name: "",
            document_id: null,
            document_name: "",
            birthdate: null,
            age: null,
            civil_status: "",
            resident_image: "",
            purpose: "",
            placeholders: null,
            dynamicValues: [], // ✅ MUST EXIST
        });

    const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    const handleDocumentChange = async (e) => {
        const cert = documents.find((c) => c.id == e);
        if (cert) {
            setData("document_name", cert.name);
            setData("document_id", cert.id);
            try {
                const response = await axios.get(
                    `${APP_URL}/document/fetchplaceholders/${e}`
                );
                setData("placeholders", response.data.placeholders);
            } catch (error) {
                console.error("Error fetching placeholders:", error);
            }
        }
    };

    const documentsList = documents.map((document) => ({
        label: document.name.replace(/\s+/g, " ").trim(),
        value: document.id.toString(),
    }));

    // handles document issuance
    const handleRequest = (e) => {
        e.preventDefault(); // prevent page reload

        // Optional: clear previous errors
        clearErrors();

        // Optional client-side validation
        if (!data.document_id) {
            setError("document_id", "Please select a certificate.");
            return;
        }
        if (!data.purpose) {
            setError("purpose", "Please provide the purpose.");
            return;
        }

        post(route("resident.certificate.store"), data, {
            onError: (errs) => {
                console.error("Validation Errors:", errs);
                const messages = Object.values(errs).flat(); // flatten nested errors if needed
                toast.error("Validation Error", {
                    description: (
                        <ul className="list-disc pl-5">
                            {messages.map((m, i) => (
                                <li key={i}>{m}</li>
                            ))}
                        </ul>
                    ),
                });
            },
        });
    };
    // tables and modals
    queryParams = queryParams || {};

    const [query, setQuery] = useState(queryParams["name"] ?? "");
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
        router.get(route("resident_account.certificates", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "certificate_type",
                "request_status",
                "issued_by",
                "issued_at",
            ].includes(key) &&
            value &&
            value !== ""
    );
    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const allColumns = [
        { key: "id", label: "Issued ID" },
        { key: "certificate", label: "Certificate" },
        { key: "purpose", label: "Purpose" },
        { key: "request_status", label: "Request Status" },
        { key: "issued_by", label: "Issued By" },
        { key: "issued_at", label: "Issued At" },
        { key: "control_number", label: "Control Number" },
        { key: "actions", label: "Actions" },
    ];

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const handlePrint = () => {
        window.print();
    };
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("certificate_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "certificate_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const columnRenderers = {
        id: (row) => <span className="text-xs text-gray-700">{row.id}</span>,

        certificate: (row) => (
            <span className="text-xs text-indigo-700 font-medium">
                {row.document?.name ?? "—"}
            </span>
        ),

        purpose: (row) => (
            <span className="text-xs text-gray-700">{row.purpose ?? "—"}</span>
        ),
        request_status: (row) => (
            <span
                className={`text-xs font-medium ${
                    CONSTANTS.CERTIFICATE_REQUEST_STATUS_CLASS[
                        row.request_status
                    ]
                }`}
            >
                {CONSTANTS.CERTIFICATE_REQUEST_STATUS_TEXT[
                    row.request_status
                ] ?? "—"}
            </span>
        ),

        issued_by: (row) => (
            <span className="text-xs text-gray-700">
                {CONSTANTS.BARANGAY_OFFICIAL_POSITIONS_TEXT[
                    row.issued_by?.position
                ] ?? "—"}
            </span>
        ),

        issued_at: (row) => (
            <span className="text-xs text-gray-600">
                {row.issued_at ?? "—"}
            </span>
        ),

        control_number: (row) => (
            <span className="text-xs text-gray-600">
                {row.control_number ?? "—"}
            </span>
        ),

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Cancel Request",
                        icon: <OctagonX className="w-4 h-4 text-red-600" />,
                        onClick: () => handleCancel(row.id),
                    },
                ]}
            />
        ),
    };

    const handleCancel = (id) => {
        router.delete(route("resident_account.certificate.destroy", id));
    };

    // adding of certificate
    const handleAddCertificate = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    // handle modal closing
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        reset();
        clearErrors();
    };

    return (
        <AdminLayout>
            <Head title="Certificate Issuance" />
            <Toaster richColors />
            <div>
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4">
                            {/* HEADER */}
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-blue-50 rounded-xl shadow-sm">
                                    <div className="p-2 bg-blue-100 rounded-full self-start sm:self-center">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                            My Certificates
                                        </h1>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            View and request{" "}
                                            <span className="font-medium">
                                                official certificates
                                            </span>
                                            from your barangay. Check your
                                            records or download documents below.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CONTROLS SECTION */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 w-full">
                                {/* LEFT CONTROLS */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <DynamicTableControls
                                        allColumns={allColumns}
                                        visibleColumns={visibleColumns}
                                        setVisibleColumns={setVisibleColumns}
                                        onPrint={handlePrint}
                                        showFilters={showFilters}
                                        toggleShowFilters={() =>
                                            setShowFilters((prev) => !prev)
                                        }
                                    />
                                </div>

                                {/* RIGHT CONTROLS */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                                    {/* SEARCH BAR */}
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex items-center gap-2 w-full sm:w-[330px]"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search Name"
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
                                            className="border active:bg-blue-900 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                            variant="outline"
                                        >
                                            <Search className="w-4 h-4" />
                                        </Button>
                                    </form>

                                    {/* REQUEST BUTTON */}
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white w-full sm:w-auto"
                                        onClick={handleAddCertificate}
                                    >
                                        <FileInput className="w-4 h-4" />
                                        <span className="hidden sm:block">
                                            Request Certificate
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            {/* FILTERS */}
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "certificate_type",
                                        "request_status",
                                        "issued_by",
                                        "issued_at",
                                    ]}
                                    certificateTypes={documentsList}
                                    showFilters={true}
                                    months={months}
                                    clearRouteName="resident_account.certificates"
                                    clearRouteParams={{}}
                                />
                            )}

                            {/* TABLE */}
                            <DynamicTable
                                passedData={certificates}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
                                is_paginated={isPaginated}
                                toggleShowAll={() => setShowAll(!showAll)}
                                showAll={showAll}
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                            />
                        </div>
                    </div>

                    <SidebarModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        title={"Request a Certificate"}
                    >
                        {modalState === "add" && (
                            <Request
                                data={data}
                                setData={setData}
                                errors={errors}
                                documentsList={documentsList}
                                handleDocumentChange={handleDocumentChange}
                                handleRequest={handleRequest}
                                reset={reset}
                                defaultPlaceholders={defaultPlaceholders}
                            />
                        )}
                    </SidebarModal>
                </div>
            </div>
        </AdminLayout>
    );
}
