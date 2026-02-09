import { useMutation } from "@tanstack/react-query";
import { CreatePost } from "../apis/CreatePost";

export function useCreatePost() {
    return useMutation({
        mutationFn: CreatePost,
        onError: (error) => {
            console.error(error);
        }
    });
};
