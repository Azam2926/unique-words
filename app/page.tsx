import WordForm from "@/components/form";
import { wordService } from "@/services/wordService";
import { addWordAction } from "@/lib/actions";

export default async function Home() {
  // Get words through the service layer
  const words = await wordService.getActiveWords();

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] gap-8 p-4 md:p-8">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <WordForm onSubmit={addWordAction} />

        {words.length > 0 ? (
          <div className="mt-4">
            <h2 className="mb-2 text-xl font-semibold">
              Kiritilgan so&#39;zlar
            </h2>
            <ul className="space-y-2">
              {words.map((word) => (
                <li
                  key={word.id}
                  className="rounded bg-gray-50 p-2 dark:bg-gray-800"
                >
                  {word.word}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">No words submitted yet.</p>
        )}
      </main>
    </div>
  );
}
