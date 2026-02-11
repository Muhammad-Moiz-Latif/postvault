import { privateApi } from "../../../app/axios";
import type { LikeUnlikePostResponse } from "../../types";



export async function LikeUnlikeComment(commentId: string) {
    const response = await privateApi.post<LikeUnlikePostResponse>(`/api/post/like-comment/${commentId}`);
    return response.data;
}