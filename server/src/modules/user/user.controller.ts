import { Request, Response } from 'express';
import { userService } from './user.service';

export const userController = {
    async getUserPosts(req: Request, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Not Authorized'
                });
            };

            const getUserPosts = await userService.getUserPosts(userId);

            if (getUserPosts) {
                return res.status(200).json({
                    success: true,
                    message: "retrieved user posts successfully",
                    data: getUserPosts
                });
            } else {
                return res.status(400).json({
                    sucess: false,
                    message: 'unable to retreive user posts'
                })
            };

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async getUserProfile(req: Request, res: Response) {
        try {
            const userId = req.params.userId as string;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User not Authorized"
                });
            };

            const getUserProfile = await userService.getUserProfile(userId);

            if (getUserProfile) {
                return res.status(200).json({
                    success: true,
                    message: "retrieved user profile succssfully",
                    data: getUserProfile
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "unable to retrieve user profile"
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
}