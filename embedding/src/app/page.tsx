'use client';
import { useState } from 'react';
import { createEmbedding } from '../actions/openAi';
import { insertDocument, searchDocument } from '../actions/supabase';
import { data } from '@/data';
import { Database } from '@/types/supabase';

export default function Home() {
  const [resultSearch, setResultSearch] = useState<Database['public']['Functions']['match_documents']['Returns']>([]);
  const [searchQuery , setSearchQuery] = useState<string>('Animals');
  const handleClick = async () => {
    const documents = await createEmbedding(data);
    const result = await insertDocument(documents);
    console.log(result);
  };

  const handleSearch = async () => {
    const documents = await createEmbedding([searchQuery]);
    if (documents.length > 0) {
      console.log('documents',documents);
      const result = await searchDocument(documents[0].embedding);
      console.log(result);
      setResultSearch(result?.data ?? []);
    }
  };

  return (
    <div className="container mx-auto grid grid-cols-2 gap-4 mt-10">
      <div className='card grid grid-cols-1 gap-4 border-2 border-gray-300 p-2 rounded-md'>
        <h1 className='first-letter:capitalize text-lg font-bold'>Embedding Data : </h1>
        <section className='grid grid-cols-1 gap-4'>
          {data.map((item) => (
            <div key={item} className='border-2 border-gray-300 p-2 rounded-md'>
              <p className='first-letter:capitalize'>{item}</p>
            </div>
          ))}
        </section>
        <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleClick}>Create Embedding</button>
      </div>
      <div className='card border-2 border-gray-300 p-2 rounded-md'>
        <div className='grid grid-cols-1 gap-4'>
        <label className='first-letter:capitalize text-lg font-bold'>Search</label>
        <input className='border-2 border-gray-300 p-2 rounded-md' onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search...'
        value={searchQuery}></input>
        <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleSearch}>Search</button>
      </div>
      <div className='grid grid-cols-1 gap-4 mt-4'>
        {resultSearch.map((item) => (
            <div key={item.id} className='border-2 border-gray-300 p-2 rounded-md'>
              <p className='first-letter:capitalize'>content : {item.content}</p>
              <p className='first-letter:capitalize'>similarity : {item.similarity}</p>
            </div>
        ))}
      </div>
      </div>
    </div>
  );
}
