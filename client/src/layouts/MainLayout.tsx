import { Outlet } from "react-router";
import { Navbar } from "../features/user/components/Navbar";
import { SideBar } from "../features/user/components/Sidebar";

export const MainLayout = () => {
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