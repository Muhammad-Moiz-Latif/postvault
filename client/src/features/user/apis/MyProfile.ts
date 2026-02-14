import { privateApi } from "../../../app/axios";
import type { MyProfileResponse } from "../../types";

export async function MyProfile(userId: string) {
    const response = await privateApi.get<MyProfileResponse>(`/api/user/profile/${userId}`);
    return response.data;
};