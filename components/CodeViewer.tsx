import React from 'react';
import { Copy, Terminal, Check } from 'lucide-react';

interface CodeViewerProps {
  code: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[400px] lg:h-[550px] bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-white/10">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal size={16} className="text-emerald-400" />
          <span className="text-sm font-mono font-medium">experiment.py</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors text-xs"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#0d1117]">
        <pre className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
          <code className="language-python text-slate-300">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;
