import { db } from "@/db";
import { wordsTable as table } from "@/db/schema";
import {and, asc, desc, eq} from "drizzle-orm";
import { WordService } from "@/lib/defs";
import {headers} from "next/headers";

// Implement the WordService interface with proper error handling and transaction support
export const wordService: WordService = {
    async addWord(word: string, ip: string): Promise<void> {
        try {
            await db.insert(table).values({
                word,
                ip,
            });
        } catch (error) {
            console.error("Failed to add word:", error);
            throw new Error("Failed to save word to database");
        }
    },

    async getActiveWords() {
        const headerList = await headers();
        const ip = headerList.get('x-forwarded-for');
        try {
            return await db
                .select({
                    id: table.id,
                    word: table.word,
                })
                .from(table)
                .where(and(eq(table.status, "active"), eq(table.ip, ip ?? "")))
                .orderBy(desc(table.createdAt));
        } catch (error) {
            console.error("Failed to get active words:", error);
            throw new Error("Failed to retrieve words from database");
        }
    },

    async deactivateWord(id: number): Promise<void> {
        try {
            await db
                .update(table)
                .set({
                    status: "inactive",
                })
                .where(eq(table.id, id));
        } catch (error) {
            console.error("Failed to deactivate word:", error);
            throw new Error("Failed to update word status");
        }
    },
};