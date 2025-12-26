import React from 'react';
import { AnalysisResult, FileData, Variant } from '../types';
import MethodGraph from './MethodGraph';
import ReasoningPanel from './ReasoningPanel';
import CodeViewer from './CodeViewer';
import BeforeAfterViewer from './BeforeAfterViewer';
import PromptConsole from './PromptConsole';
import ConfidenceMeter from './ConfidenceMeter';
import { GitBranch, Beaker, FileText, Activity, Download, ArrowDownToLine, Zap, Layers, AlertTriangle, Crosshair } from 'lucide-react';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  files: FileData[];
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, files }) => {
  
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "experiment_pack.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportPython = () => {
    const dataStr = "data:text/x-python;charset=utf-8," + encodeURIComponent(result.code);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "reproduction.py");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getVariantIcon = (type: Variant['type']) => {
    switch (type) {
      case 'Hybrid Fusion': return <Layers className="text-blue-400" size={18} />;
      case 'Speed Demon': return <Zap className="text-yellow-400" size={18} />;
      case 'Untested Territory': return <AlertTriangle className="text-red-400" size={18} />;
      case 'Efficiency Mod': return <Crosshair className="text-emerald-400" size={18} />;
      default: return <GitBranch className="text-slate-400" size={18} />;
    }
  };

  const getVariantColor = (type: Variant['type']) => {
    switch (type) {
      case 'Hybrid Fusion': return 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60';
      case 'Speed Demon': return 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/60';
      case 'Untested Territory': return 'border-red-500/30 bg-red-500/5 hover:border-red-500/60';
      case 'Efficiency Mod': return 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60';
      default: return 'border-slate-700 bg-slate-800/30';
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Top Section: Split View */}
      {files.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <BeforeAfterViewer files={files} result={result} />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Method Graph */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Activity className="text-blue-500" size={24} />
                Method Pipeline
              </h2>
            </div>
            <MethodGraph data={result.graph} />
          </section>

          {/* Prompt Console */}
          <section className="space-y-3">
             <PromptConsole context={result} />
          </section>

          {/* Code Viewer & Export */}
          <section className="space-y-3">
             <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="text-emerald-500" size={24} />
                  Replication Code
                </h2>
                <div className="flex gap-2">
                  <button onClick={handleExportJSON} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs text-slate-300 transition-colors">
                    <Download size={14} /> JSON Pack
                  </button>
                  <button onClick={handleExportPython} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs text-slate-300 transition-colors">
                    <ArrowDownToLine size={14} /> .py File
                  </button>
                </div>
             </div>
             <CodeViewer code={result.code} />
          </section>
        </div>

        {/* RIGHT COLUMN (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Confidence Meter & Reasoning */}
          <section className="bg-slate-900/50 rounded-xl border border-slate-700 p-5 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Beaker className="text-violet-500" size={20} />
                  Analysis Logic
                </h2>
             </div>
             <ConfidenceMeter score={result.summary.overall_confidence} missingCount={result.summary.missing_details.length} />
            <ReasoningPanel result={result} />
          </section>

          {/* Variants */}
          <section className="space-y-4">
             <div className="flex items-center justify-between">
               <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <GitBranch className="text-amber-500" size={20} />
                  Creative Variants
                </h2>
                <span className="text-xs text-amber-500/80 bg-amber-950/30 px-2 py-1 rounded border border-amber-900">AI Generated</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {result.variants.map((variant, idx) => (
                  <div key={idx} className={`border rounded-xl p-4 transition-all duration-300 group ${getVariantColor(variant.type)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getVariantIcon(variant.type)}
                        <h3 className="font-bold text-slate-200">{variant.name}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/40 text-slate-400">
                        {variant.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-400 mb-3 leading-relaxed">{variant.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800/50">
                        <div className="text-[10px] text-slate-500 uppercase">Accuracy Impact</div>
                        <div className="text-emerald-400 font-mono text-xs font-bold">{variant.expected_accuracy_impact || "N/A"}</div>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800/50">
                        <div className="text-[10px] text-slate-500 uppercase">Compute Cost</div>
                        <div className="text-red-400 font-mono text-xs font-bold">{variant.expected_compute_impact || "N/A"}</div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                      <p className="text-xs text-slate-400 italic">"{variant.rationale}"</p>
                    </div>
                  </div>
                ))}
              </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;