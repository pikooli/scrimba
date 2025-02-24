'use client';
import { agent } from '@/actions/openAi';
import { useState } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export default function Home() {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessages: ChatCompletionMessageParam[] = [
      ...messages,
      { role: 'user', content: query },
    ];
    const response = await agent(newMessages);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: query },
      { role: 'assistant', content: response },
    ]);
    setQuery('');
  };

  return (
    <div className="flex h-screen flex-col p-6">
      <div className="h-44 flex-1 overflow-y-auto rounded-md border border-gray-200">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex p-4 ${message.role === 'user' ? 'items-end bg-gray-100 text-right' : 'items-start bg-blue-100 text-left'}`}
          >
            <div className="text-sm">
              {message.role === 'user' ? 'You' : 'Assistant'} :
            </div>
            <div className="ml-2 text-sm">{message.content}</div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex h-16 rounded-md border border-gray-200"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-96 rounded-md border border-gray-200 p-4"
        />
        <button type="submit" className="rounded-md bg-blue-500 p-3 text-white">
          Submit
        </button>
      </form>
    </div>
  );
}
