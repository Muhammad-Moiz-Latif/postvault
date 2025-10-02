import { getAllLikes } from "@/lib/db/UserQueries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { PostId } = body;
  console.log("yomama", PostId);
  const AllLikes = await getAllLikes({ PostId });
  return NextResponse.json({ AllLikes }, { status: 200 });
}
