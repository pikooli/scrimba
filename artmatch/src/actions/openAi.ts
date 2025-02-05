'use server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// const MODEL = 'dall-e-3';
// const SIZE = '1024x1024';
const MODEL = 'dall-e-2';
const SIZE = '256x256';
const N = 1;
const STYLE = 'vivid';
// const RESPONSE_FORMAT = "url";
const RESPONSE_FORMAT = "b64_json";

export const generateImage = async (prompt: string) => {
  try {
    const response = await openai.images.generate({
      model: MODEL,
      prompt: prompt,
      n: N,
      size: SIZE,
      style: STYLE,
      response_format: RESPONSE_FORMAT,
    });
    if (response.data[0].b64_json) {
      return response.data[0].b64_json;
    }  
    return null;
  } catch (err) {
    console.error('error: ', err);
    return null;
  }
};
