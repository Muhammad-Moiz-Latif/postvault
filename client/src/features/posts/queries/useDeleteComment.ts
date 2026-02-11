import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteComment } from "../apis/DeleteComment";

export function useDeleteComment(postId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DeleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
        }
    });
};