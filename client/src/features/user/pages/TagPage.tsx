import { PostCard } from "../../posts/components/PostCard";
import { useAllPosts } from "../../posts/queries/useAllPosts";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";
import { ChevronRight, Home, Loader2, Tag } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export const TagPage = () => {
    const navigate = useNavigate();
    const { tag } = useParams<{ tag: string }>();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useAllPosts();

    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Filter posts by tag across all pages
    const tagFilteredPosts = useMemo(() => {
        if (!data?.pages || !tag) return [];

        const allPosts: any[] = [];
        data.pages.forEach(page => {
            const posts = page.data?.posts || [];
            const filtered = posts.filter(post =>
                post.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase())
            );
            allPosts.push(...filtered);
        });

        return allPosts;
    }, [data, tag]);

    // Get first page filtered posts for featured sections
    const firstPageFilteredPosts = useMemo(() => {
        if (!data?.pages[0]?.data?.posts || !tag) return [];
        return data.pages[0].data.posts.filter(post =>
            post.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase())
        );
    }, [data, tag]);

    // Get featured hero post (highest liked from filtered posts)
    const heroPost = useMemo(() => {
        if (firstPageFilteredPosts.length === 0) return null;
        return [...firstPageFilteredPosts].sort((a, b) => b.likecount - a.likecount)[0];
    }, [firstPageFilteredPosts]);

    // Get trending posts (top 5 highest liked for sidebar from filtered posts)
    const trendingPosts = useMemo(() => {
        if (firstPageFilteredPosts.length === 0) return [];
        return [...firstPageFilteredPosts]
            .sort((a, b) => b.likecount - a.likecount)
            .slice(0, 5);
    }, [firstPageFilteredPosts]);

    // Get related tags (other tags from filtered posts)
    const relatedTags = useMemo(() => {
        const tagCount: Record<string, number> = {};

        firstPageFilteredPosts.forEach(post => {
            post.tags?.forEach(t => {
                if (t.toLowerCase() !== tag?.toLowerCase()) {
                    tagCount[t] = (tagCount[t] || 0) + 1;
                }
            });
        });

        return Object.entries(tagCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([t]) => t);
    }, [firstPageFilteredPosts, tag]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-sans">Loading stories...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h2 className="text-xl font-serif font-semibold text-foreground mb-2">
                        Unable to load stories
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 font-sans">
                        {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-background rounded-full text-sm font-semibold font-sans hover:shadow-lg transition-all"
                    >
                        Refresh page
                    </button>
                </div>
            </div>
        );
    }

    const isEmpty = tagFilteredPosts.length === 0;

    if (isEmpty) {
        return (
            <div className="w-full">
                {/* Breadcrumbs */}
                <div className="w-full max-w-7xl mx-auto px-6 pt-6">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                        <button
                            onClick={() => navigate("/app")}
                            className="flex items-center gap-1 hover:text-foreground transition-colors font-sans"
                        >
                            <Home className="size-4" />
                            <span>Home</span>
                        </button>
                        <ChevronRight className="size-4" />
                        <span className="text-foreground font-medium capitalize font-sans">{tag}</span>
                    </nav>
                </div>

                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                            <Tag className="size-8 text-foreground" />
                        </div>
                        <h2 className="text-xl font-serif font-semibold text-foreground mb-2">
                            No stories found for #{tag}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6 font-sans">
                            Be the first to create content with this tag.
                        </p>
                        <button
                            onClick={() => navigate("/app")}
                            className="px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-background rounded-full text-sm font-semibold font-sans hover:shadow-lg transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Breadcrumbs */}
            <div className="w-full max-w-7xl mx-auto px-6 pt-6">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 font-sans">
                    <button
                        onClick={() => navigate("/app")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <Home className="size-4" />
                        <span>Home</span>
                    </button>
                    <ChevronRight className="size-4" />
                    <span className="text-foreground font-medium capitalize">{tag}</span>
                </nav>

                {/* Tag Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent">
                            <Tag className="size-6 text-foreground" />
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-foreground capitalize">
                            {tag}
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg font-sans">
                        {tagFilteredPosts.length} {tagFilteredPosts.length === 1 ? 'story' : 'stories'} tagged with <span className="font-semibold text-foreground">#{tag}</span>
                    </p>
                </div>
            </div>

            {/* Featured Hero Post */}
            {heroPost && (
                <div className="w-full max-w-7xl mx-auto px-6 mb-16">
                    <div
                        onClick={() => navigate(`/app/${heroPost.id}`)}
                        className="relative h-[480px] w-full cursor-pointer overflow-hidden rounded-3xl group shadow-xl"
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${heroPost.img})` }}
                        />

                        {/* Gradient Overlay - Enhanced */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent group-hover:from-black via-black/70 transition-all duration-300" />

                        {/* Content */}
                        <div className="absolute inset-0 flex items-end">
                            <div className="w-full px-8 pb-12">
                                <div className="max-w-3xl">
                                    {/* Author */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <img
                                            src={heroPost.author.img}
                                            alt={heroPost.author.username}
                                            className="size-12 rounded-full object-cover ring-3 ring-white/30 hover:ring-white/50 transition-all"
                                        />
                                        <div className="flex items-center gap-2 text-sm text-white/90 font-sans">
                                            <span className="font-semibold">{heroPost.author.username}</span>
                                            <span>·</span>
                                            <span>
                                                {new Date(heroPost.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-4xl font-serif font-bold text-white mb-4 leading-tight group-hover:underline transition-all">
                                        {heroPost.title}
                                    </h2>

                                    {/* Paragraph */}
                                    <p className="text-base text-white/75 line-clamp-2 mb-6 font-sans">
                                        {heroPost.paragraph}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {heroPost.tags?.slice(0, 3).map((t, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-1.5 rounded-full text-sm bg-white/15 text-white backdrop-blur-sm border border-white/30 font-sans font-medium hover:bg-white/25 transition-all"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Layout - Two Columns */}
            <div className="w-full max-w-7xl mx-auto px-6 pb-16">
                <div className="flex gap-8">
                    {/* Left Column - Filtered Posts */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-8">
                            <h2 className="text-2xl font-serif font-bold text-foreground">All Stories</h2>
                        </div>

                        <div className="space-y-16">
                            {tagFilteredPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        {/* Infinite scroll trigger */}
                        <div ref={ref} className="py-14 flex items-center justify-center">
                            {isFetchingNextPage && (
                                <div className="flex items-center gap-2 text-muted-foreground font-sans">
                                    <Loader2 className="size-4 animate-spin" />
                                    <span className="text-sm">Loading more stories...</span>
                                </div>
                            )}
                            {!hasNextPage && tagFilteredPosts.length > 0 && (
                                <p className="text-sm text-muted-foreground font-sans">
                                    You've reached the end
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Sticky */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-6 space-y-8">
                            {/* Trending in This Tag */}
                            {trendingPosts.length > 0 && (
                                <div className="bg-card rounded-2xl p-6 border border-border/50 backdrop-blur-sm">
                                    <h3 className="text-lg font-serif font-bold text-foreground mb-6">
                                        Trending in #{tag}
                                    </h3>
                                    <div className="space-y-4">
                                        {trendingPosts.map((post) => (
                                            <div
                                                key={post.id}
                                                onClick={() => navigate(`/app/${post.id}`)}
                                                className="flex gap-3 cursor-pointer group p-2 rounded-lg hover:bg-accent/40 transition-colors"
                                            >
                                                <img
                                                    src={post.img}
                                                    alt={post.title}
                                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 ring-2 ring-primary/20"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1 font-sans">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground font-sans">
                                                        by {post.author.username}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Related Tags */}
                            {relatedTags.length > 0 && (
                                <div className="bg-card rounded-2xl p-6 border border-border/50 backdrop-blur-sm">
                                    <h3 className="text-lg font-serif font-bold text-foreground mb-6">
                                        Related Topics
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {relatedTags.map((t, index) => (
                                            <button
                                                key={index}
                                                onClick={() => navigate(`/app/tag/${t}`)}
                                                className="px-3.5 py-2 rounded-full text-sm font-medium font-sans bg-accent text-foreground hover:bg-accent/80 transition-all ring-1 ring-primary/20"
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
