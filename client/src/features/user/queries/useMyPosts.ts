import { useQuery } from "@tanstack/react-query";
import { MyPosts } from "../apis/MyPosts";

export function useMyPosts() {
    return useQuery({
        queryKey: ["my-posts"],
        queryFn: MyPosts,
        staleTime: 2 * 60 * 1000
    });
};