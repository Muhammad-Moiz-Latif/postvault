import { index, pgTable, primaryKey, pgEnum } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { WishlistTable } from "./wishlist";
import { DeviceTable } from "./devices";

export const OrderStatus = pgEnum("orderStatus", [
    "CREATED",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
]);

export const OrderTable = pgTable("orders", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    clientId: t.uuid("clientId").references(() => UserTable.id).notNull(),
    wishlistId: t.uuid("wishlistId").references(() => WishlistTable.id),
    createdAt: t.timestamp("createdAt").defaultNow(),
    status: OrderStatus("status").default("CREATED").notNull(),
    updatedAt: t.timestamp("updatedAt").defaultNow()
}));

export const OrderItemsTable = pgTable("order-items", (t) => ({
    orderId: t.uuid("orderId").references(() => OrderTable.id).notNull(),
    deviceId: t.uuid("deviceId").references(() => DeviceTable.id).notNull(),
    quantity: t.integer("quantity").default(0),
    addedAt: t.timestamp("addedAt").defaultNow()
}), table => {
    return {
        pK: primaryKey({ columns: [table.orderId, table.deviceId] }),
        orderIndex: index("orderIndex").on(table.orderId),
        deviceIndex: index("orderdeviceIndex").on(table.deviceId)
    }
});