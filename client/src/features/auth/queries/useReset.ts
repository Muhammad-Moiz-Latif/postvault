import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../apis/reset-password";

export function useReset() {
    return useMutation({
        mutationFn: resetPassword,
        onError: (error: any) => {
            console.error(error)
        }
    })
}