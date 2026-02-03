import { publicApi } from "../../../app/axios";

type LoginForm = {
  email: string;
  password: string;
};


export async function login(formData: LoginForm) {
  const response = await publicApi.post(
    "/api/auth/login",
    formData
  );

  return response.data;
}
