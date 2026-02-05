import { useMutation } from "@tanstack/react-query";
import { Logout } from "../apis/logout";
import { useAuth } from "../../../context/authContext";

export function useLogout() {
    const { setAuth } = useAuth();
    return useMutation({
        mutationFn: Logout,
        onSuccess: () => {
            setAuth({ access_token: "", user_id: '' });
        },
        onError: (error: any) => {
            console.error(error);
        }
    });
};