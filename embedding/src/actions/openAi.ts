'use server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const model = 'text-embedding-ada-002';

const data = [
  "Beyond Mars: speculating life on distant planets.",
  "Jazz under stars: a night in New Orleans' music scene.",
  "Mysteries of the deep: exploring uncharted ocean caves.",
  "Rediscovering lost melodies: the rebirth of vinyl culture.",
  "Tales from the tech frontier: decoding AI ethics.",
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
    console.log('hash', hash);
    return hash;
  } catch (err) {
    console.error('error: ', err);
    return 'Unable to access AI. Please refresh and try again' + err;
  }
};
