// 'use server'

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function splitText() {
    const file = await fetch('/popcast.txt')
    const text = await file.text()
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 150,
      chunkOverlap: 15,
    });
    const documents = await splitter.createDocuments([text]);
    return documents;
}
