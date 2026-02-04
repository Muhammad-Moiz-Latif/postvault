import { useMutation } from "@tanstack/react-query";
import { signup } from "../apis/signup";


export function useSignup() {
    return useMutation({
        mutationFn: signup,
        onError: (error) => {
            console.error(error);
        }
    });
};