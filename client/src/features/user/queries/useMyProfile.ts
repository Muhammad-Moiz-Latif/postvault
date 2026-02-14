import { useQuery } from "@tanstack/react-query";
import { MyProfile } from "../apis/MyProfile";

export function useMyProfile(userId: string) {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: () => MyProfile(userId),
        staleTime: 2 * 60 * 1000
    });
};