import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { pgEnum } from "drizzle-orm/pg-core";
import { index } from "drizzle-orm/pg-core";
import { likePostTable } from "./like.post";

export const PostStatus = pgEnum("postStatus", ["DRAFT", "PUBLISHED"]);

export const PostTable = pgTable("posts", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    authorId: t.uuid('authorId').references(() => UserTable.id, {
        onDelete: "cascade"
    }),
    title: t.varchar("title", { length: 255 }).notNull(),
    img: t.varchar("img").default(""),
    paragraph: t.text("paragraph").notNull(),
    tags: t.text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
    status: PostStatus("status").default("DRAFT").notNull(),
    createdAt: t.timestamp("createdAt").defaultNow().notNull(),
    updatedAt: t.timestamp("updatedAt").defaultNow().notNull(),
    publishedAt: t.timestamp("publishedAt").defaultNow()
}), table => {
    return {
        postTitleIndex: index("post_title_idx").on(table.title),
        postStatusIndex: index("post_status_idx").on(table.status),
        authorIdIndex: index("post_author_idx").on(table.authorId),
        createdAtIndex: index("post_created_idx").on(table.createdAt),
    }
});

export const postRelations = relations(PostTable, ({ one , many }) => ({
    author: one(UserTable, {
        fields: [PostTable.authorId],
        references: [UserTable.id]
    }),
    likes: many(likePostTable)
}));