import { Request, Response } from 'express';
import uploadImage from '../../services/cloudinary.service';
import { postService } from './post.services';


export const postController = {
    async createPost(req: Request, res: Response) {
        try {
            let { title, paragraph, tags } = req.body;

            if (typeof tags === 'string') {
                tags = JSON.parse(tags);
            }

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

            const createdPost = await postService.createPost(authorId!, title, paragraph, tags, imgURL);

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
            const getPosts = await postService.getAllPosts();
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
            return res.status(500).json({
                success: false,
                message: "internal server error"
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





};