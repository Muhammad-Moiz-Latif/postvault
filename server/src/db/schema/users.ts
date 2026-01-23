import { index } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const UserRole = pgEnum("userRole", ["ADMIN", "CLIENT"])
export const AuthType = pgEnum("authType", ["GOOGLE", "CREDENTIALS"])

export const UserTable = pgTable("users", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    password: t.varchar("password", { length: 255 }),
    username: t.varchar("username", { length: 255 }).notNull(),
    email: t.varchar("email", { length: 255 }).unique().notNull(),
    img: t.varchar("img").default(""),
    role: UserRole("role").default("CLIENT").notNull(),
    authType: AuthType("authType").default("CREDENTIALS").notNull(),
    createdAt: t.timestamp("createdAt").defaultNow()
}), table => {
    return {
        emailIndex: index("emailIndex").on(table.email),
        usernameIndex: index("usernameIndex").on(table.username),
        idIndex: index("idIndex").on(table.id)
    }
})