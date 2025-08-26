import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const check = jwt.verify(refreshToken as string, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
    if (check) {
        const accessToken = jwt.sign(
            { email: check.email },               // payload
            process.env.ACCESS_TOKEN_SECRET as string,      // secret key
            { expiresIn: "5m" }                   // options
        );
        return NextResponse.json({accessToken : accessToken} , {status : 200});
    }
    return NextResponse.json({status : 401});
}