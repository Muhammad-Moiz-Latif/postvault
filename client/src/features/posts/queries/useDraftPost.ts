import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateDraftPost } from "../apis/CreatePostAsDraft";

export function useDraftPost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: CreateDraftPost,
        onError: (error) => {
            console.error(error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-posts'] });
        }
    });
};
