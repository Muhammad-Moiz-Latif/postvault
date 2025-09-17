import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/pg";
import { userExistsByUsername } from "@/lib/db/UserQueries";

function extractTitle(blocks: any[]): string | null {
    const titleBlock = blocks.find(
        (block) => block.type === "heading" && block.props?.level === 1
    );

    if (titleBlock && titleBlock.content?.length > 0) {
        return titleBlock.content.map((c: any) => c.text).join(" ");
    }

    return null;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { html, json, username } = body;

        // Extract title with fallback
        const title = extractTitle(json) || "Untitled Post";

        // Get user id
        const user = await userExistsByUsername(username);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const authorId = Number(user.id);
        // Insert into DB
        const query = `
            INSERT INTO user_posts (title, json_content, html_content, author_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [title, JSON.stringify(json), html, authorId];
        const result = await pool.query(query, values);

        // Check if insert was successful
        if (result.rowCount && result.rowCount > 0) {
            return NextResponse.json({ 
                message: "Blog stored successfully", 
                data: result.rows[0] 
            }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Insert failed, no rows returned" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Error storing blog:", error);
        return NextResponse.json({ message: "Could not store blog in DB", error: error.message }, { status: 500 });
    }
}
