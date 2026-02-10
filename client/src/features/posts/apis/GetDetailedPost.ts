import { privateApi } from "../../../app/axios";
import type { DetailedPostResponse } from "../../types";

export async function getDetailedPost(postId: string) {
    const response = await privateApi.get<DetailedPostResponse>(`/api/post/${postId}`);
    return response.data;
};