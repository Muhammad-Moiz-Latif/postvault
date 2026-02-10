import { privateApi } from "../../../app/axios";
import type { CreatePostResponse } from "../../types";
import type { PostSchemaType } from "../pages/CreatePost";

export async function CreateDraftPost(Data: PostSchemaType) {
    const formData = new FormData();
    formData.append("status", "DRAFT");
    Data.title ? formData.append("title", Data.title) : formData.append("title", "");
    Data.paragraph ? formData.append("paragraph", Data.paragraph) : formData.append("paragraph", "");
    if (Data.image && Data.image.length > 0) formData.append("image", Data.image[0]);
    const tags = Data.tags.map((tag) => tag.value);
    if (tags && tags.length > 0) {
        formData.append("tags", JSON.stringify(tags));
    } else formData.append("tags", JSON.stringify([]));

    const response = await privateApi.post<CreatePostResponse>('/api/post/create', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};