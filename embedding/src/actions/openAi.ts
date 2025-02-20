'use server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const model = 'text-embedding-ada-002';

const data = [
  "Beyond Mars (1 hr 15 min): Join space enthusiasts as they speculate about extraterrestrial life and the mysteries of distant planets.",
  "Jazz under stars (55 min): Experience a captivating night in New Orleans, where jazz melodies echo under the moonlit sky.",
  "Mysteries of the deep (1 hr 30 min): Dive with marine explorers into the uncharted caves of our oceans and uncover their hidden wonders.",
  "Rediscovering lost melodies (48 min): Journey through time to explore the resurgence of vinyl culture and its timeless appeal.",
  "Tales from the tech frontier (1 hr 5 min): Navigate the complex terrain of AI ethics, understanding its implications and challenges.",
  "The soundscape of silence (30 min): Traverse the globe with sonic explorers to find the world's most serene and silent spots.",
  "Decoding dreams (1 hr 22 min): Step into the realm of the subconscious, deciphering the intricate narratives woven by our dreams.",
  "Time capsules (50 min): Revel in the bizarre, endearing, and profound discoveries that unveil the quirks of a century past.",
  "Frozen in time (1 hr 40 min): Embark on an icy expedition, unearthing secrets hidden within the majestic ancient glaciers.",
  "Songs of the Sea (1 hr): Dive deep with marine biologists to understand the intricate whale songs echoing in our vast oceans."
]; 

export const createEmbedding = async () => {
  'use server';
  try {
    const response = await openai.embeddings.create({
      model,
      input: data,
    });
    console.log('data', data);
    console.log('response', response);
    const embeddings= response.data;

    const hash = data.map((item, idx) => {
      return {
        id: idx,
        text: item,
        embedding: embeddings.find((embedding) => embedding.index === idx)
          ?.embedding,
      };
    });
    const documents = hash.map((item) => {
      return {
        content: item.text,
        embedding: item.embedding,
      };
    });
    await supabase.from('documents').insert(documents);
    return hash;
  } catch (err) {
    console.error('error: ', err);
    return 'Unable to access AI. Please refresh and try again' + err;
  }
};
