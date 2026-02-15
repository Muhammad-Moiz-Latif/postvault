import { PostCard } from "../../posts/components/PostCard";
import { useAllPosts } from "../../posts/queries/useAllPosts";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";
import { Loader2, ArrowUpRight, Calendar, TrendingUp, Hash } from "lucide-react";
import { useNavigate } from "react-router";

export const Home = () => {
    const navigate = useNavigate();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useAllPosts();

    const { ref, inView } = useInView({ threshold: 0.1 });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const firstPagePosts = useMemo(() => {
        return data?.pages[0]?.data?.posts || [];
    }, [data]);

    const heroPost = useMemo(() => {
        if (firstPagePosts.length === 0) return null;
        return [...firstPagePosts].sort((a, b) => b.likecount - a.likecount)[0];
    }, [firstPagePosts]);

    const trendingPosts = useMemo(() => {
        if (firstPagePosts.length === 0) return [];
        return [...firstPagePosts]
            .sort((a, b) => b.likecount - a.likecount)
            .slice(0, 5);
    }, [firstPagePosts]);

    const popularTags = useMemo(() => {
        const tagCount: Record<string, number> = {};
        firstPagePosts.forEach(post => {
            post.tags?.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });
        return Object.entries(tagCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([tag]) => tag);
    }, [firstPagePosts]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-sans">Loading posts...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h2 className="text-xl font-semibold font-serif text-foreground mb-2">
                        Unable to load posts
                    </h2>
                    <p className="text-sm text-muted-foreground font-sans mb-4">
                        {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium font-sans hover:bg-foreground/90 transition-colors"
                    >
                        Refresh page
                    </button>
                </div>
            </div>
        );
    }

    const isEmpty = !data?.pages[0]?.data?.posts?.length;

    if (isEmpty) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h2 className="text-xl font-semibold font-serif text-foreground mb-2">
                        No posts yet
                    </h2>
                    <p className="text-sm text-muted-foreground font-sans">
                        Be the first to share your thoughts with the community.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Cinematic Hero */}
            {heroPost && (
                <section
                    onClick={() => navigate(`/app/${heroPost.id}`)}
                    className="relative mx-4 sm:mx-6 mt-6 h-[28rem] sm:h-[32rem] overflow-hidden rounded-2xl group cursor-pointer"
                >
                    <img
                        src={heroPost.img}
                        alt={heroPost.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                    <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {heroPost.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm font-sans font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl leading-[1.1]">
                                {heroPost.title}
                            </h1>
                            <ArrowUpRight className="text-white/70 group-hover:text-white transition-colors flex-shrink-0 mt-2" />
                        </div>

                        <p className="mt-3 text-sm sm:text-base text-white/75 line-clamp-2 max-w-2xl font-sans leading-relaxed">
                            {heroPost.paragraph}
                        </p>

                        {/* Author + Date */}
                        <div className="mt-5 flex items-center gap-5 text-sm text-white/70 font-sans">
                            <div className="flex items-center gap-2">
                                <img
                                    src={heroPost.author.img}
                                    className="rounded-full object-cover w-7 h-7 ring-2 ring-white/20"
                                    alt={heroPost.author.username}
                                />
                                <span className="font-medium text-white/90">{heroPost.author.username}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 opacity-60" />
                                <span>
                                    {new Date(heroPost.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-20 mt-12">
                <div className="flex gap-12">
                    {/* Feed */}
                    <main className="flex-1 min-w-0">
                        <div className="mb-8">
                            <h2 className="font-serif text-2xl font-bold text-foreground">Latest Stories</h2>
                            <p className="text-sm text-muted-foreground font-sans mt-1">
                                Fresh perspectives from writers you'll love
                            </p>
                        </div>

                        <div>
                            {data?.pages.map((page, pageIndex) => (
                                <div key={pageIndex}>
                                    {page.data?.posts.map((post, i) => (
                                        <PostCard key={post.id} post={post} index={pageIndex * 10 + i} />
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Infinite scroll trigger */}
                        <div ref={ref} className="py-14 flex items-center justify-center">
                            {isFetchingNextPage && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="size-4 animate-spin" />
                                    <span className="text-sm font-sans">Loading more stories...</span>
                                </div>
                            )}
                            {!hasNextPage && !isFetchingNextPage && (
                                <p className="text-sm text-muted-foreground font-sans">
                                    You've reached the end
                                </p>
                            )}
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24 space-y-10">
                            {/* Trending */}
                            {trendingPosts.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-5">
                                        <TrendingUp className="size-4 text-primary" />
                                        <h3 className="font-serif text-base font-bold text-foreground">Trending Now</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {trendingPosts.map((post, i) => (
                                            <div
                                                key={post.id}
                                                onClick={() => navigate(`/app/${post.id}`)}
                                                className="flex gap-3 cursor-pointer group"
                                            >
                                                <span className="font-serif text-2xl font-bold text-muted-foreground/30 leading-none mt-0.5">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors font-sans leading-snug">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground/50 font-sans mt-1">
                                                        {post.author.username}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="w-full h-px bg-border" />

                            {/* Topics */}
                            {popularTags.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-5">
                                        <Hash className="size-4 text-primary" />
                                        <h3 className="font-serif text-base font-bold text-foreground">Explore Topics</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {popularTags.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => navigate(`/app/tag/${tag}`)}
                                                className="px-3 py-1 rounded-full text-xs font-medium font-sans bg-sidebar-accent text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="w-full h-px bg-border" />

                            {/* CTA */}
                            <div className="bg-muted rounded-xl p-5">
                                <h3 className="font-serif text-base font-bold text-foreground mb-2">
                                    Start Writing
                                </h3>
                                <p className="text-sm text-muted-foreground font-sans mb-4 leading-relaxed">
                                    Share your ideas with a community that values depth over clicks.
                                </p>
                                <button className="w-full px-4 py-2.5 text-sm font-medium font-sans bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors">
                                    Create your first post
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
