'use client'

import { useEffect, useState } from "react"
import { splitText } from "@/actions/langchain"
import { Document } from "@langchain/core/documents"
import { createEmbedding ,getChatCompletion} from "@/actions/openAi"
import { insertDocument, searchDocument } from "@/actions/supabase"
import { Database } from '@/types/supabase'
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"
// const defaultSearch = "Which movie can I take my child to?"
// const defaultSearch = "What will give me a good laugh?"
// const defaultSearch = "Which movie will give me an adrenaline rush?"
// const defaultSearch ="What's the highest rated movie?";
const defaultSearch = "The movie with that actor from Castaway";

export default function Home() {
  const [texts, setTexts] = useState<string>('')
  const [chunks, setChunks] = useState<Document[]>([])
  const [search, setSearch] = useState<string>(defaultSearch)
  const [results, setResults] = useState<Database['public']['Functions']['match_langchain_documents']['Returns']>([])
  const [response, setResponse] = useState<string>('')
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])

  useEffect(() => {
    fetch('/data.txt')
      .then(res => res.text())
      .then(data => setTexts(data))
      .catch(err => console.error(err))
  }, [])  

  useEffect(() => {
    if (texts) {
      splitText(texts).then((chunks) => {
        setChunks(JSON.parse(chunks))
        console.log("chunks",JSON.parse(chunks))
      }).catch(err => console.error(err))
    }
  }, [texts])

  const insertDocuments = async () => {
    try {
      const embeddings = await createEmbedding(chunks.map((chunk) => chunk.pageContent))
      console.log("embeddings",embeddings)
      await insertDocument(embeddings)
    } catch (err) {
      console.error(err)
    }
  }

  const searchDocuments = async () => {
    try {
      const embeddings = await createEmbedding([search])
      const results = await searchDocument(embeddings[0].embedding)
      console.log("results",results)
      setResults(results.data || [])
      if (results.data) {
        const content = results.data.map((result) => result.content).join('\n')
        const newMessage: ChatCompletionMessageParam = {
          role: 'user',
          content: `Context: ${content}\n\nQuestion: ${search}`
        }
        const response = await getChatCompletion([...messages, newMessage])
        console.log("response",response)
        setResponse(response || '')
        setMessages(prev => [...prev, newMessage, {role: 'assistant', content: response}])
      }
    } catch (err) {
      console.error(err)
    }
  }

  console.log("messages",messages)
  return (
   <div className="grid grid-cols-1 gap-4 mt-6 container mx-auto">
    <div>
      <button disabled className="bg-blue-500 text-white p-2 rounded-lg" onClick={insertDocuments}>Insert Documents ( already insered )</button>
    </div>
    <div>
      <div className="flex gap-2">
      <textarea  className="border border-gray-200 p-2 rounded-lg" onChange={(e) => setSearch(e.target.value)} value={search} />
      <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={searchDocuments}>Search Documents</button>
      </div>
        <p className="text-sm text-gray-500 border border-gray-200 p-4 rounded-lg whitespace-pre-wrap"> response :{response}</p>
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
