import { getAllCommentswithUsers } from "@/lib/db/UserQueries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { PostId } = body;
  const getUserComments = await getAllCommentswithUsers(PostId);
  return NextResponse.json({ getUserComments });
}
