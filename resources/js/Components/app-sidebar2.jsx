import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // For accessing the current route
import {
    Home,
    Users,
    FileText,
    Search,
    Settings,
    FileCog,
    UserPlus,
    ChevronDown,
    ChevronUp,
    Table,
    UsersRound,
    FileUser,
    Scale,
    FileStack,
    Warehouse,
    SquareUserRound,
    House,
    CarFront,
    PiggyBank,
    Flag,
    GraduationCap,
    BriefcaseBusiness,
    SquareActivity,
    Tractor,
    HeartPulse,
    Accessibility,
    Pill,
    Syringe,
    Heart,
    Stethoscope,
    Tablets,
    PersonStanding,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";

// Menu items with submenus
const items = [
    {
        title: "Dashboard",
        url: "/barangay_officer/dashboard",
        icon: Home,
        submenu: [],
    },
    {
        title: "Barangay",
        url: "#",
        icon: FileStack,
        submenu: [
            {
                title: "Barangay Profile",
                url: "/barangay_officer/barangay_profile",
                icon: FileText,
            },
            {
                title: "Barangay Officials",
                url: "/barangay_officer/barangay_official",
                icon: FileText,
            },
            {
                title: "Barangay Documents",
                url: "/barangay_officer/document",
                icon: FileText,
            },
        ],
    },
    {
        title: "Residents Information",
        url: "#",
        icon: FileUser,
        submenu: [
            {
                title: "Information Table",
                url: "/barangay_officer/resident",
                icon: Table,
            },
            {
                title: "Senior Citizen",
                url: "/barangay_officer/senior_citizen",
                icon: UsersRound,
            },
            {
                title: "Families",
                url: "/barangay_officer/family",
                icon: SquareUserRound,
            },
            {
                title: "Households",
                url: "/barangay_officer/household",
                icon: House,
            },
            {
                title: "Vehicles",
                url: "/barangay_officer/vehicle",
                icon: CarFront,
            },
            {
                title: "Education",
                url: "/barangay_officer/education",
                icon: GraduationCap,
            },
            {
                title: "Occupation/Livelihood",
                url: "/barangay_officer/occupation",
                icon: BriefcaseBusiness,
            },
            // {
            //     title: "Livelihood",
            //     url: "/barangay_officer/livelihood",
            //     icon: Tractor,
            // },
        ],
    },
    {
        title: "Medical Information",
        url: "#",
        icon: HeartPulse,
        submenu: [
            {
                title: "Information Table",
                url: "/barangay_officer/medical",
                icon: Table,
            },
            {
                title: "Allergies",
                url: "/barangay_officer/allergy",
                icon: Tablets,
            },
            {
                title: "Medical Condition",
                url: "/barangay_officer/medical_condition",
                icon: Stethoscope,
            },
            {
                title: "Disabilities",
                url: "/barangay_officer/disability",
                icon: Accessibility,
            },
            {
                title: "Medications",
                url: "/barangay_officer/medication",
                icon: Pill,
            },
            {
                title: "Pregnancy Records",
                url: "/barangay_officer/pregnancy",
                icon: SquareActivity,
            },
            {
                title: "Vaccinations",
                url: "/barangay_officer/vaccination",
                icon: Syringe,
            },
            {
                title: "Deaths",
                url: "#",
                icon: PersonStanding,
            },
        ],
    },
    {
        title: "Issuance",
        url: "#",
        icon: FileStack,
        submenu: [
            {
                title: "Certificate Issuance",
                url: "/barangay_officer/certificate/index",
                icon: FileText,
            },
        ],
    },
    {
        title: "Blotter",
        url: "#",
        icon: Scale,
        submenu: [],
    },
    {
        title: "Reports",
        url: "#",
        icon: Flag,
        submenu: [],
    },
    {
        title: "CRA 2025",
        url: "#",
        icon: Flag,
        submenu: [
            {
                title: "Create",
                url: "/barangay_officer/cra/create",
                icon: FileText,
            },
        ],
    },
];

export function AppSidebar({ auth }) {
    const location = useLocation(); // Get current location
    const [collapsed, setCollapsed] = useState({});
    const [barangay, setBarangay] = useState(null);

    const toggleCollapse = (index) => {
        setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const user = auth.user;
    const APP_URL = useAppUrl();
    useEffect(() => {
        const fetchBarangayDetails = async () => {
            try {
                const response = await axios.get(
                    `${APP_URL}/barangay_officer/barangay_profile/barangaydetails`
                );
                setBarangay(response.data.data);
            } catch (error) {
                console.error("Error fetching barangay details:", error);
            }
        };

        fetchBarangayDetails();
    }, []);

    return (
        <Sidebar>
            <SidebarContent className="bg-sky-600 shadow-lg">
                <div className="flex items-center pt-1 pb-0 px-4 text-left">
                    <img
                        src="/images/csa-logo.png"
                        alt="CSA Logo"
                        className="h-12 w-12 mr-3"
                    />
                    <div className="flex flex-col leading-none space-y-0">
                        <p className="font-black text-xl text-white font-montserrat m-0 pb-1 leading-none">
                            iBIMS
                        </p>
                        <p className="font-light text-sm text-white font-montserrat m-0 p-0 leading-none">
                            {barangay ? barangay.barangay_name : "Loading..."}
                        </p>
                    </div>
                </div>
                <hr className="border-t-2 border-white opacity-30 mx-3 my-0" />
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-100 m-0">
                        Main Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index) => (
                                <div key={item.title}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            onClick={() =>
                                                toggleCollapse(index)
                                            }
                                        >
                                            <a
                                                href={item.url}
                                                className={`flex items-center justify-between w-full my-1 ${
                                                    location.pathname ===
                                                    item.url
                                                        ? "bg-gray-200 text-primary" // Active item styles
                                                        : "text-white"
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <item.icon className="mr-2" />
                                                    <span>{item.title}</span>
                                                </div>
                                                {item.submenu.length > 0 && (
                                                    <span className="ml-2">
                                                        {collapsed[index] ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronUp className="w-4 h-4" />
                                                        )}
                                                    </span>
                                                )}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    {item.submenu.length > 0 && (
                                        <SidebarGroupContent
                                            className={`overflow-hidden transition-all duration-300 ease-in-out transform ${
                                                collapsed[index]
                                                    ? "max-h-0 opacity-0 translate-x-[-10px]"
                                                    : "max-h-[1000px] opacity-100 translate-x-0"
                                            }`}
                                            style={{
                                                transitionProperty:
                                                    "max-height, opacity, transform",
                                            }}
                                        >
                                            {item.submenu.map((submenuItem) => (
                                                <SidebarMenuItem
                                                    key={submenuItem.title}
                                                >
                                                    <SidebarMenuButton asChild>
                                                        <a
                                                            href={
                                                                submenuItem.url
                                                            }
                                                            className={`flex items-center pl-6 my-1 ${
                                                                location.pathname ===
                                                                submenuItem.url
                                                                    ? "bg-gray-200 text-primary"
                                                                    : "text-gray-200"
                                                            }`}
                                                            style={{
                                                                maxWidth:
                                                                    "calc(100% - 2rem)", // Adjust width
                                                                width: "auto",
                                                            }}
                                                        >
                                                            <submenuItem.icon className="mr-2" />
                                                            <span>
                                                                {
                                                                    submenuItem.title
                                                                }
                                                            </span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarGroupContent>
                                    )}
                                </div>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-sky-600">
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
