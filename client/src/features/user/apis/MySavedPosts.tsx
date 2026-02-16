import { privateApi } from "../../../app/axios";
import type { MySavedPostsResponse } from "../../types";

export async function MySavedPosts() {
    const response = await privateApi.get<MySavedPostsResponse>('/api/post/get-saved-posts');
    return response.data;
};