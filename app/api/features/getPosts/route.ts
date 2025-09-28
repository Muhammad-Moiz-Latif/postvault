import { getAllPosts, userExistsById } from "@/lib/db/UserQueries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data = await getAllPosts();
  const updatedData: any[] = [];
  for (const post of data) {
    const userData = await userExistsById(post.author_id);
    const mergeData = { ...post, ...userData };
    updatedData.push(mergeData);
  }

  return NextResponse.json({ getData: updatedData }, { status: 200 });
}
