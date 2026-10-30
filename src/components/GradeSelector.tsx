import React from 'react';
import { Layers, Users, BookOpen, Sparkles } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const GradeSelector: React.FC = () => {
  const {
    grades,
    sections,
    selectedGradeId,
    selectedSectionId,
    setSelectedGradeId,
    setSelectedSectionId,
    currentGrade,
    currentSection,
    currentGrades,
  } = useSchool();

  return (
    <section className="w-full mb-6">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-blue-100 p-4 sm:p-6 shadow-xs hover:shadow-md transition-shadow">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                صفوف المرحلة الابتدائية
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  من الصف الأول إلى السادس
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                اختر الصف الدراسي والفصل لعرض جدول الحصص والدرجات الشهرية
              </p>
            </div>
          </div>
        </div>

        {/* 1. Grade Selection Grid (Responsive, fits all 6 primary classes smoothly) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 mb-5">
          {grades.map((grade) => {
            const isSelected = selectedGradeId === grade.id;
            return (
              <button
                key={grade.id}
                onClick={() => setSelectedGradeId(grade.id)}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/25 border-transparent scale-102 ring-2 ring-blue-300 ring-offset-1'
                    : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200 hover:border-blue-200'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {grade.code}
                </span>
                <span className="truncate">{grade.name}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Section (Class/الفصل) Selection (A to E / أ إلى هـ) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                فصول الصف (حتى حرف e):
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (مثل: 6/e)
              </span>
            </div>

            {/* Class / الفصل Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {sections.map((sec) => {
                const isSelected = selectedSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-600/20 scale-105'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <span>{sec.name}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                        isSelected ? 'bg-blue-800 text-blue-100' : 'bg-white text-slate-500'
                      }`}
                    >
                      {sec.letter}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Active Class Highlight Banner */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-xs">
              {currentGrade.code}/{currentSection.letter.toLowerCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-blue-950">
                  {currentGrade.name} - {currentSection.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white">
                  الفصل الحالي
                </span>
              </div>
              <p className="text-xs text-blue-700 font-mono">
                رمز الفصل: {currentGrade.code}/{currentSection.letter.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-100 text-slate-700 shadow-xs">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>الطلاب: <strong className="text-blue-900 font-bold">{currentGrades.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-100 text-slate-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>المتفوقون: <strong className="text-amber-600 font-bold">{currentGrades.filter(g => g.score >= 90).length}</strong></span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
