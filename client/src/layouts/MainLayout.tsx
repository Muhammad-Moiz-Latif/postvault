import { Outlet } from "react-router";
import { Navbar } from "../features/user/components/Navbar";
import { SideBar } from "../features/user/components/Sidebar";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { useState } from "react";

export const MainLayout = () => {
    const { isChecking } = useAuthRedirect();
    const [isOpen, setIsOpen] = useState(true);

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-foreground font-sans">Loading...</div>
            </div>
        );
    };


    return (
        <div className="max-w-full min-h-screen">
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <div className="flex-1 flex flex-col">
                <Navbar isOpen={isOpen}/>
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};