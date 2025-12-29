import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import { Brain, Github, ChevronRight, AlertCircle, FileText, Loader2, Layers } from 'lucide-react';
import FileUpload from './components/FileUpload';
import FeatureCarousel from './components/FeatureCarousel';
import AnalysisDashboard from './components/AnalysisDashboard';

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
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-20%,#10b98115,transparent)] pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <img src={logo} alt="Research-Buddy Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">Research-Buddy</h1>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 lg:py-8">

        {/* State: IDLE - Upload Screen */}
        {status === AnalysisStatus.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-5xl mx-auto text-center space-y-12 lg:space-y-16 animate-in fade-in duration-1000">

            <div className="w-full max-w-4xl mx-auto space-y-6 lg:space-y-8">
              <div className="space-y-3 lg:space-y-4 px-2">
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-[1.1]">
                  Your Intelligent <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Research Co-Pilot</span>
                </h2>
                <p className="text-base lg:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                  Decode complex papers, extract methodologies, and generate implementation code instantly.
                  <span className="text-emerald-500/80 hidden sm:inline"> Research-Buddy accelerates your journey from reading to replicating.</span>
                </p>
              </div>

              <div className="w-full max-w-md lg:max-w-lg mx-auto">
                <FileUpload onFileSelect={handleFilesSelect} isLoading={false} />
              </div>
            </div>

            <FeatureCarousel />
          </div>
        )}

        {/* State: ANALYZING */}
        {status === AnalysisStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-sm lg:max-w-md mb-8 opacity-50 pointer-events-none grayscale">
              <FileUpload onFileSelect={() => { }} isLoading={true} />
            </div>

            <div className="max-w-md lg:max-w-xl w-full text-center">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                <span>Processing</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6 relative">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
                <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]"></div>
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
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span className="text-emerald-200 font-medium text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State: ERROR */}
        {status === AnalysisStatus.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center animate-in zoom-in-95 duration-300 px-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
              <AlertCircle className="w-8 h-8 lg:w-10 lg:h-10 text-red-500" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Analysis Failed</h3>
            <p className="text-slate-400 mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base break-words">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 lg:px-8 py-2.5 lg:py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-white/10 font-medium"
            >
              Try Another Paper
            </button>
          </div>
        )}

        {/* State: COMPLETE */}
        {status === AnalysisStatus.COMPLETE && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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