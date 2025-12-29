import React, { useState } from 'react';
import { AnalysisResult, FileData, Variant } from '../types';
import MethodGraph from './MethodGraph';
import ReasoningPanel from './ReasoningPanel';
import CodeViewer from './CodeViewer';
import BeforeAfterViewer from './BeforeAfterViewer';
import PromptConsole from './PromptConsole';
import ConfidenceMeter from './ConfidenceMeter';
import { GitBranch, Beaker, FileText, Activity, Download, ArrowDownToLine, Zap, Layers, AlertTriangle, Crosshair, MessageSquare, LayoutDashboard } from 'lucide-react';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  files: FileData[];
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, files }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'code' | 'logic' | 'variants' | 'chat'>('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'graph', label: 'Pipeline', icon: Activity },
    { id: 'code', label: 'Code', icon: FileText },
    { id: 'logic', label: 'Logic', icon: Beaker },
    { id: 'variants', label: 'Variants', icon: GitBranch },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];

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
      case 'Hybrid Fusion': return <Layers className="text-teal-400 flex-shrink-0" size={18} />;
      case 'Speed Demon': return <Zap className="text-yellow-400 flex-shrink-0" size={18} />;
      case 'Untested Territory': return <AlertTriangle className="text-red-400 flex-shrink-0" size={18} />;
      case 'Efficiency Mod': return <Crosshair className="text-emerald-400 flex-shrink-0" size={18} />;
      default: return <GitBranch className="text-slate-400 flex-shrink-0" size={18} />;
    }
  };

  const getVariantColor = (type: Variant['type']) => {
    switch (type) {
      case 'Hybrid Fusion': return 'border-teal-500/30 bg-teal-500/5 hover:border-teal-500/50';
      case 'Speed Demon': return 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50';
      case 'Untested Territory': return 'border-red-500/30 bg-red-500/5 hover:border-red-500/50';
      case 'Efficiency Mod': return 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50';
      default: return 'border-slate-700 bg-slate-800/30';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 animate-in fade-in duration-700">

      {/* Sidebar Navigation - Responsive */}
      <aside className="w-full lg:w-64 flex-shrink-0 z-40 sticky top-0 lg:relative bg-black/90 lg:bg-transparent backdrop-blur-lg lg:backdrop-blur-none border-b lg:border-none border-white/10">
        <div className="lg:sticky lg:top-20 lg:bg-slate-900/60 lg:backdrop-blur-xl lg:border lg:border-white/10 lg:rounded-2xl lg:p-3 flex lg:flex-col overflow-x-auto no-scrollbar items-center lg:items-stretch gap-1.5 p-2">
          
          <div className="hidden lg:block mb-4 px-3 py-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Analysis Hub</h3>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex-shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 py-2 lg:py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${activeTab === item.id ? 'bg-emerald-500 text-black' : 'bg-slate-800/80 text-slate-400 group-hover:text-emerald-400'}`}>
                <item.icon size={14} />
              </div>
              <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-0 lg:p-0">
        <div className="relative z-10">

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">Analysis Overview</h2>
                <p className="text-slate-400 text-sm">Comprehensive summary of the extracted research data.</p>
              </header>
              {files.length > 0 && <BeforeAfterViewer files={files} result={result} />}
            </div>
          )}

          {/* Tab: Method Graph */}
          {activeTab === 'graph' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1">Method Pipeline</h2>
                <p className="text-slate-400 text-sm">Interactive visualization of the research methodology.</p>
              </header>
              <div className="bg-slate-900/60 rounded-2xl p-2 border border-white/10">
                <MethodGraph data={result.graph} />
              </div>
            </div>
          )}

          {/* Tab: Code */}
          {activeTab === 'code' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-1">Replication Code</h2>
                  <p className="text-slate-400 text-sm">Auto-generated PyTorch implementation.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={handleExportJSON} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm text-slate-200 transition-all">
                    <Download size={16} /> JSON
                  </button>
                  <button onClick={handleExportPython} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-sm text-emerald-400 transition-all">
                    <ArrowDownToLine size={16} /> Python
                  </button>
                </div>
              </header>
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <CodeViewer code={result.code} />
              </div>
            </div>
          )}

          {/* Tab: Logic */}
          {activeTab === 'logic' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="text-center">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">Analysis Logic</h2>
                <p className="text-slate-400 text-sm">Understanding how the AI reached its conclusions.</p>
              </header>

              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 lg:p-6">
                <ConfidenceMeter score={result.summary.overall_confidence} missingCount={result.summary.missing_details.length} />
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 lg:p-6">
                <ReasoningPanel result={result} />
              </div>
            </div>
          )}

          {/* Tab: Variants */}
          {activeTab === 'variants' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-1">Creative Variants</h2>
                  <p className="text-slate-400 text-sm">Novel experimental ideas from the analysis.</p>
                </div>
                <span className="self-start text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20 uppercase tracking-widest">AI Generated</span>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {result.variants.map((variant, idx) => (
                  <div key={idx} className={`relative p-4 lg:p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${getVariantColor(variant.type)}`}>

                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex-shrink-0">
                        {getVariantIcon(variant.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base lg:text-lg text-white truncate">{variant.name}</h3>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{variant.type}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 mb-4 leading-relaxed line-clamp-3">{variant.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">Accuracy</div>
                        <div className="text-emerald-400 font-mono text-sm font-bold flex items-center gap-1.5 truncate">
                          <Activity size={14} className="flex-shrink-0" /> 
                          <span className="truncate">{variant.expected_accuracy_impact || "N/A"}</span>
                        </div>
                      </div>
                      <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">Compute</div>
                        <div className="text-red-400 font-mono text-sm font-bold flex items-center gap-1.5 truncate">
                          <Zap size={14} className="flex-shrink-0" /> 
                          <span className="truncate">{variant.expected_compute_impact || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-xs text-slate-400 italic leading-relaxed line-clamp-2">"{variant.rationale}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Chat */}
          {activeTab === 'chat' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-[calc(100vh-200px)] lg:h-[700px]">
              <header>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">Research Assistant</h2>
                <p className="text-slate-400 text-sm">Ask questions about the analyzed paper.</p>
              </header>
              <div className="flex-1 bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden min-h-0">
                <PromptConsole context={result} />
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AnalysisDashboard;