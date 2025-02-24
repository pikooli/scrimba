'use server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { getCurrentWeather, getLocation, tools } from '@/tools';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const model = 'gpt-3.5-turbo';

export const chatCompletion = async (
  messages: ChatCompletionMessageParam[]
) => {
  const response = await openai.chat.completions.create({
    model,
    messages: messages,
    tools: tools,
  });
  console.log('response', JSON.stringify(response));
  return response;
};

const invokeTools = async (actionName: string, parameters: any) => {
  if (actionName === 'getCurrentWeather') {
    return await getCurrentWeather(parameters);
  }
  if (actionName === 'getLocation') {
    return await getLocation();
  }
  return null;
};

export const agent = async (
  messages: ChatCompletionMessageParam[]
): Promise<string> => {
  const response = await chatCompletion(messages);
  if (response.choices[0].message.tool_calls?.length) {
    const newMessages: ChatCompletionMessageParam[] = [
      ...messages,
      response.choices[0].message,
    ];
    const toolCallsPromises = response.choices[0].message.tool_calls?.map(
      async (toolCall) => {
        console.log('toolCall =========', toolCall);
        const toolResponse = await invokeTools(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments)
        );
        console.log('toolResponse =========', toolResponse);
        if (toolResponse) {
          newMessages.push({
            role: 'tool',
            content: toolResponse,
            tool_call_id: toolCall.id,
          });
        }
      }
    );
    await Promise.all(toolCallsPromises);
    const responseAfterTool = await agent(newMessages);
    console.log('responseAfterTool =========', responseAfterTool);
    return responseAfterTool;
  }

  console.log('response =========', JSON.stringify(response));
  return response.choices[0].message.content ?? '';
};
