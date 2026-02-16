import type { MyPost } from "../../types";
import { useMyPosts } from "../queries/useMyPosts";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { detailedPostQueryOptions } from "../../posts/queries/useDetailedPost";
import { useDeletePost } from "../../posts/queries/useDeletePost";
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Heart, MessageCircle, Trash2, Send } from "lucide-react";

export default function DraftPosts() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useMyPosts();
    const { mutate } = useDeletePost();
    const navigate = useNavigate();
    const posts = data?.data ?? [];

    const draftPosts = posts.filter((post: MyPost) => post.status === "DRAFT");

    function handleDeletePost(postId: string) {
        mutate(postId, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['all-posts'] });
                queryClient.invalidateQueries({ queryKey: ['my-posts'] });
                toast.success("Draft deleted successfully");
            },
            onError: (error) => {
                console.error(error);
                toast.error("Could not delete draft");
            }
        })
    }

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-sans">Loading your drafts...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 bg-gradient-to-b from-card to-background">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/40 px-3 py-2 rounded-full transition-all duration-200 mb-4"
                    >
                        <ArrowLeft size={16} />
                        <span className="font-sans">Back</span>
                    </button>
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Draft Stories</h1>
                        <p className="text-muted-foreground font-sans">
                            {draftPosts.length} {draftPosts.length === 1 ? 'draft' : 'drafts'} saved
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                {draftPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                            <Send className="size-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-serif font-semibold text-foreground mb-2">
                            No draft stories yet
                        </h2>
                        <p className="text-muted-foreground font-sans mb-6">
                            Create a new draft to continue working on it later.
                        </p>
                        <button
                            onClick={() => navigate("/app/posts/new")}
                            className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-background rounded-full text-sm font-semibold font-sans hover:shadow-lg transition-all"
                        >
                            Start a New Draft
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {draftPosts.map((post: MyPost) => (
                            <div
                                onMouseEnter={() => {
                                    queryClient.prefetchQuery(detailedPostQueryOptions(post.id))
                                }}
                                key={post.id}
                                className="group border border-border/60 rounded-xl p-6 hover:shadow-lg hover:border-primary/40 transition-all duration-200 bg-card hover:bg-card/80 cursor-pointer"
                                onClick={() => navigate(`/app/posts/edit/${post.id}`)}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground font-sans mt-1">
                                            Saved {new Date(post.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </p>
                                    </div>

                                    <span className="px-3.5 py-1.5 text-xs rounded-full font-semibold bg-amber-100 text-amber-700 font-sans">
                                        Draft
                                    </span>
                                </div>

                                {/* Content Preview */}
                                <p className="text-foreground/80 line-clamp-2 mb-4 font-sans leading-relaxed">
                                    {post.paragraph}
                                </p>

                                {/* Meta */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                                            <Heart size={16} />
                                            <span>{post.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                                            <MessageCircle size={16} />
                                            <span>{post.comments}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/app/posts/edit/${post.id}`);
                                        }}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold font-sans bg-primary text-background rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <Send size={16} />
                                        <span>Continue Editing</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePost(post.id);
                                        }}
                                        className="px-4 py-2.5 text-sm font-semibold font-sans bg-destructive/10 text-destructive rounded-full hover:bg-destructive/20 transition-all flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
