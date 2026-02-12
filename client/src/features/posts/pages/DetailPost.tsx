import { useNavigate, useParams } from "react-router";
import { useDetailedPost } from "../queries/useDetailedPost"
import { useReactToPost } from "../queries/useReactToPost";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useComment } from "../queries/useComment";
import { useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { Comment } from "../components/Comment";
import { useAuth } from "../../../context/authContext";
import { useDeletePost } from "../queries/useDeletePost";
import { useSavePost } from "../queries/useSavePost";

export const DetailPost = () => {
    const { postId } = useParams();
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    const { data, isSuccess, isPending } = useDetailedPost(postId || "");
    const [isComment, setComment] = useState("");
    const { mutate: CommentOnPost, isPending: loadingComment } = useComment();
    const { mutate: ReactToPost } = useReactToPost(postId!);
    const { mutate: DeletePost, isPending: isDeleting } = useDeletePost();
    const { mutate: SavePost } = useSavePost(postId!);
    const navigate = useNavigate();
    const post = data?.data!;


    function handleLike() {
        ReactToPost();
    };

    function handleSave() {
        SavePost();
    };

    function handleComment() {
        CommentOnPost({ postId, comment: isComment }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['post', postId] });
                queryClient.invalidateQueries({ queryKey: ['all-posts'] });
                setComment("");
            },
            onError: (error) => {
                console.error(error);
                toast.error("An error occured while commenting on this post");
            }
        })
    };

    async function deletePost() {
        DeletePost(postId, {
            onSuccess: () => {
                toast.success("Deleted Post Successfully!");
                queryClient.invalidateQueries({ queryKey: ['all-posts'] });
                setTimeout(() => {
                    navigate("/app", { replace: true });
                }, 1500);
            },
            onError: (error) => {
                console.error(error);
                toast.error("Unable to delete post");
            }
        })
    };



    if (isPending) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!isSuccess || !post) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-500">Post not found</div>
            </div>
        );
    };


    return (
        <article className="w-full min-h-screen bg-white">

            <ToastContainer
                position='top-center'
                closeOnClick
                draggable
                hideProgressBar={true}
            />

            <div className="max-w-[680px] mx-auto px-6 py-12">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                    {post.title}
                </h1>

                {/* Author info */}
                <div className="flex items-center justify-between gap-3 mb-8 pb-8 border-b border-gray-200">
                    <div className="flex gap-3">
                        <img
                            src={post.author.img}
                            alt={post.author.username}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{post.author.username}</span>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <time>{post.createdAt}</time>
                            </div>
                            <Bookmark
                                onClick={handleSave}
                                className={`hover:cursor-pointer ${post.savedbyme ? "text-rose-600 " : "text-zinc-400"} `}
                            />

                        </div>

                    </div>

                    {
                        (auth.user_id === post.author.id) &&
                        <button
                            disabled={isDeleting}
                            onClick={deletePost}
                            className="bg-rose-600 text-white rounded-md px-3 py-1 hover:cursor-pointer
                            active:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete Post"}
                        </button>
                    }
                </div>

                {/* Main content */}
                <div className="prose prose-lg max-w-none">
                    <p className="text-xl leading-relaxed text-gray-800 whitespace-pre-wrap">
                        {post.paragraph}
                    </p>
                </div>

                {/* Engagement bar */}
                <div className="flex items-center gap-6 py-6 my-8 border-y border-gray-200">
                    <button
                        onClick={handleLike}
                        className={`flex items-center hover:cursor-pointer
                        gap-2 ${post.likedbyme ? "text-rose-600" : "text-gray-600"}  hover:text-gray-900 transition`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">{post.comments.length}</span>
                    </button>
                </div>

                {/* Comments section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Comments ({post.comments.length})
                    </h2>

                    {/* Comment input */}
                    <div className="mb-10">
                        <textarea
                            placeholder="What are your thoughts?"
                            value={isComment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-900 transition"
                            rows={3}
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                disabled={loadingComment}
                                onClick={handleComment}
                                className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition">
                                {loadingComment ? "Responding..." : "Respond"}
                            </button>
                        </div>
                    </div>

                    {/* Comments list */}
                    <div className="space-y-8">
                        {post.comments.map(comment => (
                            <Comment comment={comment} isReply={false} postId={postId!} key={comment.id} />
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
};


