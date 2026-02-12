import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SavePost } from "../apis/SavePost";
import type { DetailedPostResponse } from "../../types";

export function useSavePost(postId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => SavePost(postId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['post', postId] });

            const previousValue = queryClient.getQueryData(['post', postId]);

            queryClient.setQueryData(['post', postId], (old: DetailedPostResponse) => {
                if (!old.data) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        savedbyme: !old.data.savedbyme
                    }
                };
            });

            return { previousValue };
        },

        onError: (error, _var, context) => {
            console.error(error);
            if (context?.previousValue) {
                queryClient.setQueryData(['post', postId], context.previousValue);
            };
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        },
    });
};