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
  Edit3,
  Star,
  X,
  Save,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { MONTHS, MONTHLY_EXAM_SUBJECTS, EVALUATION_OPTIONS } from '../services/mockData';
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
    updateGrade,
    toggleStudentDistinction,
  } = useSchool();

  const [viewStyle, setViewStyle] = useState<'cards' | 'table'>('cards');

  // Edit Grade Modal State
  const [editingGrade, setEditingGrade] = useState<StudentGrade | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editMonth, setEditMonth] = useState('');
  const [editScore, setEditScore] = useState<number>(0);
  const [editMaxScore, setEditMaxScore] = useState<number>(100);
  const [editEvaluation, setEditEvaluation] = useState('');
  const [editIsDistinguished, setEditIsDistinguished] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  // Filtered grades calculation
  const filteredGrades = useMemo(() => {
    return currentGrades.filter((g) => {
      // Search filter (name)
      const matchesSearch =
        !searchQuery.trim() ||
        g.studentName.toLowerCase().includes(searchQuery.toLowerCase());

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

  const getStatusBadge = (score: number, maxScore: number, customEvaluation?: string) => {
    if (customEvaluation) {
      if (customEvaluation === 'متفوق') {
        return {
          text: 'متفوق 🌟',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold',
          bar: 'bg-emerald-500',
        };
      }
      if (customEvaluation === 'ممتاز') {
        return {
          text: 'ممتاز ✨',
          bg: 'bg-blue-50 text-blue-700 border-blue-200 font-extrabold',
          bar: 'bg-blue-500',
        };
      }
      if (customEvaluation === 'جيد جداً') {
        return {
          text: 'جيد جداً',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold',
          bar: 'bg-indigo-500',
        };
      }
      if (customEvaluation === 'جيد') {
        return {
          text: 'جيد',
          bg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
          bar: 'bg-amber-500',
        };
      }
      if (customEvaluation === 'مقبول') {
        return {
          text: 'مقبول',
          bg: 'bg-slate-50 text-slate-700 border-slate-200 font-bold',
          bar: 'bg-slate-500',
        };
      }
      return {
        text: customEvaluation,
        bg: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
        bar: 'bg-rose-500',
      };
    }

    const pct = (score / maxScore) * 100;
    if (pct >= 95) {
      return {
        text: 'متفوق 🌟',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold',
        bar: 'bg-emerald-500',
      };
    } else if (pct >= 85) {
      return {
        text: 'ممتاز ✨',
        bg: 'bg-blue-50 text-blue-700 border-blue-200 font-extrabold',
        bar: 'bg-blue-500',
      };
    } else if (pct >= 75) {
      return {
        text: 'جيد جداً',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold',
        bar: 'bg-indigo-500',
      };
    } else if (pct >= 65) {
      return {
        text: 'جيد',
        bg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
        bar: 'bg-amber-500',
      };
    } else {
      return {
        text: 'مقبول',
        bg: 'bg-slate-50 text-slate-700 border-slate-200 font-bold',
        bar: 'bg-slate-500',
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

  const handleStartEditGrade = (e: React.MouseEvent, grade: StudentGrade) => {
    e.stopPropagation();
    setEditingGrade(grade);
    setEditStudentName(grade.studentName);
    setEditSubject(grade.subject);
    setEditMonth(grade.month);
    setEditScore(grade.score);
    setEditMaxScore(grade.maxScore);
    setEditEvaluation(grade.evaluation || 'متفوق');
    setEditIsDistinguished(!!grade.isDistinguished);
    setEditNotes(grade.notes || '');
  };

  const handleSaveGradeEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;
    await updateGrade({
      ...editingGrade,
      studentName: editStudentName.trim(),
      subject: editSubject,
      month: editMonth,
      score: Number(editScore),
      maxScore: Number(editMaxScore),
      evaluation: editEvaluation,
      isDistinguished: editIsDistinguished,
      notes: editNotes.trim() || undefined,
    });
    setEditingGrade(null);
  };

  const handleToggleDistinction = async (e: React.MouseEvent, gradeId: string) => {
    e.stopPropagation();
    await toggleStudentDistinction(gradeId);
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
              placeholder="ابحث عن طالب بالاسم..."
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

            {/* Subject Selector (Monthly Exam Subjects) */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="الكل">جميع المواد</option>
              {MONTHLY_EXAM_SUBJECTS.map((s) => (
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
            const badge = getStatusBadge(grade.score, grade.maxScore, grade.evaluation);
            const percentage = Math.round((grade.score / grade.maxScore) * 100);

            return (
              <div
                key={grade.id}
                onClick={() => handleOpenCertificate(grade)}
                className={`group relative bg-white rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden border ${
                  grade.isDistinguished
                    ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-amber-50'
                    : 'border-slate-200/90 hover:border-blue-300'
                }`}
              >
                {/* Top Bar inside card */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                        {grade.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                            {grade.studentName}
                          </h4>
                          {grade.isDistinguished && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border border-amber-300 shadow-xs inline-flex items-center gap-1">
                              ⭐ متميز
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
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
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={(e) => handleToggleDistinction(e, grade.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            grade.isDistinguished
                              ? 'text-amber-500 bg-amber-100/60 hover:bg-amber-100'
                              : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                          }`}
                          title={grade.isDistinguished ? 'إلغاء وسام الطالب المتميز' : 'تمييز الطالب كـ (طالب متميز ⭐)'}
                        >
                          <Star className={`w-3.5 h-3.5 ${grade.isDistinguished ? 'fill-amber-500' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => handleStartEditGrade(e, grade)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="تعديل الدرجة وبيانات الطالب"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteGrade(e, grade.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="حذف هذه الدرجة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                  const badge = getStatusBadge(grade.score, grade.maxScore, grade.evaluation);
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
                        {grade.isDistinguished && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                            ⭐ متميز
                          </span>
                        )}
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
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenCertificate(grade)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                          >
                            شهادة
                          </button>
                          {currentTeacher && (
                            <>
                              <button
                                onClick={(e) => handleToggleDistinction(e, grade.id)}
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                  grade.isDistinguished
                                    ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                    : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                                }`}
                                title={grade.isDistinguished ? 'إلغاء تمييز الطالب' : 'منح وسام طالب متميز ⭐'}
                              >
                                <Star className={`w-3.5 h-3.5 ${grade.isDistinguished ? 'fill-amber-500' : ''}`} />
                              </button>
                              <button
                                onClick={(e) => handleStartEditGrade(e, grade)}
                                className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                                title="تعديل الدرجة"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteGrade(e, grade.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                title="حذف الدرجة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
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

      {/* Edit Grade Modal */}
      {editingGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                <h4 className="font-bold text-sm sm:text-base">تعديل درجة وبيانات الطالب</h4>
              </div>
              <button
                onClick={() => setEditingGrade(null)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGradeEdit} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطالب الرباعي *</label>
                <input
                  type="text"
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الشهر / الاختبار</label>
                  <select
                    value={editMonth}
                    onChange={(e) => setEditMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المادة</label>
                  <select
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    {MONTHLY_EXAM_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الدرجة المحققة *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editScore}
                    onChange={(e) => {
                      const sc = Number(e.target.value);
                      setEditScore(sc);
                      const pct = (sc / (editMaxScore || 100)) * 100;
                      if (pct >= 95) setEditEvaluation('متفوق');
                      else if (pct >= 85) setEditEvaluation('ممتاز');
                      else if (pct >= 75) setEditEvaluation('جيد جداً');
                      else if (pct >= 65) setEditEvaluation('جيد');
                      else if (pct >= 50) setEditEvaluation('مقبول');
                      else setEditEvaluation('يحتاج متابعة');
                    }}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-blue-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الدرجة القصوى</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editMaxScore}
                    onChange={(e) => setEditMaxScore(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-slate-600 bg-white"
                  />
                </div>
              </div>

              {/* Evaluation options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>التقدير المحدد: <span className="text-blue-700 font-bold underline">{editEvaluation}</span></span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {EVALUATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setEditEvaluation(opt)}
                      className={`py-1.5 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        editEvaluation === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distinguished Student switch */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-black text-amber-950">تمييز كـ «طالب متميز» (لوحة الشرف) ⭐</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsDistinguished}
                    onChange={(e) => setEditIsDistinguished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظة المعلم</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
