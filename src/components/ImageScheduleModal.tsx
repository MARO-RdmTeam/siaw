import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Printer } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const ImageScheduleModal: React.FC = () => {
  const { previewImage, setPreviewImage, currentGrade, currentSection } = useSchool();
  const [scale, setScale] = useState<number>(1);

  if (!previewImage) return null;

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setScale(1);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = previewImage;
    a.download = `schedule_${currentGrade.code}_${currentSection.letter}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-900 text-white border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold">
              معاينة جدول الحصص: {currentGrade.name} - شعبة {currentSection.letter}
            </h4>
            <span className="text-xs text-slate-400">
              نسبة التكبير: {Math.round(scale * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetZoom}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              title="إعادة ضبط الحجم"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-slate-700 mx-1" />

            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              title="تحميل الصورة"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              title="طباعة"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setScale(1);
                setPreviewImage(null);
              }}
              className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer ml-1"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoomable Image Viewport */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100">
          <img
            src={previewImage}
            alt="صورة الجدول بالحجم الكامل"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
            className="transition-transform duration-200 max-w-full max-h-full object-contain rounded-xl shadow-lg border border-slate-200"
          />
        </div>

      </div>
    </div>
  );
};

