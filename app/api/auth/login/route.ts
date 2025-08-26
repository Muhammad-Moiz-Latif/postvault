import { userExistsByEmail, userExistsByPassword } from "@/lib/db/UserQueries";

import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (body) {
            const { email, password } = body;
            const check1 = await userExistsByEmail(email);
            const check2 = await userExistsByPassword(password);
            if (check1 && check2) {
                const accessToken = jwt.sign(
                    { email: email },
                    process.env.ACCESS_TOKEN_SECRET as string,
                    { expiresIn: "5m" }
                );
                const refreshToken = jwt.sign(
                    { email: email },
                    process.env.REFRESH_TOKEN_SECRET as string,
                    { expiresIn: "1d" }
                );

                const response = NextResponse.json({ 'message': 'User created successfully', 'data': body }, { status: 200 });
                response.cookies.set("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 5
                });

                response.cookies.set("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "strict",    // protect against CSRF
                    path: "/",             // cookie valid for all routes
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                });
                return response;
            };
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.log('Error', error);
        return NextResponse.json({ "message": "Failed to process query" }, { status: 500 });
    }
}