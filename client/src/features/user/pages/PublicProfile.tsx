import { useState } from "react";
import { useMyProfile } from "../queries/useMyProfile";
import { useNavigate, useParams } from "react-router";
import {
    Users,
    FileText,
    ArrowLeft,
    CheckCircle2,
    Sparkles,
    Mail
} from "lucide-react";

type TabType = "posts" | "followers" | "followings";

interface PublicPost {
    id: string;
    title: string;
    paragraph: string;
    img: string;
    publishedAt: string;
    tags: string[];
    likes: number;
    comments: number;
}

export default function PublicProfile() {
    const { userId } = useParams<{ userId: string }>();
    const { data: profileData, isLoading: isProfileLoading } = useMyProfile(userId || "");
    const [activeTab, setActiveTab] = useState<TabType>("posts");
    const navigate = useNavigate();

    console.log(profileData?.data?.followedbyme);
    const profile = profileData?.data;

    if (isProfileLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6 ring-2 ring-destructive/20">
                        <FileText className="w-9 h-9 text-destructive" />
                    </div>
                    <p className="text-lg font-semibold text-foreground mb-2">Profile not found</p>
                    <p className="text-sm text-muted-foreground mb-6">This profile doesn't exist or has been deleted.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Get published posts (only public posts)
    const publishedPosts: PublicPost[] = profile.posts ?? [];
    const stats = {
        posts: publishedPosts.length,
        followers: profile.followers?.length ?? 0,
        followings: profile.followings?.length ?? 0,
        totalLikes: publishedPosts.reduce((acc: number, post: PublicPost) => acc + post.likes, 0),
        totalComments: publishedPosts.reduce((acc: number, post: PublicPost) => acc + post.comments, 0),
    };


    return (
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-background">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40 px-3 py-2 rounded-full transition-all duration-200 mb-8 hover:cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                {/* Profile Header */}
                <div className="mb-12">
                    {/* Cover Art */}
                    <div className="h-48 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 mb-8 relative overflow-hidden border border-border/50">
                        <div className="absolute inset-0 opacity-30">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
                                </pattern>
                                <rect width="100" height="100" fill="url(#grid)" />
                            </svg>
                        </div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
                        {/* Avatar */}
                        <div className="relative -mt-24">
                            <img
                                src={profile.img}
                                alt={profile.username}
                                className="w-32 h-32 rounded-2xl object-cover ring-4 ring-background shadow-lg border border-primary/20"
                            />
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/90 flex items-center justify-center text-white shadow-lg ring-2 ring-background">
                                <Sparkles size={18} />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
                                {profile.username}
                            </h1>
                            <p className="text-muted-foreground font-sans text-sm mb-4">
                                Member since {new Date(profile.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric"
                                })}
                            </p>

                            {/* Contact Info */}
                            <div className="flex items-center gap-3 text-sm text-muted-foreground font-sans">
                                <Mail size={16} />
                                <span>{profile.email}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex-1 hover:cursor-pointer hover:scale-110 ease-in-out md:flex-none px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-full font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                {profile.followedbyme ? (
                                    <>
                                        <CheckCircle2 size={16} />
                                        Following
                                    </>
                                ) : (
                                    <>
                                        <Users size={16} />
                                        Follow
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Published Posts</p>
                            <p className="text-3xl font-serif font-bold text-foreground">{stats.posts}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Followers</p>
                            <p className="text-3xl font-serif font-bold text-foreground">{stats.followers}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Total Likes</p>
                            <p className="text-3xl font-serif font-bold text-foreground">{stats.totalLikes}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Total Comments</p>
                            <p className="text-3xl font-serif font-bold text-foreground">{stats.totalComments}</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-3 mb-8 bg-card rounded-full p-1 border border-border/50 w-fit">
                    {(["posts", "followers", "followings"] as TabType[]).map((tab) => {
                        const labels = {
                            posts: "Posts",
                            followers: "Followers",
                            followings: "Following",
                        };

                        const counts = {
                            posts: stats.posts,
                            followers: stats.followers,
                            followings: stats.followings
                        };

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    px-5 py-2.5 text-sm font-semibold transition-all duration-200 rounded-full
                                    ${activeTab === tab
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                                    }
                                `}
                            >
                                {labels[tab]}
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === tab ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                    {counts[tab]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Sections */}
                <div className="space-y-4">
                    {/* Published Posts Tab */}
                    {activeTab === "posts" && (
                        <div>
                            {publishedPosts.length === 0 ? (
                                <div className="text-center py-20 bg-card/50 border border-border/50 rounded-2xl">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4 ring-2 ring-primary/20">
                                        <FileText className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                                        No posts yet
                                    </h3>
                                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                        {profile.username} hasn't published any posts yet. Check back soon!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {publishedPosts.map((post: PublicPost) => (
                                        <article
                                            onClick={() => navigate(`/app/${post.id}`)}
                                            key={post.id}
                                            className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="flex gap-5 p-6">
                                                {post.img && (
                                                    <div className="w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden ring-2 ring-border/50 group-hover:ring-primary/40 transition-all">
                                                        <img
                                                            src={post.img}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex-1">
                                                    <h3 className="text-lg font-serif font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                                        {post.title}
                                                    </h3>

                                                    <p className="text-foreground text-sm line-clamp-2 mb-4 font-sans">
                                                        {post.paragraph}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <img
                                                                    src={profile.img}
                                                                    alt={profile.username}
                                                                    className="w-5 h-5 rounded-full"
                                                                />
                                                                <span className="font-medium">{profile.username}</span>
                                                            </div>
                                                            <span className="text-muted-foreground">
                                                                {new Date(post.publishedAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <button className="opacity-0 group-hover:opacity-100 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-full hover:shadow-lg transition-all duration-200">
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Followers Tab */}
                    {activeTab === "followers" && (
                        <div>
                            {profile.followers && profile.followers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profile.followers.map((follower: any) => (
                                        <div
                                            key={follower.id}
                                            onClick={() => navigate(`/app/profile/${follower.id}`)}
                                            className="p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/40 transition-all group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={follower.img}
                                                    alt={follower.username}
                                                    className="w-16 h-16 rounded-full ring-2 ring-primary/20"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-base font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                                                        {follower.username}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        Followed on {new Date(follower.followedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full transition-all duration-200">
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-card/50 border border-border/50 rounded-2xl">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100/50 to-blue-50/30 dark:from-blue-950/30 dark:to-blue-900/10 mb-4 ring-2 ring-blue-200/50 dark:ring-blue-800/30">
                                        <Users className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-foreground mb-2">No followers yet</h3>
                                    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                                        {profile.username} has no followers yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Following Tab */}
                    {activeTab === "followings" && (
                        <div>
                            {profile.followings && profile.followings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profile.followings.map((following: any) => (
                                        <div
                                            key={following.id}
                                            onClick={() => navigate(`/app/profile/${following.id}`)}
                                            className="p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/40 transition-all group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={following.img}
                                                    alt={following.username}
                                                    className="w-16 h-16 rounded-full ring-2 ring-primary/20"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-base font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                                                        {following.username}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        Following since {new Date(following.followingAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full transition-all duration-200">
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-card/50 border border-border/50 rounded-2xl">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100/50 to-purple-50/30 dark:from-purple-950/30 dark:to-purple-900/10 mb-4 ring-2 ring-purple-200/50 dark:ring-purple-800/30">
                                        <Users className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-foreground mb-2">Not following anyone yet</h3>
                                    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                                        {profile.username} isn't following anyone yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
