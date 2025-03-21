import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { wordsTable } from './schema';

export const db = drizzle(process.env.DATABASE_URL!);

// async function main() {
//     const word: typeof wordsTable.$inferInsert = {
//         word: 'Assalomu',
//         ip: '192.168.10.123',
//     };
//
//     await db.insert(wordsTable).values(word);
//     console.log('New word created!')
//
//     const words = await db.select().from(wordsTable);
//     console.log('Getting all words from the database: ', words)
//     /*
//     const words: {
//       id: number;
//       name: string;
//       age: number;
//       email: string;
//     }[]
//     */
//
//     await db
//         .update(wordsTable)
//         .set({
//             ip: "192.168.10.124",
//         })
//         .where(eq(wordsTable.word, word.word));
//     console.log('word info updated!')
//
// }
//
// main();
