import { drizzle } from 'drizzle-orm/node-postgres';
import { UserTable } from '../../db/schema/users';
import { eq, desc } from 'drizzle-orm';
import { PostTable } from '../../db/schema/posts';

const db = drizzle(process.env.DATABASE_URL!);


export const userService = {
    async verifyUser(id: string) {
        const users = await db.select().from(UserTable).where(eq(
            UserTable.id, id
        )).limit(1);

        const user = users[0];

        return user;
    },

    async getUserPosts(Userid: string) {
        const posts = await db.select().from(PostTable).where(eq(
            PostTable.authorId, Userid
        )).orderBy(desc(PostTable.createdAt));

        return posts;
    },
}