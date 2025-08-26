import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const res = NextResponse.json({ message: 'Logged out' } , {status : 200});
    res.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });
    res.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    return res;
}