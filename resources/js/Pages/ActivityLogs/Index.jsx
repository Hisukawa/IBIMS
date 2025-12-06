import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleUser, ClipboardList, Search } from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTable from "@/Components/DynamicTable";
import { toTitleCase } from "@/utils/stringFormat";
import { ACTION_TYPE_COLORS } from "@/constants";
import ExportButton from "@/Components/ExportButton";

export default function Index({
    activity_logs,
    queryParams,
    action_types,
    roles,
    modules,
}) {
    const breadcrumbs = [{ label: "Activity Logs", showOnMobile: true }];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const [query, setQuery] = useState(queryParams["name"] ?? "");

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
        router.get(route("activity_log.index", queryParams));
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
        { key: "user_name", label: "User" },
        { key: "role", label: "Role" },
        { key: "module", label: "Module" },
        { key: "action_type", label: "Action Type" },
        { key: "description", label: "Description" },
        { key: "created_at", label: "Date & Time" },
    ];
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "action",
                "role",
                "module",
                "start_date_logs",
                "end_date_logs",
            ].includes(key) &&
            value &&
            value !== ""
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

    const columnRenderers = {
        id: (row) => (
            <span className="text-xs text-gray-500 font-medium">{row.id}</span>
        ),

        user_name: (row) => (
            <span className="text-sm font-semibold text-gray-800">
                {row.user_name ?? "—"}
            </span>
        ),

        role: (row) => (
            <span
                className={`text-xs font-medium ${
                    row.role === "admin"
                        ? "text-indigo-600"
                        : row.role === "user"
                        ? "text-green-600"
                        : "text-gray-400"
                }`}
            >
                {row.role?.toUpperCase() ?? "—"}
            </span>
        ),

        module: (row) => (
            <span className="text-sm text-gray-700 font-medium">
                {row.module ?? "—"}
            </span>
        ),

        action_type: (row) => {
            const key = row.action_type?.toLowerCase().trim() ?? "default";

            const classes =
                ACTION_TYPE_COLORS[key] ?? ACTION_TYPE_COLORS.default;

            return (
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${classes}`}
                >
                    {toTitleCase(row.action_type ?? "—")}
                </span>
            );
        },

        description: (row) => (
            <span className="text-xs text-gray-600">
                {row.description ?? "—"}
            </span>
        ),

        // barangay_name: (row) => (
        //     <span className="text-sm font-medium text-gray-800">
        //         {row.barangay_name ?? "—"}
        //     </span>
        // ),

        created_at: (row) => {
            const date = row.created_at
                ? new Date(row.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                  })
                : "—";

            return <span className="text-xs text-gray-500">{date}</span>;
        },
    };
    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("activity_logs_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    return (
        <AdminLayout>
            <Head title="Activity Logs" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <div className="p-2 md:p-4">
                    {/* <pre>{JSON.stringify(activity_logs, null, 2)}</pre> */}
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        {/* ddddd */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <section className="mb-6">
                                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl shadow-sm border border-orange-100">
                                    <div className="p-2 bg-orange-100 rounded-full">
                                        <ClipboardList className="w-6 h-6 text-orange-600" />
                                    </div>

                                    <div>
                                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                                            Activity Logs
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            View and monitor all system
                                            activities performed by{" "}
                                            <span className="font-medium">
                                                users, admins, and residents
                                            </span>
                                            . Track actions such as{" "}
                                            <span className="font-medium">
                                                create, update, delete, login,
                                            </span>{" "}
                                            and other events for auditing and
                                            accountability.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <div className="flex items-start gap-2 flex-wrap">
                                    <DynamicTableControls
                                        allColumns={allColumns}
                                        visibleColumns={visibleColumns}
                                        setVisibleColumns={setVisibleColumns}
                                        showFilters={showFilters}
                                        toggleShowFilters={() =>
                                            setShowFilters((prev) => !prev)
                                        }
                                    />
                                    <ExportButton
                                        url="report/export-activity-logs-excel"
                                        queryParams={queryParams}
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex w-[380px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search Logs"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed(
                                                    "name",
                                                    e.target.value
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
                                    </form>
                                </div>
                            </div>

                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "action",
                                        "role",
                                        "module",
                                        "start_date_logs",
                                        "end_date_logs",
                                    ]}
                                    showFilters={true}
                                    clearRouteName="activity_log.index"
                                    clearRouteParams={{}}
                                    action_types={action_types}
                                    roles={roles}
                                    modules={modules}
                                />
                            )}
                            <DynamicTable
                                passedData={activity_logs}
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
            </div>
        </AdminLayout>
    );
}
