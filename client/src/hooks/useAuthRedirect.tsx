import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { RefreshAccessToken } from "../features/user/apis/refreshToken";
import { useNavigate } from "react-router";

export function useAuthRedirect() {
    const { auth, setAuth } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // If we already have a token (from localStorage), no need to check
        if (auth.access_token) {
            setIsChecking(false);
            return;
        }

        // No token in context/localStorage, try to get one from refresh cookie
        async function tryRefresh() {
            try {
                const response = await RefreshAccessToken();
                if (response.access_token) {
                    setAuth({
                        access_token: response.access_token,
                        user_id: response.data?.userId!
                    });
                } else {
                    // No token, redirect to auth
                    navigate('/auth', { replace: true });
                }
            } catch (error) {
                // Refresh failed, user needs to login
                console.error("Token refresh failed:", error);
                navigate('/auth', { replace: true });
            } finally {
                setIsChecking(false);
            }
        }

        tryRefresh();
    }, [auth.access_token, navigate, setAuth]);

    return { isChecking };
}