import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FollowUser } from "../apis/FollowNigga";
import type { DetailedPostResponse } from "../../types";

export function useFollow(postId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: FollowUser,

        // Optimistic update for current post only
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['post', postId] });

            const previousValue = queryClient.getQueryData(['post', postId]);

            queryClient.setQueryData(['post', postId], (old: DetailedPostResponse) => {
                if (!old?.data) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        followedbyme: !old.data.followedbyme
                    },
                };
            });

            return { previousValue };
        },

        onError: (error, _var, context) => {
            console.error(error);
            if (context?.previousValue) {
                queryClient.setQueryData(['post', postId], context.previousValue);
            }
        },

        onSettled: () => {
            // Invalidate ALL post queries (not just the current one)
            // This ensures all posts by this author show updated follow status
            queryClient.invalidateQueries({ queryKey: ['post'] });
            queryClient.invalidateQueries({ queryKey: ['all-posts'] });
        }
    });
};