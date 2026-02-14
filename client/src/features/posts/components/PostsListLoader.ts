// routes/postsListRoute.tsx
import { queryClient } from "../../../lib/queryClient";
import { allPostsQueryOptions } from "../queries/useAllPosts"

export const postsListLoader = async () => {
    // Prefetch the first page
    await queryClient.ensureInfiniteQueryData(allPostsQueryOptions());
    return null;
};