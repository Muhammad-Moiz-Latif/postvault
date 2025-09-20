import pool from "@/lib/pg";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const query = `DELETE FROM user_posts WHERE id=$1`;
  const value = [id];
  try {
    await pool.query(query, value);
    return NextResponse.json(
      { message: "Post deleted Successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to delete post" },
      { status: 500 },
    );
  }
}
