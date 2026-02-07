import { privateApi } from "../../../app/axios";
import type { RefreshTokenResponse } from "../../types";

export async function RefreshAccessToken() {
    const response = await privateApi.get<RefreshTokenResponse>('/api/auth/refresh');
    return response.data;
}