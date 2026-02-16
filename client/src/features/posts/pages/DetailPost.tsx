import { useParams } from "react-router";
import { useDetailedPost } from "../queries/useDetailedPost"
import { useReactToPost } from "../queries/useReactToPost";
import { useState } from "react";
import { Bookmark, Heart, MessageCircle, Share2, MoreHorizontal, Loader2, ArrowLeft } from "lucide-react";
import { useComment } from "../queries/useComment";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner';
import { Comment } from "../components/Comment";
import { useSavePost } from "../queries/useSavePost";
import { useNavigate } from "react-router";
import { useFollow } from "../../user/queries/useFollow";
import { useAuth } from "../../../context/authContext";

export const DetailPost = () => {
    const { postId } = useParams();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isSuccess, isPending } = useDetailedPost(postId || "");
    const [commentText, setCommentText] = useState("");
    const { mutate: CommentOnPost, isPending: loadingComment } = useComment();
    const { mutate: ReactToPost } = useReactToPost(postId!);
    const { mutate: SavePost } = useSavePost(postId!);
    const { mutate: Follow } = useFollow(postId!);
    const post = data?.data!;

    // Calculate reading time
    const calculateReadingTime = (text: string) => {
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    function handleLike() {
        ReactToPost();
    }

    function handleSave() {
        SavePost();
    }

    function handleFollow(followingId: string) {
        Follow(followingId)
    }

    function handleComment() {
        if (!commentText.trim()) return;

        CommentOnPost({ postId, comment: commentText }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['post', postId] });
                queryClient.invalidateQueries({ queryKey: ['all-posts'] });
                setCommentText("");
                toast.success("Response published");
            },
            onError: (error) => {
                console.error(error);
                toast.error("Failed to publish response");
            }
        });
    }

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading post...</p>
                </div>
            </div>
        );
    }

    if (!isSuccess || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Post not found
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        This post may have been deleted or made private.
                    </p>
                    <button
                        onClick={() => navigate('/app')}
                        className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
                    >
                        Back to feed
                    </button>
                </div>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-background">
            {/* Back button */}
            <div className="border-b border-border/50 bg-gradient-to-b from-card to-background">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/40 px-3 py-2 rounded-full transition-all duration-200"
                    >
                        <ArrowLeft size={16} />
                        <span className="font-sans">Back</span>
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-12">

                {/* Draft badge */}
                {post.status === "DRAFT" && (
                    <div className="mb-6">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-200/60 font-sans">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            Draft
                        </span>
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight text-balance">
                    {post.title}
                </h1>

                {/* Author + Meta */}
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-border/50">
                    <div className="flex items-center gap-4">
                        <img
                            src={post.author.img}
                            alt={post.author.username}
                            className="size-14 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-primary/20"
                            onClick={() => navigate(`/app/profile/${post.author.id}`)}
                        />
                        <div className="flex flex-col">
                            <button
                                onClick={() => navigate(`/app/profile/${post.author.id}`)}
                                className="font-serif font-semibold text-foreground hover:text-primary text-left transition-colors"
                            >
                                {post.author.username}
                            </button>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                                <time>{formatDate(post.createdAt)}</time>
                                <span>·</span>
                                <span>{calculateReadingTime(post.paragraph)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {
                            (auth.user_id != post.author.id) && <button
                                onClick={() => handleFollow(post.author.id)}
                                className={`font-sans font-semibold text-sm px-4 py-2 rounded-full transition-all duration-200 ${post.followedbyme
                                    ? "bg-accent text-foreground border border-primary/30"
                                    : "border border-foreground/30 text-foreground hover:bg-accent hover:border-primary/50"
                                    }`}>
                                {post.followedbyme ? "Following" : "Follow"}
                            </button>
                        }
                        <button
                            onClick={handleSave}
                            className="p-2.5 rounded-full hover:bg-accent/50 transition-all duration-200 group"
                            aria-label="Save post"
                        >
                            <Bookmark
                                size={20}
                                className={`transition-colors ${post.savedbyme
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground group-hover:text-foreground"
                                    }`}
                                strokeWidth={1.5}
                            />
                        </button>
                        <button
                            className="p-2.5 rounded-full hover:bg-accent/50 transition-all duration-200 group"
                            aria-label="Share post"
                        >
                            <Share2 size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                        </button>
                        <button
                            className="p-2.5 rounded-full hover:bg-accent/50 transition-all duration-200 group"
                            aria-label="More options"
                        >
                            <MoreHorizontal size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Hero Image */}
                {post.img && (
                    <div className="mb-12 -mx-4 md:mx-0">
                        <img
                            src={post.img}
                            alt={post.title}
                            className="w-full rounded-lg object-cover max-h-[500px]"
                        />
                    </div>
                )}

                {/* Tags */}
                {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => navigate(`/app/tag/${tag}`)}
                                className="px-3.5 py-1.5 rounded-full bg-accent text-foreground text-sm font-sans font-medium hover:bg-accent/80 transition-colors ring-1 ring-primary/20"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                {/* Body */}
                <div className="prose prose-lg max-w-none mb-12">
                    <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap font-sans">
                        {post.paragraph}
                    </p>
                </div>

                {/* Engagement Bar */}
                <div className="flex items-center justify-between py-6 border-y border-border/50">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 group"
                        >
                            <div className={`p-2.5 rounded-full transition-all ${post.likedbyme
                                ? "bg-rose-100"
                                : "hover:bg-accent/50"
                                }`}>
                                <Heart
                                    size={20}
                                    className={`transition-colors ${post.likedbyme
                                        ? "fill-rose-500 text-rose-500"
                                        : "text-muted-foreground group-hover:text-foreground"
                                        }`}
                                    strokeWidth={1.5}
                                />
                            </div>
                            <span className={`text-sm font-sans font-medium ${post.likedbyme ? "text-rose-500" : "text-muted-foreground"}`}>
                                {post.likes}
                            </span>
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="p-2.5 rounded-full hover:bg-accent/50 transition-all">
                                <MessageCircle
                                    size={20}
                                    className="text-muted-foreground"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <span className="text-sm text-muted-foreground font-sans font-medium">
                                {post.comments.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <section className="mt-16">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-8 text-balance">
                        Responses ({post.comments.length})
                    </h2>

                    {/* Comment Input */}
                    <div className="mb-12">
                        <textarea
                            placeholder="Share your thoughts..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows={4}
                            className="w-full p-4 rounded-lg border border-border/60 bg-card text-foreground resize-none outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm font-sans hover:border-border/80"
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                disabled={loadingComment || !commentText.trim()}
                                onClick={handleComment}
                                className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-primary/90 text-background text-sm font-semibold font-sans hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loadingComment ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin" />
                                        Publishing...
                                    </span>
                                ) : "Respond"}
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    {post.comments.length > 0 ? (
                        <div className="space-y-8">
                            {post.comments.map(comment => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    depth={0}
                                    postId={postId!}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                                <MessageCircle size={32} className="text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm font-sans">
                                No responses yet. Be the first to share your thoughts.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </article>
    );
};
