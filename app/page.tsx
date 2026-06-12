"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useState } from "react";
import { companyManual } from "../data/manual";

const Page = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <main className="flex h-full w-full">
      {/* 左: マニュアル表示エリア */}
      <section className="w-1/2 h-full overflow-y-auto bg-gray-50 p-6 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">マニュアル</h2>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
          {companyManual}
        </pre>
      </section>

      {/* 右: チャットエリア */}
      <section className="w-1/2 h-full flex flex-col bg-white">
        {/* メッセージ表示エリア */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center mt-10">マニュアルについて質問してみましょう。</p>
          )}
          {messages.map((m: UIMessage) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <span className="block text-xs font-semibold mb-1 opacity-80">
                  {m.role === 'user' ? 'あなた' : 'AIアシスタント'}
                </span>
                <p className="whitespace-pre-wrap text-sm">
                  {m.parts.filter(part => part.type === 'text').map(part => part.text).join('')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 入力フォーム */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              value={input}
              placeholder="マニュアルに関する質問を入力..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              送信
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Page;