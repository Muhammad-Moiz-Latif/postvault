import { Request, Response } from 'express';
import uploadImage from '../../services/cloudinary.service';
import { postService } from './post.services';


export const postController = {
    async createPost(req: Request, res: Response) {
        try {
            let { title, paragraph, tags, status } = req.body;


            if (typeof tags === 'string') {
                tags = JSON.parse(tags);
            };

            const image = req.file;
            let imgURL: string | null = null;

            if (image) {
                imgURL = await uploadImage(image.buffer);
            };

            const authorId = req.user?.id;


            const createdPost = await postService.createPost(authorId!, title, paragraph, tags, imgURL, status);

            if (createdPost) {
                return res.status(201).json({
                    success: true,
                    message: "Created post successfully",
                    data: createdPost
                });

            } else {
                return res.status(400).json({
                    success: false,
                    message: "Could not create post.",
                });
            };

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async savePost(req: Request, res: Response) {
        try {
            const postId = req.params.postId as string;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "Unauthorized User"
                })
            };

            const isSavedPost = await postService.getSavedPost(userId, postId);

            //post is already saved so we unsave it
            if (isSavedPost && isSavedPost.postId) {
                const unSavePost = await postService.removeSavedPost(userId, postId);
                if (unSavePost) {
                    return res.status(200).json({
                        success: true,
                        message: "Post is unsaved",
                        action: "unsaved"
                    });
                };
            }

            //save the post if not already saved
            const savedPost = await postService.savePost(userId, postId);

            if (savedPost) {
                return res.status(201).json({
                    success: true,
                    message: "Saved Post successfully!",
                    data: savedPost,
                    action: "saved"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Unable to save post"
                });
            };


        } catch (error) {
            console.error(error);
            return res.status(500).json({
                sucess: false,
                message: "Internal server error"
            });
        };
    },

    async getAllSavedPosts(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            console.log("I reach here");
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "Unauthorized User"
                })
            };

            const savedPosts = await postService.getAllSavedPosts(userId);

            if (savedPosts) {
                return res.status(200).json({
                    success: true,
                    message: "Retrieved saved posts successfully",
                    data: savedPosts
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Did not get saved posts'
                });
            };

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },


    async editPost(req: Request, res: Response) {
        try {
            let { title, paragraph, tags, status } = req.body;

            //  When you destructure { postId } from req.params, TypeScript infers it 
            // as ParamsDictionary rather than narrowing it to string

            const postId = req.params.postId as string;

            if (!postId) {
                return res.status(400).json({
                    success: false,
                    message: "post does not exist"
                });
            };

            if (typeof tags === 'string') {
                tags = JSON.parse(tags);
            };

            if (!title || !paragraph || !tags) {
                return res.status(400).json({
                    success: false,
                    message: "Title, paragraph and tags are required"
                });
            };

            const image = req.file;
            let imgURL: string | null = null;

            if (image) {
                imgURL = await uploadImage(image.buffer);
            };

            const authorId = req.user?.id;

            const updatedPost = await postService.updatePost(postId, authorId!, title, paragraph, tags, imgURL, status);

            if (updatedPost) {
                return res.status(200).json({
                    success: true,
                    message: "Post has been updated successfully",
                    data: updatedPost
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Could not updated post"
                });
            };

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async getDetailedPost(req: Request, res: Response) {
        try {
            const postId = req.params.postId as string;
            const authorId = req.user?.id;

            if (!authorId) {
                return res.status(400).json({
                    success: false,
                    message: "Forbidden"
                });
            };

            const getPost = await postService.getPost(postId, authorId);

            if (!getPost) {
                return res.status(400).json({
                    status: false,
                    message: "Post does not exist"
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Retrived post data successfully!!",
                    data: getPost
                });
            };

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },


    async deletePost(req: Request, res: Response) {
        try {
            const postId = req.params.postId as string;
            const authorId = req.user?.id;
            if (!authorId) {
                return res.status(404).json({
                    success: false,
                    message: "Forbidden"
                });
            };

            const deletedPost = await postService.deletePost(authorId, postId);

            if (deletedPost) {
                return res.status(200).json({
                    success: true,
                    message: "Deleted Post successfully",
                    data: deletedPost
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Post does not exist"
                });
            };

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                sucess: false,
                message: "Internal server error"
            });
        };
    },

    async getAllPosts(req: Request, res: Response) {
        try {
            const cursor = req.query.cursor as string | undefined;
            const getPosts = await postService.getAllPosts(cursor);
            if (getPosts) {
                return res.status(200).json({
                    success: true,
                    message: "returned all posts successfully",
                    data: getPosts
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "no posts found"
                });
            };
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "internal server error"
            });
        };
    },

    async likePost(req: Request, res: Response) {
        try {
            const postId = req.params.postId as string;
            const authorId = req.user?.id;

            if (!authorId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            };

            const getPost = await postService.getPost(postId, authorId);

            if (!getPost) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found"
                });
            };

            const existingLike = await postService.getLikedPost(authorId, postId);
            //if user has already liked a post we remove it
            if (existingLike && existingLike.id) {
                const unlike = await postService.removeLikeFromPost(authorId, postId);
                if (unlike) {
                    return res.status(200).json({
                        success: true,
                        message: "Unliked post successfully",
                        data: 'unliked'
                    });
                };
            };

            //else we like the post
            const likePost = await postService.likePost(authorId, postId);

            if (likePost) {
                return res.status(201).json({
                    success: true,
                    message: "Liked the post successfully",
                    action: 'liked'
                });
            };

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        };
    },

    async commentOnPost(req: Request, res: Response) {
        try {
            const { comment } = req.body;
            const postId = req.params.postId as string;
            const authorId = req.user?.id;

            if (!authorId) {
                return res.status(400).json({
                    success: false,
                    message: "Forbidden"
                });
            };

            if (!comment) {
                return res.status(400).json({
                    success: false,
                    message: "Comment is required"
                });
            };

            const yourComment = await postService.commmentOnPost(authorId, postId, comment);

            if (yourComment) {
                return res.status(201).json({
                    success: true,
                    message: "you made a comment on the post successfully!",
                    data: yourComment
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Could not comment on post"
                });
            };
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        };
    },

    async replyToAComment(req: Request, res: Response) {
        try {
            const parentId = req.params.parentId as string;
            const postId = req.params.postId as string;
            const { comment } = req.body;
            console.log(parentId);
            console.log(postId);
            console.log(comment);
            const authorId = req.user?.id;

            if (!comment) {
                return res.status(400).json({
                    success: false,
                    message: "Comment is required"
                });
            };

            if (!authorId) {
                return res.status(400).json({
                    success: false,
                    message: 'User not Authorized'
                });
            };

            const reply = await postService.replyToComment(authorId, parentId, postId, comment);

            if (reply) {
                return res.status(201).json({
                    success: true,
                    message: "reply made successfully!!",
                    data: reply
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "could not reply to the comment"
                });
            };
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async editComment(req: Request, res: Response) {
        try {
            const { comment } = req.body;
            const commentId = req.params.commentId as string;
            const postId = req.params.postId as string;

            const editedComment = await postService.editComment(comment, postId, commentId);

            if (editedComment) {
                return res.status(200).json({
                    success: true,
                    message: "your comment has been edited successfully!!"
                });
            } else {
                return res.status(400).json({
                    sucess: false,
                    message: "Unable to edit your comment"
                });
            };

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async deleteComment(req: Request, res: Response) {
        try {
            const postId = req.params.postId as string;
            const commentId = req.params.commentId as string;
            const authorId = req.user?.id;

            if (!authorId) {
                return res.status(404).json({
                    success: false,
                    message: "Forbidden"
                });
            };

            const deletedComment = await postService.deleteComment(commentId, postId);

            if (deletedComment) {
                return res.status(200).json({
                    success: true,
                    message: "Deleted comment successfully",
                    data: deletedComment
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "comment does not exist"
                });
            };

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                sucess: false,
                message: "Internal server error"
            });
        };
    },

    async likeComment(req: Request, res: Response) {
        try {
            const commentId = req.params.commentId as string;
            const authorId = req.user?.id;

            if (!authorId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            };

            const existingLike = await postService.getLikedComment(authorId, commentId);
            //if user has already liked a comment we remove it
            if (existingLike && existingLike.id) {
                const unlike = await postService.unlikeComment(authorId, commentId);
                if (unlike) {
                    return res.status(200).json({
                        success: true,
                        message: "Unliked comment successfully",
                        data: 'unliked'
                    });
                };
            };

            //else we like the comment
            const likeComment = await postService.likeComment(authorId, commentId);

            if (likeComment) {
                return res.status(201).json({
                    success: true,
                    message: "Liked the comment successfully",
                    action: 'liked'
                });
            };

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        };
    },


};