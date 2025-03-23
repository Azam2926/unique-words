import { db } from "@/db";
import { wordsTable as table } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { WordService } from "@/lib/defs";
import fs from "fs";

// Implement the WordService interface with proper error handling and transaction support
export const wordService: WordService = {
  async addWords(values: { word: string; ip: string }[]): Promise<void> {
    for (const value of values) {
      await db.transaction(async (tx) => {
        try {
          await tx.insert(table).values(value);
        } catch (error) {}
      });
      addWord(value.word).then(console.log);
    }
  },

  async getActiveWords() {
    try {
      return await db
        .select({
          id: table.id,
          word: table.word,
        })
        .from(table)
        .where(eq(table.status, "active"))
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

export async function addWord(word: string) {
  // Basic validation (only allow letters, accents, and Uzbek apostrophes)
  if (!word || /\d|\W/.test(word.replace(/['ʻʼ-]/g, ""))) {
    return { success: false, message: "Invalid word format" };
  }

  // Path to OnlyOffice custom dictionary
  const dictPath = "/Users/admin/WebstormProjects/unique-words/db/db.dic";

  // Ensure file exists before reading
  if (!fs.existsSync(dictPath)) {
    fs.writeFileSync(dictPath, "custom\n", "utf8"); // First line should be "custom" for OnlyOffice
  }

  // Read the dictionary file
  const words = fs
    .readFileSync(dictPath, "utf8")
    .split("\n")
    .map((w) => w.trim());

  // Check if word already exists
  if (words.includes(word)) {
    return { success: false, message: "Word already exists" };
  }

  // Append the new word
  fs.appendFileSync(dictPath, `${word}\n`, "utf8");

  return { success: true, message: "Word added successfully!", word };
}

// Get file paths
const DICT_PATH =
  "/Users/admin/WebstormProjects/unique-words/db/onlyoffice/uz_Cyrl_UZ.dic";
const AFF_PATH =
  "/Users/admin/WebstormProjects/unique-words/db/onlyoffice/uz_Cyrl_UZ.aff";

// Function to read and parse the dictionary file
export async function getDictionaryWords() {
  if (!fs.existsSync(DICT_PATH)) {
    return { success: false, message: "Dictionary file not found!" };
  }

  // Read .dic file
  const lines = fs
    .readFileSync(DICT_PATH, "utf8")
    .split("\n")
    .map((line) => line.trim());
  if (lines.length === 0)
    return { success: false, message: "Empty dictionary file!" };

  const words = lines.slice(1).filter((word) => word.length > 0); // Ignore first line (word count)
  return { success: true, words };
}

// Function to read and parse affix rules
export async function getAffixRules() {
  if (!fs.existsSync(AFF_PATH)) {
    return { success: false, message: "Affix file not found!" };
  }

  // Read .aff file
  const lines = fs
    .readFileSync(AFF_PATH, "utf8")
    .split("\n")
    .map((line) => line.trim());
  const rules: {
    prefixes: { flag: string; add: string }[];
    suffixes: { flag: string; add: string }[];
  } = { prefixes: [], suffixes: [] };

  for (const line of lines) {
    if (line.startsWith("PFX")) {
      const parts = line.split(/\s+/);
      if (parts.length >= 4)
        rules.prefixes.push({ flag: parts[1], add: parts[3] });
    }
    if (line.startsWith("SFX")) {
      const parts = line.split(/\s+/);
      if (parts.length >= 4)
        rules.suffixes.push({ flag: parts[1], add: parts[3] });
    }
  }

  return { success: true, rules };
}
