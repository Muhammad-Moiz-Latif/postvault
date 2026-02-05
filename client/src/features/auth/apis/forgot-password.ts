import { publicApi } from "../../../app/axios";

export async function ForgotPassword(email: string) {
    const response = await publicApi.post('/api/auth/forgot-password', { email });
    return response.data;
}