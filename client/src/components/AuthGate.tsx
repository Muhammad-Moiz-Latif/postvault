import { Navigate } from "react-router"
import { useAuth } from "../context/authContext";

export function AuthGate() {
    const { auth } = useAuth();

    if (!auth.access_token) {
        return <Navigate to="/auth" replace />;
    }
    return <Navigate to="/app" replace />;
};
