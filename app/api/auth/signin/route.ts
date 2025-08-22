import pool from "@/lib/pg";
import { NextRequest, NextResponse } from "next/server";
import { userExistsByEmail, userExistsByPassword, userExistsByUsername } from "@/lib/db/UserQueries";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(body);
        if (body) {
            const { username, password, email, image } = body;
            //Validation to check whether with same email, username or password exists or not
            const check1 = await userExistsByEmail(email);
            const check2 = await userExistsByUsername(username);
            const check3 = await userExistsByPassword(password);
            if (check1) {
                return NextResponse.json({ message: "User with this email already exists, please try again." }, { status: 400 });
            } else if (check2) {
                return NextResponse.json({ message: "User with this username already exists, please try again." }, { status: 400 });
            } else if (check3) {
                return NextResponse.json({ message: "User with this password already exists, please try again." }, { status: 400 });
            }
            //user with same data does not exist so creating user
            if(image){
                 const query = `INSERT INTO users
            (username, password, email, image) VALUES ($1,$2,$3,$4)
            RETURNING id,username,email,created_at,image`;
            const values = [username, password, email, image];
            const result = await pool.query(query, values);
            return NextResponse.json({ 'message': 'User created successfully', 'data': result.rows[0] }, { status: 200 });
            }
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