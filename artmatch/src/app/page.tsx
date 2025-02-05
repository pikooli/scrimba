"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { generateImage } from "@/actions/openAi";


const ImageContainer = ({image, loading, error}: {image: string, loading: boolean, error: string}) => {
  if (loading) {
    return (<Image src="/svgs/loader.svg" alt="loading" width={280} height={280} />)
  }
  if (error) {
    return (<h2 className="font-[Verdana] text-lg mt-12 mx-10 text-center font-normal tracking-[.04em]">
          {error}
        </h2>)
  }
  return (
    <div className="bg-black border-[20px] border-[#eee] border-b-[rgb(111,78,55)] border-l-[rgb(90,68,50)] border-r-[rgb(90,68,40)] border-t-[rgb(101,78,55)] rounded-[2px] shadow-[0_0_5px_0_rgba(0,0,0,0.25)_inset,_0_5px_10px_5px_rgba(0,0,0,0.25)] box-border inline-block relative text-center w-[280px] h-[280px]">
      {image ? <Image src={`data:image/jpeg;base64,${image}`} alt="Generated Image" width={280} height={280} /> : <h2 className="font-[Verdana] text-lg mt-12 mx-10 text-center font-normal tracking-[.04em]">
          Describe a famous painting without saying its name or the artist!
        </h2>}
    </div>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateImage = useCallback(async () => {
    setLoading(true);
    const imageData = await generateImage(prompt);
    if(imageData) {
      setImage(imageData);
    }else {
      setError('Failed to generate image');
    }
    setLoading(false);
  }, [prompt]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.currentTarget.value);
  }

  return (
    <div className="font-[Verdana] flex flex-col items-center justify-center h-screen gap-5 text-[whitesmoke]">
      <h1 className="font-bold text-2xl mt-5">ArtMatch 👩‍🎨</h1>
        <ImageContainer image={image} loading={loading} error={error} />
        <textarea placeholder="A woman with long brown hair..." id="instruction" 
        className="w-[280px] box-border text-sm p-[8px_15px] rounded-[5px] resize-none h-[3.5em] placeholder:text-gray-600 text-gray-600"
        value={prompt}
        onChange={handleChange}
        />
        <button className="mt-2 bg-[#b2835a] w-[280px] py-[15px] text-white border-none rounded-[5px] tracking-[1.1px]" id="submit-btn" onClick={handleGenerateImage}>
          Create</button>
    </div>
  );
}

// text prompt
//A 16th-century woman with long brown hair standing in front of a green vista with cloudy skies. She's looking at the viewer with a faint smile on her lips.
