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

    async getSavedPosts(req: Request, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "Unauthorized User"
                });
            };

            const savedPosts = await userService.SavedPosts(userId);

            if (savedPosts) {
                return res.status(200).json({
                    success: true,
                    message: "Retrieved saved posts successfully",
                    data: savedPosts
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

    async FollowUser(req: Request, res: Response) {
        try {
            const { followingId } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "Unauthorized User"
                });
            };

            const following = await userService.isFollowing(userId);

            if (following && following.createdAt) {
                //un-follow the cunt
                const unfollowed = await userService.UnFollowedUser(userId, followingId);
                if (unfollowed) {
                    return res.status(200).json({
                        success: true,
                        action: "Unfollowed",
                        message: "Account has been unfollowed"
                    });
                };
            } else {
                // follow the cunt
                const followed = await userService.FollowUser(userId, followingId);
                if (followed) {
                    return res.status(200).json({
                        success: true,
                        action: "Followed",
                        message: "Started following account"
                    });
                };
            };
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    async getFollowers(req: Request, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "Unauthorized User"
                });
            };

            const myFollowers = await userService.getFollowers(userId);

            if (myFollowers) {
                return res.status(200).json({
                    status: true,
                    message: "Retrieved all of your followers",
                    data: myFollowers
                });
            };
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    async MyFollowings(req: Request, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "Unauthorized User"
                });
            };

            const followings = await userService.myFollowings(userId);

            if (followings) {
                return res.status(200).json({
                    status: true,
                    message: "Retreived accounts you follow successfully",
                    data: followings
                });
            };

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },
}