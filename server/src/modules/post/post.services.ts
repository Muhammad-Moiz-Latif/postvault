import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, sql } from 'drizzle-orm';
import 'dotenv/config';
import { PostTable } from '../../db/schema/posts';
import { CommentTable } from '../../db/schema/comments';
import { likeCommentTable } from '../../db/schema/like.comment';
import { likePostTable } from '../../db/schema/like.post';
import { UserTable } from '../../db/schema/users';
import { savedPostTable } from '../../db/schema/saved.posts';

const db = drizzle(process.env.DATABASE_URL!);



export const postService = {
    async createPost(authorId: string, title: string, paragraph: string, tags: string[], imgURL: string | null, status: "DRAFT" | "PUBLISHED") {
        const posts = await db.insert(PostTable).values({
            authorId,
            title,
            paragraph,
            img: imgURL,
            tags,
            status,
            publishedAt: status === 'PUBLISHED' ? new Date() : null
        }).returning();

        const post = posts[0];

        return post;
    },



    async updatePost(postId: string, authorId: string, title?: string, paragraph?: string, tags?: string[], imgURL?: string | null, status?: "DRAFT" | "PUBLISHED") {

        const posts = await db.update(PostTable).set({
            authorId,
            title,
            paragraph,
            tags,
            img: imgURL,
            status,
            updatedAt: new Date(),
            publishedAt: status === 'PUBLISHED' ? new Date() : null,
        }).where(and(
            eq(PostTable.authorId, authorId),
            eq(PostTable.id, postId)
        )).returning();

        const post = posts[0];

        return post;
    },

    async deletePost(authorId: string, postId: string) {
        const posts = await db.delete(PostTable).where(and(
            eq(PostTable.authorId, authorId),
            eq(PostTable.id, postId)
        )).returning();

        const post = posts[0];

        return post;
    },

    async getAllPosts(cursor?: string, limit: number = 10) {
        let query;
        if (cursor) {
            //GET Posts after the cursor
            query = sql`
                SELECT
                    p.id,
                    p.title,
                    p.paragraph,
                    p.img,
                    p."createdAt",
                    p.tags,
                    json_build_object(
                        'id', u.id,
                        'username',u.username,
                        'img',u.img          
                    ) AS author,
                    (
                        SELECT COUNT(*) FROM
                        comments c WHERE
                        c."postId" = p.id
                    ) AS commentCount,
                    (
                        SELECT COUNT(*) FROM likepost lp WHERE
                        lp."postId" = p.id
                    ) AS likeCount

                    FROM posts p LEFT JOIN users u ON
                    p."authorId" = u.id WHERE p.status = 'PUBLISHED'
                    AND p."createdAt" < (
                        SELECT "createdAt" FROM posts WHERE p.id = ${cursor}
                    )
                    ORDER BY p."createdAt" DESC
                    LIMIT ${limit}
            `;
        } else {
            //First page - No cursor
            query = sql`
                SELECT
                    p.id,
                    p.title,
                    p.paragraph,
                    p.img,
                    p."createdAt",
                    p.tags,
                    json_build_object(
                        'id', u.id,
                        'username',u.username,
                        'img',u.img          
                    ) AS author,
                    (
                        SELECT COUNT(*) FROM
                        comments c WHERE
                        c."postId" = p.id
                    ) AS commentCount,
                    (
                        SELECT COUNT(*) FROM likepost lp WHERE
                        lp."postId" = p.id
                    ) AS likeCount

                    FROM posts p LEFT JOIN users u ON
                    p."authorId" = u.id WHERE p.status = 'PUBLISHED'
                    ORDER BY p."createdAt" DESC
                    LIMIT ${limit}
            `;
        };
        const posts = await db.execute(query);
        const nextCursor = posts.rows.length === limit ? posts.rows[posts.rows.length - 1].id : null;
        const hasMore = posts.rows.length === limit;
        return {
            posts: posts.rows,
            nextCursor,
            hasMore
        };
    },

    async removeLikeFromPost(authorId: string, postId: string) {
        const [removeLike] = await db.delete(likePostTable).where(and(
            eq(likePostTable.authorId, authorId),
            eq(likePostTable.postId, postId)
        )).returning();

        return removeLike;
    },

    async getLikedPost(authorId: string, postId: string) {
        const [liked] = await db.select().from(likePostTable).where(and(
            eq(likePostTable.authorId, authorId),
            eq(likePostTable.postId, postId)
        ));
        return liked;
    },

    async likePost(authorId: string, postId: string) {
        const [likePost] = await db.insert(likePostTable).values({
            authorId, postId
        }).onConflictDoNothing({
            target: [likePostTable.authorId, likePostTable.postId]
        }).returning();

        return likePost;
    },

    async commmentOnPost(authorId: string, postId: string, comment: string) {
        const commented = await db.insert(CommentTable).values({
            authorId,
            postId,
            text: comment,
            updatedAt: null
        }).returning();

        return commented;
    },

    async replyToComment(authorId: string, parentId: string, postId: string, comment: string) {
        const [reply] = await db.insert(CommentTable).values({
            authorId,
            parentId,
            postId,
            text: comment
        }).returning();

        return reply;
    },

    async editComment(comment: string, postId: string, commentId: string) {
        const [editComment] = await db.update(CommentTable).set({
            text: comment
        }).where(and(
            eq(CommentTable.id, commentId),
            eq(CommentTable.postId, postId)
        )).returning();

        return editComment;
    },

    async deleteComment(commentId: string, postId: string) {
        const [deletedComment] = await db.delete(CommentTable).where(and(
            eq(CommentTable.id, commentId),
            eq(CommentTable.postId, postId)
        )).returning();

        return deletedComment;
    },

    async savePost(userId: string, postId: string) {
        const [savedPost] = await db.insert(savedPostTable).values({
            postId,
            userId
        }).returning();

        return savedPost;
    },

    async getAllSavedPosts(userId: string) {
        const savedPosts = await db.select({
            post: PostTable
        }).from(savedPostTable).innerJoin(
            PostTable, eq(savedPostTable.postId, PostTable.id)).where(eq(
                savedPostTable.userId, userId
            ));
        return savedPosts;
    },

    async getPost(postId: string, authorId: string) {

        const result = await db.execute(sql`
            SELECT
                p.id,
                p.title,
                p.paragraph,
                p.img,
                p.tags,
                p.status,
                p."createdAt",

                json_build_object(
                    'username', u.username,
                    'email', u.email,
                    'img', u.img,
                    'id', u.id
                ) AS author,

                (
                    SELECT COUNT(*)
                    FROM likepost lp
                    WHERE lp."postId" = p.id
                ) AS likes,

                EXISTS (
                    SELECT 1 FROM likepost lp
                    WHERE lp."postId" = ${postId}
                    AND lp."authorId" = ${authorId}
                ) AS likedByMe,

                 EXISTS (
                    SELECT 1 FROM saved_posts sp
                    WHERE sp."postId" = ${postId}
                    AND sp."userId" = ${authorId}
                ) AS savedByMe,

                EXISTS (
                    SELECT 1 from follows f
                    WHERE f."followerId" = ${authorId}
                ) AS followedbyme,

                COALESCE(
                    (
                    SELECT json_agg(
                        json_build_object(
                        'id', c.id,
                        'text', c.text,
                        'createdAt', c."createdAt",
                        'author', json_build_object(
                            'username', cu.username,
                            'email', cu.email,
                            'img', cu.img,
                            'id', cu.id
                        ),
                        'likes', (
                            SELECT COUNT(*)
                            FROM likecomment lc
                            WHERE lc."commentId" = c.id
                        ),
                       'likedByMe',
                            EXISTS (
                            SELECT 1 
                            FROM likecomment lc
                            WHERE lc."authorId" = ${authorId}
                            AND lc."commentId" = c.id
                        ),
                        'replies', (
                            COALESCE(
                                (
                                SELECT json_agg(
                                    json_build_object(
                                        'id', rc.id,
                                        'text', rc.text,
                                        'createdAt', rc."createdAt",
                                        'author', json_build_object(
                                            'username', rcu.username,
                                            'email', rcu.email,
                                            'img', rcu.img,
                                            'id', rcu.id
                                         ),
                                        'likes', (
                                            SELECT COUNT(*)
                                            FROM likecomment lc
                                            WHERE lc."commentId" = rc.id
                                        ),
                                        'likedByMe',
                                            EXISTS (
                                            SELECT 1 
                                            FROM likecomment lc
                                            WHERE lc."authorId" = ${authorId}
                                            AND lc."commentId" = rc.id
                                        )
                                    )
                                ) FROM comments rc
                                  JOIN users rcu
                                  ON rc."authorId" = rcu.id
                                  WHERE rc."parentId" = c.id
                            ), '[]' :: json )
                        )
                        ) ORDER BY c."createdAt"
                    )
                    FROM comments c
                    JOIN users cu ON cu.id = c."authorId"
                    WHERE c."postId" = p.id
                    AND c."parentId" IS NULL
                    ),
                    '[]' :: json
                ) AS comments

                FROM posts p
                JOIN users u ON u.id = p."authorId"
                WHERE p.id = ${postId} ;
        `);

        return result.rows[0] || null;
    },

    async getLikedComment(authorId: string, commentId: string) {
        const [comment] = await db.select().from(likeCommentTable).where(and(
            eq(likeCommentTable.authorId, authorId),
            eq(likeCommentTable.commentId, commentId)
        ));

        return comment;
    },

    async unlikeComment(authorId: string, commentId: string) {
        const [comment] = await db.delete(likeCommentTable).where(and(
            eq(likeCommentTable.authorId, authorId),
            eq(likeCommentTable.commentId, commentId)
        )).returning();

        return comment;
    },

    async getSavedPost(userId: string, postId: string) {
        const [savedPost] = await db.select().from(savedPostTable).where(and(
            eq(savedPostTable.userId, userId),
            eq(savedPostTable.postId, postId)
        ));

        return savedPost;
    },

    async removeSavedPost(userId: string, postId: string) {
        const [removeSavedPost] = await db.delete(savedPostTable).where(and(
            eq(savedPostTable.userId, userId),
            eq(savedPostTable.postId, postId)
        )).returning();

        return removeSavedPost;
    },

    async likeComment(authorId: string, commentId: string) {
        const [comment] = await db.insert(likeCommentTable).values({
            authorId,
            commentId
        }).onConflictDoNothing({
            target: [likeCommentTable.authorId, likeCommentTable.commentId]
        }).returning();

        return comment;
    },


};