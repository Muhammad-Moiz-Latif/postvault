import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, sql } from 'drizzle-orm';
import 'dotenv/config';
import { PostTable } from '../../db/schema/posts';
import { CommentTable } from '../../db/schema/comments';
import { likeCommentTable } from '../../db/schema/like.comment';
import { likePostTable } from '../../db/schema/like.post';
import { UserTable } from '../../db/schema/users';

const db = drizzle(process.env.DATABASE_URL!);



export const postService = {
    async createPost(authorId: string, title: string, paragraph: string, tags: string[], imgURL: string | null) {
        const posts = await db.insert(PostTable).values({
            authorId,
            title,
            paragraph,
            img: imgURL,
            tags,
            publishedAt: null
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

    async getAllPosts() {
        const posts = await db.execute(sql`
                SELECT
                    p.id,
                    p.title,
                    p.paragraph,
                    p.img,
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
            `);
        return posts.rows;
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

    async getPost(postId: string) {

        const result = await db.execute(sql`
            SELECT
                p.id,
                p.title,
                p.paragraph,
                p."createdAt",

                json_build_object(
                    'username', u.username,
                    'email', u.email,
                    'img', u.img
                ) AS author,

                (
                    SELECT COUNT(*)
                    FROM likepost lp
                    WHERE lp."postId" = p.id
                ) AS likes,

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
                            'img', cu.img
                        ),
                        'likes', (
                            SELECT COUNT(*)
                            FROM likecomment lc
                            WHERE lc."commentId" = c.id
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
                                            'img', rcu.img
                                         ),
                                        'likes', (
                                            SELECT COUNT(*)
                                            FROM likecomment lc
                                            WHERE lc."commentId" = c.id
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