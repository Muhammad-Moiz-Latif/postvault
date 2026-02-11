import { useQueryClient } from "@tanstack/react-query";
import { useReactToComment } from "../queries/useReactToComment";
import { useReply } from "../queries/useReply";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import type { CommentsinDetailedPost } from "../../types";
import { useAuth } from "../../../context/authContext";
import { useDeleteComment } from "../queries/useDeleteComment";
import { useEditComment } from "../queries/useEditComment";

interface CommentProps {
    comment: CommentsinDetailedPost;
    isReply?: boolean;
    postId: string
}

export const Comment = ({ comment, isReply = false, postId }: CommentProps) => {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const { mutate: ReactToComment } = useReactToComment(postId!);
    const { mutate: ReplyToComment, isPending: replying } = useReply();
    const { mutate: DeleteComment, isPending } = useDeleteComment(postId);
    const { mutate: EditComment, isPending: editing } = useEditComment(postId);
    const [isEdit, setIsEdit] = useState(false);
    const [editValue, setEditValue] = useState(comment.text);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    function handleCommentLike(commentId: string) {
        ReactToComment(commentId, {
            onError: (error) => {
                console.error(error);
                toast.error("An error occurred while liking this comment");
            }
        });
    }

    function handleReplySubmit() {

        ReplyToComment({ postId, parentId: comment.id, comment: replyText }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['post', postId] });
                setReplyText("");
                setIsReplying(false);
            },
            onError: (error) => {
                console.error(error);
                toast.error("Failed to reply");
            }
        });
    };

    function handleDeleteComment(commentId: string) {
        DeleteComment({ postId, commentId }, {
            onError: (error) => {
                console.error(error);
                toast.error("Could not delete comment");
            }
        })
    };

    function handleEdit() {
        EditComment({ commentId: comment.id, postId, comment: editValue }, {
            onSuccess: () => {
                setIsEdit(false);
            },
            onError: (error) => {
                console.error(error);
                toast.error("Could not edit comment");
            }
        })
    };

    return (
        <div className={isReply ? "ml-12" : ""}>
            <ToastContainer
                position='top-center'
                closeOnClick
                draggable
                hideProgressBar={true}
            />
            <div className="flex gap-3">
                <img
                    src={comment.author.img}
                    alt={comment.author.username}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">
                                {comment.author.username}
                            </span>
                            <span className="text-sm text-gray-500">
                                {comment.createdAt}
                            </span>
                        </div>
                        {
                            (auth.user_id === comment.author.id) &&
                            <div className="flex gap-2">
                                <button
                                    disabled={isPending}
                                    className="bg-rose-600 text-white px-3 py-1 rounded-md hover:cursor-pointer active:opacity-55"
                                    onClick={() => handleDeleteComment(comment.id)}
                                >{isPending ? "Deleting..." : "Delete"}</button>
                                <button
                                    className="bg-amber-600 text-white px-3 py-1 rounded-md hover:cursor-pointer active:opacity-55"
                                    onClick={() => setIsEdit((prev) => !prev)}
                                >{isEdit ? "Cancel" : "Edit"}</button>
                            </div>
                        }
                    </div>


                    <input
                        disabled={!isEdit}
                        type="text"
                        value={isEdit ? editValue : comment.text}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={`text-gray-800 leading-relaxed mb-3 ${isEdit && "border rounded-md border-zinc-300 outline-none p-1"}`}
                    />


                    <div className="flex items-center gap-4 text-sm">
                        <button
                            onClick={() => handleCommentLike(comment.id)}
                            className={`flex items-center gap-1 ${comment.likedByMe
                                ? "text-rose-600"
                                : "text-gray-600"
                                } hover:opacity-60 transition hover:cursor-pointer`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span>{comment.likes}</span>
                        </button>

                        {
                            !isReply && (
                                <button
                                    onClick={() => setIsReplying(!isReplying)}
                                    className="text-gray-600 hover:text-gray-900 transition"
                                >
                                    {(isReplying) ? "Cancel" : "Reply"}
                                </button>
                            )
                        }

                        {
                            isEdit && (
                                <button
                                    onClick={handleEdit}
                                    className="bg-black rounded-md text-white p-1 hover:cursor-pointer"
                                >
                                    {editing ? "Editing..." : "Edit Comment"}
                                </button>
                            )
                        }

                    </div>

                    {/* Reply Input */}
                    {isReplying && (
                        <div className="mt-4">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                rows={2}
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-900 transition"
                            />

                            <div className="flex justify-end mt-2">
                                <button
                                    disabled={replying}
                                    onClick={handleReplySubmit}
                                    className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition"
                                >
                                    {replying ? "Replying..." : "Reply"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Nested replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-6 space-y-6">
                            {comment.replies.map((reply: any) => (
                                <Comment
                                    key={reply.id}
                                    comment={reply}
                                    isReply={true}
                                    postId={postId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
