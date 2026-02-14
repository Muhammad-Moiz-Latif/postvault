import { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useMyProfile } from "../queries/useMyProfile";
import { EmptyState } from "../components/EmptyState";
import { PostCard } from "../components/PostCard";
import { SimplePostCard } from "../components/SimplePostCard";
import { CommentCard } from "../components/CommentCard";

type TabType = "SAVED" | "LIKED_POSTS" | "LIKED_COMMENTS";

export function MyProfile() {
    const { auth } = useAuth();
    const { data, isLoading } = useMyProfile(auth.user_id);
    const [activeTab, setActiveTab] = useState<TabType>("SAVED");

    const profile = data?.data;

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                Loading...
            </div>
        );
    }

    if (!profile) return null;

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* ===== Profile Header ===== */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-10 relative overflow-hidden">

                    {/* Subtle background accent */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent opacity-40 pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        {/* Left Side */}
                        <div className="flex items-center gap-6">
                            <img
                                src={profile.img}
                                alt={profile.username}
                                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                            />

                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {profile.username}
                                </h1>

                                <p className="text-gray-600 mt-1">{profile.email}</p>

                                <p className="text-sm text-gray-400 mt-2">
                                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-10 text-center">
                            <div>
                                <p className="text-2xl font-semibold">
                                    {profile.saved_posts.length}
                                </p>
                                <p className="text-sm text-gray-500">Saved</p>
                            </div>

                            <div>
                                <p className="text-2xl font-semibold">
                                    {profile.liked_posts.length}
                                </p>
                                <p className="text-sm text-gray-500">Liked Posts</p>
                            </div>

                            <div>
                                <p className="text-2xl font-semibold">
                                    {profile.liked_comments.length}
                                </p>
                                <p className="text-sm text-gray-500">Liked Comments</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ===== Tabs ===== */}
                <div className="flex gap-3 mb-8 border-b pb-4">
                    {(["SAVED", "LIKED_POSTS", "LIKED_COMMENTS"] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-5 py-2 text-sm font-medium transition-all duration-200
              ${activeTab === tab
                                    ? "text-black"
                                    : "text-gray-500 hover:text-black"
                                }`}
                        >
                            {tab.replace("_", " ")}

                            {activeTab === tab && (
                                <span className="absolute left-0 -bottom-4 w-full h-[2px] bg-black rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* ===== Content Grid ===== */}
                <div className="grid gap-6">

                    {/* SAVED POSTS */}
                    {activeTab === "SAVED" &&
                        (profile.saved_posts.length === 0 ? (
                            <EmptyState message="No saved posts yet." />
                        ) : (
                            profile.saved_posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ))}

                    {/* LIKED POSTS */}
                    {activeTab === "LIKED_POSTS" &&
                        (profile.liked_posts.length === 0 ? (
                            <EmptyState message="No liked posts yet." />
                        ) : (
                            profile.liked_posts.map((post) => (
                                <SimplePostCard key={post.id} post={post} />
                            ))
                        ))}

                    {/* LIKED COMMENTS */}
                    {activeTab === "LIKED_COMMENTS" &&
                        (profile.liked_comments.length === 0 ? (
                            <EmptyState message="No liked comments yet." />
                        ) : (
                            profile.liked_comments.map((comment) => (
                                <CommentCard key={comment.id} comment={comment} />
                            ))
                        ))}

                </div>
            </div>
        </main>
    );

};
