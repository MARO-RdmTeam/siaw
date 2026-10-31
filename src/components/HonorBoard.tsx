import React, { useMemo } from 'react';
import { Trophy, Sparkles, Star, Medal, PartyPopper } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import type { StudentGrade } from '../types';

export const HonorBoard: React.FC = () => {
  const {
    currentGrade,
    currentSection,
    currentGrades,
    setSelectedStudentReport,
    triggerCelebration,
  } = useSchool();

  const sortedAchievers = useMemo(() => {
    const list = [...currentGrades].sort((a, b) => {
      const pctA = a.score / a.maxScore;
      const pctB = b.score / b.maxScore;
      return pctB - pctA;
    });
    return list;
  }, [currentGrades]);

  const top1 = sortedAchievers[0];
  const top2 = sortedAchievers[1];
  const top3 = sortedAchievers[2];
  const otherAchievers = sortedAchievers.slice(3).filter((g) => (g.score / g.maxScore) >= 0.85);

  const handleStudentClick = (student: StudentGrade) => {
    setSelectedStudentReport(student);
    triggerCelebration();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Celebration Trigger */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md text-amber-300 animate-float shadow-inner">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  لوحة شرف الأوائل والمتفوقين
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950">
                  {currentGrade.name} ({currentSection.letter})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                نحتفي بكوكبة الطلاب المتميزين الذين أبدعوا في الاختبارات الشهرية وحققوا أعلى المراتب.
              </p>
            </div>
          </div>

          <button
            onClick={triggerCelebration}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <PartyPopper className="w-4 h-4 animate-bounce" />
            <span>إطلاق قصاصات الاحتفال 🎉</span>
          </button>
        </div>
      </div>

      {/* Empty State when no grades exist */}
      {!top1 && (
        <div className="bg-white rounded-3xl border border-blue-100/90 p-10 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center">
            <Trophy className="w-7 h-7" />
          </div>
          <h4 className="text-base font-extrabold text-slate-800">
            لا توجد درجات مرصودة لهذا الفصل حتى الآن
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ستظهر منصة تتويج الأوائل والمتفوقين تلقائياً هنا فور قيام المعلمين برصد درجات الاختبارات الشهرية.
          </p>
        </div>
      )}

      {/* Podium for Top 3 Students */}
      {top1 && (
        <div className="bg-white rounded-3xl border border-blue-100/90 p-6 sm:p-8 shadow-sm">
          <h4 className="text-center text-sm font-extrabold text-slate-500 mb-8 uppercase tracking-wider">
            منصة تتويج الثلاثة الأوائل
          </h4>

          <div className="flex flex-col md:flex-row items-end justify-center gap-4 sm:gap-6 pt-10 pb-4 max-w-4xl mx-auto">
            
            {/* Rank 2 (Silver) */}
            {top2 && (
              <div
                onClick={() => handleStudentClick(top2)}
                className="w-full md:w-1/3 order-2 md:order-1 flex flex-col items-center cursor-pointer group"
              >
                <div className="relative mb-3 flex flex-col items-center group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 border-4 border-slate-300 flex items-center justify-center shadow-md">
                    <Medal className="w-8 h-8 text-slate-600" />
                  </div>
                  <span className="absolute -top-3 px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-600 text-white shadow-xs">
                    المركز الثاني
                  </span>
                  <span className="text-sm font-black text-slate-800 mt-2 text-center group-hover:text-blue-600">
                    {top2.studentName}
                  </span>
                  <span className="text-xs font-bold text-blue-600 font-mono">
                    {top2.score} / {top2.maxScore} ({Math.round((top2.score / top2.maxScore) * 100)}%)
                  </span>
                  <span className="text-[11px] text-slate-400">{top2.subject}</span>
                </div>

                <div className="w-full h-36 bg-gradient-to-b from-slate-200 to-slate-300 rounded-t-3xl flex flex-col items-center justify-center text-slate-700 shadow-inner p-3">
                  <span className="text-3xl font-black">2</span>
                  <span className="text-xs font-bold">فضية التفوق</span>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold - Center & Highest) */}
            <div
              onClick={() => handleStudentClick(top1)}
              className="w-full md:w-1/3 order-1 md:order-2 flex flex-col items-center cursor-pointer group"
            >
              <div className="relative mb-3 flex flex-col items-center group-hover:-translate-y-2 transition-transform duration-300">
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-amber-400 absolute -top-4 -right-2 animate-bounce" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 border-4 border-amber-300 flex items-center justify-center shadow-lg shadow-amber-300/40 animate-glow">
                    <Trophy className="w-10 h-10 text-amber-900" />
                  </div>
                </div>
                <span className="mt-1 px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm">
                  👑 الأول على الفصل
                </span>
                <span className="text-base font-black text-slate-900 mt-1.5 text-center group-hover:text-blue-600">
                  {top1.studentName}
                </span>
                <span className="text-sm font-black text-amber-600 font-mono">
                  {top1.score} / {top1.maxScore} (100%)
                </span>
                <span className="text-xs text-slate-400">{top1.subject}</span>
              </div>

              <div className="w-full h-48 bg-gradient-to-b from-amber-300 to-yellow-400 rounded-t-3xl flex flex-col items-center justify-center text-amber-950 shadow-md p-3">
                <span className="text-4xl font-black">1</span>
                <span className="text-xs font-black">الوسام الذهبي</span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            {top3 && (
              <div
                onClick={() => handleStudentClick(top3)}
                className="w-full md:w-1/3 order-3 md:order-3 flex flex-col items-center cursor-pointer group"
              >
                <div className="relative mb-3 flex flex-col items-center group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 border-4 border-amber-600 flex items-center justify-center shadow-md">
                    <Medal className="w-8 h-8 text-amber-100" />
                  </div>
                  <span className="absolute -top-3 px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-800 text-white shadow-xs">
                    المركز الثالث
                  </span>
                  <span className="text-sm font-black text-slate-800 mt-2 text-center group-hover:text-blue-600">
                    {top3.studentName}
                  </span>
                  <span className="text-xs font-bold text-blue-600 font-mono">
                    {top3.score} / {top3.maxScore} ({Math.round((top3.score / top3.maxScore) * 100)}%)
                  </span>
                  <span className="text-[11px] text-slate-400">{top3.subject}</span>
                </div>

                <div className="w-full h-28 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-3xl flex flex-col items-center justify-center text-amber-100 shadow-inner p-3">
                  <span className="text-3xl font-black">3</span>
                  <span className="text-xs font-bold">برونزية الشرف</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Other High Achievers List */}
      {otherAchievers.length > 0 && (
        <div className="bg-white rounded-3xl border border-blue-100/90 p-5 sm:p-6 shadow-sm">
          <h4 className="font-extrabold text-slate-800 text-base mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            باقي فرسان التميز والتفوق (درجات 85% فما فوق)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {otherAchievers.map((student) => (
              <div
                key={student.id}
                onClick={() => handleStudentClick(student)}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                    {student.studentName.charAt(0)}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-blue-700">
                      {student.studentName}
                    </h5>
                    <p className="text-[11px] text-slate-400">{student.subject}</p>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs font-black text-emerald-600 font-mono">
                    {student.score}/{student.maxScore}
                  </span>
                  <span className="block text-[10px] text-slate-400">شهادة 🏅</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
