import { useState } from "react";
import type { MyPost } from "../../types";
import { useMyPosts } from "../queries/useMyPosts";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { detailedPostQueryOptions } from "../../posts/queries/useDetailedPost";
import { useDeletePost } from "../../posts/queries/useDeletePost";
import { toast } from "react-toastify";

type FilterType = "ALL" | "DRAFT" | "PUBLISHED";

export default function MyPosts() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useMyPosts();
    const { mutate } = useDeletePost();
    const [filter, setFilter] = useState<FilterType>("ALL");
    const navigate = useNavigate();
    const posts = data?.data ?? [];

    const filteredPosts = posts.filter((post: MyPost) => {
        if (filter === "ALL") return true;
        return post.status === filter;
    });

    function handleDeletePost(postId: string) {
        mutate(postId, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['all-posts'] });
                queryClient.invalidateQueries({ queryKey: ['my-posts'] });
            },
            onError: (error) => {
                console.error(error);
                toast.error("Could not delete post");
            }
        })
    }
    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                Loading...
            </div>
        );
    }

    return (
        <main className="p-6 font-sans max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">My Stories</h1>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-10 border-b border-border/50">
                {["ALL", "PUBLISHED", "DRAFT"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type as FilterType)}
                        className={`px-4 py-3 text-sm font-sans font-medium transition-all duration-200 border-b-2 ${filter === type
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
                {filteredPosts.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 3 9.756 3 14s3.5 7.747 9 7.747m0-13c5.5 0 9-3.503 9-7.747m0 13c5.5 0 9-3.503 9-7.747" />
                            </svg>
                        </div>
                        <p className="text-muted-foreground font-sans">No stories found.</p>
                    </div>
                )}

                {filteredPosts.map((post: MyPost) => (
                    <div
                        onMouseEnter={() => {
                            queryClient.prefetchQuery(detailedPostQueryOptions(post.id))
                        }}
                        onClick={() => navigate(`edit/${post.id}`)}
                        key={post.id}
                        className="border border-border/50 rounded-2xl p-6 hover:cursor-pointer hover:shadow-md hover:border-border/80 transition-all duration-200 bg-card group"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2 font-sans">
                                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>

                            <span
                                className={`px-3.5 py-1.5 text-xs rounded-full font-semibold font-sans whitespace-nowrap ml-4
                                    ${post.status === "PUBLISHED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                            >
                                {post.status}
                            </span>
                        </div>

                        {/* Content Preview */}
                        <p className="text-foreground line-clamp-2 mb-5 font-sans">
                            {post.paragraph}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-6 text-sm font-sans mb-6 pb-6 border-b border-border/50">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                    </svg>
                                    {post.likes}
                                </span>
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                                    </svg>
                                    {post.comments}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                className="px-5 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground rounded-full hover:shadow-lg transition-all duration-200">
                                Edit
                            </button>

                            {post.status === "DRAFT" && (
                                <button className="px-5 py-2 text-sm font-sans font-semibold bg-accent text-foreground rounded-full hover:bg-accent/80 transition-all duration-200 ring-1 ring-primary/20">
                                    Continue Editing
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeletePost(post.id)
                                }}
                                className="px-5 py-2 text-sm font-sans font-semibold text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};
