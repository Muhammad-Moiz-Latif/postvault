import { useMutation } from "@tanstack/react-query";
import { CreateDraftPost } from "../apis/CreatePostAsDraft";

export function useDraftPost() {
    return useMutation({
        mutationFn: CreateDraftPost,
        onError: (error) => {
            console.error(error);
        }
    });
};
