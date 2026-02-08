import { privateApi } from "../../../app/axios";
import type { AllPostsResponse } from "../../types";

export async function AllPosts() {
    const response = await privateApi.get<AllPostsResponse>('/api/post/all-posts');
    return response.data;
};