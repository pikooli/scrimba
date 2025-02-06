'use server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// const MAX_TOKENS = 1000;
const model = 'gpt-3.5-turbo';
const systemPrompt: OpenAI.ChatCompletionMessageParam = {
  role: 'system',
  content: `You are a translator. Translate the text to the language selected.`,
};

export const translateText = async (data: {
  textToTranslate: string;
  language: string;
}) => {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        systemPrompt,
        {
          role: 'user',
          content: `text: ${data.textToTranslate}, language: ${data.language}`,
        },
      ],
      //   max_tokens: MAX_TOKENS,
      temperature: 1.1,
      // stop: ['3.'], // stop when encountering this string
      // frequency_penalty: 0.5, // penalize the model for repeating the same line
      // presence_penalty: 0.5, // penalize the model for repeating the same line
    });
    console.log('data', data);
    console.log('response', response.choices[0].message.content);
    return response.choices[0].message.content || null;
  } catch (err) {
    console.error('error: ', err);
    return null;
  }
};
