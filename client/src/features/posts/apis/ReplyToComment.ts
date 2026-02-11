import { privateApi } from "../../../app/axios";

type DataType = {
    postId: string,
    parentId: string,
    comment: string
};

export async function ReplyToComment(Data: DataType) {
    const response = await privateApi.post(`/api/post/reply/${Data.parentId}/${Data.postId}`, { comment: Data.comment });
    return response.data;
};