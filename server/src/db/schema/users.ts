import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { PostTable } from "./posts";
import { CommentTable } from "./comments";
import { likePostTable } from "./like.post";
import { likeCommentTable } from "./like.comment";
import { verificationTokenTable } from "./verify.token";

export const AuthType = pgEnum("authType", ["GOOGLE", "CREDENTIALS", "BOTH"]);

export const AccountStatus = pgEnum("accountStatus", ["PENDING", "VERIFIED"]);

export const UserTable = pgTable("users", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    password: t.varchar("password", { length: 255 }),
    username: t.varchar("username", { length: 255 }).notNull(),
    email: t.varchar("email", { length: 255 }).unique().notNull(),
    img: t.varchar("img").default(""),
    authType: AuthType("authType").default("CREDENTIALS").notNull(),
    status: AccountStatus("status").default("PENDING").notNull(),
    createdAt: t.timestamp("createdAt").defaultNow().notNull()
}), table => {
    return {
        emailIndex: index("email_idx").on(table.email),
        usernameIndex: index("username_idx").on(table.username),
    }
});

export const userRelations = relations(UserTable, ({ many }) => ({
    posts: many(PostTable),
    comments: many(CommentTable),
    post_likes: many(likePostTable),
    comment_likes: many(likeCommentTable),
    verification_tokens: many(verificationTokenTable)
}));