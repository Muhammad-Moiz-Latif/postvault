import { drizzle } from 'drizzle-orm/node-postgres';
import "dotenv/config";
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { UserTable } from '../../db/schema/users';


const db = drizzle(process.env.DATABASE_URL!);

export const authService = {
    async createUserAccount(name: string, email: string, password: string, imgURL: string | null) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUser = await db.insert(UserTable).values({
            username: name,
            email,
            password: hashedPassword,
            img: imgURL
        }).returning();
        return createUser;
    },

    async verifyUser(email: string) {
        const users = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.email, email))
            .limit(1);

        const user = users[0];

        return user;
    }
};
