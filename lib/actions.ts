"use server";

import {wordService} from "@/services/wordService";
import {revalidatePath} from "next/cache";
import {headers} from "next/headers";
import {userInputSchema} from "@/lib/defs";
import {db} from "@/db";
import {wordsTable} from "@/db/schema";

export async function addWordAction(formData: FormData) {
    try {
        const wordInput = formData.get("word");
        console.log('wordInput', wordInput)
        if (typeof wordInput !== "string") {
            throw new Error("Invalid word format");
        }

        const result = userInputSchema.safeParse({word: wordInput});

        if (!result.success) {
            const errorMessage = result.error.errors[0]?.message || "Invalid input";
            throw new Error(errorMessage);
        }

        const headersList = await headers()
        let ip = headersList.get("x-forwarded-for") || "Unknown IP";

        if (ip.startsWith("::ffff:")) {
            ip = ip.replace("::ffff:", "");
        }


        const values = [...new Set(result.data.word.match(/\b[^\d\W][\w‘’']+\b/g) || [])]
            .filter(value => value)
            .map(value => ({
                word: value.replace(/\s/g, ""),
                ip,
            }));

        if (!values) throw new Error("Error adding word");

        await db.insert(wordsTable).values(values);

        revalidatePath("/");

        return {success: true};
    } catch (error) {
        console.error("Add word action error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to add word"
        };
    }
}

export async function deactivateWordAction(id: number) {
    try {
        await wordService.deactivateWord(id);
        revalidatePath("/");
        return {success: true};
    } catch (error) {
        console.error("Deactivate word action error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to deactivate word"
        };
    }
}