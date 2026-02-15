import { useNavigate, NavLink, useLocation } from "react-router";
import { useAuth } from "../../../context/authContext";
import { useLogout } from "../../auth/queries/useLogout";
import { toast } from "react-toastify";
import logo from "../../../assets/logo.png";
import {
    PanelLeftOpen,
    PanelRightOpen,
    LogOut,
    SquarePlus,
    Home,
    FileText,
    User2,
    ChevronRight,
    FileCheck,
    FilePenLine,
    Bookmark,
    Bell,
} from "lucide-react";
import type React from "react";
import { useUserProfile } from "../queries/useProfile";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const NAV_ITEMS = [
    { icon: Home, label: "Home", to: "/app" },
    { icon: Bookmark, label: "Saved", to: "/app/saved" },
    { icon: User2, label: "Profile", to: "/app/profile" },
];

const POSTS_SUBITEMS = [
    { icon: FileCheck, label: "Published", to: "/app/posts/published" },
    { icon: FilePenLine, label: "Drafts", to: "/app/posts/drafts" },
];

export function SideBar({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { mutate, isPending } = useLogout();
    const { auth, setAuth } = useAuth();
    const { data, isLoading, error } = useUserProfile(auth.user_id);
    const user = data?.data;
    const navigate = useNavigate();
    const location = useLocation();
    const [isPostsOpen, setIsPostsOpen] = useState(false);

    // Check if we're on any posts route
    const isPostsActive = location.pathname.startsWith("/app/posts");

    // Fetch unread notifications count
    const { data: unreadData } = useQuery({
        queryKey: ['notifications', 'unread'],
        queryFn: async () => {
            // Replace with your actual API call
            // const response = await fetch('/api/notifications/unread');
            // return response.json();
            return { count: 0 }; // Placeholder
        },
        enabled: !!auth.user_id,
    });

    const unreadCount = unreadData?.count || 0;

    function handleLogout() {
        mutate(undefined, {
            onSuccess: () => {
                setAuth({ access_token: "", user_id: "" });
                toast.success("Logged out");
                setTimeout(() => navigate("/auth", { replace: true }), 1200);
            },
            onError: () => {
                setAuth({ access_token: "", user_id: "" });
                toast.success("Logged out");
                setTimeout(() => navigate("/auth", { replace: true }), 1200);
            },
        });
    }

    return (
        <aside
            className={`
                h-screen shrink-0
                bg-background border-r border-border
                transition-all duration-300 ease-out
                ${isOpen ? "w-60" : "w-16"}
                flex flex-col
                fixed left-0 top-0 z-40
            `}
        >

            {/* Header - Logo + User Info (expanded) or just Toggle (collapsed) */}
            <div className={`
                border-b border-border/50 bg-gradient-to-b from-card to-background
                ${isOpen ? "px-4 py-[10.9px]" : "h-16 flex items-center justify-center"}
            `}>
                {isOpen ? (
                    <div className="flex items-center justify-between gap-3">
                        <NavLink
                            to="/app"
                            className="flex items-center gap-2 min-w-0 flex-1"
                        >
                            <img
                                src={logo}
                                alt="PostVault"
                                className="size-10 object-contain shrink-0"
                            />

                            {isLoading ? (
                                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                                    <div className="h-3.5 w-24 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                </div>
                            ) : error ? (
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-sm font-medium text-foreground truncate">
                                        User
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        Profile unavailable
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-sm font-semibold text-foreground truncate font-serif">
                                        {user?.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate font-sans">
                                        {user?.email}
                                    </span>
                                </div>
                            )}
                        </NavLink>

                        <button
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="
                                p-1.5 -mr-1.5 rounded-full flex-shrink-0
                                text-muted-foreground 
                                hover:cursor-pointer
                                hover:text-foreground hover:bg-accent/50
                                transition-all duration-200 group
                            "
                            aria-label="Collapse sidebar"
                        >
                            <PanelLeftOpen size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="
                            p-2.5 bg-accent rounded-full
                            text-muted-foreground 
                            hover:text-foreground hover:bg-accent/80 hover:cursor-pointer
                            transition-all duration-200 group
                        "
                        aria-label="Expand sidebar"
                    >
                        <PanelRightOpen size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                )}
            </div>

            {/* Create Post - Primary action */}
            <div className="px-3 pt-4 pb-3">
                <NavLink
                    to="/app/posts/new"
                    className={`
                        group relative
                        flex items-center justify-center gap-3 w-full
                        h-10 rounded-full
                        bg-gradient-to-r from-primary to-primary/90 text-background
                        hover:shadow-lg hover:from-primary/90 hover:to-primary/80
                        transition-all duration-200
                        font-semibold text-sm font-sans
                        ${isOpen && "px-3"}
                    `}
                >
                    <SquarePlus
                        size={18}
                        className="flex-shrink-0"
                        strokeWidth={2}
                    />
                    {isOpen && (
                        <span className="whitespace-nowrap">
                            New Post
                        </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                        <span className="
                            absolute left-full ml-2 px-2 py-1
                            bg-foreground text-background text-xs rounded
                            whitespace-nowrap pointer-events-none
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-200
                        ">
                            New Post
                        </span>
                    )}
                </NavLink>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mx-3 mb-5" />

            {/* Navigation items */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    //@ts-ignore
                    const showBadge = item.badge && unreadCount > 0;

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/app"}
                            className={({ isActive }) =>
                                `
                                    group relative
                                    flex items-center justify-center gap-3
                                    h-9 rounded-full
                                    text-sm font-normal font-sans
                                    transition-all duration-200
                                    ${isOpen && "px-3"}
                                    ${isActive
                                    ? "bg-accent text-foreground font-semibold ring-2 ring-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                                }
                                `
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="relative flex-shrink-0">
                                        <Icon
                                            size={18}
                                            strokeWidth={isActive ? 2 : 1.5}
                                        />
                                        {/* Badge for collapsed state */}
                                        {showBadge && !isOpen && (
                                            <span className="
                                                absolute -top-1 -right-1
                                                min-w-[16px] h-4 px-1
                                                flex items-center justify-center
                                                bg-destructive text-background
                                                text-[10px] font-semibold rounded-full
                                            ">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </div>

                                    {isOpen && (
                                        <span className="whitespace-nowrap w-full text-left flex items-center justify-between">
                                            <span>{item.label}</span>
                                            {/* Badge for expanded state */}
                                            {showBadge && (
                                                <span className="
                                                    min-w-[20px] h-5 px-1.5
                                                    flex items-center justify-center
                                                    bg-destructive text-background
                                                    text-xs font-semibold rounded-full
                                                ">
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </span>
                                            )}
                                        </span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {!isOpen && (
                                        <span className="
                                            absolute left-full ml-2 px-2 py-1
                                            bg-foreground text-background text-xs rounded
                                            whitespace-nowrap pointer-events-none
                                            opacity-0 group-hover:opacity-100
                                            transition-opacity duration-200
                                        ">
                                            {item.label}
                                            {showBadge && ` (${unreadCount})`}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}

                {/* Posts Dropdown with Tree Lines */}
                <div>
                    {/* Posts Parent Link */}
                    <div className="relative">
                        <NavLink
                            to="/app/posts"
                            end
                            onClick={(e) => {
                                if (isOpen) {
                                    e.preventDefault();
                                    setIsPostsOpen((prev) => !prev);
                                }
                            }}
                            className={`
                                group relative
                                flex items-center justify-center gap-3
                                h-9 rounded-full
                                text-sm font-normal font-sans
                                transition-all duration-200
                                ${isOpen && "px-3"}
                                ${isPostsActive
                                    ? "bg-accent text-foreground font-semibold ring-2 ring-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                                }
                            `}
                        >
                            <FileText
                                size={18}
                                className="flex-shrink-0"
                                strokeWidth={isPostsActive ? 2 : 1.5}
                            />
                            {isOpen && (
                                <>
                                    <span className="whitespace-nowrap flex-1 text-left">
                                        Posts
                                    </span>
                                    <ChevronRight
                                        size={16}
                                        className={`
                                            flex-shrink-0 transition-transform duration-200
                                            ${isPostsOpen ? "rotate-90" : "rotate-0"}
                                        `}
                                    />
                                </>
                            )}

                            {/* Tooltip for collapsed state */}
                            {!isOpen && (
                                <span className="
                                    absolute left-full ml-2 px-2 py-1
                                    bg-foreground text-background text-xs rounded
                                    whitespace-nowrap pointer-events-none
                                    opacity-0 group-hover:opacity-100
                                    transition-opacity duration-200
                                ">
                                    Posts
                                </span>
                            )}
                        </NavLink>
                    </div>

                    {/* Dropdown Subitems with Tree Connectors */}
                    {isOpen && isPostsOpen && (
                        <div className="relative mt-0.5 space-y-0.5 pl-3">
                            {/* Vertical line connecting all children */}
                            <div className="
                                absolute left-[21px] top-0 bottom-2
                                w-px bg-border
                            " />

                            {POSTS_SUBITEMS.map((subitem) => {
                                const SubIcon = subitem.icon;

                                return (
                                    <div key={subitem.to} className="relative">
                                        {/* Horizontal connector line */}
                                        <div className="
                                            absolute left-[21px] top-1/2 -translate-y-1/2
                                            w-3 h-px bg-border
                                        " />

                                        <NavLink
                                            to={subitem.to}
                                            className={({ isActive }) =>
                                                `
                                                    group relative
                                                    flex items-center gap-3
                                                    h-8 rounded-full pl-[33px] pr-3
                                                    text-sm font-normal font-sans
                                                    transition-all duration-200
                                                    ${isActive
                                                    ? "bg-accent/60 text-foreground font-semibold"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                                                }
                                                `
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <SubIcon
                                                        size={16}
                                                        className="flex-shrink-0"
                                                        strokeWidth={isActive ? 2 : 1.5}
                                                    />
                                                    <span className="whitespace-nowrap">
                                                        {subitem.label}
                                                    </span>
                                                </>
                                            )}
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mx-3" />

            {/* Logout button */}
            <div className="px-3 py-4">
                <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className={`
                        group relative
                        flex items-center justify-center gap-3 w-full
                        h-9 rounded-full
                        text-sm font-normal font-sans
                        text-muted-foreground
                        hover:text-destructive hover:bg-destructive/10
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${isOpen && "px-3"}
                    `}
                >
                    <LogOut
                        size={18}
                        className="flex-shrink-0"
                        strokeWidth={1.5}
                    />
                    {isOpen && (
                        <span className="whitespace-nowrap w-full text-left">
                            {isPending ? "Logging out..." : "Logout"}
                        </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!isOpen && !isPending && (
                        <span className="
                            absolute left-full ml-2 px-2 py-1
                            bg-foreground text-background text-xs rounded
                            whitespace-nowrap pointer-events-none
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-200
                        ">
                            Logout
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}
