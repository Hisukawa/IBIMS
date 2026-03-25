import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    SquarePen,
    Trash2,
    Eye,
    ListPlus,
    UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import {
    RESIDENT_GENDER_COLOR_CLASS,
    RESIDENT_GENDER_TEXT2,
} from "@/constants";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import ExportButton from "@/Components/ExportButton";
import InstitutionMemberSidebarModal from "./Partials/InstitutionMemberFormModal";

export default function Members({
    members,
    puroks,
    queryParams,
    residents,
    institution,
}) {
    const breadcrumbs = [
        { label: "Barangay Information", showOnMobile: false },
        { label: "Institution", showOnMobile: false },
        { label: "Institution Members", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete
    const [memberDetails, setMemberDetails] = useState(null); //delete

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [selectedResident, setSelectedResident] = useState(null);
    const hasHead = members.some((m) => m.is_head === 1 || m.is_head === true);
    const head = members.find((m) => m.is_head === 1 || m.is_head === true);

    const formatName = (value = "") =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    const headFullName = head?.resident
        ? `${formatName(head.resident.firstname || "")} ${formatName(
              head.resident.lastname || "",
          )}`
        : "";

    const handleSearchSubmit = (e) => {
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
        router.get(
            route("barangay_institution.show", institution.id),
            queryParams,
        );
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Resident Name" },
        { key: "sex", label: "Sex" },
        { key: "age", label: "Age" },
        { key: "birthdate", label: "Date of Birth" },
        { key: "member_since", label: "Date of Membership" },
        { key: "status", label: "Status" },
        { key: "contact_number", label: "Contact Number" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];
    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key),
    );
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "sex",
                "age_group",
                "pwd",
                "fourps",
                "solo_parent",
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
    const toggleShowFilters = () => setShowFilters((prev) => !prev);

    const handlePrint = () => {
        window.print();
    };
    const calculateAge = (birthdate) => {
        if (!birthdate) return "Unknown";
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const columnRenderers = {
        id: (row) => (
            <span className="text-xs font-semibold text-gray-500">
                {row.id}
            </span>
        ),

        name: (row) => {
            const res = row.resident;
            const isHead = row.is_head === 1;

            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                        {res.firstname} {res.middlename ?? ""} {res.lastname}{" "}
                        <span className="text-gray-500">
                            {res.suffix ?? ""}
                        </span>
                    </span>

                    {isHead && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-800">
                            Head
                        </span>
                    )}
                </div>
            );
        },
        sex: (row) => {
            const sexKey = row.resident?.sex;
            const label =
                RESIDENT_GENDER_TEXT2?.[sexKey] ?? sexKey ?? "Unknown";
            const className =
                RESIDENT_GENDER_COLOR_CLASS?.[sexKey] ??
                "bg-gray-100 text-gray-800";

            return (
                <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap ${className}`}
                >
                    {label}
                </span>
            );
        },

        contact_number: (row) => {
            const cn = row.resident?.contact_number;
            const label = cn ? cn : "—";
            return (
                <span className="text-xs font-medium text-gray-700 capitalize">
                    {label}
                </span>
            );
        },

        age: (row) => {
            const res = row.resident;
            const age = calculateAge(res.birthdate);

            if (age === null)
                return <span className="italic text-gray-400">Unknown</span>;

            return (
                <div className="flex flex-col text-sm">
                    <span className="font-bold text-indigo-700">{age} yrs</span>
                    {age > 60 && (
                        <span className="text-xs text-rose-500 font-semibold mt-0.5">
                            Senior Citizen
                        </span>
                    )}
                </div>
            );
        },

        birthdate: (row) =>
            row.resident?.birthdate ? (
                <span className="text-gray-700 text-sm">
                    {new Date(row.resident.birthdate).toLocaleDateString()}
                </span>
            ) : (
                <span className="italic text-gray-400">—</span>
            ),

        member_since: (row) =>
            row.member_since ? (
                <span className="text-indigo-600 font-medium text-sm">
                    {new Date(row.member_since).toLocaleDateString()}
                </span>
            ) : (
                <span className="italic text-gray-400">—</span>
            ),

        status: (row) => {
            const status = row.status;
            const statusClasses = {
                active: "bg-green-100 text-green-800",
                inactive: "bg-red-100 text-red-700",
            };
            return (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        statusClasses[status] ?? "bg-gray-100 text-gray-600"
                    }`}
                >
                    {status}
                </span>
            );
        },

        purok_number: (row) => (
            <span className="text-gray-700 font-medium">
                {row.resident?.purok_number ?? "—"}
            </span>
        ),

        actions: (record) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(record.resident?.id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(record.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(record.id),
                    },
                ]}
            />
        ),
    };

    // add
    const { data, setData, post, errors, reset, clearErrors } = useForm({
        members: [
            {
                resident_id: null,
                resident_name: "",
                resident_image: null,
                birthdate: null,
                purok_number: null,
                member_since: "",
                status: "active",
                is_head: false,
            },
        ],
        institution_id: null,
        member_id: null,
        _method: undefined,
    });
    const handleResidentChange = (e, index) => {
        const selected = residents.find((r) => r.id == e.target.value);
        const updatedMembers = [...data.members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            resident_id: selected?.id || null,
            resident_name:
                `${selected.firstname} ${selected.middlename} ${
                    selected.lastname
                } ${selected.suffix ?? ""}` || "",
            birthdate: selected?.birthdate || null,
            purok_number: selected?.purok_number || null,
            resident_image: selected?.image || null,
        };
        setData("members", updatedMembers);
        setData("institution_id", institution.id);
    };

    const handleArrayValues = (e, index, field) => {
        const updatedMembers = [...data.members];
        updatedMembers[index][field] =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setData("members", updatedMembers);
    };

    const addMember = () => {
        setData("members", [
            ...data.members,
            {
                resident_id: null,
                resident_name: "",
                resident_image: null,
                birthdate: null,
                purok_number: null,
                member_since: "",
                status: "active",
                is_head: false,
            },
        ]);
    };

    const removeMember = (index) => {
        const updatedMembers = [...data.members];
        updatedMembers.splice(index, 1);
        setData("members", updatedMembers);
        toast.warning("Member removed.", {
            duration: 2000,
        });
    };

    const handleAddMember = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(route("institution_member.store"), {
            onError: (errors) => {
                // console.error("Validation Errors:", errors);
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}> ${msg}</div>`,
                );

                toast.error("Validation Error", {
                    description: (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: errorList.join(""),
                            }}
                        />
                    ),
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };
    const handleEditSubmit = (e) => {
        e.preventDefault();
        post(route("institution_member.update", data.member_id), {
            onError: () => {
                // console.error("Validation Errors:", errors);
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}> ${msg}</div>`,
                );

                toast.error("Validation Error", {
                    description: (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: errorList.join(""),
                            }}
                        />
                    ),
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    const handleModalClose = () => {
        setModalState(null);
        setIsModalOpen(false);
        setSelectedResident(null);
        setMemberDetails(null);
        reset();
        clearErrors();
    };

    const handleEdit = async (id) => {
        setModalState("add"); // ✅ use edit instead of add
        setMemberDetails(null);

        try {
            const response = await axios.get(
                `${APP_URL}/institution_member/details/${id}`,
            );

            const details = response.data.member;
            setMemberDetails(details);

            // update top-level id + method
            setData("member_id", details.id);
            setData("_method", "PUT");

            // update inside members[0]
            setData("members", [
                {
                    resident_id: details.resident?.id ?? null,
                    resident_name: `${details.resident?.firstname ?? ""} ${
                        details.resident?.middlename ?? ""
                    } ${details.resident?.lastname ?? ""} ${
                        details.resident?.suffix ?? ""
                    }`.trim(),
                    resident_image: details.resident?.image ?? null,
                    birthdate: details.resident?.birthdate ?? null,
                    purok_number: details.resident?.purok_number ?? null,
                    member_since: details.member_since ?? "",
                    status: details.status ?? "active",
                    is_head: details.is_head ?? false,
                },
            ]);
        } catch (error) {
            console.error("Error fetching member details:", error);

            let title = "Error";
            let description = "Something went wrong. Please try again.";

            if (
                error.response?.status === 422 &&
                error.response?.data?.errors
            ) {
                title = "Validation Error";

                const errorList = Object.values(
                    error.response.data.errors,
                ).flat();

                description = (
                    <ul className="list-disc ml-5">
                        {errorList.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                );
            }

            toast.error(title, {
                description,
                duration: 4000,
                closeButton: true,
            });
        } finally {
            setIsModalOpen(true);
        }
    };

    const handleDeleteClick = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("institution_member.destroy", recordToDelete), {
            onError: (errors) => {
                //console.error("Validation Errors:", errors);
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}> ${msg}</div>`,
                );

                toast.error("Validation Error", {
                    description: (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: errorList.join(""),
                            }}
                        />
                    ),
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
        setIsDeleteModalOpen(false);
    };

    const handleView = async (resident) => {
        setModalState("view");
        try {
            const response = await axios.get(
                `${APP_URL}/resident/showresident/${resident}`,
            );
            setSelectedResident(response.data.resident);
        } catch (error) {
            console.error("Error fetching placeholders:", error);
        }
        setIsModalOpen(true);
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
            <Head title="Resident Information" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(members, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="mb-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-gray-50 rounded-xl shadow-sm">
                                    {/* Left Side */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-full">
                                            <UsersRound className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                                {institution.name} Overview
                                            </h1>
                                            <p className="text-sm text-gray-500">
                                                Review, filter, and manage
                                                members of {institution.name}{" "}
                                                efficiently.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Side — Head Info */}
                                    {head && (
                                        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 w-64">
                                            <h2 className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                                                Head of Institution
                                            </h2>

                                            <div className="mt-2">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {`${
                                                        (
                                                            head.resident
                                                                .firstname || ""
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        (
                                                            head.resident
                                                                .firstname || ""
                                                        )
                                                            .slice(1)
                                                            .toLowerCase()
                                                    } ${
                                                        (
                                                            head.resident
                                                                .lastname || ""
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        (
                                                            head.resident
                                                                .lastname || ""
                                                        )
                                                            .slice(1)
                                                            .toLowerCase()
                                                    }`}
                                                </p>

                                                {head.resident
                                                    .contact_number ? (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        <span className="font-medium text-gray-700">
                                                            Contact:
                                                        </span>{" "}
                                                        {
                                                            head.resident
                                                                .contact_number
                                                        }
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-400 italic mt-1">
                                                        No contact number
                                                        provided
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <div className="flex items-start gap-2 flex-wrap">
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
                                    <ExportButton
                                        url={`/report/export-institution-members-pdf/${institution.id}`}
                                        queryParams={queryParams}
                                        label="Export Members as PDF"
                                        type="pdf"
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex w-[380px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search Resident Name"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <div className="relative group z-50">
                                            <Button
                                                type="submit"
                                                className="border active:bg-blue-900 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center gap-2 bg-transparent"
                                                variant="outline"
                                            >
                                                <Search />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Search
                                            </div>
                                        </div>
                                        <div className="relative group z-50">
                                            <Button
                                                className="bg-blue-700 hover:bg-blue-400 "
                                                type={"button"}
                                                onClick={handleAddMember}
                                            >
                                                <ListPlus />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Add Institution Member
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "purok",
                                        "sex",
                                        "age_group",
                                        "pwd",
                                        "fourps",
                                        "solo_parent",
                                    ]}
                                    puroks={puroks}
                                    showFilters={true}
                                    clearRouteName="barangay_institution.show"
                                    clearRouteParams={{ id: institution.id }}
                                />
                            )}
                            <DynamicTable
                                passedData={members}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                            />
                        </div>
                    </div>
                </div>
                <InstitutionMemberSidebarModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    modalState={modalState}
                    memberDetails={memberDetails}
                    selectedResident={selectedResident}
                    data={data}
                    errors={errors}
                    residentsList={residentsList}
                    hasHead={hasHead}
                    handleAddSubmit={handleAddSubmit}
                    handleEditSubmit={handleEditSubmit}
                    handleResidentChange={handleResidentChange}
                    handleArrayValues={handleArrayValues}
                    removeMember={removeMember}
                    addMember={addMember}
                    reset={reset}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={confirmDelete}
                    residentId={recordToDelete}
                />
            </div>
        </AdminLayout>
    );
}
