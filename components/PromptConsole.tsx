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
    { role: 'model', content: 'Methodology context loaded. I can help rewrite code, explain the graph, or design specific variants.', timestamp: Date.now() }
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
    "Explain the method graph",
    "Generate experiment variants",
    "Compare with ResNet-50",
    "Rewrite code for TPU"
  ];

  return (
    <div className="flex flex-col h-[400px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2 text-slate-200">
          <Terminal size={16} className="text-green-400" />
          <span className="text-sm font-semibold">Prompt Console</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-slate-500 uppercase">Context Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 custom-scrollbar space-y-4 bg-slate-900/50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${msg.role === 'user'
                ? 'bg-green-600 text-white rounded-br-none'
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}>
              {msg.role === 'model' && <Cpu size={14} className="mb-2 text-green-400 opacity-50" />}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-lg rounded-bl-none border border-slate-700 flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-xs text-slate-300 transition-colors"
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
            placeholder="Ask PaperFusion to refine the experiment..."
            className="w-full bg-slate-900 border border-slate-600 text-slate-200 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-600 hover:bg-green-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptConsole;