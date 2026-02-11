import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditComment } from "../apis/EditComment";

export function useEditComment(postId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: EditComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] })
        }
    })
}