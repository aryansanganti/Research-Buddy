import React, { useState, useEffect, useRef } from 'react';
import { FileData, AnalysisResult } from '../types';
import { FileText, Code2, GripVertical, Loader2, Layers } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';

interface BeforeAfterViewerProps {
  files: FileData[];
  result: AnalysisResult;
}

const PdfPageRenderer: React.FC<{ pdf: any; pageNum: number }> = ({ pdf, pageNum }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let renderTask: any = null;
    let active = true;

    const render = async () => {
      if (!pdf || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      try {
        const page = await pdf.getPage(pageNum);
        if (!active) return;

        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // If there's an existing render task, cancel it (though Effect cleanup handles most cases)
        if (renderTask) {
          try {
            renderTask.cancel();
          } catch (e) {
            // ignore cancel error
          }
        }

        renderTask = page.render(renderContext);
        await renderTask.promise;
        
        if (active) setLoading(false);
      } catch (err: any) {
        if (err.name === 'RenderingCancelledException' || err.message?.includes('cancelled')) {
          // Task cancelled, expected behavior
          return;
        }
        console.error(`Error rendering page ${pageNum}`, err);
      }
    };

    render();

    return () => {
      active = false;
      if (renderTask) {
        // Cancel the render task if the component unmounts or deps change
        try {
          renderTask.cancel();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [pdf, pageNum]);

  return (
    <div className="relative mb-4 bg-white rounded-xl overflow-hidden w-full shadow-lg">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
          <Loader2 className="animate-spin" size={24} />
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-auto block" />
    </div>
  );
};

const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({ files, result }) => {
  const [splitPos, setSplitPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState<'source' | 'result'>('source');
  const [isDesktop, setIsDesktop] = useState(false);

  // PDF State
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Check if we're on desktop
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isDesktop) return;
    const container = e.currentTarget.getBoundingClientRect();
    const newPos = ((e.clientX - container.left) / container.width) * 100;
    if (newPos > 15 && newPos < 85) setSplitPos(newPos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isDesktop) return;
    const container = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const newPos = ((touch.clientX - container.left) / container.width) * 100;
    if (newPos > 15 && newPos < 85) setSplitPos(newPos);
  };

  // Load PDF Document when file selection changes
  useEffect(() => {
    const currentFile = files[selectedFileIndex];
    if (!currentFile) return;

    const loadPdfDocument = async () => {
      setPdfDocument(null);
      setNumPages(0);

      if (currentFile.type.includes('pdf')) {
        try {
          const base64Data = currentFile.base64.split(',')[1] || currentFile.base64;
          const binaryString = window.atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const loadingTask = pdfjsLib.getDocument({ data: bytes });
          const pdf = await loadingTask.promise;
          setPdfDocument(pdf);
          setNumPages(pdf.numPages);
        } catch (error) {
          console.error("PDF load error:", error);
        }
      }
    };

    loadPdfDocument();
  }, [selectedFileIndex, files]);

  const currentFile = files[selectedFileIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile Toggle Controls */}
      <div className="flex lg:hidden bg-slate-800/80 p-1 rounded-xl border border-white/10">
        <button 
          onClick={() => setMobileTab('source')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mobileTab === 'source' ? 'bg-slate-700 text-white' : 'text-slate-400'
          }`}
        >
          Document
        </button>
        <button 
          onClick={() => setMobileTab('result')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mobileTab === 'result' ? 'bg-slate-700 text-white' : 'text-slate-400'
          }`}
        >
          Extracted Data
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[500px] lg:h-[600px] bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* File selector - only show when source is active on mobile */}
        <div className={`absolute top-3 left-3 z-20 ${mobileTab === 'result' && !isDesktop ? 'hidden' : ''}`}>
          <div className="bg-slate-900/95 backdrop-blur text-slate-200 text-xs font-bold p-1 rounded-xl border border-white/10 flex items-center gap-1 shadow-lg">
            {files.map((f, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFileIndex(idx)}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedFileIndex === idx
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {files.length > 1 ? `File ${idx + 1}` : 'Source'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Data label - only show when result is active on mobile */}
        <div className={`absolute top-3 right-3 z-20 ${mobileTab === 'source' && !isDesktop ? 'hidden' : ''}`}>
          <div className="bg-slate-900/95 backdrop-blur text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
            <Code2 size={12} className="text-emerald-400" /> 
            <span className="hidden sm:inline">STRUCTURED</span> DATA
          </div>
        </div>

        {/* Left Side: PDF/Image */}
        <div
          className={`absolute top-0 left-0 h-full bg-slate-800/50 transition-all duration-200
            ${!isDesktop ? (mobileTab === 'source' ? 'opacity-100 z-10 w-full' : 'opacity-0 z-0 pointer-events-none w-full') : ''}
          `}
          style={isDesktop ? { width: `${splitPos}%` } : undefined}
        >
          <div className="w-full h-full overflow-y-auto custom-scrollbar pt-14 px-3 pb-6">
            {currentFile && currentFile.type.includes('pdf') && pdfDocument ? (
              <div className="flex flex-col items-center gap-3 max-w-full">
                {Array.from(new Array(numPages), (el, index) => (
                  <PdfPageRenderer key={`page_${index + 1}`} pdf={pdfDocument} pageNum={index + 1} />
                ))}
              </div>
            ) : currentFile ? (
              <div className="flex justify-center">
                <img src={currentFile.base64} alt="Input" className="max-w-full h-auto object-contain rounded-xl shadow-xl" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <Loader2 className="animate-spin mr-2" /> Loading...
              </div>
            )}
          </div>

          {isDragging && <div className="absolute inset-0 bg-transparent z-50"></div>}
        </div>

        {/* Right Side: JSON View */}
        <div
          className={`absolute top-0 right-0 h-full bg-[#0d1117] transition-all duration-200
            ${!isDesktop ? (mobileTab === 'result' ? 'opacity-100 z-10 w-full' : 'opacity-0 z-0 pointer-events-none w-full') : ''}
          `}
          style={isDesktop ? { width: `${100 - splitPos}%` } : undefined}
        >
          <div className="w-full h-full overflow-auto p-4 pt-14 custom-scrollbar">
            <pre className="text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap break-words">
              {JSON.stringify(result.summary, null, 2)}
            </pre>
          </div>
        </div>

        {/* Split Handle - Desktop Only */}
        {isDesktop && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-emerald-500 cursor-col-resize hover:bg-emerald-400 transition-colors z-30 flex items-center justify-center"
            style={{ left: `${splitPos}%` }}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            <div className="w-6 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg -ml-[2px] hover:scale-110 transition-transform">
              <GripVertical size={14} className="text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeforeAfterViewer;