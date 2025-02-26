'use client';

import { generateImage } from '@/actions/openAi';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const handleGenerateImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await generateImage(prompt);
    console.log('response', response);
    if (response) {
      setImageUrl(response);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleGenerateImage}>
        <input className='border-2 border-gray-300 rounded-md p-2' type="text" placeholder="Enter a prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button className='bg-blue-500 text-white p-2 rounded-md' type='submit'>Generate Image</button>
      </form>
      {imageUrl && <Image src={imageUrl} alt="Generated Image" width={1024} height={1024} />}
    </div>
  );
}
