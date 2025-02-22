'use server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const model = 'text-embedding-ada-002';


export const createEmbedding = async (data: string[]) => {
  'use server';
  try {
    const response = await openai.embeddings.create({
      model,
      input: data,
    });
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
        embedding: item.embedding || [],
      };
    });
    return documents;
  } catch (err) {
    console.error('error: ', err);
    return [];
  }
};
