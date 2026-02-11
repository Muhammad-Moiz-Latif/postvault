import { privateApi } from "../../../app/axios";
import type { LikeUnlikePostResponse } from "../../types";

type Datatype = {
    commentId: string,
    postId: string,
    comment: string
};

export async function EditComment(data: Datatype) {
    const response = await privateApi.put<LikeUnlikePostResponse>(`/api/post/edit/${data.commentId}/${data.postId}`, { comment: data.comment });
    return response.data
};