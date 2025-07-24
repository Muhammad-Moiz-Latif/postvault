import pool from "@/lib/pg";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (body) {
            const {username, password, email} = body;
            const query = `INSERT INTO users
            (username, password, email) VALUES ($1,$2,$3)
            RETURNING id,username,email,created_at`;
            const values = [username, password, email];
            const result = await pool.query(query, values);
            return NextResponse.json({ 'message': 'User created successfully', 'data': result.rows[0] }, { status: 200 });
        }
    } catch (error) {
        console.log('Error', error);
        return NextResponse.json({ "message": "Failed to process query" }, { status: 500 });
    }
}