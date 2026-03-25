import { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import OfficialCard from "@/Components/OfficialCards";
import { BARANGAY_OFFICIAL_POSITIONS_TEXT } from "@/constants";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import Modal from "@/Components/Modal2";
import EditOfficialForm from "./Partials/EditOfficialForm";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import SelectField from "@/Components/SelectField";
import { Toaster, toast } from "sonner";
import { Home, Plus, SquarePen, TableIcon, Trash2 } from "lucide-react";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import { Switch } from "@/components/ui/switch"; // adjust path
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import { Button } from "@/Components/ui/button";
import BarangayOfficialSidebarModal from "./Partials/BarangayOfficialSidebarModal";

const BarangayOfficials = ({
    officials,
    residents,
    puroks,
    activeterms,
    terms,
    queryParams,
}) => {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Officials", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};

    const [isModalOpen, setIsModalOpen] = useState(false); // Resident detail modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal
    const [selectedResident, setSelectedResident] = useState(null);
    const [selectedOfficial, setSelectedOfficial] = useState(null); // for edit
    const [showNewTermToggle, setShowNewTermToggle] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [officialToDelete, setOfficialToDelete] = useState(null); //delete
    const [selectedTerm, setSelectedTerm] = useState(queryParams["term"] ?? "");
    const [statusMap, setStatusMap] = useState(
        officials.reduce((acc, official) => {
            acc[official.id] = official.status === "active"; // true if active, false if inactive
            return acc;
        }, {}),
    );

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

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
        router.get(route("barangay_official.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const { data, setData, post, errors, processing, reset, clearErrors } =
        useForm({
            resident_name: "",
            resident_id: "",
            resident_image: "",
            position: "",
            designations: [],
            term: "",
            new_term_start: "",
            new_term_end: "",
            contact_number: "",
            email: "",
            appointment_type: "",
            appointted_by: "",
            appointment_reason: "",
            remarks: "",
            official_id: "",
            _method: undefined,
        });
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };
    const handleResidentChange = useResidentChangeHandler(residents, setData);
    const handleView = async (residentId) => {
        try {
            const response = await axios.get(
                `${APP_URL}/resident/showresident/${residentId}`,
            );
            setSelectedResident(response.data.resident);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching resident details:", error);
        }
    };
    const handleDeleteClick = (id) => {
        setOfficialToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("barangay_official.destroy", officialToDelete), {
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

    const handleArrayValues = (e, index, column, array) => {
        const updated = [...(data[array] || [])];
        updated[index] = {
            ...updated[index],
            [column]: e.target.value,
        };
        setData(array, updated);
    };

    const addDesignation = () => {
        setData("designations", [...(data.designations || []), {}]);
    };
    const removeDesignation = (desIdx) => {
        const updated = [...(data.designations || [])];
        updated.splice(desIdx, 1);
        setData("designations", updated);
        toast.warning("Designation removed.", {
            duration: 2000,
        });
    };

    const handleAdd = () => {
        setIsAddModalOpen(true);
        setIsModalOpen(true);
    };

    // New: open edit modal with selected official data
    const handleEdit = async (id) => {
        try {
            const response = await axios.get(
                `${APP_URL}/barangay_official/officialsinfo/${id}`,
            );
            const official = response.data.official;

            setSelectedOfficial(official);
            console.log(official);
            setData("resident_id", official.resident.id || "");
            setData(
                "resident_name",
                `${official.resident.firstname} ${
                    official.resident.middlename
                } ${official.resident.lastname} ${
                    official.resident.suffix ?? ""
                }`,
            );
            setData("contact_number", official.resident.contact_number || "");
            setData("email", official.resident.email || "");
            setData("position", official.position || "");
            setData(
                "designations",
                (official.designation || []).map((d) => ({
                    designation: d.purok_id || "",
                    term_start: d.started_at || "",
                    term_end: d.ended_at || "",
                })),
            );
            setData(
                "term",
                official.term.id ? official.term.id.toString() : "",
            );
            setData(
                "resident_image",
                official.resident.resident_picture_path || "",
            );
            setData("appointment_type", official.appointment_type || "");
            if (official.appointment_type === "appointed") {
                setData(
                    "appointted_by",
                    official.appointted_by
                        ? official.appointted_by.toString()
                        : "",
                );
                setData(
                    "appointment_reason",
                    official.appointment_reason || "",
                );
                setData("remarks", official.remarks || "");
            } else {
                setData("appointted_by", "");
                setData("appointment_reason", "");
                setData("remarks", "");
            }
            setData("_method", "PUT");
            setData("official_id", official.id);
            setIsModalOpen(true);
            setIsAddModalOpen(true);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };

    const officialPositionsList = Object.entries(
        BARANGAY_OFFICIAL_POSITIONS_TEXT,
    ).map(([key, label]) => ({
        label: label,
        value: key.toString(),
    }));

    const purok_numbers = Array.from(new Set(puroks)).map((purok) => ({
        label: "Purok " + purok,
        value: purok.toString(),
    }));

    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    const active_terms = activeterms.map((term) => ({
        label: `${term.term_start} - ${term.term_end}`,
        value: term.id.toString(),
    }));

    const termList = terms.map((term) => ({
        label: `${term.term_start} - ${term.term_end}`,
        value: term.id.toString(),
    }));

    useEffect(() => {
        if (data.appointment_type !== "appointed") {
            setData((prev) => ({
                ...prev,
                appointted_by: "",
                appointment_reason: "",
            }));
        }
    }, [data.appointment_type]);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedResident(null);
        setSelectedOfficial(null);
        setIsAddModalOpen(false);
        reset();
        clearErrors();
    };

    // New: onAdd form submit handler (customize to your needs)
    const onAddSubmit = (e) => {
        e.preventDefault();
        post(route("barangay_official.store"), {
            onError: (validationErrors) => {
                console.error("Validation Errors:", validationErrors);
                const messages = Object.values(validationErrors);
                toast.error("Validation Error", {
                    description: (
                        <ul>
                            {messages.map((m, i) => (
                                <li key={i}>{m}</li>
                            ))}
                        </ul>
                    ),
                });
            },
            onSuccess: () => {
                handleModalClose();
            },
        });
    };

    // New: onEdit form submit handler
    const onEditSubmit = (e) => {
        e.preventDefault();
        post(route("barangay_official.update", data.official_id), {
            onError: (validationErrors) => {
                console.error("Validation Errors:", validationErrors);
                const messages = Object.values(validationErrors);
                toast.error("Validation Error", {
                    description: (
                        <ul>
                            {messages.map((m, i) => (
                                <li key={i}>{m}</li>
                            ))}
                        </ul>
                    ),
                });
            },
            onSuccess: () => {
                handleModalClose();
            },
        });
    };

    const groupedOfficials = officials.reduce((acc, official) => {
        const position =
            BARANGAY_OFFICIAL_POSITIONS_TEXT[official.position] || "Others";
        if (!acc[position]) acc[position] = [];
        acc[position].push(official);
        return acc;
    }, {});

    // tables

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "position", label: "Position" },
        { key: "sex", label: "Sex" },
        { key: "status", label: "Status" },
        { key: "term", label: "Term" },
        { key: "designation", label: "Designation" },
        { key: "contact_number", label: "Contact Number" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleCols);
    const columnRenderers = {
        id: (row) => (
            <span className="text-gray-700 font-medium">{row.id}</span>
        ),

        name: (row) => {
            const r = row.resident;
            const fullname = `${r.firstname} ${r.middlename ?? ""} ${
                r.lastname
            }${r.suffix ? ", " + r.suffix : ""}`;

            return (
                <span className="font-semibold text-gray-900 capitalize">
                    {fullname}
                </span>
            );
        },

        position: (row) => (
            <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold capitalize">
                {row.position.replace(/_/g, " ")}
            </span>
        ),

        sex: (row) => (
            <span
                className={
                    "px-2 py-1 rounded-md text-xs font-semibold capitalize " +
                    (row.resident.sex === "male"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-pink-50 text-pink-700")
                }
            >
                {row.resident.sex}
            </span>
        ),

        status: (row) => {
            const isActive = statusMap[row.id] ?? row.status === "active";

            const handleToggle = (checked) => {
                setStatusMap((prev) => ({ ...prev, [row.id]: checked }));

                axios
                    .patch(`/barangayofficial/${row.id}/toggle-status`, {
                        status: checked ? "active" : "inactive",
                    })
                    .then((res) => {
                        toast[res.data.success ? "success" : "error"](
                            res.data.message,
                            {
                                duration: 3000,
                                closeButton: true,
                            },
                        );
                    })
                    .catch(() => {
                        toast.error("Failed to update status.", {
                            duration: 3000,
                            closeButton: true,
                        });
                        setStatusMap((prev) => ({
                            ...prev,
                            [row.id]: !checked,
                        }));
                    });
            };

            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={isActive}
                        onCheckedChange={handleToggle}
                        className="bg-gray-200 hover:bg-gray-300"
                    />
                    <span
                        className={`text-xs font-semibold ${
                            isActive ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                </div>
            );
        },

        term: (row) => (
            <span className="text-sm text-gray-700 font-medium">
                {row.term?.term_start && row.term?.term_end
                    ? `${row.term.term_start} - ${row.term.term_end}`
                    : "—"}
            </span>
        ),

        designation: (row) => {
            if (!row.active_designations?.length)
                return <span className="text-gray-500">—</span>;

            const purok = row.active_designations[0].purok;

            return (
                <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold">
                    {purok ? `Purok ${purok.purok_number}` : "—"}
                </span>
            );
        },
        contact_number: (row) => (
            <span
                className={`text-sm font-medium ${
                    row.resident.contact_number
                        ? "text-gray-700"
                        : "text-gray-400 italic"
                }`}
            >
                {row.resident.contact_number || "No contact number available"}
            </span>
        ),

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-600" />,
                        onClick: () => handleEdit(row.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.id),
                    },
                ]}
                className="flex justify-center"
            />
        ),
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
                    <div className="shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                {/* LEFT: Title & Subtitle */}
                                <div className="flex items-center gap-3 mb-4 md:mb-0">
                                    <div className="p-2 bg-indigo-100 rounded-full">
                                        <Home className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                            Barangay Officials Overview
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            Review, filter, and manage current
                                            and past barangay officials
                                            efficiently.
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT: Term Filter Dropdown */}
                                <div className="flex items-center w-full md:w-auto gap-3">
                                    {/* Select */}
                                    <div className="w-full md:w-[280px]">
                                        <SelectField
                                            id="term_filter"
                                            name="term_filter"
                                            placeholder="Filter by Terms"
                                            value={selectedTerm}
                                            onChange={(e) => {
                                                searchFieldName(
                                                    "term",
                                                    e.target.value,
                                                );
                                                setSelectedTerm(e.target.value);
                                            }}
                                            className="w-full"
                                            items={termList}
                                        />
                                    </div>

                                    {/* Button */}
                                    <Button
                                        onClick={handleAdd}
                                        size="lg"
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <Plus />
                                        Add Official
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                                {!selectedTerm && (
                                    <div className="max-w-lg mx-auto p-10 text-center bg-yellow-50 rounded-2xl border border-dashed border-yellow-300">
                                        <p className="text-yellow-600 font-medium">
                                            Select a term for the chart to view.
                                        </p>
                                    </div>
                                )}
                                {selectedTerm &&
                                    Object.keys(groupedOfficials).map(
                                        (position) => {
                                            const officials =
                                                groupedOfficials[position];
                                            const isSingle =
                                                officials.length === 1;

                                            return (
                                                <div
                                                    key={position}
                                                    className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                                                >
                                                    {/* HEADER */}
                                                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight mb-2 uppercase relative inline-block">
                                                            {position}
                                                        </h2>

                                                        <div className="w-24 h-1 bg-indigo-600 rounded-full mb-4"></div>

                                                        <span className="px-4 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase tracking-wider shadow-sm">
                                                            {officials.length}{" "}
                                                            {officials.length ===
                                                            1
                                                                ? "Official"
                                                                : "Officials"}
                                                        </span>
                                                    </div>

                                                    {/* OFFICIALS OR EMPTY STATE */}
                                                    {officials.length > 0 ? (
                                                        <div
                                                            className={
                                                                isSingle
                                                                    ? "flex justify-center w-full"
                                                                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
                                                            }
                                                        >
                                                            {officials.map(
                                                                (official) => (
                                                                    <div
                                                                        className="w-full max-w-[320px]"
                                                                        key={
                                                                            official.id
                                                                        }
                                                                    >
                                                                        <OfficialCard
                                                                            id={
                                                                                official.id
                                                                            }
                                                                            onView={() =>
                                                                                handleView(
                                                                                    official
                                                                                        .resident
                                                                                        .id,
                                                                                )
                                                                            }
                                                                            onEdit={() =>
                                                                                handleEdit(
                                                                                    official.id,
                                                                                )
                                                                            }
                                                                            onDelete={() =>
                                                                                handleDeleteClick(
                                                                                    official.id,
                                                                                )
                                                                            }
                                                                            name={`${
                                                                                official
                                                                                    .resident
                                                                                    .firstname
                                                                            } ${
                                                                                official
                                                                                    .resident
                                                                                    .middlename
                                                                                    ? official.resident.middlename
                                                                                          .charAt(
                                                                                              0,
                                                                                          )
                                                                                          .toUpperCase() +
                                                                                      "."
                                                                                    : ""
                                                                            } ${
                                                                                official
                                                                                    .resident
                                                                                    .lastname
                                                                            }`}
                                                                            position={
                                                                                position
                                                                            }
                                                                            purok={
                                                                                official
                                                                                    .active_designations[0]
                                                                                    ?.purok
                                                                                    ?.purok_number ||
                                                                                "N/A"
                                                                            }
                                                                            term={`${
                                                                                official
                                                                                    .term
                                                                                    ?.term_start ||
                                                                                "0000"
                                                                            } – ${
                                                                                official
                                                                                    .term
                                                                                    ?.term_end ||
                                                                                "0000"
                                                                            }`}
                                                                            phone={
                                                                                official
                                                                                    .resident
                                                                                    .contact_number
                                                                            }
                                                                            email={
                                                                                official
                                                                                    .resident
                                                                                    .email
                                                                            }
                                                                            image={
                                                                                official
                                                                                    .resident
                                                                                    .resident_picture_path
                                                                            }
                                                                        />
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    ) : (
                                                        // If selectedTerm exists but no officials
                                                        <div className="max-w-lg mx-auto p-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                                            <p className="text-gray-400 font-medium italic">
                                                                No officials
                                                                found for this
                                                                position.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        },
                                    )}
                            </div>
                            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                                {/* Header */}
                                <div className="px-6 py-5 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    {/* Title */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
                                            <TableIcon className="w-5 h-5" />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-extrabold text-gray-800 tracking-tight">
                                                Barangay Officials Directory
                                            </h3>
                                            <p className="text-xs font-medium text-gray-500">
                                                Complete list of current active
                                                officials
                                            </p>
                                        </div>
                                    </div>

                                    {/* Total badge */}
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 text-xs font-semibold bg-white text-gray-600 rounded-md shadow-sm">
                                            Total: {officials?.length || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Table Section */}
                                <div className="overflow-x-auto">
                                    <div className="inline-block min-w-full align-middle">
                                        <DynamicTable
                                            passedData={officials}
                                            allColumns={allColumns}
                                            columnRenderers={columnRenderers}
                                            visibleColumns={visibleColumns}
                                            showTotal={true}
                                        />
                                    </div>
                                </div>

                                {/* Footer (kept borderless) */}
                                <div className="px-6 py-3 bg-gray-50"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <BarangayOfficialSidebarModal
                    isModalOpen={isModalOpen}
                    isAddModalOpen={isAddModalOpen}
                    handleModalClose={handleModalClose}
                    selectedResident={selectedResident}
                    selectedOfficial={selectedOfficial}
                    onAddSubmit={onAddSubmit}
                    onEditSubmit={onEditSubmit}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    residentsList={residentsList}
                    officialPositionsList={officialPositionsList}
                    active_terms={active_terms}
                    purok_numbers={purok_numbers}
                    showNewTermToggle={showNewTermToggle}
                    setShowNewTermToggle={setShowNewTermToggle}
                    handleResidentChange={handleResidentChange}
                    handleChange={handleChange}
                    handleArrayValues={handleArrayValues}
                    addDesignation={addDesignation}
                    removeDesignation={removeDesignation}
                />

                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Edit Barangay Official"
                >
                    {selectedOfficial && <EditOfficialForm />}
                </Modal>
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    residentId={officialToDelete}
                />
            </div>
        </AdminLayout>
    );
};

export default BarangayOfficials;
