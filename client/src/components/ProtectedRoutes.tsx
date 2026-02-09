import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/authContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";


export function ProtectedRoute() {
    const { auth } = useAuth();
    const { isChecking } = useAuthRedirect();
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    };

    if (!auth.access_token) {
        return <Navigate to="/auth" replace />
    };

    return <Outlet />
};