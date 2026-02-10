import { useNavigate, NavLink } from "react-router";
import { useAuth } from "../../../context/authContext";
import { useLogout } from "../../auth/queries/useLogout";
import { toast, ToastContainer } from "react-toastify";
import logo from "../../../assets/logo.png";
import shortLogo from "../../../assets/logo_responsive.png";
import {
    PanelLeftOpen,
    PanelRightOpen,
    LogOut,
    SquarePlus,
    Home,
    FileText,
    User2,
    Settings,
} from "lucide-react";
import { useSidebar } from "../../../context/sidebarContext";
import type React from "react";

const NAV_ITEMS = [
    { icon: Home, label: "Home", to: "/app" },
    { icon: FileText, label: "Posts", to: "/app/posts" },
    { icon: User2, label: "Profile", to: "/app/profile" },
    { icon: Settings, label: "Settings", to: "/app/settings" },
];



export function SideBar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { mutate, isPending } = useLogout();
    const { setAuth } = useAuth();
    const navigate = useNavigate();

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
                shrink-0  h-screen 
                bg-card border-r fixed border-border
                transition-all duration-300 ease-in-out
                ${isOpen ? "w-52" : "w-20"}
                flex flex-col
            `}
        >
            <ToastContainer position="top-center" hideProgressBar />

            <div className="flex items-center justify-between border-b border-border px-3 py-[14.5px]">
                <NavLink to="/app" className="flex items-center overflow-hidden">
                    <img
                        src={isOpen ? logo : shortLogo}
                        alt="Logo"
                        className="h-9 w-auto object-contain transition-opacity duration-200"
                    />
                </NavLink>

                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="text-primary hover:cursor-pointer"
                >
                    {isOpen ? <PanelRightOpen /> : <PanelLeftOpen />}
                </button>
            </div>

            <div className="p-3">
                <NavLink
                    to="/app/posts/new"
                    className={`
                        flex items-center gap-2 w-full rounded-md 
                        bg-sidebar-accent px-3 py-2 text-white 
                        transition-colors hover:opacity-90
                        ${!isOpen && "justify-center"}
                    `}
                >
                    <SquarePlus className="flex-shrink-0" size={20} />
                    <span
                        className={`
                            whitespace-nowrap overflow-hidden
                            transition-all duration-300
                            ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
                        `}
                    >
                        Create Post
                    </span>
                </NavLink>
            </div>

            <div className="h-px bg-border" />

            <nav className="px-3 py-2 space-y-1 flex-1">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/app"}
                            className={({ isActive }) =>
                                `
                                    flex items-center gap-3 rounded-md px-3 py-2
                                    transition-colors duration-200
                                    ${!isOpen && "justify-center"}
                                    ${isActive
                                    ? "bg-sidebar-accent text-white"
                                    : "text-muted-foreground hover:bg-muted"
                                }
                                `
                            }
                        >
                            <Icon className="flex-shrink-0" size={20} />
                            <span
                                className={`
                                    whitespace-nowrap overflow-hidden
                                    transition-all duration-300
                                    ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
                                `}
                            >
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-3">
                <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className={`
                        flex items-center gap-2 w-full rounded-md 
                        bg-rose-500 px-3 py-2 text-white 
                        hover:cursor-pointer
                        transition-opacity hover:opacity-90 
                        disabled:opacity-70
                        ${!isOpen && "justify-center"}
                    `}
                >
                    <LogOut className="flex-shrink-0" size={20} />
                    <span
                        className={`
                            whitespace-nowrap overflow-hidden
                            transition-all duration-300
                            ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
                        `}
                    >
                        {isPending ? "Logging out..." : "Logout"}
                    </span>
                </button>
            </div>
        </aside>
    );
};