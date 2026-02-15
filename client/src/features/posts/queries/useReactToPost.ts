import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LikeUnlikePost } from "../apis/LikeUnlikePost";
import type { DetailedPostResponse } from "../../types";

export function useReactToPost(postId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => LikeUnlikePost(postId),

        onMutate: async () => {

            await queryClient.cancelQueries({ queryKey: ["post", postId] });

            const previousValue = queryClient.getQueryData(["post", postId]);

            queryClient.setQueryData(["post", postId], (old: DetailedPostResponse) => {
                if (!old?.data) return old;

                const likes = Number(old.data.likes);


                const isLiked = old.data.likedbyme;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        likes: isLiked ? likes - 1 : likes + 1,
                        likedbyme: !isLiked,
                    },
                };
            });

            return { previousValue };
        },

        onError: (_err, _vars, context) => {
            if (context?.previousValue) {
                queryClient.setQueryData(["post", postId], context.previousValue);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
            queryClient.invalidateQueries({ queryKey: ['all-posts'] });
        },
    });
}
