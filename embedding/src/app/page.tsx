'use client';
import { createEmbedding } from '../actions/openAi';
import { insertDocument } from '../actions/supabase';

export default function Home() {
  const handleClick = async () => {
    const documents = await createEmbedding();
    const result = await insertDocument(documents);
    console.log(result);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={handleClick}>Create Embedding</button>

    </div>
  );
}
