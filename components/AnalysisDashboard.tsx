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
    { id: 'graph', label: 'Method Pipeline', icon: Activity },
    { id: 'code', label: 'Code & Export', icon: FileText },
    { id: 'logic', label: 'Analysis Logic', icon: Beaker },
    { id: 'variants', label: 'Creative Variants', icon: GitBranch },
    { id: 'chat', label: 'Research Chat', icon: MessageSquare },
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
      case 'Hybrid Fusion': return <Layers className="text-teal-400" size={18} />;
      case 'Speed Demon': return <Zap className="text-yellow-400" size={18} />;
      case 'Untested Territory': return <AlertTriangle className="text-red-400" size={18} />;
      case 'Efficiency Mod': return <Crosshair className="text-emerald-400" size={18} />;
      default: return <GitBranch className="text-slate-400" size={18} />;
    }
  };

  const getVariantColor = (type: Variant['type']) => {
    switch (type) {
      case 'Hybrid Fusion': return 'border-teal-500/30 bg-teal-500/5 hover:border-teal-500/60';
      case 'Speed Demon': return 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/60';
      case 'Untested Territory': return 'border-red-500/30 bg-red-500/5 hover:border-red-500/60';
      case 'Efficiency Mod': return 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60';
      default: return 'border-slate-700 bg-slate-800/30';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[800px] gap-8 animate-in fade-in duration-700">

      {/* Sidebar Navigation - Floating Glass Panel */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="sticky top-24 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl overflow-hidden relative">
          {/* Decorative Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-transparent"></div>

          <div className="mb-6 px-4 py-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">Analysis Hub</h3>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                  ? 'bg-gradient-to-r from-emerald-500/20 to-transparent border border-emerald-500/30 text-white shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
                  }`}
              >
                <div className={`relative z-10 p-2 rounded-lg transition-colors ${activeTab === item.id ? 'bg-emerald-500 text-black' : 'bg-slate-800/50 text-slate-400 group-hover:text-emerald-400'}`}>
                  <item.icon size={20} />
                </div>
                <span className="relative z-10 font-medium tracking-wide">{item.label}</span>

                {/* Active Indicator Bar */}
                {activeTab === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-r-full shadow-[0_0_10px_#34d399]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-900/20 backdrop-blur-sm rounded-3xl border border-white/5 p-8 relative overflow-hidden min-h-[800px]">
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 h-full">

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <header className="mb-8">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">Analysis Overview</h2>
                <p className="text-slate-400">Comprehensive summary of the extracted research data.</p>
              </header>
              {files.length > 0 && <BeforeAfterViewer files={files} result={result} />}
            </div>
          )}

          {/* Tab: Method Graph */}
          {activeTab === 'graph' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 h-full">
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">Method Pipeline</h2>
                  <p className="text-slate-400">Interactive visualization of the research methodology.</p>
                </div>
              </header>
              <div className="bg-black/40 rounded-3xl p-2 border border-white/10 shadow-2xl">
                <MethodGraph data={result.graph} />
              </div>
            </div>
          )}

          {/* Tab: Code */}
          {/* Tab: Code */}
          {activeTab === 'code' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <header className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">Replication Code</h2>
                  <p className="text-slate-400">Auto-generated PyTorch implementation tailored to this paper.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleExportJSON} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-sm text-slate-200 transition-all shadow-lg hover:shadow-slate-900/50">
                    <Download size={18} /> JSON Pack
                  </button>
                  <button onClick={handleExportPython} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-sm text-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <ArrowDownToLine size={18} /> .py File
                  </button>
                </div>
              </header>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <CodeViewer code={result.code} />
              </div>
            </div>
          )}

          {/* Tab: Logic */}
          {/* Tab: Logic */}
          {activeTab === 'logic' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-5xl mx-auto">
              <header className="mb-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-2">Analysis Logic</h2>
                <p className="text-slate-400">Understanding how the AI reached its conclusions.</p>
              </header>

              <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-violet-500/20 transition-colors duration-700"></div>
                <ConfidenceMeter score={result.summary.overall_confidence} missingCount={result.summary.missing_details.length} />
              </div>

              <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-1 shadow-2xl">
                <ReasoningPanel result={result} />
              </div>
            </div>
          )}

          {/* Tab: Variants */}
          {/* Tab: Variants */}
          {activeTab === 'variants' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <header className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-2">Creative Variants</h2>
                  <p className="text-slate-400">Novel experimental ideas generated from the analysis.</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-4 py-2 rounded-full border border-amber-400/20 uppercase tracking-widest shadow-[0_0_15px_rgba(251,191,36,0.2)]">AI Generated</span>
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {result.variants.map((variant, idx) => (
                  <div key={idx} className={`relative p-8 rounded-3xl border transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${getVariantColor(variant.type)}`}>

                    {/* Card Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-20 bg-gradient-to-bl from-white to-transparent rounded-bl-full pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                          {getVariantIcon(variant.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-white">{variant.name}</h3>
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{variant.type}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-base text-slate-300 mb-8 leading-relaxed font-light">{variant.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-wider">Accuracy Impact</div>
                        <div className="text-emerald-400 font-mono text-lg font-bold flex items-center gap-2">
                          <Activity size={16} /> {variant.expected_accuracy_impact || "N/A"}
                        </div>
                      </div>
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-wider">Compute Cost</div>
                        <div className="text-red-400 font-mono text-lg font-bold flex items-center gap-2">
                          <Zap size={16} /> {variant.expected_compute_impact || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-3 relative z-10">
                      <div className="min-w-[4px] w-1 bg-gradient-to-b from-slate-500 to-transparent rounded-full h-auto"></div>
                      <p className="text-sm text-slate-400 italic leading-relaxed">"{variant.rationale}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Chat */}
          {/* Tab: Chat */}
          {activeTab === 'chat' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500 h-full flex flex-col">
              <header className="mb-2">
                <h2 className="text-3xl font-bold text-white mb-2">Research Assistant</h2>
                <p className="text-slate-400">Ask questions about the analyzed paper.</p>
              </header>
              <div className="flex-1 bg-black/40 rounded-3xl border border-white/10 p-2 overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
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