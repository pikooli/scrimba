'use client';

import { useEffect, useState } from 'react';
import { HfInference } from '@huggingface/inference';

const model = 'espnet/kan-bayashi_ljspeech_vits';
const textToSpeech = "It's an exciting time to be an AI engineer";

export function TextToSpeech() {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const inference = new HfInference(process.env.NEXT_PUBLIC_HF_API_KEY);
    inference
      .textToSpeech({
        model,
        inputs: textToSpeech,
      })
      .then((result) => {
        const audioBlob = new Blob([result], { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setResult(url);
      });
  }, []);

  return (
    <div>
      <p className="rounded-lg bg-gray-100 p-4 text-lg font-medium text-gray-800">
        Text to translate: {textToSpeech}
      </p>
      {result && <audio src={result} controls />}
    </div>
  );
}
