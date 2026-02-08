import { useQuery } from "@tanstack/react-query";
import { AllPosts } from "../apis/AllPosts";

export function useAllPosts() {
    return useQuery({
        queryKey: ["all-posts"],
        queryFn: AllPosts,
        staleTime: 2 * 60 * 1000
    });
};