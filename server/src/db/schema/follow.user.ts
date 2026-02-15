import { index, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { sql } from "drizzle-orm";


export const FollowUserTable = pgTable("follows", (t) => ({
    followerId: t.uuid("followerId").
        references(() => UserTable.id, { onDelete: "cascade" }).
        notNull(),
    followingId: t.uuid("followingId").
        references(() => UserTable.id, { onDelete: "cascade" }).
        notNull(),
    createdAt: t.timestamp('createdAt').defaultNow().notNull()
}), (table) => {
    return {
        pk: primaryKey({ columns: [table.followerId, table.followingId] }),
        noSelfFollow: sql`CHECK ("followerId" <> "followingId")`,
        followerIdx: index("follower_idx").on(table.followerId),
        followingIdx: index("following_idx").on(table.followingId),
    };
});