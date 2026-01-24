import { Request, Response } from 'express';
import { userService } from './user.service';

export const userController = {
    async getUserPosts(req: Request, res: Response) {
        const id = req.user?.id;

        const verifyUser = await userService.verifyUser(id!);

        if(!verifyUser){
            res.status(400).json({
                success : false,
                message : "Invalid User"
            })
        };

        const getUserPosts = await userService.getUserPosts(id!);
    }
}