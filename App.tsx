import React, { useState, useEffect } from 'react';
import { Brain, Github, ChevronRight, AlertCircle, FileText, Loader2, Layers } from 'lucide-react';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import HeroBanner from './components/HeroBanner';
import { AnalysisResult, AnalysisStatus, FileData } from './types';
import { analyzePaper, readFileAsBase64 } from './services/geminiService';

const LOADING_STEPS = [
  "Reading PDF documents...",
  "Extracting equations and tables...",
  "Parsing visual figures...",
  "Cross-referencing methods...",
  "Resolving contradictions...",
  "Generating executable code...",
  "Finalizing experiment graph..."
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);

  // Loading animation state
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (status === AnalysisStatus.ANALYZING) {
      setLoadingStepIndex(0);
      setLoadingProgress(0);

      // Cycle through text steps
      const stepDuration = 1500; // Change text every 1.5s
      const stepInterval = setInterval(() => {
        setLoadingStepIndex(prev => (prev + 1) % LOADING_STEPS.length);
      }, stepDuration);

      // Smooth progress bar
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) return 95; // Hold at 95 until complete
          return prev + 0.5;
        });
      }, 50);

      return () => {
        clearInterval(stepInterval);
        clearInterval(interval);
      };
    }
  }, [status]);

  const handleFilesSelect = async (selectedFiles: File[]) => {
    try {
      setStatus(AnalysisStatus.ANALYZING);
      setError(null);

      // Process all files
      const fileDataPromises = selectedFiles.map(async (file) => {
        const base64 = await readFileAsBase64(file);
        return {
          name: file.name,
          type: file.type,
          base64: base64
        } as FileData;
      });

      const processedFiles = await Promise.all(fileDataPromises);
      setFiles(processedFiles);

      // Call API with all files
      const analysis = await analyzePaper(processedFiles);
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETE);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setFiles([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-green-500/30 overflow-x-hidden">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform">
              <Brain className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">PaperFusion</h1>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5 group-hover:text-green-400 transition-colors">Scientific Synthesis Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {status === AnalysisStatus.COMPLETE && files.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 animate-in fade-in slide-in-from-top-2">
                {files.length > 1 ? <Layers size={14} className="text-green-400" /> : <FileText size={14} className="text-green-400" />}
                <span className="text-xs font-medium text-slate-300 truncate max-w-[200px]">
                  {files.length > 1 ? `${files.length} Papers Loaded` : files[0].name}
                </span>
              </div>
            )}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">

        {/* State: IDLE - Upload Screen */}
        {status === AnalysisStatus.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-4xl mx-auto text-center space-y-12 animate-in fade-in duration-700">

            <HeroBanner />

            <div className="space-y-6 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-200 via-emerald-200 to-slate-200 tracking-tight leading-tight">
                Literature to Executable Code.<br />Instantly.
              </h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
                Upload scientific papers or architectural diagrams. <br />
                PaperFusion extracts methods, resolves contradictions, and generates executable PyTorch code.
              </p>
            </div>

            <div className="w-full max-w-md mx-auto transform hover:scale-[1.01] transition-transform duration-300">
              <FileUpload onFileSelect={handleFilesSelect} isLoading={false} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full mt-8">
              <div className="p-5 rounded-xl bg-slate-800/20 border border-slate-800/60 hover:border-green-500/30 hover:bg-slate-800/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors">
                  <Brain size={20} className="text-green-400" />
                </div>
                <h3 className="font-bold text-slate-200 mb-1">Multimodal Parsing</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Understands PDF text, equations, tables, and plot images simultaneously.</p>
              </div>
              <div className="p-5 rounded-xl bg-slate-800/20 border border-slate-800/60 hover:border-violet-500/30 hover:bg-slate-800/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3 group-hover:bg-violet-500/20 transition-colors">
                  <Github size={20} className="text-violet-400" />
                </div>
                <h3 className="font-bold text-slate-200 mb-1">Code Generation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Produces runnable PyTorch training loops, dataloaders, and baselines.</p>
              </div>
              <div className="p-5 rounded-xl bg-slate-800/20 border border-slate-800/60 hover:border-emerald-500/30 hover:bg-slate-800/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
                  <ChevronRight size={20} className="text-emerald-400" />
                </div>
                <h3 className="font-bold text-slate-200 mb-1">Variant Discovery</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Suggests ablations, hybrid models, and high-risk improvements automatically.</p>
              </div>
            </div>
          </div>
        )}

        {/* State: ANALYZING */}
        {status === AnalysisStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md mb-8 opacity-50 pointer-events-none grayscale">
              <FileUpload onFileSelect={() => { }} isLoading={true} />
            </div>

            <div className="max-w-xl w-full text-center">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                <span>Processing</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6 relative">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
              </div>

              <div className="h-8 relative overflow-hidden">
                {LOADING_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500 transform ${idx === loadingStepIndex
                      ? 'translate-y-0 opacity-100'
                      : idx < loadingStepIndex
                        ? '-translate-y-full opacity-0'
                        : 'translate-y-full opacity-0'
                      }`}
                  >
                    <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                    <span className="text-green-200 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State: ERROR */}
        {status === AnalysisStatus.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/30">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Analysis Failed</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 text-white rounded-lg transition-all border border-slate-700 font-medium shadow-lg shadow-black/50"
            >
              Try Another Paper
            </button>
          </div>
        )}

        {/* State: COMPLETE */}
        {status === AnalysisStatus.COMPLETE && result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <AnalysisDashboard result={result} files={files} />
          </div>
        )}

      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;