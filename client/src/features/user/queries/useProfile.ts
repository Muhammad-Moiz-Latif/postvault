import { useQuery } from "@tanstack/react-query"
import { UserProfile } from "../apis/userProfile";

export const useUserProfile = (userId: string) => {
    return useQuery({
        queryKey: ["user", "profile", { userId }],
        queryFn: () => UserProfile(userId),
        enabled: !!userId
    });
}