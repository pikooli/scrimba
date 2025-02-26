'use server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const model = 'dall-e-3';
// const model = 'dall-e-2';

export const generateImage = async (
  prompt: string
) => {
  const response = await openai.images.generate({
    model,
    prompt,
    n: 1,
    size: '1024x1024',
    response_format: "b64_json",
    quality: "hd",
    style: "vivid"
  });
  console.log('response',response)
  return `data:image/png;base64,${response.data[0].b64_json}`;
};
