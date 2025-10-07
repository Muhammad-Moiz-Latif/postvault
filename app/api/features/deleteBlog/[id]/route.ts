import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/pg";

export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params as { id: string };

  try {
    await pool.query(`DELETE FROM user_posts WHERE id=$1`, [id]);
    return NextResponse.json({ message: "Post deleted Successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Unable to delete post" }, { status: 500 });
  }
}
