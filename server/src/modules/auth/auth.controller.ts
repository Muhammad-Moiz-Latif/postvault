import { Request, Response } from 'express';
import uploadImage from '../../services/cloudinary.service';
import "dotenv/config";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authService } from './auth.service';

export const authController = {

    async createUserAccount(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Name, email, and password are required'
                });
            };

            const image = req.file;
            let imgURL: string | null = null;

            if (image) {
                imgURL = await uploadImage(image.buffer);
            };

            const createUser = await authService.createUserAccount(name, email, password, imgURL);

            if (createUser) {
                console.log(createUser);
                return res.status(201).json(
                    {
                        success: true,
                        message: "User created succesfully!",
                        data: {
                            id: createUser[0].id
                        }
                    });
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Could not create user account"
                })
            };

        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const ACCESS_SECRET = process.env.access_secret!;
            const REFRESH_SECRET = process.env.refresh_secret!

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "email and password are required"
                });
            };

            const findUser = await authService.verifyUser(email);

            if (!findUser) {
                return res.status(404).json({
                    success: false,
                    message: "User does not exist"
                });
            };

            const verifyPassword = await bcrypt.compare(password, findUser.password!);

            if (!verifyPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Credentials"
                })
            };

            const access_token = jwt.sign(
                { id: findUser.id, name: findUser.username },
                ACCESS_SECRET,
                { expiresIn: "15m" }
            );

            const refresh_token = jwt.sign(
                { id: findUser.id, name: findUser.username },
                REFRESH_SECRET,
                { expiresIn: "1d" }
            );

            res.cookie("refresh_token", refresh_token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 });

            return res.status(200).json({
                success: true,
                message: "User verified successfully!",
                data: {
                    username: findUser.username,
                    img: findUser.img,
                    email: findUser.email,
                    createdAt: findUser.createdAt
                },
                access_token: access_token
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
    },

    async verifyRefreshToken(req: Request, res: Response) {
        const { refresh_token } = req.cookies;

        if (!refresh_token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing",
            });
        };

        jwt.verify(refresh_token, process.env.refresh_secret!, (err: any, decoded: any) => {
            if (err || !decoded || typeof decoded === "string") {
                return res.status(403).json({
                    success: false,
                    message: "Invalid refresh token",
                });
            }

            const access_token = jwt.sign(
                { id: decoded.id, name: decoded.name },
                process.env.access_secret!,
                { expiresIn: "15m" }
            );

            return res.status(200).json({
                success: true,
                message: "Access token refreshed",
                access_token,
            });
        });
    },

    async handleLogout(req: Request, res: Response) {
        const { refresh_token } = req.cookies;

        if (!refresh_token) {
            return res.status(200).json({
                success: true,
                message: "Refresh token already deleted. Logged out successfully",
            });
        };

        res.clearCookie("refresh_token", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 });

        return res.status(200).json({
            success: true,
            message: "Refresh token deleted. Logged out successfully"
        });
    },


};