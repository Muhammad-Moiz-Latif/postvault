import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { relations } from 'drizzle-orm';

export const verificationTokenType = pgEnum("type", ["EMAIL_VERIFICATION", "PASSWORD_RESET"]);

export const verificationTokenTable = pgTable("verify_token", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    userId: t.uuid("userId").references(() => UserTable.id, { onDelete: "cascade" }).notNull(),
    token: t.varchar('token', { length: 255 }).notNull().unique(),
    type: verificationTokenType("type").default("EMAIL_VERIFICATION").notNull(),
    expiresAt: t.timestamp("expiresAt").defaultNow(),
    createdAt: t.timestamp("createdAt").defaultNow()
}));

export const verificationTokenRelations = relations(verificationTokenTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [verificationTokenTable.userId],
        references: [UserTable.id]
    })
}));