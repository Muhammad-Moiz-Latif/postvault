import { privateApi } from "../../../app/axios";
import { type UserProfileResponse } from "../../types";

export async function UserProfile(userId: string) {
    const response = await privateApi.get<UserProfileResponse>(`/api/user/profile/${userId}`);
    return response.data;
};
