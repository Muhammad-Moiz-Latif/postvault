export type ApiResponse<T> = {
    success: boolean,
    message: string,
    data: T,
    access_token?: string
};

export type SignupResponse = ApiResponse<string>;

export type VerifyEmailResponse = ApiResponse<{}>;

export type LoginResponse = ApiResponse<{
    _id: string,
    username: string,
    img: string,
    email: string,
    createdAt: Date
}>;
