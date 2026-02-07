import { Search, BellIcon, ArrowDown } from "lucide-react"
import { useAuth } from "../../../context/authContext";
import { useUserProfile } from "../queries/useProfile";

export function Navbar({ isOpen }: { isOpen: boolean }) {
    const { auth } = useAuth();
    const { data } = useUserProfile(auth.user_id);
    console.log(data);
    return (
        <header className={`h-16 bg-card border-b font-sans ease-in-out transition-all border-border flex items-center justify-between px-6 ${isOpen ? "ml-52" : "ml-24"}`}>
            {/* Navbar content here */}
            <div className="flex w-full relative">
                <Search className="absolute text-zinc-500 left-1 top-1.5 size-5" />
                <input
                    type="search"
                    className="w-[70%] h-8 rounded-md border-border border outline-none text-sm tracking-tight p-2 pl-7
                focus:ring-1 focus:ring-primary"
                    placeholder="Search for a post."
                />
            </div>

            <div className="flex justify-end items-center w-full gap-4">
                <BellIcon />
                <div className="w-px h-4 bg-zinc-300" />
                <div className="flex gap-2 items-center">
                    <img src={data?.data?.img} className="object-contain size-7 rounded-full" />
                    <h1 className="tracking-tight text-zinc-400 font-extralight">{data?.data?.username}</h1>
                    <ArrowDown className="size-3 text-zinc-400" />
                </div>

            </div>

        </header>
    )
}