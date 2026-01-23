import { pgTable } from "drizzle-orm/pg-core";
import { DeviceTable } from "./devices";
import { relations } from "drizzle-orm";

export const Device_Images_Table = pgTable("device_images", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    url: t.varchar("url", { length: 255 }).notNull(),
    deviceId: t.uuid("deviceId").references(() => DeviceTable.id),
    isPrimary: t.boolean("isPrimary").default(true),
    createdAt: t.timestamp("createdAt").defaultNow()
}));

export const deviceImagesRelations = relations(Device_Images_Table, ({ one }) => ({
    device: one(DeviceTable, {
        fields: [Device_Images_Table.deviceId],
        references: [DeviceTable.id]
    })
}));