import { publicApi } from "../../../app/axios";
import { type VerifyEmailResponse } from "../../types";

type dataType = {
    otp: string,
    tokenId: string | null
};

export async function verifyEmail(Data: dataType) {
    console.log(Data);
    const response = await publicApi.post<VerifyEmailResponse>(`/api/auth/verify/${Data.tokenId}`, { otp: Data.otp });
    return response.data;
};