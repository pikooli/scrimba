'use client';
import Image from 'next/image';

export const Waiting = ({ loadingMessage }: { loadingMessage: string }) => {
  return (
    <section className="flex h-[400px] flex-col items-center justify-center text-center">
      <Image src="/svgs/loader.svg" alt="loading" width={340} height={340} />
      <div> {loadingMessage}</div>
    </section>
  );
};
