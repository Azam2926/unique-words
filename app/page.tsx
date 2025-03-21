import WordForm from "@/components/form";
import {wordService} from "@/services/wordService";
import {addWordAction} from "@/lib/actions";

export default async function Home() {
    // Get words through the service layer
    const words = await wordService.getActiveWords();

    return (
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-4 md:p-8 gap-8">
            <main className="flex flex-col gap-6 max-w-2xl mx-auto w-full">

                <WordForm onSubmit={addWordAction}/>

                {words.length > 0 ? (
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">Kiritilgan so&#39;zlar</h2>
                        <ul className="space-y-2">
                            {words.map((word) => (
                                <li key={word.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
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