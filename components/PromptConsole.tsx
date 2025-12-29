import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Cpu, Sparkles } from 'lucide-react';
import { AnalysisResult, ChatMessage } from '../types';
import { chatWithPaperContext } from '../services/geminiService';

interface PromptConsoleProps {
  context: AnalysisResult;
}

const PromptConsole: React.FC<PromptConsoleProps> = ({ context }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Context loaded. I can help rewrite code, explain the methodology, or design experimental variants.', timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await chatWithPaperContext(userMsg.content, context);

    const modelMsg: ChatMessage = { role: 'model', content: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "Explain the pipeline",
    "Generate variants",
    "Compare methods",
    "Optimize code"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-white/10">
        <div className="flex items-center gap-2 text-slate-200">
          <Terminal size={16} className="text-emerald-400" />
          <span className="text-sm font-semibold">Research Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-slate-500 uppercase hidden sm:inline">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 custom-scrollbar space-y-3 min-h-0" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed break-words ${msg.role === 'user'
              ? 'bg-emerald-600 text-white rounded-br-lg'
              : 'bg-slate-800/80 text-slate-200 rounded-bl-lg border border-white/10'
              }`}>
              {msg.role === 'model' && <Cpu size={14} className="mb-1.5 text-emerald-400 opacity-50" />}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 p-3 rounded-2xl rounded-bl-lg border border-white/10 flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-800/80 border-t border-white/10">
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-700/50 hover:bg-slate-700 border border-white/10 text-xs text-slate-300 transition-colors flex-shrink-0"
              >
                <Sparkles size={10} className="text-amber-400" />
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the research..."
            className="w-full bg-slate-900/80 border border-white/10 text-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptConsole;