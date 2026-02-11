import { privateApi } from "../../../app/axios";
import type { LikeUnlikePostResponse } from "../../types";

type DataType = {
    postId: string,
    commentId: string
};

export async function DeleteComment(data: DataType) {
    const response = await privateApi.delete<LikeUnlikePostResponse>(`/api/post/delete/${data.commentId}/${data.postId}`);
    return response.data;
};