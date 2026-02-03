import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";

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

    const [auth, setAuth] = useState<AuthState>({
        access_token: "",
        user_id: ""
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};