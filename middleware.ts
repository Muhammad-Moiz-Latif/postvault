
import { NextRequest, NextResponse } from "next/server";

export default async function Middleware(req: NextRequest) {
    const accessToken = req.cookies.get('accessToken')?.value;
    console.log(accessToken);
    if (!accessToken) {
        return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next();
};

export const config = {
    matcher: ['/about'],
}