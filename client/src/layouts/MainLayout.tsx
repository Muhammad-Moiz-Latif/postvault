import { Outlet } from "react-router";
import { Navbar } from "../features/user/components/Navbar";
import { SideBar } from "../features/user/components/Sidebar";
import { useSidebar } from "../context/sidebarContext";
import { ToastContainer } from "react-toastify";

export const MainLayout = () => {
    const { isOpen, setIsOpen } = useSidebar();
    return (
        <div className="min-h-screen w-full">
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
            <Navbar isOpen={isOpen} />
            <main className={`pt-16 z-0 ${isOpen ? "pl-60" : "pl-16"} transition-all ease-in-out`}>
                <ToastContainer position="top-center" hideProgressBar />
                <Outlet />
            </main>
        </div>
    );
};