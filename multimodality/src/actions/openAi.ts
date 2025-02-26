'use server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const generateImage = async (
  prompt: string
) => {
  console.log('prompt',prompt)
  const response = await openai.images.edit({
      image: fs.createReadStream(path.join(process.cwd(), 'public', 'building.png')),
      mask: fs.createReadStream(path.join(process.cwd(), 'public', 'mask.png')),
      prompt,
      response_format: "b64_json",
  });
  console.log('response',response)
  return `data:image/png;base64,${response.data[0].b64_json}`;
};



export const analyseImage = async (prompt: string, imgURL: string) => {
  console.log('prompt',prompt)
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: imgURL
            }
          }
        ]
      }
    ]
  });
  console.log('response',response)
  return response.choices[0].message.content;
} 