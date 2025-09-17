import { updateUser } from "@/lib/db/UserQueries";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { url, username } = body;
        const result = await updateUser(url, username);
        console.log(result);
        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "could not update User" }, { status: 400 });
    }
}