'use server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const model = 'text-embedding-ada-002';

const DefaultMessages : ChatCompletionMessageParam[] = [{
  role: 'system',
  content: `You are an enthusiastic movies expert who loves recommending movies to people. 
  You will be given two pieces of information - some context about movies and a question. 
  Your main job is to formulate a short answer to the question using the provided context. 
  If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer."
  Please do not make up the answer.` 
},
]

export const getChatCompletion = async (text: string, question: string) => {
  'use server';
  console.log("text",text)
  console.log("question",question)
  const newMessages :ChatCompletionMessageParam[]= [...DefaultMessages, {
    role: 'user',
    content: `Context: ${text}\n\nQuestion: ${question}`
  }];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: newMessages,
    temperature: 0.5,
    frequency_penalty: 0.5,
  });
  return response.choices[0].message.content;
}

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
