import { queryOptions, useQuery } from "@tanstack/react-query";
import { getDetailedPost } from "../apis/GetDetailedPost";


export const detailedPostQueryOptions = (postId: string) => {
    return queryOptions({
        queryKey: ['post', postId],
        queryFn: () => getDetailedPost(postId),
        staleTime: 2 * 60 * 1000,
    });
};

export function useDetailedPost(postId: string) {
    return useQuery(detailedPostQueryOptions(postId));
};