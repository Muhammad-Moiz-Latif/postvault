import { pgTable, index } from "drizzle-orm/pg-core";
import { CategoryTable } from "./category";
import { relations } from "drizzle-orm";
import { Device_Images_Table } from "./device_images";

export const DeviceTable = pgTable("devices", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    name: t.varchar("name", { length: 255 }).notNull(),
    model: t.varchar("model", { length: 255 }).notNull(),
    year: t.integer("year").notNull(),
    price: t.numeric("price").notNull(),
    quantity: t.integer("quantity").default(0),
    categoryId: t.uuid("categoryId").references(() => CategoryTable.id).notNull(),
    createdAt: t.timestamp("createdAt").defaultNow(),
    updatedAt: t.timestamp("updatedAt").defaultNow()
}), table => {
    return {
        nameIndex: index("nameIndex").on(table.name),
        yearIndex: index("yearIndex").on(table.year)
    }
});

export const deviceUrlRelations = relations(DeviceTable, ({ many }) => ({
    images: many(Device_Images_Table)
}));


export const deviceRelations = relations(DeviceTable, ({ one }) => ({
    category: one(CategoryTable, {
        fields: [DeviceTable.categoryId],
        references: [CategoryTable.id]
    })
}));
