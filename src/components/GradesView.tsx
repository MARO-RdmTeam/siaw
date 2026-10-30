import React, { useState, useMemo } from 'react';
import {
  Search,
  Award,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Users,
  Trash2,
  PlusCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { MONTHS, SUBJECTS } from '../services/mockData';
import type { StudentGrade } from '../types';

export const GradesView: React.FC = () => {
  const {
    currentGrades,
    searchQuery,
    setSearchQuery,
    selectedMonth,
    setSelectedMonth,
    selectedSubject,
    setSelectedSubject,
    setSelectedStudentReport,
    triggerCelebration,
    currentTeacher,
    setTeacherModalOpen,
    removeGrade,
  } = useSchool();

  const [viewStyle, setViewStyle] = useState<'cards' | 'table'>('cards');

  // Filtered grades calculation
  const filteredGrades = useMemo(() => {
    return currentGrades.filter((g) => {
      // Search filter (name or seat number)
      const matchesSearch =
        !searchQuery.trim() ||
        g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.seatNumber && g.seatNumber.includes(searchQuery.trim()));

      // Month filter
      const matchesMonth = selectedMonth === 'الكل' || g.month === selectedMonth;

      // Subject filter
      const matchesSubject = selectedSubject === 'الكل' || g.subject === selectedSubject;

      return matchesSearch && matchesMonth && matchesSubject;
    });
  }, [currentGrades, searchQuery, selectedMonth, selectedSubject]);

  // Statistics
  const stats = useMemo(() => {
    if (filteredGrades.length === 0) {
      return { avg: 0, max: 0, excellentCount: 0, passRate: 100 };
    }
    const scores = filteredGrades.map((g) => (g.score / g.maxScore) * 100);
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / scores.length);
    const max = Math.max(...filteredGrades.map((g) => g.score));
    const excellentCount = filteredGrades.filter((g) => (g.score / g.maxScore) >= 0.9).length;
    const passCount = filteredGrades.filter((g) => (g.score / g.maxScore) >= 0.5).length;
    const passRate = Math.round((passCount / filteredGrades.length) * 100);

    return { avg, max, excellentCount, passRate };
  }, [filteredGrades]);

  const getStatusBadge = (score: number, maxScore: number) => {
    const pct = (score / maxScore) * 100;
    if (pct >= 90) {
      return {
        text: 'ممتاز 🌟',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        bar: 'bg-emerald-500',
      };
    } else if (pct >= 80) {
      return {
        text: 'جيد جداً',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        bar: 'bg-blue-500',
      };
    } else if (pct >= 65) {
      return {
        text: 'جيد',
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
        bar: 'bg-sky-500',
      };
    } else {
      return {
        text: 'يحتاج متابعة',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        bar: 'bg-amber-500',
      };
    }
  };

  const handleOpenCertificate = (grade: StudentGrade) => {
    setSelectedStudentReport(grade);
    if ((grade.score / grade.maxScore) >= 0.85) {
      triggerCelebration();
    }
  };

  const handleDeleteGrade = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف درجة هذا الطالب؟')) {
      removeGrade(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Statistics Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">متوسط الدرجات</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-900">{stats.avg}%</span>
            <span className="text-xs text-blue-500 font-semibold">المعدل العام</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">أعلى درجة</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{stats.max}</span>
            <span className="text-xs text-slate-400 font-semibold">/ 100</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">عدد المتفوقين</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">{stats.excellentCount}</span>
            <span className="text-xs text-emerald-500 font-semibold">طالب ممتاز</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">نسبة النجاح</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-sky-700">{stats.passRate}%</span>
            <span className="text-xs text-sky-500 font-semibold">ناجح</span>
          </div>
        </div>

      </div>

      {/* 2. Filter & Search Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن طالب بالاسم أو رقم الجلوس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                مسح
              </button>
            )}
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="الكل">كل الشهور والاختبارات</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="الكل">جميع المواد</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Layout switch & Add grade button */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewStyle('cards')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewStyle === 'cards' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
                }`}
                title="عرض بطاقات"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewStyle('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewStyle === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
                }`}
                title="عرض جدول"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setTeacherModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة درجة طالب</span>
            </button>
          </div>

        </div>

        {/* Filter Badges Active */}
        {(selectedMonth !== 'الكل' || selectedSubject !== 'الكل' || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs text-slate-600">
            <span>التصفية الحالية:</span>
            {searchQuery && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                بحث: "{searchQuery}"
              </span>
            )}
            {selectedMonth !== 'الكل' && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                الشهر: {selectedMonth}
              </span>
            )}
            {selectedSubject !== 'الكل' && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                المادة: {selectedSubject}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedMonth('الكل');
                setSelectedSubject('الكل');
              }}
              className="text-xs text-red-500 hover:underline mr-auto cursor-pointer"
            >
              إلغاء التصفية
            </button>
          </div>
        )}

      </div>

      {/* 3. Grades Cards View */}
      {viewStyle === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGrades.map((grade) => {
            const badge = getStatusBadge(grade.score, grade.maxScore);
            const percentage = Math.round((grade.score / grade.maxScore) * 100);

            return (
              <div
                key={grade.id}
                onClick={() => handleOpenCertificate(grade)}
                className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-blue-300 p-5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Top Bar inside card */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                        {grade.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                          {grade.studentName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          {grade.seatNumber && (
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-600 font-bold">
                              جلوس: {grade.seatNumber}
                            </span>
                          )}
                          <span>{grade.date}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                      {badge.text}
                    </span>
                  </div>

                  {/* Subject & Exam Month */}
                  <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                    <span className="font-bold text-slate-700">{grade.subject}</span>
                    <span className="text-slate-500">{grade.month}</span>
                  </div>

                  {/* Score & Progress Bar */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">الدرجة المحققة:</span>
                      <span className="text-sm font-black text-blue-900">
                        {grade.score} <span className="text-slate-400 font-normal">/ {grade.maxScore}</span>
                        <span className="text-blue-600 font-bold mr-1.5 font-mono">({percentage}%)</span>
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${badge.bar}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Teacher Notes */}
                  {grade.notes && (
                    <p className="text-xs text-slate-500 bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/60 line-clamp-2">
                      💬 {grade.notes}
                    </p>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 truncate max-w-[150px]">
                    المعلم: {grade.teacherName}
                  </span>

                  <div className="flex items-center gap-2">
                    {currentTeacher && (
                      <button
                        onClick={(e) => handleDeleteGrade(e, grade.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="حذف هذه الدرجة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <span className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:underline">
                      عرض الشهادة 🏅
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 4. Grades Table View (Desktop) */}
      {viewStyle === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">اسم الطالب</th>
                  <th className="py-3.5 px-4">رقم الجلوس</th>
                  <th className="py-3.5 px-4">المادة</th>
                  <th className="py-3.5 px-4">الشهر / الاختبار</th>
                  <th className="py-3.5 px-4 text-center">الدرجة</th>
                  <th className="py-3.5 px-4 text-center">النسبة</th>
                  <th className="py-3.5 px-4 text-center">التقدير</th>
                  <th className="py-3.5 px-4">المعلم</th>
                  <th className="py-3.5 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrades.map((grade) => {
                  const badge = getStatusBadge(grade.score, grade.maxScore);
                  const percentage = Math.round((grade.score / grade.maxScore) * 100);

                  return (
                    <tr
                      key={grade.id}
                      onClick={() => handleOpenCertificate(grade)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                          {grade.studentName.charAt(0)}
                        </span>
                        <span>{grade.studentName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                        {grade.seatNumber || '-'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {grade.subject}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {grade.month}
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-blue-900">
                        {grade.score} / {grade.maxScore}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-blue-600 font-mono">
                        {percentage}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {grade.teacherName}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenCertificate(grade)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100"
                          >
                            شهادة
                          </button>
                          {currentTeacher && (
                            <button
                              onClick={(e) => handleDeleteGrade(e, grade.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredGrades.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">لا توجد درجات مطابقة لبحثك</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            جرب تغيير معايير البحث أو اختيار شهر أو مادة أخرى
          </p>
          <button
            onClick={() => setTeacherModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            إضافة درجة لهذا الصف الآن
          </button>
        </div>
      )}

    </div>
  );
};
