import { Outlet } from "react-router";
import { Navbar } from "../features/user/components/Navbar";
import { SideBar } from "../features/user/components/Sidebar";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

export const MainLayout = () => {
    const { isChecking } = useAuthRedirect();

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-foreground font-sans">Loading...</div>
            </div>
        );
    };


    return (
        <div className="flex min-h-screen w-full">
            <SideBar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};