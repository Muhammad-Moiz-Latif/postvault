import pool from "@/lib/pg";


export async function userExistsByEmail(email: string) {
    const query = `SELECT email FROM users WHERE email = $1 LIMIT 1`;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
};

export async function userExistsByUsername(username: string) {
    const query = "SELECT username FROM users where username = $1 LIMIT 1";
    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
}

export async function userExistsByPassword(password: string) {
    const query = "SELECT password FROM users where password = $1 LIMIT 1";
    const result = await pool.query(query, [password]);
    return result.rows[0] || null;
}

export async function findUser(email: string, username: string) {
    const query = `SELECT username, email, image FROM users WHERE email = $1 AND username = $2 LIMIT 1`;
    const values = [email, username];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
}