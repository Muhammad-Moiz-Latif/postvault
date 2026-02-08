export type ApiResponse<T> = {
    success: boolean,
    message: string,
    data?: T,
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

export type RefreshTokenResponse = ApiResponse<{ userId: string }>;

export type UserProfileResponse = ApiResponse<{
    id: string,
    username: string,
    email: string,
    img: string,
    createdAt: string,
    liked_posts: Array<{
        id: string;
        title: string;
        paragraph: string;
        img: string;
        likedAt: string;
    }>;
    liked_comments: Array<{
        id: string;
        text: string;
        likedAt: string;
    }>;
}>;

export type AllPostsResponse = ApiResponse<[
    {
        id: string,
        title: string,
        paragraph: string,
        createdAt: Date,
        img: string,
        tags: Array<string>,
        author: {
            id: string,
            username: string,
            img: string
        },
        commentcount: number,
        likecount: number
    }
]>;