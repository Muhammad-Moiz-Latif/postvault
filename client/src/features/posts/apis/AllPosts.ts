import { privateApi } from "../../../app/axios";
import type { AllPostsResponse } from "../../types";

export async function AllPosts({ pageParam }: { pageParam: string | undefined }) {
    const response = await privateApi.get<AllPostsResponse>('/api/post/all-posts', {
        params: {
            cursor: pageParam
        }
    });
    return response.data;
};