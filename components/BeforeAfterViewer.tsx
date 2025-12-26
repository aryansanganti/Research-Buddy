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
    let active = true;
    const render = async () => {
      if (!pdf || !canvasRef.current) return;
      try {
        const page = await pdf.getPage(pageNum);
        if (!active) return;

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context!,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        if (active) setLoading(false);
      } catch (err) {
        console.error(`Error rendering page ${pageNum}`, err);
      }
    };
    render();
    return () => { active = false; };
  }, [pdf, pageNum]);

  return (
    <div className="relative mb-4 bg-white rounded shadow-lg overflow-hidden w-full">
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

  // PDF State
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget.getBoundingClientRect();
    const newPos = ((e.clientX - container.left) / container.width) * 100;
    if (newPos > 10 && newPos < 90) setSplitPos(newPos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const newPos = ((touch.clientX - container.left) / container.width) * 100;
    if (newPos > 10 && newPos < 90) setSplitPos(newPos);
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
          // Handle base64 data
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
    <div
      ref={containerRef}
      className="relative w-full h-[700px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden select-none group"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <div className="bg-slate-900/90 backdrop-blur text-slate-200 text-xs font-bold px-1 py-1 rounded-lg border border-slate-700 flex items-center shadow-lg">
          {files.map((f, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFileIndex(idx)}
              className={`px-3 py-1 rounded-md transition-all ${selectedFileIndex === idx
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              {files.length > 1 ? `File ${idx + 1}` : 'Input Document'}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur text-slate-200 text-xs font-bold px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2 shadow-lg">
          <Code2 size={12} className="text-emerald-400" /> STRUCTURED DATA
        </div>
      </div>

      {/* Left Side: PDF/Image (Scrollable) */}
      <div
        className="absolute top-0 left-0 h-full bg-slate-800"
        style={{ width: `${splitPos}%` }}
      >
        <div className="w-full h-full overflow-y-auto custom-scrollbar relative bg-slate-800/50 pt-16 px-4 pb-20">

          {currentFile && currentFile.type.includes('pdf') && pdfDocument ? (
            <div className="flex flex-col items-center gap-4 max-w-full">
              {Array.from(new Array(numPages), (el, index) => (
                <PdfPageRenderer key={`page_${index + 1}`} pdf={pdfDocument} pageNum={index + 1} />
              ))}
            </div>
          ) : currentFile ? (
            <div className="flex justify-center">
              <img src={currentFile.base64} alt="Input" className="max-w-full h-auto object-contain rounded-lg shadow-2xl" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <Loader2 className="animate-spin mr-2" /> Loading document...
            </div>
          )}

        </div>

        {/* Overlay to block interaction during drag */}
        {isDragging && <div className="absolute inset-0 bg-transparent z-50"></div>}
      </div>

      {/* Right Side: Parsed JSON View */}
      <div
        className="absolute top-0 right-0 h-full bg-[#0d1117]"
        style={{ width: `${100 - splitPos}%` }}
      >
        <div className="w-full h-full overflow-auto p-8 pt-16 custom-scrollbar">
          <pre className="text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(result.summary, null, 2)}
          </pre>
        </div>
      </div>

      {/* Split Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-green-500 cursor-col-resize hover:bg-green-400 transition-colors z-30 flex items-center justify-center"
        style={{ left: `${splitPos}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="w-6 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg -ml-[1px] hover:scale-110 transition-transform">
          <GripVertical size={14} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterViewer;