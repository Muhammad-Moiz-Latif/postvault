import { drizzle } from 'drizzle-orm/node-postgres';
import { UserTable } from '../../db/schema/users';
import { eq, sql } from 'drizzle-orm';
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

    async getUserPosts(userId: string) {
        const posts = await db.execute(sql`
                SELECT 
                    p.id,
                    p.title,
                    p.paragraph,
                    p.img,
                    p.tags,
                    p.status,
                    p."createdAt",
                    p."updatedAt",
                    p."publishedAt",
                    (
                        SELECT COUNT(*) FROM comments c WHERE
                        c."postId" = p.id
                    ) AS comments,
                    (
                        SELECT COUNT(*) FROM likepost lp where
                        lp."postId" = p.id
                    ) AS likes,
                    EXISTS (
                        SELECT 1 FROM likepost lp WHERE
                        lp."authorId" = ${userId} 
                        AND lp."postId" = p.id
                    ) AS likedbyme,
                    EXISTS (
                        SELECT 1 FROM saved_posts sp WHERE
                        sp."userId" = ${userId}
                        AND sp."postId" = p.id
                    ) AS savedbyme
                    FROM posts p WHERE p."authorId" = ${userId} ORDER BY p."createdAt" ASC
            `);

        return posts.rows;
    },

    async getUserProfile(userId: string) {
        const result = await db.execute(sql`
            SELECT
                u.id,
                u.username,
                u.email,
                u.img,
                u."createdAt",

                -- liked posts
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', p.id,
                                'title', p.title,
                                'paragraph', p.paragraph,
                                'img', p.img,
                                'likedAt', lp."createdAt"
                            )
                        )
                        FROM likepost lp
                        JOIN posts p ON p.id = lp."postId"
                        WHERE lp."authorId" = u.id
                    ),
                    '[]'::json
                ) AS liked_posts,

                -- liked comments
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', c.id,
                                'text', c.text,
                                'likedAt', lc."createdAt"
                            )
                        )
                        FROM likecomment lc
                        JOIN comments c ON c.id = lc."commentId"
                        WHERE lc."authorId" = u.id
                    ),
                    '[]'::json
                ) AS liked_comments

            FROM users u
            WHERE u.id = ${userId};          
            `);

        return result.rows[0] || null;
    },
}