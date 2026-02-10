import { PostCard } from "../../posts/components/PostCard";
import { useAllPosts } from "../../posts/queries/useAllPosts"
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export const Home = () => {
    const { data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useAllPosts();


    const { ref, inView } = useInView();

    // Fetch next page when user scrolls to bottom
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);


    if (isLoading) {
        return (
            <div className="h-full p-3 flex justify-center items-center">
                <div className="size-1/2 bg-muted animate-pulse" />
            </div>
        )
    } else if (isError) {
        return (
            <div className="h-full p-3 flex justify-center items-center">
                <div className="">An error occured</div>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-4 p-3">
            {data?.pages.map((page) => (
                page.data?.posts.map((post) => (
                    <PostCard key={post.id} Post={post} />
                ))
            ))}

            {/* Invisible div at the bottom - triggers next page when visible */}
            <div ref={ref} className="h-20 flex items-center justify-center">
                {isFetchingNextPage && <div>Loading more...</div>}
                {!hasNextPage && <div>No more posts</div>}
            </div>
        </div>
    );
}