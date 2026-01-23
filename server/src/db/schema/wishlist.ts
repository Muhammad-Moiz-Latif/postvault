import { pgTable, index, uniqueIndex } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { DeviceTable } from "./devices";
import { primaryKey } from "drizzle-orm/pg-core";

export const WishlistTable = pgTable("wishlist", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    clientId: t.uuid("clientId").references(() => UserTable.id).notNull(),
    createdAt: t.timestamp("createdAt").defaultNow(),
    updatedAt: t.timestamp("updatedAt").defaultNow()
}), table => {
    return {
        uniqueWishlistPerUser: uniqueIndex("uniqueWishlistPerUser").on(table.clientId)
    }
});


export const WishlistItemsTable = pgTable("wishlist-items", (t) => ({
    wishlistId: t.uuid("wishlistId").references(() => WishlistTable.id).notNull(),
    deviceId: t.uuid("deviceId").references(() => DeviceTable.id).notNull(),
    quantity: t.integer("quantity").default(0),
    addedAt: t.timestamp("addedAt").defaultNow()
}), table => {
    return {
        pK: primaryKey({ columns: [table.wishlistId, table.deviceId] }),
        wishlistIndex: index("wishlistIndex").on(table.wishlistId),
        deviceIndex: index("wishlistdeviceIndex").on(table.deviceId)
    }
});