import { z } from "zod";

// Improved validation with more specific error messages
export const userInputSchema = z.object({
    word: z
        .string()
        .min(1, { message: "Word cannot be empty" })
        .max(8196, { message: "Word cannot exceed 8196 characters" })
        // .regex(/^[a-zA-Z.\s]+$/, {
        //     message: "Word can only contain letters, and spaces",
        // })
        .transform((val) => val.trim()),
});

export type UserInputType = z.infer<typeof userInputSchema>;

// Add domain types for better type safety across the application
export type WordStatus = "active" | "inactive";

export interface WordEntity {
    id: number;
    word: string;
    ip: string;
    status: WordStatus;
    createdAt: Date;
}

// Define service functions for domain operations
export interface WordService {
    addWord(word: string, ip: string): Promise<void>;
    getActiveWords(): Promise<Pick<WordEntity, "id" | "word">[]>;
    deactivateWord(id: number): Promise<void>;
}