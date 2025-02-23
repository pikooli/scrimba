'use server'

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function splitText(text: string) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 250,
      chunkOverlap: 35,
    });
    const documents = await splitter.createDocuments([text]);
    return JSON.stringify(documents);
  } catch (err) {
    console.error(err)
    throw err
  }
}
