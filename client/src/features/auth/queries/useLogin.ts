import { useMutation } from "@tanstack/react-query";
import { login } from "../apis/login";


export default function useLogin() {
    return useMutation({
        mutationFn: login,
    });
};