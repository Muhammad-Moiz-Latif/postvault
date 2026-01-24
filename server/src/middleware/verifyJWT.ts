import "dotenv/config";
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    //header = Bearer ${token}
    const header = req.header('authorization');
    if (!header) {
        return res.status(401);
    };
    const token = header.split(" ")[1];
    jwt.verify(token, process.env.access_secret!, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
            return res.sendStatus(403);
        }

        req.user = {
            id: decoded.id,
            name: decoded.name,
        };

        next();
    });
}