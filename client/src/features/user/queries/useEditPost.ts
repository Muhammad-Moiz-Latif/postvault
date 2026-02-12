import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditPost } from "../apis/EditPost";

export function useEditPost(postId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: EditPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            queryClient.invalidateQueries({ queryKey: ['my-posts'] });
        }
    });
};