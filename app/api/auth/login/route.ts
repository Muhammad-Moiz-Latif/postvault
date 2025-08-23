import { userExistsByEmail, userExistsByPassword } from "@/lib/db/UserQueries";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        if(body){
            const {email , password } = body;
            const check1 = await userExistsByEmail(email);
            const check2 = await userExistsByPassword(password);
            if(check1 && check2){
                return NextResponse.json({message:"User exists" , user : body},{status: 200});
            }
        }
    } catch (error) {
        console.log('Error', error);
        return NextResponse.json({ "message": "Failed to process query" }, { status: 500 });
    }
}