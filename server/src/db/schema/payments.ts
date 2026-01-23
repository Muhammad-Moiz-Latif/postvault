import { pgTable } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { pgEnum } from "drizzle-orm/pg-core";
import { OrderTable } from "./order";

export const PaymentStatus = pgEnum("status", ["PENDING", "FAILED", "REFUNDED", "PAID"]);

export const PaymentTable = pgTable("payments", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    orderId: t.uuid("orderId").references(() => OrderTable.id).notNull(),
    clientId: t.uuid("clientId").references(() => UserTable.id).notNull(),
    provider: t.varchar("provider", { length: 50 }).default("STRIPE"),
    providerPaymentId: t.varchar("providerPaymentId", { length: 255 }).unique(),
    currency: t.varchar("currency", { length: 10 }).default("usd"),
    amount: t.integer("amount").default(0).notNull(),
    status: PaymentStatus("status").default("PENDING").notNull(),
    createdAt: t.timestamp("createdAt").defaultNow(),
    updatedAt: t.timestamp("updatedAt").defaultNow()
}));