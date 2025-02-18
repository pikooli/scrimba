'use client';

import Image from 'next/image';
import { ImageToImage } from '@/components/ImageToImage';

export default function Home() {
  return (
    <div>
      <Image src="/huggingFace.svg" alt="Hugging Face" width={95} height={88} />
      <ImageToImage />
    </div>
  );
}
