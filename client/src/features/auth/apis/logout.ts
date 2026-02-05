import { publicApi } from "../../../app/axios";

export async function Logout() {
    const response = await publicApi.get('/api/auth/logout', {
        withCredentials: true
    });
    return response.data;
}