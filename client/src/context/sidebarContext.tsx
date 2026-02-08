import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";


interface SideBarContextType {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
};

const SidebarContext = createContext<SideBarContextType | undefined>(undefined);

export const SideBarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within SidebarProvider");
    }
    return context;
};


