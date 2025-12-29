import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';

interface ReasoningPanelProps {
  result: AnalysisResult;
}

const ReasoningPanel: React.FC<ReasoningPanelProps> = ({ result }) => {
  return (
    <div className="flex flex-col gap-5 overflow-y-auto custom-scrollbar">
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-800/60 p-4 rounded-xl border border-white/10">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-medium">Confidence</div>
          <div className={`text-xl font-bold flex items-center gap-2 ${
            result.summary.overall_confidence > 80 ? 'text-emerald-400' : 
            result.summary.overall_confidence > 50 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {result.summary.overall_confidence}%
            {result.summary.overall_confidence > 80 ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          </div>
        </div>
        <div className="bg-slate-800/60 p-4 rounded-xl border border-white/10">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-medium">Missing Info</div>
          <div className="text-xl font-bold text-slate-200 flex items-center gap-2">
            {result.summary.missing_details.length}
            <HelpCircle size={18} className="text-slate-500" />
          </div>
        </div>
      </div>

      {/* Extracted Hyperparameters */}
      <div className="bg-slate-800/40 rounded-xl border border-white/10 overflow-hidden">
        <div className="p-3 bg-slate-800/80 border-b border-white/10 font-semibold text-slate-200 flex items-center gap-2 text-sm">
           <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0"></span> 
           <span>Hyperparameters</span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {Object.entries(result.summary.hyperparameters).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center gap-2 border-b border-white/5 pb-2 last:border-0 last:pb-0">
              <span className="text-slate-400 font-mono text-xs truncate">{key}</span>
              <span className="text-violet-300 font-mono text-xs truncate max-w-[50%]">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions & Reasoning */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Inference & Reasoning</h3>
        {result.reasoning.map((item, idx) => (
          <div key={idx} className={`
            p-3 rounded-xl border text-sm overflow-hidden
            ${item.is_assumption 
              ? 'bg-amber-500/10 border-amber-500/20' 
              : 'bg-emerald-500/10 border-emerald-500/20'}
          `}>
            <div className="flex justify-between items-start gap-2 mb-1.5">
              <span className={`font-bold flex items-center gap-2 truncate ${item.is_assumption ? 'text-amber-200' : 'text-emerald-200'}`}>
                {item.is_assumption ? <AlertCircle size={14} className="flex-shrink-0" /> : <CheckCircle size={14} className="flex-shrink-0" />}
                <span className="truncate">{item.topic}</span>
              </span>
              <span className="text-xs opacity-70 bg-black/20 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">{item.confidence_score}%</span>
            </div>
            <p className={`opacity-80 leading-relaxed text-xs ${item.is_assumption ? 'text-amber-100/80' : 'text-emerald-100/80'}`}>{item.explanation}</p>
          </div>
        ))}
      </div>

       {/* Missing Details Warning */}
       {result.summary.missing_details.length > 0 && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <h3 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
            <AlertTriangle size={16} className="flex-shrink-0" /> Missing Information
          </h3>
          <ul className="list-disc list-inside text-xs text-red-200/80 space-y-1">
            {result.summary.missing_details.map((detail, idx) => (
              <li key={idx} className="break-words">{detail}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReasoningPanel;
