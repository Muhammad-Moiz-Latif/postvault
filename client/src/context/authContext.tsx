import { createContext, useContext, useState, useEffect, type Dispatch, type SetStateAction } from "react";

interface AuthState {
    access_token: string,
    user_id: string
};

interface AuthContextType {
    auth: AuthState;
    setAuth: Dispatch<SetStateAction<AuthState>>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [auth, setAuth] = useState<AuthState>(() => {
        // Initialize from localStorage on mount
        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id');
        return {
            access_token: token || "",
            user_id: userId || ""
        };
    });

    // Sync to localStorage whenever auth changes
    useEffect(() => {
        if (auth.access_token) {
            localStorage.setItem('access_token', auth.access_token);
            localStorage.setItem('user_id', auth.user_id);
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
};

// CUSTOM HOOK
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};