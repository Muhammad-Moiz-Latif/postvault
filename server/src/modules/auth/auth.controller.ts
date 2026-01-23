import { Request, Response } from 'express';
import uploadImage from '../../services/cloudinary.service';
import { authService } from './auth.service';
import jwt from 'jsonwebtoken';

export const authController = {
    async createUserAccount(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const image = req.file;
            let imgURL: string | null = null;
            if (image) {
                imgURL = await uploadImage(image.buffer);
            };
            const createUser = await authService.createUserAccount(name, email, password, imgURL);
            if (createUser) {
                //create jwt tokens and then send res
            }
        } catch (error) {

        }
    }
};