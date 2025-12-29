import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ConfidenceMeterProps {
  score: number;
  missingCount: number;
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, missingCount }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = 'text-emerald-500';
  let bgColor = 'bg-emerald-500/20';
  if (score < 80) { color = 'text-amber-500'; bgColor = 'bg-amber-500/20'; }
  if (score < 50) { color = 'text-red-500'; bgColor = 'bg-red-500/20'; }

  return (
    <div className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-xl border border-white/10">
      <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
        <svg className="transform -rotate-90 w-16 h-16">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="5"
            fill="transparent"
            className="text-slate-700"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${color} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute text-sm font-bold ${color}`}>{score}%</span>
      </div>
      
      <div className="flex flex-col min-w-0">
        <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">AI Confidence</span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${bgColor} ${color}`}>
             {score >= 90 ? 'High' : score >= 70 ? 'Moderate' : 'Low'}
          </span>
        </div>
        {missingCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-red-400 mt-1">
             <HelpCircle size={10} className="flex-shrink-0" />
             <span className="truncate">{missingCount} inferred</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfidenceMeter;