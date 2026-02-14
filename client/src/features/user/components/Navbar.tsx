import { Search, BellIcon, ChevronDown, User } from "lucide-react"
import { useAuth } from "../../../context/authContext";
import { useUserProfile } from "../queries/useProfile";

export function Navbar({ isOpen }: { isOpen: boolean }) {
    const { auth } = useAuth();
    const { data, isLoading, error } = useUserProfile(auth.user_id);
    const profile = data?.data;

    return (
        <header
            className={`
                fixed top-0 z-30
                bg-background border-b border-border
                flex items-center justify-between
                px-6 transition-all duration-300 ease-out
                ${isOpen ? "ml-60 w-[calc(100%-15rem)] h-[63px]" : "ml-16  h-16 w-[calc(100%-4rem)]"}
            `}
        >
            {/* Search Section */}
            <div className="flex items-center w-full max-w-md relative">
                <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                <input
                    type="search"
                    placeholder="Search posts..."
                    className="
                        w-full h-9 pl-9 pr-3
                        rounded-lg border border-border
                        bg-background text-foreground text-sm
                        outline-none transition-all
                        placeholder:text-muted-foreground
                        focus:ring-2 focus:ring-ring focus:border-transparent
                    "
                />
            </div>

            {/* Right Section - Notifications & Profile */}
            <div className="flex items-center gap-2">
                {/* Notification Button */}
                <button
                    className="
                        relative p-2 rounded-lg
                        text-muted-foreground
                        hover:text-foreground hover:bg-muted
                        transition-colors
                    "
                    aria-label="Notifications"
                >
                    <BellIcon size={18} strokeWidth={1.5} />
                    <span className="absolute top-1.5 right-1.5 size-1.5 bg-destructive rounded-full" />
                </button>

                {/* Divider */}
                <div className="w-px h-5 bg-border mx-1" />

                {/* Profile Section */}
                {isLoading ? (
                    <div className="flex items-center gap-2 px-2 py-1.5">
                        <div className="size-7 rounded-full bg-muted animate-pulse" />
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 px-2 py-1.5">
                        <div className="size-7 rounded-full bg-muted flex items-center justify-center">
                            <User size={14} className="text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">Unavailable</span>
                    </div>
                ) : (
                    <button
                        className="
                            flex items-center gap-2
                            px-2 py-1.5 rounded-lg
                            hover:bg-muted
                            transition-colors
                        "
                        aria-label="Account menu"
                    >
                        <img
                            src={profile?.img || ""}
                            alt={profile?.username}
                            className="size-7 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-foreground">
                            {profile?.username}
                        </span>
                        <ChevronDown size={16} className="text-muted-foreground" strokeWidth={1.5} />
                    </button>
                )}
            </div>
        </header>
    )
}