import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { RefreshAccessToken } from "../features/user/apis/refreshToken";
import { useNavigate } from "react-router";

export function useAuthRedirect() {
    const { auth, setAuth } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.access_token) {
            setIsChecking(false);
            return
        } else {
            async function getToken() {
                try {
                    const response = await RefreshAccessToken();
                    if (response.access_token) {
                        setAuth({
                            access_token: response.access_token,
                            user_id: response.data?.userId!
                        });
                    }
                } catch (error) {
                    navigate('/auth', { replace: true });
                    console.error(error);
                } finally {
                    setIsChecking(false);
                }
            };
            getToken();
        }
    }, []);

    return { isChecking };
}