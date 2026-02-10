import { useMutation } from "@tanstack/react-query";
import { PublishPost } from "../apis/PublishPost";

export function usePublishPost() {
    return useMutation({
        mutationFn: PublishPost,
        onError: (error) => {
            console.error(error);
        }
    });
}