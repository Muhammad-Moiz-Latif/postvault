import { incrementUserLikes } from "@/lib/db/UserQueries";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { UserId, PostId } = body;
  const UserLikes = await incrementUserLikes({ UserId, PostId });
  return NextResponse.json({ UserLikes }, { status: 200 });
}
