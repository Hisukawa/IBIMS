import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@inertiajs/react";

const ActionMenu = ({ actions = [] }) => {
    const containerRef = useRef(null);
    const [visibleActions, setVisibleActions] = useState(actions);
    const [overflowActions, setOverflowActions] = useState([]);

    // ✅ ADD THIS (control dropdown state)
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const containerWidth = containerRef.current?.offsetWidth || 0;
            let totalWidth = 0;
            const visible = [];
            const overflow = [];

            actions.forEach((action) => {
                const buttonWidth = 35;
                if (totalWidth + buttonWidth <= containerWidth - 35) {
                    totalWidth += buttonWidth;
                    visible.push(action);
                } else {
                    overflow.push(action);
                }
            });

            setVisibleActions(visible);
            setOverflowActions(overflow);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [actions]);

    // ✅ FIXED HANDLER
    const handleActionClick = (action) => {
        if (action.href) return;

        // close dropdown first
        setDropdownOpen(false);

        // wait before opening modal
        setTimeout(() => {
            action.onClick?.();
        }, 0);
    };

    const renderButton = (action) => {
        if (action.href) {
            return (
                <Link href={action.href}>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="p-1 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
                    >
                        {action.icon}
                    </Button>
                </Link>
            );
        }

        return (
            <Button
                size="icon"
                variant="ghost"
                onClick={() => handleActionClick(action)} // ✅ FIXED
                className="p-1 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
            >
                {action.icon}
            </Button>
        );
    };

    return (
        <div ref={containerRef} className="flex gap-1 items-center">
            <TooltipProvider>
                {visibleActions.map((action, idx) => (
                    <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                            {renderButton(action)}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{action.label}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>

            {/* ✅ CONTROLLED DROPDOWN */}
            {overflowActions.length > 0 && (
                <DropdownMenu
                    open={dropdownOpen}
                    onOpenChange={setDropdownOpen}
                >
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="p-1 hover:bg-gray-200 bg-gray-100 focus:ring-2 focus:ring-gray-200"
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {overflowActions.map((action, idx) => (
                            <DropdownMenuItem
                                key={idx}
                                className="flex items-center gap-2"
                                asChild={!!action.href}
                                onSelect={(e) => {
                                    e.preventDefault(); // ✅ IMPORTANT
                                    handleActionClick(action);
                                }}
                            >
                                {action.href ? (
                                    <Link
                                        href={action.href}
                                        className="flex items-center gap-2 w-full"
                                    >
                                        {action.icon}
                                        {action.label}
                                    </Link>
                                ) : (
                                    <>
                                        {action.icon}
                                        {action.label}
                                    </>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

export default ActionMenu;
