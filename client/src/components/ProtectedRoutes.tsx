import { Navigate } from "react-router";
import { useAuth } from "../context/authContext";


export function ProtectedRoutes({ children }: { children: React.ReactNode }) {
    const { auth } = useAuth();
    if (!auth.access_token) {
        return <Navigate to="/auth" replace />
    } return (
        <>
            {children}
        </>
    );
};