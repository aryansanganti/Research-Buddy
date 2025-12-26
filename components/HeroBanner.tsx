import React from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';

const HeroBanner: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12 p-1">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 shadow-2xl">
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Replication Time Collapse</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                3,313× Faster
              </span> <br/>
              Scientific Reproduction
            </h2>
            <div className="flex flex-col gap-2 text-sm text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-slate-500" />
                <span>Traditional: <span className="text-slate-300">127 hours</span></span>
              </div>
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-yellow-400" />
                <span>PaperFusion: <span className="text-yellow-300 font-bold">2.3 minutes</span></span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
             <div className="bg-slate-950/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[2%] bg-red-500"></div>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">Manual</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-blue-500 animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <span className="text-xs text-blue-400 font-bold whitespace-nowrap">AI Engine</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;