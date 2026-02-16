import { useQueryClient } from "@tanstack/react-query";
import { useReactToComment } from "../queries/useReactToComment";
import { useReply } from "../queries/useReply";
import { useState } from "react";
import { toast } from 'sonner';
import type { CommentsinDetailedPost } from "../../types";
import { useAuth } from "../../../context/authContext";
import { useDeleteComment } from "../queries/useDeleteComment";
import { useEditComment } from "../queries/useEditComment";
import { Heart, MoreVertical, Loader2 } from "lucide-react";

interface CommentProps {
    comment: CommentsinDetailedPost;
    depth: number;
    postId: string;
}

const MAX_DEPTH = 1; // Only allow 1 level of nesting (comment -> reply)

export const Comment = ({ comment, depth, postId }: CommentProps) => {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const { mutate: ReactToComment } = useReactToComment(postId);
    const { mutate: ReplyToComment, isPending: replying } = useReply();
    const { mutate: DeleteComment, isPending: deleting } = useDeleteComment(postId);
    const { mutate: EditComment, isPending: editing } = useEditComment(postId);

    const [isEdit, setIsEdit] = useState(false);
    const [editValue, setEditValue] = useState(comment.text);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showActions, setShowActions] = useState(false);

    const isOwner = auth.user_id === comment.author.id;
    const canReply = depth < MAX_DEPTH;

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
        });
    };

    function handleCommentLike() {
        ReactToComment(comment.id, {
            onError: (error) => {
                console.error(error);
                toast.error("Failed to like comment");
            }
        });
    }

    function handleReplySubmit() {
        if (!replyText.trim()) return;

        ReplyToComment(
            { postId, parentId: comment.id, comment: replyText },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['post', postId] });
                    setReplyText("");
                    setIsReplying(false);
                    toast.success("Reply published");
                },
                onError: (error) => {
                    console.error(error);
                    toast.error("Failed to reply");
                }
            }
        );
    }

    function handleDeleteComment() {
        if (!confirm("Delete this comment? This action cannot be undone.")) return;

        DeleteComment(
            { postId, commentId: comment.id },
            {
                onSuccess: () => {
                    toast.success("Comment deleted");
                },
                onError: (error) => {
                    console.error(error);
                    toast.error("Failed to delete comment");
                }
            }
        );
    }

    function handleEdit() {
        if (!editValue.trim()) return;

        EditComment(
            { commentId: comment.id, postId, comment: editValue },
            {
                onSuccess: () => {
                    setIsEdit(false);
                    toast.success("Comment updated");
                },
                onError: (error) => {
                    console.error(error);
                    toast.error("Failed to update comment");
                }
            }
        );
    }

    return (
        <div className={depth > 0 ? "ml-12 pt-6 border-l-2 border-border/50 pl-6" : ""}>
            <div className="flex gap-3">
                {/* Avatar */}
                <img
                    src={comment.author.img}
                    alt={comment.author.username}
                    className="size-10 rounded-full object-cover flex-shrink-0 ring-2 ring-primary/20"
                />

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-sm font-sans">
                                {comment.author.username}
                            </span>
                            <span className="text-xs text-muted-foreground font-sans">
                                {formatDate(comment.createdAt)}
                            </span>
                        </div>

                        {/* Actions menu */}
                        {isOwner && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowActions(!showActions)}
                                    className="p-1 rounded-full hover:bg-accent/50 transition-all group"
                                >
                                    <MoreVertical size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                </button>

                                {showActions && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowActions(false)}
                                        />
                                        <div className="absolute right-0 top-8 z-20 w-32 bg-card border border-border/60 rounded-lg shadow-lg overflow-hidden">
                                            <button
                                                onClick={() => {
                                                    setIsEdit(true);
                                                    setShowActions(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm font-sans hover:bg-accent transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDeleteComment();
                                                    setShowActions(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm font-sans text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                {deleting ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {isEdit ? (
                        <div className="mb-3">
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                rows={3}
                                className="w-full p-3 border border-border/60 rounded-lg bg-card text-foreground resize-none outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm font-sans"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handleEdit}
                                    disabled={editing || !editValue.trim()}
                                    className="px-4 py-1.5 bg-gradient-to-r from-primary to-primary/90 text-background text-sm rounded-full font-semibold font-sans hover:shadow-lg disabled:opacity-50 transition-all"
                                >
                                    {editing ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 size={12} className="animate-spin" />
                                            Saving...
                                        </span>
                                    ) : "Save"}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEdit(false);
                                        setEditValue(comment.text);
                                    }}
                                    className="px-4 py-1.5 text-sm rounded-full font-sans font-medium hover:bg-accent/50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-foreground text-sm leading-relaxed mb-3 whitespace-pre-wrap font-sans">
                            {comment.text}
                        </p>
                    )}

                    {/* Actions */}
                    {!isEdit && (
                        <div className="flex items-center gap-4 text-sm">
                            <button
                                onClick={handleCommentLike}
                                className="flex items-center gap-1.5 group"
                            >
                                <div className={`p-1 rounded-full transition-all ${comment.likedByMe ? "bg-rose-100" : "group-hover:bg-accent/50"}`}>
                                    <Heart
                                        size={14}
                                        className={`transition-colors ${comment.likedByMe
                                            ? "fill-rose-500 text-rose-500"
                                            : "text-muted-foreground group-hover:text-foreground"
                                            }`}
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <span className={`text-xs font-sans font-medium ${comment.likedByMe
                                    ? "text-rose-500"
                                    : "text-muted-foreground"
                                    }`}>
                                    {comment.likes}
                                </span>
                            </button>

                            {canReply && (
                                <button
                                    onClick={() => setIsReplying(!isReplying)}
                                    className="text-xs font-sans font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {isReplying ? "Cancel" : "Reply"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Reply Input */}
                    {isReplying && canReply && (
                        <div className="mt-4">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                rows={3}
                                className="w-full p-3 border border-border/60 rounded-lg bg-card text-foreground resize-none outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm font-sans"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    disabled={replying || !replyText.trim()}
                                    onClick={handleReplySubmit}
                                    className="px-4 py-1.5 bg-gradient-to-r from-primary to-primary/90 text-background text-sm rounded-full font-semibold font-sans hover:shadow-lg disabled:opacity-50 transition-all"
                                >
                                    {replying ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 size={12} className="animate-spin" />
                                            Replying...
                                        </span>
                                    ) : "Reply"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies?.length > 0 && (
                        <div className="mt-6 space-y-6">
                            {comment.replies.map((reply: any) => (
                                <Comment
                                    key={reply.id}
                                    comment={reply}
                                    depth={depth + 1}
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
