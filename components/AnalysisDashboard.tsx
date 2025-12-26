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
    <div className="flex flex-col lg:flex-row min-h-[800px] gap-6 bg-black/20 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900/50 border-r border-white/5 p-4 flex flex-col gap-2">
        <div className="mb-4 px-2 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Analysis Views
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === item.id
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-h-[90vh]">

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6">Analysis Overview</h2>
            {files.length > 0 && <BeforeAfterViewer files={files} result={result} />}
          </div>
        )}

        {/* Tab: Method Graph */}
        {activeTab === 'graph' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Method Pipeline</h2>
            </div>
            <MethodGraph data={result.graph} />
          </div>
        )}

        {/* Tab: Code */}
        {activeTab === 'code' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-white">Replication Code</h2>
              <div className="flex gap-2">
                <button onClick={handleExportJSON} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm text-slate-200 transition-colors">
                  <Download size={16} /> JSON Pack
                </button>
                <button onClick={handleExportPython} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-sm text-emerald-400 transition-colors">
                  <ArrowDownToLine size={16} /> .py File
                </button>
              </div>
            </div>
            <CodeViewer code={result.code} />
          </div>
        )}

        {/* Tab: Logic */}
        {activeTab === 'logic' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl">
            <h2 className="text-2xl font-bold text-white">Analysis Logic</h2>
            <div className="bg-slate-900/50 rounded-xl border border-white/5 p-6">
              <ConfidenceMeter score={result.summary.overall_confidence} missingCount={result.summary.missing_details.length} />
            </div>
            <ReasoningPanel result={result} />
          </div>
        )}

        {/* Tab: Variants */}
        {activeTab === 'variants' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Creative Variants</h2>
              <span className="text-xs text-amber-500/80 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900">AI Generated Suggestions</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.variants.map((variant, idx) => (
                <div key={idx} className={`border rounded-2xl p-6 transition-all duration-300 group hover:shadow-lg ${getVariantColor(variant.type)}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/20">
                        {getVariantIcon(variant.type)}
                      </div>
                      <h3 className="font-bold text-lg text-slate-100">{variant.name}</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-black/40 text-slate-400">
                      {variant.type}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 mb-6 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">{variant.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Accuracy Impact</div>
                      <div className="text-emerald-400 font-mono text-sm font-bold">{variant.expected_accuracy_impact || "N/A"}</div>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Compute Cost</div>
                      <div className="text-red-400 font-mono text-sm font-bold">{variant.expected_compute_impact || "N/A"}</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex gap-2">
                    <div className="w-1 bg-slate-700 rounded-full h-full"></div>
                    <p className="text-xs text-slate-400 italic leading-relaxed">"{variant.rationale}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Chat */}
        {activeTab === 'chat' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-[700px] flex flex-col">
            <h2 className="text-2xl font-bold text-white">Research Assistant</h2>
            <div className="flex-1 bg-slate-950/50 rounded-2xl border border-white/5 p-1 overflow-hidden">
              <PromptConsole context={result} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AnalysisDashboard;