import { useQuery } from "@tanstack/react-query";
import { MySavedPosts } from "../apis/MySavedPosts";

export function useMySavedPosts() {
    return useQuery({
        queryKey: ['my-saved-posts'],
        queryFn: MySavedPosts
    });
};