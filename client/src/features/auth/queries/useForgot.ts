import { useMutation } from "@tanstack/react-query";
import { ForgotPassword } from "../apis/forgot-password";

export function useForgot() {
    return useMutation({
        mutationFn: ForgotPassword,
        onError: (error) => {
            console.error(error);
        }
    });
};