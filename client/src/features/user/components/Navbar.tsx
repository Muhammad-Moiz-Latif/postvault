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
                bg-gradient-to-b from-background via-background to-background/95
                border-b border-border/50 backdrop-blur-sm
                flex items-center justify-between
                px-6 transition-all duration-300 ease-out
                ${isOpen ? "ml-60 w-[calc(100%-15rem)] h-[63px]" : "ml-16 h-16 w-[calc(100%-4rem)]"}
            `}
        >
            {/* Search Section */}
            <div className="flex items-center w-full max-w-md relative">
                <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                <input
                    type="search"
                    placeholder="Search for stories..."
                    className="
                        w-full h-9 pl-9 pr-3
                        rounded-full border border-border/60
                        bg-card text-foreground text-sm font-sans
                        outline-none transition-all
                        placeholder:text-muted-foreground/70
                        focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                        hover:border-border/80
                    "
                />
            </div>

            {/* Right Section - Notifications & Profile */}
            <div className="flex items-center gap-4">
                {/* Notification Button */}
                <button
                    className="
                        relative p-2.5 rounded-full
                        text-muted-foreground
                        hover:text-foreground hover:bg-accent/50
                        transition-all duration-200
                        group
                    "
                    aria-label="Notifications"
                >
                    <BellIcon size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2 right-2 size-1.5 bg-primary rounded-full animate-pulse" />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-border/40" />

                {/* Profile Section */}
                {isLoading ? (
                    <div className="flex items-center gap-2.5 px-3 py-2">
                        <div className="size-8 rounded-full bg-accent animate-pulse" />
                        <div className="h-3.5 w-24 bg-accent rounded-full animate-pulse hidden sm:block" />
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2.5 px-3 py-2">
                        <div className="size-8 rounded-full bg-accent flex items-center justify-center">
                            <User size={14} className="text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground font-sans hidden sm:block">Profile</span>
                    </div>
                ) : (
                    <button
                        className="
                            flex items-center gap-2.5
                            px-3 py-2 rounded-full
                            hover:bg-accent/40
                            transition-all duration-200
                            group
                        "
                        aria-label="Account menu"
                    >
                        <img
                            src={profile?.img || ""}
                            alt={profile?.username}
                            className="size-8 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                        />
                        <span className="text-sm font-medium text-foreground hidden sm:block font-sans">
                            {profile?.username}
                        </span>
                        <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-colors hidden sm:block" strokeWidth={1.5} />
                    </button>
                )}
            </div>
        </header>
    )
}
