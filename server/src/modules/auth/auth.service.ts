import { drizzle } from 'drizzle-orm/node-postgres';
import "dotenv/config";
import bcrypt from 'bcrypt';
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
        }).returning({
            userId: UserTable.id
        });
        return createUser;
    }
};
