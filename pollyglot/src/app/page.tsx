'use client';

import { useState } from 'react';
import Image from 'next/image';
import { translateText } from '@/actions/openAi';

const languages = [
  { key: 'fr', name: 'French', flag: 'fr-flag.png' },
  { key: 'es', name: 'Spanish', flag: 'sp-flag.png' },
  { key: 'jp', name: 'Japanese', flag: 'jpn-flag.png' },
];

const TranslateTextForm = ({
  setTranslatedText,
  setTextToTranslate,
  textToTranslate,
}: {
  setTranslatedText: (text: string) => void;
  setTextToTranslate: (text: string) => void;
  textToTranslate: string;
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages[0].key
  );
  const handleTranslate = async () => {
    const translatedText = await translateText({
      textToTranslate,
      language: selectedLanguage,
    });
    console.log(translatedText);
    if (translatedText) {
      setTranslatedText(translatedText);
    }
  };

  return (
    <>
      <h1 className="text-center text-[20px] font-bold text-[#035A9D]">
        Text to translate 👇
      </h1>
      <textarea
        className="h-[118px] w-full resize-none rounded-md bg-[#EFF0F4] p-2 font-bold text-[#333333] placeholder:text-[#333333]"
        placeholder="How are you?"
        value={textToTranslate}
        onChange={(e) => setTextToTranslate(e.target.value)}
      ></textarea>
      <h1 className="text-center text-[20px] font-bold leading-[30px] text-[#035A9D]">
        Select language 👇
      </h1>
      <div className="ml-7 grid h-[118px] grid-cols-1 gap-2">
        {languages.map((language) => (
          <div className="flex items-center gap-2" key={language.key}>
            <input
              type="radio"
              id={language.key}
              name="language"
              value={language.key}
              checked={selectedLanguage === language.key}
              onChange={() => setSelectedLanguage(language.key)}
              className="accent-[#035A9D]"
            />
            <label
              htmlFor={language.key}
              className="flex items-center gap-2 text-[20px] font-bold"
            >
              {language.name}
              <span>
                <Image
                  src={`/images/${language.flag}`}
                  width={25}
                  height={25}
                  alt={language.flag}
                  className="border border-black"
                />
              </span>
            </label>
          </div>
        ))}
      </div>
      <button
        className="w-full rounded-md bg-[#035A9D] p-2 text-[24px] font-bold text-white"
        onClick={handleTranslate}
      >
        Translate
      </button>
    </>
  );
};
const TranslateTextResult = ({
  translatedText,
  textToTranslate,
  setTranslatedText,
}: {
  translatedText: string;
  setTranslatedText: (text: string) => void;
  textToTranslate: string;
}) => {
  return (
    <>
      <h1 className="text-center text-[20px] font-bold text-[#035A9D]">
        Original text 👇
      </h1>
      <textarea
        className="h-[118px] w-full resize-none rounded-md bg-[#EFF0F4] p-2 font-bold text-[#333333] placeholder:text-[#333333]"
        value={textToTranslate}
        disabled
      ></textarea>
      <h1 className="text-center text-[20px] font-bold leading-[30px] text-[#035A9D]">
        Your translation 👇
      </h1>
      <textarea
        className="h-[118px] w-full resize-none rounded-md bg-[#EFF0F4] p-2 font-bold text-[#333333] placeholder:text-[#333333]"
        value={translatedText}
        disabled
      ></textarea>
      <button
        className="w-full rounded-md bg-[#035A9D] p-2 text-[24px] font-bold text-white"
        onClick={() => setTranslatedText('')}
      >
        Start Over
      </button>
    </>
  );
};

export default function Home() {
  const [translatedText, setTranslatedText] = useState<string>('');
  const [textToTranslate, setTextToTranslate] = useState<string>('');

  return (
    <div className="mx-auto flex max-w-[390px] flex-col gap-4">
      <header className="flex h-[213px] items-center justify-center bg-[url('/images/worldmap.png')] bg-cover bg-center bg-no-repeat">
        <Image src="/images/parrot.png" width={95} height={85} alt="Parrot" />
        <div className="ml-4 flex flex-col gap-2">
          <h1 className="font-big-shoulders-display text-5xl font-extrabold text-green-400">
            PollyGlot
          </h1>
          <p className="font-poppins text-xs uppercase text-white">
            Perfect translations every time.
          </p>
        </div>
      </header>
      <main className="font-poppins mx-5 grid grid-cols-1 gap-8 rounded-lg border-4 border-[#252F42] px-4 py-6">
        {translatedText ? (
          <TranslateTextResult
            translatedText={translatedText}
            setTranslatedText={setTranslatedText}
            textToTranslate={textToTranslate}
          />
        ) : (
          <TranslateTextForm
            setTranslatedText={setTranslatedText}
            setTextToTranslate={setTextToTranslate}
            textToTranslate={textToTranslate}
          />
        )}
      </main>
    </div>
  );
}
