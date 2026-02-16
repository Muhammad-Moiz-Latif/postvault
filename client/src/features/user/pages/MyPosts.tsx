import { useState } from "react";
import type { MyPost } from "../../types";
import { useMyPosts } from "../queries/useMyPosts";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { detailedPostQueryOptions } from "../../posts/queries/useDetailedPost";
import { useDeletePost } from "../../posts/queries/useDeletePost";
import { toast } from 'sonner';
import {
    Heart,
    MessageCircle,
    Edit3,
    Trash2,
    Eye,
    Clock,
    TrendingUp,
    FileText,
    PenLine
} from "lucide-react";

type FilterType = "ALL" | "DRAFT" | "PUBLISHED";

export default function MyPosts() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useMyPosts();
    const { mutate } = useDeletePost();
    const [searchParams, setSearchParams] = useSearchParams();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const navigate = useNavigate();
    const posts = data?.data ?? [];

    // Get filter from URL params, default to "ALL"
    const filterParam = searchParams.get("filter");
    const filter: FilterType =
        filterParam === "published" ? "PUBLISHED" :
            filterParam === "drafts" ? "DRAFT" :
                "ALL";

    const filteredPosts = posts.filter((post: MyPost) => {
        if (filter === "ALL") return true;
        return post.status === filter;
    });

    const stats = {
        total: posts.length,
        published: posts.filter(p => p.status === "PUBLISHED").length,
        drafts: posts.filter(p => p.status === "DRAFT").length,
        totalLikes: posts.reduce((acc, p) => acc + p.likes, 0),
        totalComments: posts.reduce((acc, p) => acc + p.comments, 0),
    };

    function handleDeletePost(postId: string, e: React.MouseEvent) {
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            return;
        }

        setDeletingId(postId);
        mutate(postId, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['all-posts'] });
                queryClient.invalidateQueries({ queryKey: ['my-posts'] });
                toast.success("Post deleted successfully");
                setDeletingId(null);
            },
            onError: (error) => {
                console.error(error);
                toast.error("Could not delete post");
                setDeletingId(null);
            }
        });
    }

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading your stories...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
                        Your Stories
                    </h1>
                    <p className="text-muted-foreground font-sans">
                        Manage and organize your published posts and drafts
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-6 border-b border-border">
                    {(["ALL", "PUBLISHED", "DRAFT"] as FilterType[]).map((type) => {
                        const count = type === "ALL" ? stats.total :
                            type === "PUBLISHED" ? stats.published : stats.drafts;

                        const handleFilterClick = () => {
                            if (type === "ALL") {
                                setSearchParams({});
                            } else if (type === "PUBLISHED") {
                                setSearchParams({ filter: "published" });
                            } else {
                                setSearchParams({ filter: "drafts" });
                            }
                        };

                        return (
                            <button
                                key={type}
                                onClick={handleFilterClick}
                                className={`
                                    group relative px-4 py-3 text-sm font-medium transition-all duration-200
                                    ${filter === type
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2">
                                    {type}
                                    <span className={`
                                        text-xs px-2 py-0.5 rounded-full font-semibold
                                        ${filter === type
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground group-hover:bg-accent"
                                        }
                                    `}>
                                        {count}
                                    </span>
                                </span>
                                {filter === type && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Posts List */}
                <div className="space-y-3">
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                                {filter === "DRAFT" ? (
                                    <PenLine className="w-7 h-7 text-muted-foreground" />
                                ) : filter === "PUBLISHED" ? (
                                    <TrendingUp className="w-7 h-7 text-muted-foreground" />
                                ) : (
                                    <FileText className="w-7 h-7 text-muted-foreground" />
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {filter === "DRAFT" ? "No drafts yet" :
                                    filter === "PUBLISHED" ? "No published posts yet" :
                                        "No stories yet"}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                {filter === "DRAFT" ? "Start writing your next story" :
                                    filter === "PUBLISHED" ? "Publish your first post to see it here" :
                                        "Create your first post to get started"}
                            </p>
                            <button
                                onClick={() => navigate("/app/posts/new")}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-all"
                            >
                                <Edit3 size={16} />
                                Write a Story
                            </button>
                        </div>
                    )}

                    {filteredPosts.map((post: MyPost) => (
                        <article
                            key={post.id}
                            onMouseEnter={() => {
                                queryClient.prefetchQuery(detailedPostQueryOptions(post.id));
                            }}
                            onClick={() => navigate(`edit/${post.id}`)}
                            className={`
                                group relative
                                bg-card border border-border rounded-xl overflow-hidden
                                hover:shadow-md hover:border-border/80 hover:cursor-pointer
                                transition-all duration-200
                                ${deletingId === post.id ? "opacity-50 pointer-events-none" : ""}
                            `}
                        >
                            <div className="flex gap-5 p-5">
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Status & Date */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`
                                            inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full
                                            ${post.status === "PUBLISHED"
                                                ? "bg-emerald-50 border border-emerald-500 text-green-500"
                                                : "bg-yellow-50 border border-yellow-500 text-yellow-500"
                                            }
                                        `}>
                                            {post.status === "PUBLISHED" ? (
                                                <>
                                                    <Eye size={12} />
                                                    Published
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={12} />
                                                    Draft
                                                </>
                                            )}
                                        </span>

                                        <span className="text-xs text-muted-foreground">
                                            {post.status === "PUBLISHED" && post.publishedAt ?
                                                new Date(post.publishedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                }) :
                                                `Updated ${new Date(post.updatedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })}`
                                            }
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-serif font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-sans leading-relaxed">
                                        {post.paragraph}
                                    </p>

                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.slice(0, 3).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-accent text-muted-foreground rounded-full hover:bg-accent/80 transition-colors"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <span className="text-xs text-muted-foreground py-1">
                                                    +{post.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Stats & Actions */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Heart
                                                    size={16}
                                                    className={post.likedbyme ? "fill-red-500 text-red-500" : ""}
                                                />
                                                {post.likes}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MessageCircle size={16} />
                                                {post.comments}
                                            </span>
                                        </div>

                                        {/* Action Buttons - Hidden until hover */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`edit/${post.id}`);
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:shadow-md transition-all"
                                            >
                                                <Edit3 size={14} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={(e) => handleDeletePost(post.id, e)}
                                                disabled={deletingId === post.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnail */}
                                {post.img && (
                                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                                        <img
                                            src={post.img}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}