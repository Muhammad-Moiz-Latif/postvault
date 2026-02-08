import { PostCard } from "../../posts/components/PostCard";
import { useAllPosts } from "../../posts/queries/useAllPosts"

export const Home = () => {
    const { data, isLoading, error } = useAllPosts();
    const posts = data?.data;
    const renderPosts = posts?.map((post) => {
        return <PostCard Post={post} key={post.id} />
    });

    if (isLoading) {
        return (
            <div className="h-full p-3 flex justify-center items-center">
                <div className="size-1/2 bg-muted animate-pulse" />
            </div>
        )
    } else if (error) {
        return (
            <div className="h-full p-3 flex justify-center items-center">
                <div className="">An error occured</div>
            </div>
        )
    }
    return (
        <div className="h-full p-3 font-sans">
            {renderPosts?.length! < 1 ? "No posts made yet" : renderPosts}
        </div>
    )
}