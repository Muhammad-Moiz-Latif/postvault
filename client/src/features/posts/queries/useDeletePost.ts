import { useMutation } from "@tanstack/react-query";
import { DeletePost } from "../apis/DeletePost";

export function useDeletePost() {
    return useMutation({
        mutationFn: DeletePost,
    });
};