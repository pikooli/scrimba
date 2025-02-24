'use server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { tools } from '@/tools';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const model = 'gpt-3.5-turbo';

export const chatCompletion = async (
  messages: ChatCompletionMessageParam[]
) => {
  const runner = openai.beta.chat.completions
    .runTools({
      model,
      messages: messages,
      tools: tools,
    })
    .on('totalUsage', (usage) => {
      console.log('usage', JSON.stringify(usage));
    })
    .on('message', (message) => {
      console.log('message', JSON.stringify(message));
    });
  const finalContent = await runner.finalContent();
  console.log('finalContent', JSON.stringify(finalContent));
  return finalContent;
};

export const agent = async (messages: ChatCompletionMessageParam[]) => {
  const response = await chatCompletion(messages);
  console.log('response =========', JSON.stringify(response));
  return response;
};
