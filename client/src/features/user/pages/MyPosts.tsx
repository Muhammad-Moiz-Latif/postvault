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
            <h1 className="text-2xl font-bold mb-6">My Posts</h1>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-8">
                {["ALL", "PUBLISHED", "DRAFT"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type as FilterType)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition
                            ${filter === type
                                ? "bg-black text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
                {filteredPosts.length === 0 && (
                    <div className="text-gray-500 text-center">
                        No posts found.
                    </div>
                )}

                {filteredPosts.map((post: MyPost) => (
                    <div
                        onMouseEnter={() => {
                            queryClient.prefetchQuery(detailedPostQueryOptions(post.id))
                        }}
                        onClick={() => navigate(`edit/${post.id}`)}
                        key={post.id}
                        className="border rounded-xl p-5 hover:cursor-pointer shadow-sm bg-white"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 text-xs rounded-full font-medium
                                    ${post.status === "PUBLISHED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {post.status}
                            </span>
                        </div>

                        {/* Content Preview */}
                        <p className="text-gray-700 line-clamp-2 mb-4">
                            {post.paragraph}
                        </p>

                        {/* Meta */}
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                            <div className="flex gap-4">
                                <span>❤️ {post.likes}</span>
                                <span>💬 {post.comments}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Edit
                            </button>

                            {post.status === "DRAFT" && (
                                <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    Publish
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeletePost(post.id)
                                }}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 hover:cursor-pointer">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};
