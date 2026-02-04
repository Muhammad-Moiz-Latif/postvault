import { publicApi } from "../../../app/axios";
import { type SignupResponse } from "../../types";
import { type signupType } from "../components/Signup";

export async function signup(Data: signupType) {

    const formData = new FormData();

    if (Data.username) formData.append("name", Data.username);
    if (Data.email) formData.append('email', Data.email);
    if (Data.password) formData.append('password', Data.password);
    if (Data.image && Data.image.length > 0) formData.append('image', Data.image[0]);

    const response = await publicApi.post<SignupResponse>('/api/auth/signup', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};