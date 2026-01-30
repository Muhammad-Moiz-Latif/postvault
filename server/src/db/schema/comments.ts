import { pgTable } from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { PostTable } from './posts';
import { index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { likeCommentTable } from './like.comment';

export const CommentTable = pgTable("comments", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    authorId: t.uuid("authorId").references(() => UserTable.id, { onDelete: "cascade" }).notNull(),
    postId: t.uuid("postId").references(() => PostTable.id, { onDelete: "cascade" }).notNull(),
    parentId: t.uuid("parentId").references((): any => CommentTable.id, { onDelete: "cascade" }),
    text: t.text("text").notNull(),
    createdAt: t.timestamp("createdAt").defaultNow(),
    updatedAt: t.timestamp("updatedAt").defaultNow(), 
}), table => ({
    commentIndex: index("comment_idx").on(table.id)
}));

export const CommentRelations = relations(CommentTable, ({ one, many }) => ({
    author: one(UserTable, {
        fields: [CommentTable.authorId],
        references: [UserTable.id]
    }),
    likes: many(likeCommentTable)
}));