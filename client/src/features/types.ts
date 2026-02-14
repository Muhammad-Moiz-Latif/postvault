export type ApiResponse<T> = {
    success: boolean,
    message: string,
    data?: T,
    access_token?: string,
    action?: string
};

export type SignupResponse = ApiResponse<string>;

export type VerifyEmailResponse = ApiResponse<{}>;

export type LoginResponse = ApiResponse<{
    _id: string,
    username: string,
    img: string,
    email: string,
    createdAt: string
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

interface Post {
    id: string,
    title: string,
    paragraph: string,
    createdAt: string,
    img: string,
    tags: Array<string>,
    author: {
        id: string,
        username: string,
        img: string
    },
    commentcount: number,
    likecount: number
};

export type AllPostsResponse = ApiResponse<{
    posts: Post[],
    nextCursor: string | null,
    hasMore: boolean
}>;

export type CreatePostResponse = ApiResponse<{
    id: string,
    authorId: string,
    title: string,
    img: string,
    paragraph: string,
    tags: string[],
    status: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string
}>;

export interface CommentsinDetailedPost {
    id: string,
    text: string,
    createdAt: string,
    author: {
        username: string,
        email: string,
        img: string,
        id: string
    },
    likes: number,
    likedByMe: boolean,
    replies: CommentsinDetailedPost[]
};

export type DetailedPostResponse = ApiResponse<{
    id: string,
    title: string,
    paragraph: string,
    img: string,
    tags: string[],
    createdAt: string,
    author: {
        username: string,
        email: string,
        img: string,
        id: string
    },
    likes: number,
    status: "DRAFT" | "PUBLISHED",
    likedbyme: boolean,
    savedbyme: boolean,
    comments: CommentsinDetailedPost[]
}>;

export type LikeUnlikePostResponse = ApiResponse<null>;


export type MyPost = {
    id: string,
    title: string,
    paragraph: string,
    img: string,
    tags: string[],
    status: "DRAFT" | "PUBLISHED",
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    comments: number,
    likes: number,
    likedbyme: boolean,
    savedbyme: boolean
};

export type MyPostsResponse = ApiResponse<[{
    id: string,
    title: string,
    paragraph: string,
    img: string,
    tags: string[],
    status: "DRAFT" | "PUBLISHED",
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    comments: number,
    likes: number,
    likedbyme: boolean,
    savedbyme: boolean
}]>;

export type MyProfileResponse = ApiResponse<{
    id: string,
    username: string,
    email: string,
    img: string,
    createdAt: string,
    liked_posts: {
        id: string;
        title: string;
        paragraph: string;
        img: string;
        likedAt: string;
    }[];

    liked_comments: {
        id: string;
        text: string;
        likedAt: string;
    }[];

    saved_posts: {
        id: string;
        img: string;
        paragraph: string;
        title: string;
        publishedAt: string;
        author: {
            id: string;
            username: string;
            img: string;
        };
    }[];

}>;