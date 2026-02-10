import { Outlet } from "react-router";
import { Navbar } from "../features/user/components/Navbar";
import { SideBar } from "../features/user/components/Sidebar";
import { useSidebar } from "../context/sidebarContext";

export const MainLayout = () => {
    const { isOpen, setIsOpen } = useSidebar();
    return (
        <div className="min-h-screen w-full">
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
            <Navbar isOpen={isOpen} />
            <main className={`pt-16 z-0 ${isOpen ? "pl-52" : "pl-20"} transition-all ease-in-out`}>
                <Outlet />
            </main>
            {/* <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div> */}
        </div>
    );
};