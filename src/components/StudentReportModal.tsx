import React from 'react';
import { X, Award, Printer, Sparkles, School } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const StudentReportModal: React.FC = () => {
  const { selectedStudentReport, setSelectedStudentReport, currentGrade, currentSection } =
    useSchool();

  if (!selectedStudentReport) return null;

  const percentage = Math.round((selectedStudentReport.score / selectedStudentReport.maxScore) * 100);
  const isExcellent = percentage >= 90;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <Award className="w-4 h-4 text-amber-500" />
            <span>معاينة شهادة التقدير وبطاقة الدرجات</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الشهادة</span>
            </button>

            <button
              onClick={() => setSelectedStudentReport(null)}
              className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Container */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="relative p-6 sm:p-10 rounded-3xl border-4 border-double border-blue-200 bg-gradient-to-b from-white via-blue-50/20 to-white shadow-sm space-y-6 text-center">
            
            {/* Watermark / Seal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <School className="w-96 h-96 text-blue-900" />
            </div>

            {/* School Logo & Header */}
            <div className="flex flex-col items-center justify-center space-y-1 mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-blue-100 p-1.5 shadow-sm mb-1">
                <img src="/logo.jpg" alt="S.I.A.W Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-bold text-slate-400 tracking-wider">
                وزارة التربية والتعليم • S.I.A.W Language School
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-blue-950">
                مدرسة سعد بن أبي وقاص الرسمية للغات
              </h3>
              <p className="text-xs text-blue-600 font-bold">
                إدارة الشؤون التعليمية والامتحانات
              </p>
            </div>

            {/* Certificate Ribbon */}
            <div className="py-2">
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-700 via-sky-600 to-blue-700 text-white text-base sm:text-lg font-black shadow-md shadow-blue-500/20">
                {isExcellent ? '🌟 شهادة شكر وتقدير وتفوق' : '📋 بطاقة درجات الاختبار الشهري'}
              </span>
            </div>

            {/* Body Text */}
            <div className="space-y-4 max-w-lg mx-auto text-slate-700">
              <p className="text-sm sm:text-base leading-relaxed">
                يسر إدارة المدرسة ومعلم المادة أن يمنحوا الطالب / الطالبة:
              </p>

              <div className="py-2 border-b-2 border-dashed border-blue-300">
                <span className="text-xl sm:text-2xl font-black text-blue-900">
                  {selectedStudentReport.studentName}
                </span>
                {selectedStudentReport.seatNumber && (
                  <span className="block text-xs text-slate-400 font-mono mt-0.5">
                    رقم الجلوس: {selectedStudentReport.seatNumber}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                المقيد بالصف <strong className="text-slate-900 font-bold">{currentGrade.name}</strong> -{' '}
                <strong className="text-slate-900 font-bold">{currentSection.name}</strong>
                <br />
                نظراً لحصوله على نتيجة متميزة في اختبار <strong className="text-blue-800">{selectedStudentReport.month}</strong> في مادة:
              </p>

              <div className="inline-block px-4 py-1.5 rounded-xl bg-blue-100/70 text-blue-900 font-black text-base">
                {selectedStudentReport.subject}
              </div>

              {/* Score Display */}
              <div className="p-4 rounded-2xl bg-white border border-blue-200/80 shadow-inner flex items-center justify-around">
                <div>
                  <span className="block text-xs text-slate-400">الدرجة المحققة</span>
                  <span className="text-2xl sm:text-3xl font-black text-blue-900">
                    {selectedStudentReport.score} <span className="text-slate-400 text-sm">/ {selectedStudentReport.maxScore}</span>
                  </span>
                </div>

                <div className="h-10 w-px bg-slate-200" />

                <div>
                  <span className="block text-xs text-slate-400">النسبة المئوية</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                    {percentage}%
                  </span>
                </div>

                <div className="h-10 w-px bg-slate-200" />

                <div>
                  <span className="block text-xs text-slate-400">التقدير والمستوى</span>
                  <span className="text-base sm:text-lg font-black text-blue-800">
                    {selectedStudentReport.evaluation || (isExcellent ? 'متفوق 🌟' : percentage >= 85 ? 'ممتاز ✨' : 'جيد جداً')}
                  </span>
                </div>
              </div>

              {selectedStudentReport.notes && (
                <p className="text-xs italic text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  كلمة المعلم: "{selectedStudentReport.notes}"
                </p>
              )}
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between px-4 sm:px-10 text-xs font-bold text-slate-600">
              <div className="text-center space-y-2">
                <span>معلم المادة</span>
                <span className="block text-slate-900 font-black">{selectedStudentReport.teacherName}</span>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-500 flex flex-col items-center justify-center text-[10px] text-blue-700 bg-blue-50/50">
                <Sparkles className="w-4 h-4 text-amber-500 mb-0.5" />
                <span className="font-bold">معتمد رسمياً</span>
              </div>

              <div className="text-center space-y-2">
                <span>مدير المدرسة</span>
                <span className="block text-slate-900 font-black">إدارة المدرسة</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2">
              تاريخ الإصدار: {selectedStudentReport.date} • تم استخراج الوثيقة من البوابة الرقمية
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
