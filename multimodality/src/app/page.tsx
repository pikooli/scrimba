'use client';

import { generateImage, analyseImage } from '@/actions/openAi';
import { useState } from 'react';
import Image from 'next/image';

const imgURL = "https://scrimba.com/links/egg-image";

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('')
  const [analysePrompt, setAnalysePrompt] = useState('I found this small egg on the ground in South Florida during spring. What type of bird could it be from?')
  const [analyseResponse, setAnalyseResponse] = useState('')
  const handleGenerateImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await generateImage(prompt);
    console.log('response', response);
    if (response) {
      setImageUrl(response);
    }
  };
  const handleAnalyseImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await analyseImage(analysePrompt, imgURL);
    console.log('response', response);
    if (response) {
      setAnalyseResponse(response);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <form onSubmit={handleGenerateImage} className='flex flex-col items-center justify-center mt-5 border-2 border-gray-300 rounded-md p-2'>
        <input className='border-2 border-gray-300 rounded-md p-2' type="text" placeholder="Enter a prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button className='bg-blue-500 text-white p-2 rounded-md' type='submit'>Generate Image</button>
      </form>
      {imageUrl && <Image src={imageUrl} alt="Generated Image" width={1024} height={1024} />}
      <form onSubmit={handleAnalyseImage} className='flex flex-col items-center justify-center mt-5 border-2 border-gray-300 rounded-md p-2'>
        <Image src={imgURL} alt="Image to analyze" width={700} height={700} />
      <input className='border-2 border-gray-300 rounded-md p-2' type="text" placeholder="Enter a prompt" value={analysePrompt} onChange={(e) => setAnalysePrompt(e.target.value)} />
      <button className='bg-blue-500 text-white p-2 rounded-md' type='submit'>Analyse Image</button>
      <p>{analyseResponse}</p>
      </form>
    </div>
  );
}
