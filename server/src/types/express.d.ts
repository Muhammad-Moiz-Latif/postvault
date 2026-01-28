import express from 'express';

declare global {
    namespace Express {
        interface User {
            id: string;
            name: string;
        }

        interface Request {
            user?: {
                id: string;
                name: string;
            };
        }
    }
}