import { privateApi } from "../../../app/axios";
import type { LikeUnlikePostResponse } from "../../types";

export async function LikeUnlikePost(postId: string) {
    const response = await privateApi.post<LikeUnlikePostResponse>(`/api/post/like/${postId}`);
    return response.data;
};