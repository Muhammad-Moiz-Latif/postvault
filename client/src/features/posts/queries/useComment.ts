import { useMutation } from "@tanstack/react-query";
import { CommentOnPost } from "../apis/CommentOnPost";

export function useComment() {
    return useMutation({
        mutationFn: CommentOnPost,
    });
};