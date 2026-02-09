import { useInfiniteQuery } from "@tanstack/react-query";
import { AllPosts } from "../apis/AllPosts";

export function useAllPosts() {
    return useInfiniteQuery({
        queryKey: ['all-posts'],
        queryFn: AllPosts,
        initialPageParam: undefined, //the first request which will have no cursor
        getNextPageParam: (lastPage) => {
            return lastPage.data?.nextCursor
        },
        staleTime: 2 * 60 * 1000
    })
};