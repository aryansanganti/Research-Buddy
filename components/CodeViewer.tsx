import React from 'react';
import { Copy, Terminal } from 'lucide-react';

interface CodeViewerProps {
  code: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal size={16} />
          <span className="text-sm font-mono font-medium">experiment.py</span>
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Copy Code"
        >
          <Copy size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#0d1117]">
        <pre className="text-xs sm:text-sm font-mono leading-relaxed">
          <code className="language-python text-slate-300">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;
