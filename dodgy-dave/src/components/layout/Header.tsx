import Image from 'next/image';

export function Header() {
  return (
    <header className="flex justify-center bg-black p-[1em]">
      <Image
        src="/images/logo-dave-text.png"
        alt="logo"
        width={340}
        height={100}
        priority
      />
    </header>
  );
}
