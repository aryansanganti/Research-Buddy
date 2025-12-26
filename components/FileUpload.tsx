import React, { useRef, useState } from 'react';
import { Upload, Loader2, File as FileIcon, Layers } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[];
      setFileNames(files.map(f => f.name));
      onFileSelect(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      setFileNames(files.map(f => f.name));
      onFileSelect(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden group cursor-pointer
        border-2 border-dashed rounded-xl transition-all duration-300
        flex flex-col items-center justify-center p-8 h-48
        ${isDragging
          ? 'border-green-500 bg-green-500/10 scale-[1.02]'
          : 'border-slate-600 hover:border-green-400 hover:bg-slate-800/50 bg-slate-800/20'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf,image/png,image/jpeg,image/webp"
        multiple
      />

      {isLoading ? (
        <div className="flex flex-col items-center text-green-400 animate-pulse">
          <Loader2 className="w-10 h-10 mb-3 animate-spin" />
          <span className="text-sm font-medium">Synthesizing Research...</span>
        </div>
      ) : (
        <>
          <div className={`
            p-4 rounded-full bg-slate-800 mb-3 transition-transform duration-300
            ${isDragging ? 'scale-110 shadow-lg shadow-green-500/20' : ''}
          `}>
            {fileNames.length > 0 ? (
              fileNames.length > 1 ? <Layers className="w-8 h-8 text-emerald-400" /> : <FileIcon className="w-8 h-8 text-emerald-400" />
            ) : (
              <Upload className="w-8 h-8 text-green-400" />
            )}
          </div>
          <div className="text-center">
            {fileNames.length > 0 ? (
              <div className="flex flex-col gap-1">
                <span className="text-emerald-400 font-semibold">{fileNames.length} file{fileNames.length > 1 ? 's' : ''} selected</span>
                <span className="text-xs text-slate-500 max-w-[200px] truncate mx-auto">{fileNames.join(', ')}</span>
              </div>
            ) : (
              <>
                <p className="text-slate-200 font-medium text-lg">Drop papers or images here</p>
                <p className="text-slate-500 text-sm mt-1">Upload multiple files to compare</p>
              </>
            )}
          </div>
        </>
      )}

      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default FileUpload;