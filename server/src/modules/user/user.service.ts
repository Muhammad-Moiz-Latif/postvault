import { drizzle } from 'drizzle-orm/node-postgres';
import { UserTable } from '../../db/schema/users';
import { and, eq, sql } from 'drizzle-orm';
import { PostTable } from '../../db/schema/posts';
import { FollowUserTable } from '../../db/schema/follow.user';

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

                EXISTS (
                   SELECT 1 FROM 
                   follows f WHERE
                   f."followerId" = ${userId}
                ) AS followedbyme,

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
                ) AS liked_comments,

                -- saved posts
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', p.id,
                                'img', p.img,
                                'paragraph', p.paragraph,
                                'title', p.title,
                                'publishedAt', p."publishedAt",
                                'author', (
                                    json_build_object(
                                        'id' , au.id,
                                        'username' , au.username,
                                        'img' , au.img
                                    )
                                )
                            )
                        ) FROM saved_posts sp
                          JOIN posts p ON
                          sp."postId" = p.id
                          JOIN users au ON
                          p."authorId" = au.id 
                          WHERE  sp."userId" = u.id
                    ), '[]'::json
                ) AS saved_posts

            FROM users u
            WHERE u.id = ${userId};          
            `);

        return result.rows[0] || null;
    },

    async SavedPosts(userId: string) {
        const posts = await db.execute(sql`
        SELECT
            p.id,
            p.title,
            p.paragraph,
            p.img,
            p.tags,
            p."publishedAt",

            json_build_object(
                'id', sa.id,
                'username', sa.username,
                'img', sa.img
            ) AS author,

            EXISTS (
                SELECT 1 FROM saved_posts sp
                WHERE sp."userId" = ${userId} 
                AND sp."postId" = p.id
            ) AS "savedByMe",

            (SELECT COUNT(*) FROM likepost lp 
             WHERE lp."postId" = p.id
            ) AS likes,

            (SELECT COUNT(*) FROM comments c 
             WHERE c."postId" = p.id
            ) AS comments
        
        FROM saved_posts sp 
        JOIN posts p ON sp."postId" = p.id 
        JOIN users sa ON sa.id = p."authorId" 
        WHERE sp."userId" = ${userId}
    `);

        return posts.rows;
    },

    async isFollowing(userId: string) {
        const [following] = await db.select().from(FollowUserTable).where(eq(
            FollowUserTable.followerId, userId
        ));

        return following;
    },

    async UnFollowedUser(userId: string, followingId: string) {
        const [unfollowed] = await db.delete(FollowUserTable).where(and(
            eq(FollowUserTable.followerId, userId),
            eq(FollowUserTable.followingId, followingId)
        )).returning();

        return unfollowed;
    },

    async FollowUser(userId: string, followingId: string) {
        const [followed] = await db.insert(FollowUserTable).values({
            followerId: userId,
            followingId
        }).returning();

        return followed;
    },

    async getFollowers(userId: string) {
        const followers = await db.execute(sql`
            SELECT
                my.id,
                my.img,
                my.username,
                my.email
            FROM users my JOIN follows f ON
            my.id = f."followerId" WHERE f."followingId" = ${userId}
            `);
        return followers.rows;
    },

    async myFollowings(userId: string) {
        const followings = await db.execute(sql`
                SELECT
                    my.id,
                    my.img,
                    my.username,
                    my.email
                FROM users my JOIN follows f ON
                    my.id = f."followingId" WHERE f."followerId" = ${userId}
        `);

        return followings.rows;
    }
}