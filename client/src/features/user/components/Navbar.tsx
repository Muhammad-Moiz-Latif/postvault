import { Search, BellIcon, ChevronDown, User } from "lucide-react"
import { useAuth } from "../../../context/authContext";
import { useUserProfile } from "../queries/useProfile";

export function Navbar() {
    const { auth } = useAuth();
    const { data, isLoading, error } = useUserProfile(auth.user_id);
    const profile = data?.data;
    return (
        <header className="h-16 bg-card border-b font-sans border-border flex items-center justify-between px-6">
            <div className="flex w-full relative">
                <Search className="absolute text-muted-foreground left-3 top-2.5 size-4" />
                <input
                    type="search"
                    className="w-[70%] h-9 rounded-md bg-background text-foreground border-border border outline-none text-sm tracking-tight px-3 pl-9 focus:ring-2 focus:ring-ring"
                    placeholder="Search for a post..."
                />
            </div>

            <div className="flex justify-end items-center w-full gap-4">
                <button className="relative hover:bg-muted p-2 rounded-md transition-colors">
                    <BellIcon className="size-5 text-muted-foreground" />
                    <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
                </button>

                <div className="w-px h-6 bg-border" />

                {isLoading ? (
                    <div className="flex gap-2 items-center">
                        <div className="size-8 rounded-full bg-muted animate-pulse" />
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                ) : error ? (
                    <div className="flex gap-2 items-center">
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="size-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">Profile unavailable</span>
                    </div>
                ) : (
                    <button className="flex gap-2 items-center hover:bg-muted px-2 py-1.5 rounded-md transition-colors">
                        <img
                            src={profile?.img || ""}
                            alt={profile?.username}
                            className="size-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-foreground font-medium">
                            {profile?.username}
                        </span>
                        <ChevronDown className="size-4 text-muted-foreground" />
                    </button>
                )}
            </div>
        </header>
    )
}