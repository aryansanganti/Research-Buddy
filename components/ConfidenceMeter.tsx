import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ConfidenceMeterProps {
  score: number;
  missingCount: number;
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, missingCount }) => {
  // Calculate circumference for SVG circle
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = 'text-emerald-500';
  if (score < 80) color = 'text-amber-500';
  if (score < 50) color = 'text-red-500';

  return (
    <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="transform -rotate-90 w-16 h-16">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-slate-700"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${color} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute text-sm font-bold ${color}`}>{score}%</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">AI Confidence</span>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-slate-200 text-sm font-medium">
             {score >= 90 ? 'High Precision' : score >= 70 ? 'Reasonable Match' : 'Uncertain'}
          </span>
        </div>
        {missingCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-red-400 mt-0.5">
             <HelpCircle size={10} />
             <span>{missingCount} parameters inferred</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfidenceMeter;