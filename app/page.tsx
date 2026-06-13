"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { companyManual } from "../data/manual";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Page = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <main className="flex-1 flex h-full w-full overflow-hidden">
      {/* 左: マニュアル表示エリア */}
      <section className="w-1/2 h-screen overflow-y-auto bg-gray-50 p-6 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">マニュアル</h2>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
          {companyManual}
        </pre>
      </section>

      {/* 右: チャットエリア */}
      <section className="w-1/2 h-screen flex flex-col bg-white">
        {/* メッセージ表示エリア */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center mt-10">マニュアルについて質問してみましょう。</p>
          )}
          {messages.map((m: UIMessage) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                <span className="block text-xs font-semibold mb-1 opacity-80">
                  {m.role === 'user' ? 'あなた' : 'AIアシスタント'}
                </span>
                {m.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {m.parts.filter(part => part.type === 'text').map(part => part.text).join('')}
                  </p>
                ) : (
                  <div className="text-sm space-y-3">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node: _, ...props }) => <p className="leading-relaxed" {...props} />,
                        ul: ({ node: _, ...props }) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                        ol: ({ node: _, ...props }) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                        li: ({ node: _, ...props }) => <li className="leading-relaxed" {...props} />,
                        strong: ({ node: _, ...props }) => <strong className="font-semibold" {...props} />,
                        a: ({ node: _, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                        h1: ({ node: _, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                        h2: ({ node: _, ...props }) => <h2 className="text-base font-bold mt-4 mb-2" {...props} />,
                        h3: ({ node: _, ...props }) => <h3 className="text-sm font-bold mt-3 mb-2" {...props} />,
                        pre: ({ node: _, ...props }) => <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs font-mono mt-2" {...props} />,
                        code: ({ node: _, className, ...props }) => {
                          const isBlock = /language-(\w+)/.test(className || '');
                          return isBlock ? <code className={className} {...props} /> : <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800" {...props} />;
                        },
                      }}
                    >
                      {m.parts.filter(part => part.type === 'text').map(part => part.text).join('')}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* ローディング表示 (AI思考中) */}
          {messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-sm">
                <span className="block text-xs font-semibold mb-2 opacity-80">AIアシスタント</span>
                <div className="flex space-x-1.5 items-center h-4">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
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