import { privateApi } from "../../../app/axios";
import type { MyPostsResponse } from "../../types";

export async function MyPosts() {
    const response = await privateApi.get<MyPostsResponse>('/api/user/posts');
    return response.data;
};