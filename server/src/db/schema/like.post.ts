import { pgTable, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { PostTable } from './posts';
import { relations } from 'drizzle-orm';

export const likePostTable = pgTable("likepost", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    authorId: t.uuid("authorId").references(() => UserTable.id, { onDelete: "cascade" }).notNull(),
    postId: t.uuid("postId").references(() => PostTable.id, { onDelete: "cascade" }).notNull(),
    createdAt: t.timestamp("createdAt").defaultNow(),
}), table => ({
    uniqueUserPost: uniqueIndex("unique_user_post").on(table.authorId, table.postId),
    likePostIndex: index("like_post_idx").on(table.id)
}));

export const likePostRelations = relations(likePostTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [likePostTable.authorId],
        references: [UserTable.id]
    }),
    post: one(PostTable, {
        fields: [likePostTable.postId],
        references: [PostTable.id]
    })
}));