import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { PostTable } from "./posts";

export const savedPostTable = pgTable("saved_posts", (t) => ({
    userId: t.uuid("userId")
        .references(() => UserTable.id, { onDelete: "cascade" })
        .notNull(),

    postId: t.uuid("postId")
        .references(() => PostTable.id, { onDelete: "cascade" })
        .notNull(),

    createdAt: t.timestamp("createdAt").defaultNow().notNull(),
}), (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.postId] }),
    }
});
