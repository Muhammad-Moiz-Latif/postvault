import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../apis/verify-email";


export function useEmailVerify() {
    return useMutation({
        mutationFn: verifyEmail,
        onError: (error) => {
            console.error(error)
        }
    });
};