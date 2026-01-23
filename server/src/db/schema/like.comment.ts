import { pgTable, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { CommentTable } from './comments';
import { relations } from 'drizzle-orm';

export const likeCommentTable = pgTable("likecomment", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    authorId: t.uuid("authorId").references(() => UserTable.id, { onDelete: "cascade" }).notNull(),
    commentId: t.uuid("commentId").references(() => CommentTable.id, { onDelete: "cascade" }).notNull(),
    createdAt: t.timestamp("createdAt").defaultNow(),
}), table => ({
    uniqueUserComment: uniqueIndex("unique_user_comment").on(table.authorId, table.commentId),
    likeCommentIndex: index("like_comment_idx").on(table.id)
}));

export const likeCommentRelations = relations(likeCommentTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [likeCommentTable.authorId],
        references: [UserTable.id],
    }),
    comment: one(CommentTable, {
        fields: [likeCommentTable.commentId],
        references: [CommentTable.id],
    }),
}));
