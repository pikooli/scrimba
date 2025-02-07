'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HfInference } from '@huggingface/inference';

const model = 'HuggingFaceH4/zephyr-7b-beta';

export default function Home() {
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const inference = new HfInference(process.env.NEXT_PUBLIC_HF_API_KEY);
    inference
      .textGeneration({
        model,
        inputs: 'Hello, how are you?',
      })
      .then((result) => {
        setResult(result.generated_text);
        console.log(result);
      });
  }, []);

  return (
    <div>
      <Image src="/huggingFace.svg" alt="Hugging Face" width={95} height={88} />
      <p className="rounded-lg bg-gray-100 p-4 text-lg font-medium text-gray-800">
        {result}
      </p>
    </div>
  );
}
