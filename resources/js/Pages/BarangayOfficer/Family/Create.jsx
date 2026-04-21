import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import ActionMenu from "@/components/ActionMenu";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import DynamicTable from "@/Components/DynamicTable";
import { useState, useEffect } from "react";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import {
    HousePlus,
    MoveRight,
    Search,
    SquarePen,
    Trash2,
    User,
    Users,
    UserPlus,
    UserRoundPlus,
    UsersRound,
    GraduationCap,
    BookOpen,
    School,
    RotateCcw,
    FileUser,
    Sheet,
    FileText,
} from "lucide-react";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import {
    FAMILY_TYPE_TEXT,
    INCOME_BRACKET_TEXT,
    INCOME_BRACKETS,
} from "@/constants";
import SidebarModal from "@/Components/SidebarModal";
import InputLabel from "@/Components/InputLabel";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { PiUsersFourBold } from "react-icons/pi";
import { Toaster, toast } from "sonner";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import ExportButton from "@/Components/ExportButton";
import { useQuery } from "@tanstack/react-query";
import FamilyFormModal from "./Partials/FamilyFormModal";

export default function Index({
    families,
    queryParams = null,
    puroks,
    members,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Families",
            href: route("family.index"),
            showOnMobile: true,
        },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [familyDetails, setFamilyDetails] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [familyToDelete, setFamilyToDelete] = useState(null); //delete

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
        router.get(route("family.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const allColumns = [
        { key: "family_id", label: "Family ID" },
        { key: "name", label: "Name of Family Head" },
        { key: "family_name", label: "Family Name" },
        { key: "income_bracket", label: "Income Bracket" },
        { key: "income_category", label: "Income Category" },
        { key: "family_type", label: "Family Type" },
        { key: "family_member_count", label: "Members" },
        { key: "house_number", label: "House Number" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];

    const viewFamily = (id) => {
        router.get(route("family.showfamily", id));
    };

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key),
    );
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["purok", "famtype", "household_head", "income_bracket"].includes(
                key,
            ) &&
            value &&
            value !== " ",
    );

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const columnRenderers = {
        family_id: (row) => row.id,
        name: (row) =>
            row.latest_head
                ? `${row.latest_head.firstname ?? ""} ${
                      row.latest_head.middlename ?? ""
                  } ${row.latest_head.lastname ?? ""} ${
                      row.latest_head.suffix ?? ""
                  }`
                : "Unknown",
        is_household_head: (row) =>
            row.is_household_head ? (
                <span className="py-1 px-2 rounded-xl bg-green-100 text-green-800">
                    Yes
                </span>
            ) : (
                <span className="py-1 px-2 rounded-xl bg-red-100 text-red-800">
                    No
                </span>
            ),
        family_name: (row) => (
            <Link
                href={route("family.showfamily", row?.id ?? 0)}
                className="hover:text-blue-500 hover:underline"
            >
                {(row?.family_name ?? "Unnamed") + " Family"}
            </Link>
        ),

        family_member_count: (row) => (
            <span className="flex items-center">
                {row?.family_member_count ?? 0}{" "}
                <User className="ml-2 h-5 w-5" />
            </span>
        ),

        income_bracket: (row) => {
            const bracketKey = row?.income_bracket;
            const bracketText = INCOME_BRACKET_TEXT?.[bracketKey];
            const bracketMeta = INCOME_BRACKETS?.[bracketKey];

            return bracketText ? (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        bracketMeta?.className ?? ""
                    }`}
                >
                    {bracketText}
                </span>
            ) : (
                <span className="text-gray-500 italic">Unknown</span>
            );
        },

        income_category: (row) => {
            const bracketMeta = INCOME_BRACKETS?.[row?.income_bracket];

            return bracketMeta ? (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${bracketMeta.className}`}
                >
                    {bracketMeta.label}
                </span>
            ) : (
                <span className="text-gray-500 italic">Unknown</span>
            );
        },

        family_type: (row) => FAMILY_TYPE_TEXT?.[row?.family_type] ?? "Unknown",

        house_number: (row) => {
            const houseNumber =
                row?.latest_head?.household_residents?.[0]?.household
                    ?.house_number;
            return houseNumber ?? "Unknown";
        },

        purok_number: (row) => row?.latest_head?.purok_number ?? "Unknown",

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "View Family",
                        icon: <UsersRound className="w-4 h-4 text-blue-600" />,
                        onClick: () => viewFamily(row?.id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(row?.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row?.id),
                    },
                ]}
            />
        ),
    };

    // add family
    const handleAddFamily = () => {
        setQuery(""); // optional
        setIsModalOpen(true);
        setData("_method", undefined);
    };

    const defaultMember = {
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: "",
        purok_number: "",
        relationship_to_head: "",
        household_position: "",
    };

    const memberList = members.map((mem) => ({
        label: `${mem.firstname} ${mem.middlename} ${mem.lastname} ${
            mem.suffix ?? ""
        }`,
        value: mem.id.toString(),
    }));

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: null,
        purok_number: null,
        house_number: null,
        family_name: "",
        family_type: "",
        members: [defaultMember],
        family_id: null,
        _method: undefined,
    });

    const handleModalClose = () => {
        setIsModalOpen(false);
        setFamilyDetails(null);
        reset();
        setData("_method", undefined); // reset method
        clearErrors();
    };

    const addMember = () => {
        setData("members", [...(data.members || []), { ...defaultMember }]);
    };
    const removeMember = (memberIndex) => {
        const updated = [...(data.members || [])];
        updated.splice(memberIndex, 1);
        setData("members", updated);
        toast.warning("Member removed.", {
            duration: 2000,
        });
    };

    const handleResidentChange = (e) => {
        const resident_id = Number(e.target.value);
        const resident = members.find((r) => r.id == e.target.value);
        if (resident) {
            setData("resident_id", resident.id);
            setData(
                "resident_name",
                `${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                } ${resident.suffix ?? ""}`,
            );
            setData("purok_number", resident.purok_number);
            setData(
                "house_number",
                resident.latest_household?.house_number ??
                    resident.household?.house_number,
            );
            setData("birthdate", resident.birthdate);
            setData("resident_image", resident.resident_picture_path);
        }
    };

    const handleDynamicResidentChange = (e, index) => {
        const updatedMembers = [...data.members];
        const selected = members.find((r) => r.id == e.target.value);

        if (selected) {
            updatedMembers[index] = {
                ...updatedMembers[index],
                resident_id: selected.id ?? "",
                resident_name: `${selected.firstname ?? ""} ${
                    selected.middlename ?? ""
                } ${selected.lastname ?? ""} ${selected.suffix ?? ""}`,
                purok_number: selected.purok_number ?? "",
                birthdate: selected.birthdate ?? "",
                resident_image: selected.image ?? null,
            };
            setData({ ...data, members: updatedMembers });
        }
    };
    const handleMemberFieldChange = (e, index) => {
        const { name, value } = e.target;
        const updatedMembers = [...data.members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            [name]: value,
        };
        setData("members", updatedMembers);
    };
    const handleSubmitFamily = (e) => {
        e.preventDefault();
        post(route("family.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };
    const handleUpdateFamily = (e) => {
        e.preventDefault();
        post(route("family.update", data.family_id), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(
                `${APP_URL}/family/getfamilydetails/${id}`,
            );

            const details = response.data.family_details;

            // Find the latest household head
            const latestHead =
                details.members
                    .filter((m) => m.is_household_head === 1)
                    .sort(
                        (a, b) =>
                            new Date(b.updated_at) - new Date(a.updated_at),
                    )[0] || details.members[0];

            setData({
                resident_id: latestHead?.id ?? null,
                resident_name: `${latestHead?.firstname} ${
                    latestHead?.middlename ? latestHead?.middlename + " " : ""
                }${latestHead?.lastname} ${latestHead?.suffix}`.trim(),
                resident_image: latestHead?.resident_picture_path,
                birthdate: latestHead?.birthdate ?? null,
                purok_number: latestHead?.purok_number ?? null,
                house_number:
                    latestHead?.household?.house_number ??
                    details.household?.house_number ??
                    null,
                family_type: details.family_type,
                family_name: details.family_name,
                members: (details.members || [])
                    .map((m) => {
                        const householdResident =
                            m.household_residents?.[0] || {};
                        return {
                            resident_id: m.id,
                            resident_name: `${m.firstname} ${
                                m.middlename ? m.middlename + " " : ""
                            }${m.lastname} ${m.suffix}`.trim(),
                            resident_image: m.resident_picture_path,
                            birthdate: m.birthdate,
                            purok_number: m.purok_number,
                            relationship_to_head:
                                householdResident.relationship_to_head ?? "",
                            household_position:
                                householdResident.household_position ?? "",
                        };
                    })
                    .filter(
                        (m) => m.relationship_to_head.toLowerCase() !== "self",
                    ),
                family_id: details.id,
                _method: "PUT",
            });

            console.log(details);
            setFamilyDetails(details);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching family details:", error);
        }
    };

    const handleDeleteClick = (id) => {
        setFamilyToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("family.destroy", familyToDelete), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setFamilyDetails(null);
                reset(); // reset form
                setData("_method", undefined); // ensure method is POST
            },
        });
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
            <Head title="Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/* <pre>{JSON.stringify(members, undefined, 2)}</pre> */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-sm">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        Family Records
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Manage and track families registered in
                                        the barangay.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
