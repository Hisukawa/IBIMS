import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Trash2,
    Pencil,
    CircleUser,
    Plus,
    KeyRound,
    ListPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import { ACCOUNT_ROLE_TEXT } from "@/constants";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import { Switch } from "@/Components/ui/switch";
import AccountSidebarModal from "./Partials/AccountSidebarModal";
import PageHeader from "@/Components/PageHeader";
import ResetPasswordModal from "./Partials/ResetPasswordModal";
import TableSearchBar from "@/Components/TableSearchBar";

export default function Index({ accounts, queryParams, residents }) {
    const breadcrumbs = [
        { label: "Barangay Information", showOnMobile: false },
        { label: "Accounts", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [accountDetails, setAccountDetails] = useState(null); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [selectedResident, setSelectedResident] = useState(null);
    const [passwordError, setPasswordError] = useState("");

    // password reset
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const handleOpenResetPassword = (user) => {
        setSelectedUser(user);
        setIsResetPasswordOpen(true);
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
        router.get(route("user.index", queryParams));
    };

    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "resident_name", label: "Full Name" },
        { key: "name", label: "User Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "status", label: "Session Status" },
        { key: "account_status", label: "Account Status" },
        { key: "logged_in", label: "Last Logged In" },
        { key: "created_at", label: "Date Added" },
        { key: "actions", label: "Actions" },
    ];

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["session_status", "account_status"].includes(key) &&
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
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const [accountEnabledMap, setAccountEnabledMap] = useState(
        accounts.data.reduce((acc, a) => {
            acc[a.id] = !a.is_disabled; // initial state
            return acc;
        }, {}),
    );

    const columnRenderers = {
        id: (row) => (
            <span className="text-xs text-gray-500 font-medium">{row.id}</span>
        ),

        resident_name: (row) => {
            const r = row.resident ?? {};
            const fullName = `${r.firstname ?? ""} ${r.middlename ?? ""} ${
                r.lastname ?? ""
            } ${r.suffix ?? ""}`.trim();

            return (
                <span className="text-sm font-semibold text-gray-800">
                    {fullName || "—"}
                </span>
            );
        },

        name: (row) => (
            <span className="text-sm font-medium text-gray-800">
                {row.username ?? "—"}
            </span>
        ),

        email: (row) => (
            <span className="text-xs text-gray-600">{row.email ?? "—"}</span>
        ),

        role: (row) => (
            <span
                className={`text-xs font-medium ${
                    row.role === "barangay_officer"
                        ? "text-indigo-600"
                        : row.role === "resident"
                          ? "text-green-600"
                          : "text-gray-400"
                }`}
            >
                {ACCOUNT_ROLE_TEXT[row.role] ?? "—"}
            </span>
        ),

        status: (row) => {
            const isActive = row.status === "active";

            return (
                <span
                    className={`
                    text-xs font-semibold px-3 py-1 rounded-full transition
                    ${
                        isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }
                    hover:shadow-sm
                `}
                >
                    {row.status?.toUpperCase() ?? "—"}
                </span>
            );
        },

        logged_in: (row) => {
            const date = row.updated_at
                ? new Date(row.updated_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                  })
                : "—";

            return <span className="text-xs text-gray-500">{date}</span>;
        },

        account_status: (row) => {
            const enabled = accountEnabledMap[row.id] ?? true;

            const handleToggle = (checked) => {
                setAccountEnabledMap((prev) => ({
                    ...prev,
                    [row.id]: checked,
                }));

                axios
                    .patch(`/user/${row.id}/toggle-account`, {
                        is_disabled: checked ? 0 : 1, // if switch is checked → enabled → not disabled
                    })
                    .then((res) => {
                        if (res.data.success) {
                            toast.success(res.data.message, {
                                duration: 3000,
                                closeButton: true,
                            });
                        } else {
                            toast.error(
                                res.data.message || "Something went wrong.",
                                {
                                    duration: 3000,
                                    closeButton: true,
                                },
                            );
                        }
                    })
                    .catch(() => {
                        // fallback for unexpected errors
                        toast.error("Failed to update account status.", {
                            duration: 3000,
                            closeButton: true,
                        });

                        // revert toggle on error
                        setAccountEnabledMap((prev) => ({
                            ...prev,
                            [row.id]: !checked,
                        }));
                    });
            };

            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={enabled}
                        onCheckedChange={handleToggle}
                        className="bg-gray-200 hover:bg-gray-300"
                    />
                    <span
                        className={`text-xs font-semibold ${
                            enabled ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {enabled ? "ENABLED" : "DISABLED"}
                    </span>
                </div>
            );
        },

        created_at: (row) => {
            const date = row.created_at
                ? new Date(row.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                  })
                : "—";

            return <span className="text-xs text-gray-500">{date}</span>;
        },

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <Pencil className="w-4 h-4 text-blue-600" />,
                        onClick: () => handleEdit(row.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.id),
                    },
                    {
                        label: "Reset Password",
                        icon: <KeyRound className="w-4 h-4 text-amber-600" />,
                        onClick: () => handleOpenResetPassword(row),
                    },
                ]}
            />
        ),
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: "",
        purok_number: "",
        sex: "",

        // Account fields
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",

        // Optional admin controls
        status: "active", // default active
        is_disabled: false,
        account_id: null,
        _method: undefined,
    });
    const handleResidentChange = useResidentChangeHandler(residents, setData);
    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("accounts_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "accounts_visible_columns",
            JSON.stringify(visibleColumns),
        );
    }, [visibleColumns]);

    const handleModalClose = () => {
        setModalState(null);
        setIsModalOpen(false);
        setSelectedResident(null);
        setAccountDetails(null);
        reset();
        clearErrors();
    };

    const handleAddAccount = () => {
        setModalState("add");
        setIsModalOpen(true);
    };
    const handleAddAccountSubmit = (e) => {
        e.preventDefault();
        post(route("user.store"), {
            onSuccess: () => {
                toast.success("User account saved successfully!", {
                    description: "The changes have been saved.",
                    duration: 3000,
                    closeButton: true,
                });
                handleModalClose(); // close modal
            },
            onError: (errors) => {
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

    const handleEdit = async (accountId) => {
        try {
            const res = await axios.get(`${APP_URL}/user/${accountId}`);
            const account = res.data;

            const resident = account.resident; // assuming backend includes resident relation

            setModalState("edit");
            setIsModalOpen(true);

            // Populate form data
            setData({
                resident_id: account.resident_id,
                resident_name: resident
                    ? `${resident.firstname} ${resident.middlename} ${
                          resident.lastname
                      } ${resident.suffix ?? ""}`.trim()
                    : "",
                resident_image: resident?.image || null,
                birthdate: resident?.birthdate || "",
                purok_number: resident?.purok_number || "",
                sex: resident?.sex || "",
                username: account.username,
                email: account.email,
                role: account.role,
                originalEmail: account.email,
                password: "",
                password_confirmation: "",
                account_id: account.id, // needed for update
                _method: "PUT",
            });
        } catch (error) {
            console.error("Error fetching account details:", error);
            toast.error("Failed to fetch account details.");
        }
    };
    const handleEditAccountSubmit = (e) => {
        e.preventDefault();

        if (!data.account_id) return; // safety check

        post(route("user.update", data.account_id), {
            onSuccess: () => {
                toast.success("User account updated successfully!", {
                    description: "The changes have been saved.",
                    duration: 3000,
                    closeButton: true,
                });
                handleModalClose(); // close modal
            },
            onError: (errors) => {
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}>${msg}</div>`,
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
    // delete
    const handleDeleteClick = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("user.destroy", recordToDelete));
        setIsDeleteModalOpen(false);
        if (success) {
            handleModalClose();
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.success = null;
    };
    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout>
            <Head title="Resident Information" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(accounts, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <PageHeader
                                title="User Accounts"
                                description={
                                    <>
                                        Manage and monitor{" "}
                                        <span className="font-medium">
                                            user accounts
                                        </span>{" "}
                                        within the system. Use the tools below
                                        to{" "}
                                        <span className="font-medium">
                                            create, update, filter, or export
                                        </span>{" "}
                                        information for administration and
                                        reports.
                                    </>
                                }
                                icon={CircleUser}
                                actions={
                                    <Button
                                        onClick={handleAddAccount}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <ListPlus className="mr-2 h-4 w-4" />
                                        Add Account
                                    </Button>
                                }
                            />
                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <div className="flex items-center gap-2 flex-wrap">
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
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    <TableSearchBar
                                        url="user.index"
                                        queryParams={queryParams}
                                        label="Search Resident Name"
                                        field="name"
                                        className="w-full sm:w-[380px]"
                                    />
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "session_status",
                                        "account_status",
                                        "account_role",
                                    ]}
                                    showFilters={true}
                                    clearRouteName="user.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                passedData={accounts}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
                                is_paginated={isPaginated}
                                toggleShowAll={() => setShowAll(!showAll)}
                                showAll={showAll}
                                visibleColumns={visibleColumns}
                            />
                        </div>
                    </div>
                </div>
                <AccountSidebarModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    modalState={modalState}
                    accountDetails={accountDetails}
                    data={data}
                    setData={setData}
                    errors={errors}
                    residentsList={residentsList}
                    handleResidentChange={handleResidentChange}
                    handleAddAccountSubmit={handleAddAccountSubmit}
                    handleEditAccountSubmit={handleEditAccountSubmit}
                    passwordError={passwordError}
                    selectedResident={selectedResident}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={confirmDelete}
                    residentId={recordToDelete}
                    title="Delete User Record"
                    description="This action requires password confirmation before proceeding."
                    message="You are about to permanently delete this User record. This action cannot be undone."
                    itemName={
                        residents?.data?.find((r) => r.id === recordToDelete)
                            ? `${residents.data.find((r) => r.id === recordToDelete).first_name} ${
                                  residents.data.find(
                                      (r) => r.id === recordToDelete,
                                  ).last_name
                              }`
                            : ""
                    }
                    itemLabel="User"
                    note="Deleting this user account will remove access to the system and may affect associated records."
                    buttonLabel="Confirm and Delete"
                    cancelLabel="Cancel"
                    processingText="Verifying..."
                />
                <ResetPasswordModal
                    open={isResetPasswordOpen}
                    onClose={() => {
                        setIsResetPasswordOpen(false);
                        setSelectedUser(null);
                    }}
                    selectedUser={selectedUser}
                />
            </div>
        </AdminLayout>
    );
}
