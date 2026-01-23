import { relations } from 'drizzle-orm';
import { pgTable, index } from 'drizzle-orm/pg-core';
import { DeviceTable } from './devices';

export const CategoryTable = pgTable("categories", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    name: t.varchar("name", { length: 255 }).notNull().unique(),
    createdAt: t.timestamp().defaultNow()
}), table => {
    return {
        categoryNameIndex: index("categoryNameIndex").on(table.name)
    }
});

export const categoryRelations = relations(CategoryTable, ({ many }) => ({
    devices: many(DeviceTable)
}));