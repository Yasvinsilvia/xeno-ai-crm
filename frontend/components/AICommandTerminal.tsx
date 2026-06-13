'use client';

import { useState, useRef, useEffect } from 'react';

export default function AiCommandTerminal() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChatHistory(prev => [...prev, { role: 'user', content: input }]);
    const currentInput = input;
    setInput('');
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:8000/api/ai-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput }),
      });
      
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Connection to AI Core severed.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px] w-full rounded-2xl border border-gray-800 bg-[rgba(20,20,20,0.6)] backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-500">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          <span className="font-semibold text-gray-200 text-sm tracking-wide">Copilot Active</span>
        </div>
      </div>
      
      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
            <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <p className="text-sm">Awaiting command protocol...</p>
          </div>
        )}

        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-sm' 
                : 'bg-gray-800/80 text-gray-200 border border-gray-700/50 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="px-5 py-3 rounded-2xl bg-gray-800/80 border border-gray-700/50 rounded-bl-sm flex gap-2 items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleExecute} className="p-4 bg-black/60 border-t border-gray-800 backdrop-blur-md">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder="e.g., Send a 20% WhatsApp discount to users who bought shoes..."
            className="w-full bg-gray-900 border border-gray-700 text-gray-100 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500 text-sm disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="absolute right-2 px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            Launch
          </button>
        </div>
      </form>
    </div>
  );
}