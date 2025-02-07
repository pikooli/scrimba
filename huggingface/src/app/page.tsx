'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HfInference } from '@huggingface/inference';

// const model = 'distilbert-base-uncased-finetuned-sst-2-english'; // only score 2 classes
const model = 'SamLowe/roberta-base-go_emotions'; // score 15 classes

const textToClassify =
  "I just bought a new camera. It's the best camera I've ever owned!";

export default function Home() {
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const inference = new HfInference(process.env.NEXT_PUBLIC_HF_API_KEY);
    inference
      .textClassification({
        model,
        inputs: textToClassify,
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
        Text to classify: {textToClassify}
      </p>
      <p className="rounded-lg bg-gray-100 p-4 text-lg font-medium text-gray-800">
        classification: {result}
      </p>
    </div>
  );
}
