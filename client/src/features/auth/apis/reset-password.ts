import { publicApi } from "../../../app/axios";

type resetPasswordType = {
    resetToken: string | null,
    password: string
};

export async function resetPassword(Data: resetPasswordType) {
    const response = await publicApi.post('/api/auth/reset-password', Data);
    return response.data;
};