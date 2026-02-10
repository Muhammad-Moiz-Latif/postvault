import { privateApi } from "../../../app/axios";

type CommentData = {
    postId: string | undefined,
    comment: string
};

export async function CommentOnPost(Data: CommentData) {
    const response = await privateApi.post(`/api/post/comment/${Data.postId}`, {comment: Data.comment });
    return response.data;
};