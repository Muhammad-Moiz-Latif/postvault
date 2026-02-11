import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LikeUnlikeComment } from "../apis/LikeUnlikeComment";
import type { CommentsinDetailedPost } from "../../types";


export function useReactToComment(postId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: LikeUnlikeComment,

        onMutate: async (commentId: string) => {
            // Cancel any outgoing queries to prevent them from overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ["post", postId] });

            const previousValue = queryClient.getQueryData(["post", postId]);

            queryClient.setQueryData(["post", postId], (old: any) => {
                if (!old?.data) return old;

                // Recursive function to find and update the comment by ID
                const updateCommentById = (comments: CommentsinDetailedPost[]): CommentsinDetailedPost[] => {
                    return comments.map(comment => {
                        // If this is the comment we're looking for, toggle its like status
                        if (comment.id === commentId) {
                            const isLiked = comment.likedByMe;
                            return {
                                ...comment,
                                likes: isLiked ? comment.likes - 1 : comment.likes + 1,
                                likedByMe: !isLiked
                            };
                        }

                        // If this comment has replies, recursively search them
                        if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: updateCommentById(comment.replies)
                            };
                        }

                        // Return comment unchanged if it's not the one we're looking for
                        return comment;
                    });
                };

                return {
                    ...old,
                    data: {
                        ...old.data,
                        comments: updateCommentById(old.data.comments)
                    }
                };
            });

            return { previousValue };
        },

        onError: (_err, _vars, context) => {
            if (context?.previousValue) {
                queryClient.setQueryData(['post', postId], context.previousValue);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        },
    });
}