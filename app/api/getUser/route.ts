import { userExistsByEmail } from "@/lib/db/UserQueries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        console.log(email);
        const getData = await userExistsByEmail(email);
        if (getData) {
            return NextResponse.json({ getData }, { status: 200 })
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Could not retrieve userData from db" }, { status: 500 });
    }
}