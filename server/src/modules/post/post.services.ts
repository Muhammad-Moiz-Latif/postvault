import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import 'dotenv/config';
import { PostTable } from '../../db/schema/posts';
import { CommentTable } from '../../db/schema/comments';

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
        const posts = await db.select().from(PostTable).leftJoin(
            CommentTable, eq(PostTable.id, CommentTable.postId)
        ).where(
            eq(PostTable.status, 'PUBLISHED')
        );
        return posts;
    },

    async commmentOnPost(authorId: string, postId: string, comment: string) {
        const commented = await db.insert(CommentTable).values({
            authorId,
            postId,
            text: comment,
            updatedAt: null
        }).returning();

        return commented;
    }




};