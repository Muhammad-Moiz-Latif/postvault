import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const request = req.headers.get('authorization');
    const token = request?.split(" ")[1];
    return NextResponse.json({accessToken : token} , {status : 200});
}