import { userExistsByUsername } from "@/lib/db/UserQueries";
import pool from "@/lib/pg";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { html, json, username, postId } = body;
  const user = await userExistsByUsername(username);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  console.log("Type of json:", typeof json);
  console.log("json:", json);
  const query = `UPDATE user_posts SET json_content=$1, html_content=$2, author_id=$3, updated_at=NOW() WHERE id=$4 Returning *`;
  const values = [JSON.stringify(json), html, user.id, postId];
  const result = await pool.query(query, values);
  if (result.rowCount === 0) {
    return NextResponse.json(
      { message: "Post not found or not yours" },
      { status: 404 },
    );
  }
  return NextResponse.json(
    { message: "Updated", post: result.rows[0] },
    { status: 200 },
  );
}
