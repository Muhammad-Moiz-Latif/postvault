import { privateApi } from "../../../app/axios";
import type { LikeUnlikePostResponse } from "../../types";

export async function SavePost(postId: string) {
    const response = await privateApi.post<LikeUnlikePostResponse>(`/api/post/save/${postId}`);
    return response.data;
}