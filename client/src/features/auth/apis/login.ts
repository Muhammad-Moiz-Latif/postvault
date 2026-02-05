import { publicApi } from "../../../app/axios";
import { type LoginResponse } from "../../types";
import type { LoginForm } from "../components/Login";


export async function login(formData: LoginForm) {
  const response = await publicApi.post<LoginResponse>(
    "/api/auth/login",
    formData, {
    withCredentials: true
  }
  );

  return response.data;
}
