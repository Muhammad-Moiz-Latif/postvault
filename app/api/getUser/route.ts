import { findUser } from "@/lib/db/UserQueries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { username, email } = await req.json();
        const getData = await findUser(username, email);
        if (getData) {
            return NextResponse.json({ getData }, { status: 200 })
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Could not retrieve userData from db" }, { status: 500 });
    }
}