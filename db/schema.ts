import {integer, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {InferSelectModel} from "drizzle-orm";

export const wordsTable = pgTable("words", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    word: varchar({length: 255}).notNull(),
    ip: text('ip').notNull(),
    status: text({enum: ["active", "inactive"]}).notNull().default("active"),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export type Word = InferSelectModel<typeof wordsTable>