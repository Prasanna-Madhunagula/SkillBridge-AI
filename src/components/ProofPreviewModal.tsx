import React, { useEffect } from 'react';
import { X, FileText, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface ProofPreviewModalProps {
  fileName: string;
  fileType?: string;
  fileSize?: string;
  fileData: string;
  onClose: () => void;
  title?: string;
}

export const ProofPreviewModal: React.FC<ProofPreviewModalProps> = ({
  fileName,
  fileType = 'Document',
  fileSize,
  fileData,
  onClose,
  title = 'Supporting Evidence Proof',
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isPdf =
    fileType.toUpperCase().includes('PDF') ||
    fileName.toLowerCase().endsWith('.pdf') ||
    fileData.startsWith('data:application/pdf');

  const isImage =
    fileType.toUpperCase().includes('JPG') ||
    fileType.toUpperCase().includes('JPEG') ||
    fileType.toUpperCase().includes('PNG') ||
    fileName.toLowerCase().match(/\.(jpg|jpeg|png)$/i) ||
    fileData.startsWith('data:image/');

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm truncate" title={fileName}>
                {title}: {fileName}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-mono font-bold text-[10px] uppercase">
                  {fileType}
                </span>
                {fileSize && <span>• {fileSize}</span>}
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3 h-3" /> Verified Attachment
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={fileData}
              download={fileName}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Download original file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Preview */}
        <div className="p-4 bg-slate-100 flex-1 overflow-auto flex items-center justify-center min-h-[350px]">
          {isImage ? (
            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 max-w-full flex items-center justify-center">
              <img
                src={fileData}
                alt={fileName}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-[65vh] flex flex-col bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <iframe
                src={fileData}
                title={fileName}
                className="w-full flex-1 border-0"
              />
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600 flex items-center justify-center gap-3">
                <span>PDF preview embedded</span>
                <a
                  href={fileData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                >
                  Open in New Window <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-xl border border-slate-200 shadow-xs max-w-md">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="font-bold text-slate-800 text-sm">{fileName}</p>
              <p className="text-xs text-slate-500 mt-1">
                Preview not directly available for this format. You can download or view the document using the button below.
              </p>
              <a
                href={fileData}
                download={fileName}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download File ({fileSize || fileType})
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Supporting Evidence Proof • Non-Technical Verification</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
