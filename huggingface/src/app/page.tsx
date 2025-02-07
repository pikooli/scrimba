'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HfInference } from '@huggingface/inference';

const model = 'facebook/mbart-large-50-many-to-many-mmt'; // score 15 classes

const textToTranslate = "It's an exciting time to be an AI engineer";

export default function Home() {
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const inference = new HfInference(process.env.NEXT_PUBLIC_HF_API_KEY);
    inference
      .translation({
        model,
        inputs: textToTranslate,
        parameters: {
          src_lang: 'en_XX',
          tgt_lang: 'fr_XX',
        },
      })
      .then((result) => {
        setResult(JSON.stringify(result));
        console.log(result);
      });
  }, []);

  return (
    <div>
      <Image src="/huggingFace.svg" alt="Hugging Face" width={95} height={88} />
      <p className="rounded-lg bg-gray-100 p-4 text-lg font-medium text-gray-800">
        Text to translate: {textToTranslate}
      </p>
      <p className="rounded-lg bg-gray-100 p-4 text-lg font-medium text-gray-800">
        translation: {result}
      </p>
    </div>
  );
}
