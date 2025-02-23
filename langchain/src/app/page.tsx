'use client'

import { useEffect, useState } from "react"
import { splitText } from "@/actions/langchain"
import { Document } from "@langchain/core/documents"
import { createEmbedding } from "@/actions/openAi"
import { insertDocument, searchDocument } from "@/actions/supabase"
import { Database } from '@/types/supabase'

export default function Home() {
  const [texts, setTexts] = useState<string>('')
  const [chunks, setChunks] = useState<Document[]>([])
  const [search, setSearch] = useState<string>('')
  const [results, setResults] = useState<Database['public']['Functions']['match_langchain_documents']['Returns']>([])

  useEffect(() => {
    fetch('/data.txt')
      .then(res => res.text())
      .then(data => setTexts(data))
  }, [])  

  useEffect(() => {
    if (texts) {
      splitText(texts).then((chunks) => {
        setChunks(JSON.parse(chunks))
        console.log("chunks",JSON.parse(chunks))
      })
    }
  }, [texts])

  const insertDocuments = async () => {
    const embeddings = await createEmbedding(chunks.map((chunk) => chunk.pageContent))
    console.log("embeddings",embeddings)
    await insertDocument(embeddings)
  }

  const searchDocuments = async () => {
    const embeddings = await createEmbedding([search])
    const results = await searchDocument(embeddings[0].embedding)
    console.log("results",results)
    setResults(results?.data || [])
  }

  return (
   <div className="grid grid-cols-1 gap-4 mt-6 container mx-auto">
    <div>
      <button disabled className="bg-blue-500 text-white p-2 rounded-lg" onClick={insertDocuments}>Insert Documents ( already insered )</button>
    </div>
    <div>
      <input type="text" className="border border-gray-200 p-2 rounded-lg" onChange={(e) => setSearch(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={searchDocuments}>Search Documents</button>
      <div className="border border-gray-200 p-4 rounded-lg ">  
        <label className="text-sm text-gray-500">Results</label>
        {results.map((result) => (
          <div key={result.id}>
            <p>{result.content}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="border border-gray-200 p-4 rounded-lg ">
    <label className="text-sm text-gray-500">Original text</label>
    <p className="text-sm text-gray-500 border border-gray-200 p-4 rounded-lg whitespace-pre-wrap h-96 overflow-y-auto" >{texts}</p>
    </div>
    <div className="border border-gray-200 p-4 rounded-lg ">
    <label className="text-sm text-gray-500">Chunks</label>  
    <div className="flex flex-col gap-4 h-96 overflow-y-auto">
    {chunks.map((chunk, id) => (
      <div className="bg-white p-4 rounded-lg border border-gray-200" key={id}>
        <p className="text-sm text-gray-500">content: {chunk.pageContent}</p>
        <p className="text-sm text-gray-500">metadata: {JSON.stringify(chunk.metadata)}</p>
      </div>
    ))}
    </div>
    </div>
   </div>
  );
}
