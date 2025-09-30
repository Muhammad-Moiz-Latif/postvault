import { userExistsByUsername } from "@/lib/db/UserQueries";
import pool from "@/lib/pg";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { comment, PostId, username } = body;
    const getUserData = await userExistsByUsername(username);
    if (!getUserData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = getUserData.id;
    const query =
      "INSERT INTO user_comments (comment , user_id , posts_id) VALUES ($1 , $2 , $3)";
    const values = [comment, userId, PostId];
    const result = await pool.query(query, values);
    return NextResponse.json({ comment: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error inserting comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
