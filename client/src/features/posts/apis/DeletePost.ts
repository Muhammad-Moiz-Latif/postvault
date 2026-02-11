import { privateApi } from "../../../app/axios";
import type { VerifyEmailResponse } from "../../types";

export async function DeletePost(postId: string | undefined) {
    const response = await privateApi.delete<VerifyEmailResponse>(`/api/post/delete/${postId}`);
    return response.data;
};