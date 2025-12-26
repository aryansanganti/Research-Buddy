import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';

interface ReasoningPanelProps {
  result: AnalysisResult;
}

const ReasoningPanel: React.FC<ReasoningPanelProps> = ({ result }) => {
  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Confidence</div>
          <div className={`text-2xl font-bold flex items-center gap-2 ${
            result.summary.overall_confidence > 80 ? 'text-emerald-400' : 
            result.summary.overall_confidence > 50 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {result.summary.overall_confidence}%
            {result.summary.overall_confidence > 80 ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Missing Info</div>
          <div className="text-2xl font-bold text-slate-200 flex items-center gap-2">
            {result.summary.missing_details.length}
            <HelpCircle size={20} className="text-slate-500" />
          </div>
        </div>
      </div>

      {/* Extracted Hyperparameters */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-3 bg-slate-800/80 border-b border-slate-700 font-semibold text-slate-200 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-violet-500"></span> Hyperparameters
        </div>
        <div className="p-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          {Object.entries(result.summary.hyperparameters).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center border-b border-slate-700/50 pb-1 last:border-0">
              <span className="text-slate-400 font-mono">{key}</span>
              <span className="text-violet-300 font-mono">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions & Reasoning */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Inference & Reasoning</h3>
        {result.reasoning.map((item, idx) => (
          <div key={idx} className={`
            p-3 rounded-lg border text-sm
            ${item.is_assumption 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-100' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100'}
          `}>
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold flex items-center gap-2">
                {item.is_assumption ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                {item.topic}
              </span>
              <span className="text-xs opacity-70 bg-black/20 px-2 py-0.5 rounded-full">{item.confidence_score}% Conf.</span>
            </div>
            <p className="opacity-80 leading-relaxed text-xs">{item.explanation}</p>
          </div>
        ))}
      </div>

       {/* Missing Details Warning */}
       {result.summary.missing_details.length > 0 && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <h3 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
            <AlertTriangle size={16} /> Missing Information
          </h3>
          <ul className="list-disc list-inside text-xs text-red-200/80 space-y-1">
            {result.summary.missing_details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReasoningPanel;
