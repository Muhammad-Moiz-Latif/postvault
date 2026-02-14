import { PostCard } from "../../posts/components/PostCard";
import { useAllPosts } from "../../posts/queries/useAllPosts"
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export const Home = () => {
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading posts...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Unable to load posts
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
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
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        No posts yet
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Be the first to share your thoughts with the community.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-6 pt-10 pb-16">
            {/* Feed */}
            <div className="space-y-16">
                {data?.pages.map((page, pageIndex) => (
                    <div key={pageIndex} className="space-y-16">
                        {page.data?.posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={ref} className="py-14 flex items-center justify-center">
                {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        <span className="text-sm">Loading more stories...</span>
                    </div>
                )}
                {!hasNextPage && (
                    <p className="text-sm text-muted-foreground">
                        You've reached the end
                    </p>
                )}
            </div>
        </div>
    );
};