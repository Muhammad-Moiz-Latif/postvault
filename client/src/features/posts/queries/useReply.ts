import { useMutation } from "@tanstack/react-query";
import { ReplyToComment } from "../apis/ReplyToComment";

export function useReply() {
    return useMutation({
        mutationFn: ReplyToComment
    })
};