'use client';

import Image from 'next/image';
import { TextToSpeech } from './TextToSpeech';
export default function Home() {
  return (
    <div>
      <Image src="/huggingFace.svg" alt="Hugging Face" width={95} height={88} />
      <TextToSpeech />
    </div>
  );
}
