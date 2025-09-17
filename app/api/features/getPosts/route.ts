import { getAllPosts } from "@/lib/db/UserQueries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data = await getAllPosts();
  return NextResponse.json({ getData: data }, { status: 200 });
}
