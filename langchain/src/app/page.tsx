'use client'

import { useEffect, useState } from "react"
import { splitText } from "@/actions/langchain"
import { Document } from "@langchain/core/documents"

export default function Home() {
  const [chunks, setChunks] = useState<Document[]>([])
  useEffect(() => {
    splitText().then((chunks) => {
      setChunks(chunks)
      console.log(chunks)
    })
  }, [])
  return (
   <div className="flex flex-col gap-4 mt-6 container mx-auto">
    {chunks.map((chunk, id) => (
      <div className="bg-white p-4 rounded-lg border border-gray-200" key={id}>
        <p className="text-sm text-gray-500">content: {chunk.pageContent}</p>
        <p className="text-sm text-gray-500">metadata: {JSON.stringify(chunk.metadata)}</p>
      </div>
    ))}
   </div>
  );
}
