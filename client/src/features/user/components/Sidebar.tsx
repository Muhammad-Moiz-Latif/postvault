import { useNavigate, NavLink, useLocation } from "react-router";
import { useAuth } from "../../../context/authContext";
import { useLogout } from "../../auth/queries/useLogout";
import { toast, ToastContainer } from "react-toastify";
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
} from "lucide-react";
import type React from "react";
import { useUserProfile } from "../queries/useProfile";
import { useState } from "react";

const NAV_ITEMS = [
    { icon: Home, label: "Home", to: "/app" },
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
            <ToastContainer position="top-center" hideProgressBar />

            {/* Header - Logo + User Info (expanded) or just Toggle (collapsed) */}
            <div className={`
                border-b border-border
                ${isOpen ? "px-4 py-3" : "h-16 flex items-center justify-center"}
            `}>
                {isOpen ? (
                    <div className="flex items-center justify-between gap-3">
                        <NavLink
                            to="/app"
                            className="flex items-center gap-3 min-w-0 flex-1"
                        >
                            <img
                                src={logo}
                                alt="PostVault"
                                className="size-8 rounded-lg object-contain flex-shrink-0"
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
                                    <span className="text-sm font-medium text-foreground truncate">
                                        {user?.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        {user?.email}
                                    </span>
                                </div>
                            )}
                        </NavLink>

                        <button
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="
                                p-1.5 -mr-1.5 rounded-md flex-shrink-0
                                text-muted-foreground 
                                hover:cursor-pointer
                                hover:text-foreground hover:bg-muted
                                transition-colors
                            "
                            aria-label="Collapse sidebar"
                        >
                            <PanelLeftOpen size={18} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="
                            p-3 bg-zinc-100 rounded-md
                            text-muted-foreground 
                            hover:text-foreground hover:bg-zinc-200 hover:cursor-pointer
                            transition-colors
                        "
                        aria-label="Expand sidebar"
                    >
                        <PanelRightOpen size={18} />
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
                        h-10 rounded-lg
                        bg-foreground text-background
                        hover:bg-foreground/90
                        transition-all duration-200
                        font-medium text-sm
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
            <div className="h-px bg-border mx-3 mb-5" />


            {/* Navigation items */}
            <nav className="flex-1 px-3 space-y-0.5">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/app"}
                            className={({ isActive }) =>
                                `
                                    group relative
                                    flex items-center justify-center gap-3
                                    h-9 rounded-lg
                                    text-sm font-normal
                                    transition-all duration-200
                                    ${isOpen && "px-3"}
                                    ${isActive
                                    ? "bg-muted text-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }
                                `
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        size={18}
                                        className="flex-shrink-0"
                                        strokeWidth={isActive ? 2 : 1.5}
                                    />
                                    {isOpen && (
                                        <span className="whitespace-nowrap w-full text-left">
                                            {item.label}
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
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}

                {/* Posts Dropdown */}
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
                                h-9 rounded-lg
                                text-sm font-normal
                                transition-all duration-200
                                ${isOpen && "px-3"}
                                ${isPostsActive
                                    ? "bg-muted text-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }
                            `}
                        >
                            {/* Active indicator bar */}
                            {isPostsActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-foreground rounded-r" />
                            )}

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

                    {/* Dropdown Subitems */}
                    {isOpen && isPostsOpen && (
                        <div className="mt-0.5 space-y-0.5 pl-3">
                            {POSTS_SUBITEMS.map((subitem) => {
                                const SubIcon = subitem.icon;
                                return (
                                    <NavLink
                                        key={subitem.to}
                                        to={subitem.to}
                                        className={({ isActive }) =>
                                            `
                                                group relative
                                                flex items-center gap-3
                                                h-8 rounded-lg px-3
                                                text-sm font-normal
                                                transition-all duration-200
                                                ${isActive
                                                ? "bg-muted/50 text-foreground font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                            }
                                            `
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {/* Active indicator bar */}
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground rounded-r" />
                                                )}

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
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* Divider */}
            <div className="h-px bg-border mx-3" />

            {/* Logout button */}
            <div className="px-3 py-4">
                <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className={`
                        group relative
                        flex items-center justify-center gap-3 w-full
                        h-9 rounded-lg
                        text-sm font-normal
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