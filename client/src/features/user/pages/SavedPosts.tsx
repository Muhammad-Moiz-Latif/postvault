import { useMySavedPosts } from "../queries/useMySavedPosts";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
    Bookmark,
    BookmarkX,
    Heart,
    MessageCircle,
    User,
    Compass,
    BookOpen
} from "lucide-react";
import { toast } from "sonner";

export function SavedPosts() {
    const { data, isError, isLoading } = useMySavedPosts();
    const savedPosts = data?.data ?? [];
    const navigate = useNavigate();
    const [unsavingId, setUnsavingId] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading your saved posts...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                        <BookmarkX className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Failed to load saved posts
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Please try refreshing the page
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Bookmark className="w-6 h-6 text-primary" fill="currentColor" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                            Saved Posts
                        </h1>
                    </div>
                    <p className="text-muted-foreground font-sans">
                        Your personal collection of stories worth revisiting
                    </p>
                </div>

                {/* Stats Bar */}
                {savedPosts.length > 0 && (
                    <div className="flex items-center gap-6 mb-8 p-4 bg-card border border-border rounded-xl">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">
                                {savedPosts.length} {savedPosts.length === 1 ? 'story' : 'stories'} saved
                            </span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {new Set(savedPosts.map(p => p.author.id)).size} {new Set(savedPosts.map(p => p.author.id)).size === 1 ? 'author' : 'authors'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {savedPosts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-6">
                            <Bookmark className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
                            No saved posts yet
                        </h3>
                        <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto">
                            Start building your collection by saving posts you want to read later or revisit
                        </p>
                        <button
                            onClick={() => navigate("/app")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            <Compass size={18} />
                            Explore Posts
                        </button>
                    </div>
                )}

                {/* Posts Grid */}
                {savedPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedPosts.map((post) => (
                            <article
                                key={post.id}
                                onClick={() => navigate(`/app/${post.id}`)}
                                className={`
                                    group relative
                                    bg-card border border-border rounded-xl overflow-hidden
                                    hover:shadow-lg hover:border-border/80 hover:cursor-pointer
                                    transition-all duration-300
                                    ${unsavingId === post.id ? "opacity-50 pointer-events-none" : ""}
                                `}
                            >
                                {/* Cover Image */}
                                {post.img && (
                                    <div className="relative h-48 bg-muted overflow-hidden">
                                        <img
                                            src={post.img}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />


                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    {/* Author */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {post.author.img ? (
                                                <img
                                                    src={post.author.img}
                                                    alt={post.author.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-primary-foreground">
                                                    {post.author.username.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">
                                                {post.author.username}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-serif font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                                        {post.paragraph}
                                    </p>

                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.slice(0, 3).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-accent text-muted-foreground rounded-full"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <span className="text-xs text-muted-foreground py-1">
                                                    +{post.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Heart size={16} />
                                            <span>{post.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <MessageCircle size={16} />
                                            <span>{post.comments}</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}