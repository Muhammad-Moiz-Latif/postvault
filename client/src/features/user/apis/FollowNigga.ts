import { privateApi } from "../../../app/axios";
import type { LikeUnlikePostResponse } from "../../types";

export async function FollowUser(followingId: string) {
    const response = await privateApi.post<LikeUnlikePostResponse>(`/api/user/follow`, { followingId });
    return response.data;
};