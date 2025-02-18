'use client';
import { useEffect, useState } from 'react';
import ImageNext from 'next/image';
import { HfInference } from '@huggingface/inference';

const model = 'stabilityai/stable-diffusion-xl-refiner-1.0';
// const model = 'ghoskno/Color-Canny-Controlnet-model';

export function ImageToImage() {
  const [result, setResult] = useState<string | null>(null);

  const inferenceFn = async () => {
    try {
      const inference = new HfInference(process.env.NEXT_PUBLIC_HF_API_KEY);
      const res = await fetch('/old-photo.jpeg');
      const blob = await res.blob();

      inference
        .imageToImage({
          model,
          inputs: blob,
          parameters: {
            negative_prompt: 'monochrome',
            prompt:
              'a colored photo of a couple of elderly people walking on the road',
          },
        })
        .then((result) => {
          console.log(result);
          const imageBlob = new Blob([result], { type: 'image/jpeg' });
          const url = URL.createObjectURL(imageBlob);
          setResult(url);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    inferenceFn();
  }, []);

  return (
    <div>
      <p className="rounded-lg bg-gray-100 p-4 text-lg font-medium text-gray-800">
        original image :
        <ImageNext
          src="/old-photo.jpeg"
          alt="Original Image"
          width={150}
          height={150}
        />
      </p>
      {result && (
        <ImageNext src={result} alt="Result Image" width={150} height={150} />
      )}
    </div>
  );
}
