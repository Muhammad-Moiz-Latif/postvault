import { useQuery } from "@tanstack/react-query";
import { getDetailedPost } from "../apis/GetDetailedPost";

export function useDetailedPost(postId: string) {
    return useQuery({
        queryKey: ["post", `${postId}`],
        queryFn: () => getDetailedPost(postId),
        staleTime: 2 * 60 * 1000,
    })
};