import { userExistsByEmail, userPostsById } from "@/lib/db/UserQueries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body.email);
  try {
    const response = await userExistsByEmail(body.email);
    if (response) {
      const id = response.id;
      const userPost = await userPostsById(id);
      return NextResponse.json({ getData: userPost });
    }
  } catch (error) {
    return NextResponse.json({});
  }
}
