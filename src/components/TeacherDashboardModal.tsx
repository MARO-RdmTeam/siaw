import React, { useState } from 'react';
import {
  X,
  Lock,
  PlusCircle,
  Upload,
  CheckCircle2,
  Bell,
  Sparkles,
  LogOut,
  Save,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Star,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { MONTHS, MONTHLY_EXAM_SUBJECTS, EVALUATION_OPTIONS, SUBJECTS } from '../services/mockData';
import type { SectionId, Announcement, SchedulePeriod, SectionSchedule } from '../types';

export const TeacherDashboardModal: React.FC = () => {
  const {
    teacherModalOpen,
    setTeacherModalOpen,
    currentTeacher,
    loginTeacher,
    logoutTeacher,
    grades,
    sections,
    selectedGradeId,
    selectedSectionId,
    addNewGrade,
    updateScheduleImage,
    updateTimetableSchedule,
    addNewAnnouncement,
    updateAnnouncement,
    removeAnnouncement,
    currentAnnouncements,
    currentSchedule,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'grades' | 'schedule' | 'announcements'>('grades');

  // Teacher Email & Password Authentication State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Add Grade Form State
  const [targetGradeId, setTargetGradeId] = useState<number>(selectedGradeId);
  const [targetSectionId, setTargetSectionId] = useState<SectionId>(selectedSectionId);
  const [studentName, setStudentName] = useState('');
  const [gradeMonth, setGradeMonth] = useState(MONTHS[0]);
  const [gradeSubject, setGradeSubject] = useState(MONTHLY_EXAM_SUBJECTS[0]);
  const [score, setScore] = useState<number>(95);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [evaluation, setEvaluation] = useState<string>('متفوق');
  const [isDistinguished, setIsDistinguished] = useState<boolean>(false);
  const [notes, setNotes] = useState('');
  const [gradeSuccessMsg, setGradeSuccessMsg] = useState('');

  // Schedule Image Upload State
  const [scheduleImageMode, setScheduleImageMode] = useState<'image' | 'table'>('image');
  const [scheduleImageUrl, setScheduleImageUrl] = useState(currentSchedule.imageUrl || '');
  const [scheduleImageTitle, setScheduleImageTitle] = useState(currentSchedule.imageTitle || '');
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState('');

  // Written Schedule Dashboard State
  const [dashboardScheduleDay, setDashboardScheduleDay] = useState<number>(0);
  const [dashboardPeriodsDraft, setDashboardPeriodsDraft] = useState<SchedulePeriod[]>(() => {
    return currentSchedule.timetable[0]?.periods ? JSON.parse(JSON.stringify(currentSchedule.timetable[0].periods)) : [];
  });

  // Announcement Form State
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'important' | 'urgent'>('important');
  const [annSuccessMsg, setAnnSuccessMsg] = useState('');

  if (!teacherModalOpen) return null;

  // Handle Teacher Email & Password Login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const res = await loginTeacher(email, password);

    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error || 'تعذر تسجيل الدخول، يرجى التأكد من البريد وكلمة المرور');
    }
  };

  // Handle Score & Evaluation auto-sync
  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    const pct = (newScore / (maxScore || 100)) * 100;
    if (pct >= 95) setEvaluation('متفوق');
    else if (pct >= 85) setEvaluation('ممتاز');
    else if (pct >= 75) setEvaluation('جيد جداً');
    else if (pct >= 65) setEvaluation('جيد');
    else if (pct >= 50) setEvaluation('مقبول');
    else setEvaluation('يحتاج متابعة');
  };

  // Handle Grade Submission
  const handleAddGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('يرجى كتابة اسم الطالب');
      return;
    }

    await addNewGrade({
      studentName: studentName.trim(),
      gradeId: targetGradeId,
      sectionId: targetSectionId,
      month: gradeMonth,
      subject: gradeSubject,
      score: Number(score),
      maxScore: Number(maxScore),
      evaluation: evaluation || 'متفوق',
      isDistinguished,
      notes: notes.trim() || undefined,
      teacherName: currentTeacher ? currentTeacher.name : 'معلم المادة',
    });

    setGradeSuccessMsg('تمت إضافة الدرجة بنجاح إلى سجل درجات الفصل!');
    setStudentName('');
    setIsDistinguished(false);
    setNotes('');
    setTimeout(() => setGradeSuccessMsg(''), 4000);
  };

  // Handle Schedule Image Upload / Change
  const handleSaveScheduleImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleImageUrl.trim()) {
      alert('يرجى إدخال رابط الصورة أو اختيار ملف صورة');
      return;
    }

    await updateScheduleImage(scheduleImageUrl, scheduleImageTitle);
    setScheduleSuccessMsg('تم حفظ وتحديث صورة الجدول بنجاح!');
    setTimeout(() => setScheduleSuccessMsg(''), 4000);
  };

  const handleSwitchDashboardDay = (dayIdx: number) => {
    setDashboardScheduleDay(dayIdx);
    const day = currentSchedule.timetable.find((d) => d.dayIndex === dayIdx) || currentSchedule.timetable[0];
    if (day) {
      setDashboardPeriodsDraft(JSON.parse(JSON.stringify(day.periods)));
    }
  };

  const handleDashboardPeriodChange = (idx: number, field: 'subject' | 'teacher', val: string) => {
    setDashboardPeriodsDraft((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSaveDashboardWrittenSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTimetable = currentSchedule.timetable.map((day) => {
      if (day.dayIndex === dashboardScheduleDay) {
        return {
          ...day,
          periods: dashboardPeriodsDraft,
        };
      }
      return day;
    });

    const updated: SectionSchedule = {
      ...currentSchedule,
      timetable: newTimetable,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await updateTimetableSchedule(updated);
    setScheduleSuccessMsg('تم حفظ وتحديث جدول الحصص بنجاح!');
    setTimeout(() => setScheduleSuccessMsg(''), 4000);
  };

  // Handle Local File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setScheduleImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Announcement Submit (Add or Edit)
  const handleAddAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      alert('يرجى ملء عنوان وتفاصيل التنبيه');
      return;
    }

    if (editingAnnouncementId) {
      const existing = currentAnnouncements.find((a) => a.id === editingAnnouncementId);
      if (existing) {
        await updateAnnouncement({
          ...existing,
          title: annTitle.trim(),
          content: annContent.trim(),
          priority: annPriority,
        });
        setAnnSuccessMsg('تم تحديث التنبيه بنجاح!');
      }
      setEditingAnnouncementId(null);
    } else {
      await addNewAnnouncement({
        title: annTitle.trim(),
        content: annContent.trim(),
        gradeId: targetGradeId,
        sectionId: targetSectionId,
        author: currentTeacher ? `${currentTeacher.name} (${currentTeacher.subject})` : 'إدارة مدرسة سعد بن أبي وقاص',
        priority: annPriority,
      });
      setAnnSuccessMsg('تم نشر التنبيه بنجاح في لوحة إعلانات الفصل!');
    }

    setAnnTitle('');
    setAnnContent('');
    setTimeout(() => setAnnSuccessMsg(''), 4000);
  };

  const handleStartEditAnnouncement = (ann: Announcement) => {
    setEditingAnnouncementId(ann.id);
    setAnnTitle(ann.title);
    setAnnContent(ann.content);
    setAnnPriority(ann.priority);
  };

  const handleCancelEditAnnouncement = () => {
    setEditingAnnouncementId(null);
    setAnnTitle('');
    setAnnContent('');
  };

  const handleDeleteAnnouncement = async (annId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التنبيه؟')) {
      await removeAnnouncement(annId);
      if (editingAnnouncementId === annId) {
        handleCancelEditAnnouncement();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                لوحة إدارة المعلمين | S.I.A.W Language School
              </h3>
              <p className="text-xs text-blue-200">
                مدرسة سعد بن أبي وقاص الرسمية للغات • نظام رصد الدرجات
              </p>
            </div>
          </div>

          <button
            onClick={() => setTeacherModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* ================= LOGIN FORM ONLY (NO REGISTER TAB) ================= */}
          {!currentTeacher ? (
            <div className="max-w-md mx-auto py-4 space-y-4">
              
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border-2 border-blue-200">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-slate-800">
                  تسجيل دخول الإدارة والمعلمين
                </h4>
                <p className="text-xs text-slate-500">
                  أدخل بيانات حسابك للوصول إلى لوحة رصد الدرجات وإدارة الجداول
                </p>
              </div>

              {/* Error Alert */}
              {authError && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3.5 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    البريد الإلكتروني (Email)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@school.com"
                      dir="ltr"
                      className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    كلمة المرور (Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      dir="ltr"
                      className="w-full pr-4 pl-10 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  <span>{authLoading ? 'جاري التحقق...' : 'دخول لوحة الإدارة 🚀'}</span>
                </button>

                {/* Security notice */}
                <div className="pt-2 border-t border-slate-200 text-center">
                  <p className="text-[11px] text-slate-500 font-medium">
                    🔒 تسجيل الدخول مقتصر فقط على الإيميلات المصرح بها والمضافة في سحابة Firebase
                  </p>
                </div>

              </form>

            </div>
          ) : (
            /* ================= IF LOGGED IN: DASHBOARD TABS ================= */
            <div className="space-y-4">
              
              {/* Teacher Info Bar & Logout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {currentTeacher.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span>{currentTeacher.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        مصرح له في Firebase
                      </span>
                    </h5>
                    <p className="text-xs text-blue-700 font-mono">
                      {currentTeacher.email} • {currentTeacher.subject}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logoutTeacher}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-slate-200 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>تسجيل خروج</span>
                </button>
              </div>

              {/* Navigation Tabs inside dashboard (Locked 3 tabs, No Firebase edit) */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-none border border-slate-200">
                <button
                  onClick={() => setActiveTab('grades')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'grades' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إضافة درجات طالب</span>
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'schedule' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>إدارة ورفع الجدول</span>
                </button>

                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'announcements' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>نشر إعلان</span>
                </button>
              </div>

              {/* 1. Add Grade Tab Content */}
              {activeTab === 'grades' && (
                <form onSubmit={handleAddGradeSubmit} className="space-y-4">
                  {gradeSuccessMsg && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{gradeSuccessMsg}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-slate-800 text-sm">
                      تسجيل درجة جديدة لامتحان الشهر
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الصف الدراسي (ابتدائي)</label>
                      <select
                        value={targetGradeId}
                        onChange={(e) => setTargetGradeId(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        {grades.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الفصل (حتى حرف e)
                      </label>
                      <select
                        value={targetSectionId}
                        onChange={(e) => setTargetSectionId(e.target.value as SectionId)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        {sections.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} (رمز: {s.letter})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      اسم الطالب الرباعي *
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: أحمد محمود العلي"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        اسم الاختبار / الشهر
                      </label>
                      <select
                        value={gradeMonth}
                        onChange={(e) => setGradeMonth(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        {MONTHS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        المادة (مواد اختبارات الشهور)
                      </label>
                      <select
                        value={gradeSubject}
                        onChange={(e) => setGradeSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        {MONTHLY_EXAM_SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-400 mt-1">
                        * ملاحظة: التربية الفنية والنشاط ليس لهما امتحان شهر
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الدرجة المحققة *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => handleScoreChange(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-blue-900 bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الدرجة القصوى
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={maxScore}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setMaxScore(val);
                          handleScoreChange(score);
                        }}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-slate-600 bg-white"
                      />
                    </div>
                  </div>

                  {/* Evaluation Selector (متفوق، ممتاز، جيد جداً...) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        تقدير ومستوى الطالب *
                      </span>
                      <span className="text-[11px] font-bold text-blue-700">
                        التقدير المحدد: <span className="underline">{evaluation}</span>
                      </span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {EVALUATION_OPTIONS.map((opt) => {
                        const isSelected = evaluation === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setEvaluation(opt)}
                            className={`py-2 px-1 text-xs font-extrabold rounded-xl border transition-all cursor-pointer text-center ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-102 ring-2 ring-blue-300'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            {opt === 'متفوق' ? '🌟 متفوق' : opt === 'ممتاز' ? '✨ ممتاز' : opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ملاحظة المعلم وتقديره
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: متفوق وإجابات نموذجية ممتازة"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Distinguished Student Toggle (طالب متميز) */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-xs">
                        <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
                      </div>
                      <div>
                        <span className="block text-xs font-black text-amber-950">
                          تمييز الطالب كـ «طالب متميز» (لوحة الشرف) ⭐
                        </span>
                        <span className="block text-[11px] text-amber-700 font-medium">
                          يُمنح وسام التميز ويظهر بصورة خاصة ومميزة في كشوف ولوحة الشرف
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDistinguished}
                        onChange={(e) => setIsDistinguished(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ ونشر الدرجة سحابياً</span>
                  </button>
                </form>
              )}

              {/* 2. Manage Schedule Tab Content */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  {scheduleSuccessMsg && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{scheduleSuccessMsg}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setScheduleImageMode('image')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        scheduleImageMode === 'image' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      رفع صورة الجدول (صورة أو ملف)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleImageMode('table')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        scheduleImageMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      تعديل الحصص المكتوبة
                    </button>
                  </div>

                  {scheduleImageMode === 'image' ? (
                    <form onSubmit={handleSaveScheduleImage} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          عنوان الجدول
                        </label>
                        <input
                          type="text"
                          value={scheduleImageTitle}
                          onChange={(e) => setScheduleImageTitle(e.target.value)}
                          placeholder="مثال: جدول الحصص الأسبوعي الرسمي - معتمد"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اختر ملف صورة من جهازك (PNG, JPG, SVG)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          أو أدخل رابط مباشر للصورة (Image URL)
                        </label>
                        <input
                          type="text"
                          value={scheduleImageUrl}
                          onChange={(e) => setScheduleImageUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                        />
                      </div>

                      {scheduleImageUrl && (
                        <div>
                          <span className="block text-xs font-bold text-slate-500 mb-1">معاينة الصورة:</span>
                          <div className="max-h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                            <img
                              src={scheduleImageUrl}
                              alt="معاينة"
                              className="w-full h-auto object-contain max-h-44 mx-auto rounded"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>حفظ واعتماد صورة الجدول</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSaveDashboardWrittenSchedule} className="space-y-4">
                      {/* Day Selector Tabs */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          اختر اليوم لتعديل حصصه (من الأحد إلى الخميس):
                        </label>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {currentSchedule.timetable.map((day) => {
                            const isSelected = dashboardScheduleDay === day.dayIndex;
                            return (
                              <button
                                key={day.dayName}
                                type="button"
                                onClick={() => handleSwitchDashboardDay(day.dayIndex)}
                                className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                              >
                                {day.dayName}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Periods Inputs */}
                      <div className="space-y-3 max-h-[350px] overflow-y-auto p-1">
                        {/* الحصص 1 إلى 3 */}
                        {dashboardPeriodsDraft.slice(0, 3).map((period, idx) => (
                          <div key={period.periodNumber} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-600 text-white text-xs font-black">
                              الحصة {period.periodNumber}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">المادة</label>
                                <select
                                  value={period.subject}
                                  onChange={(e) => handleDashboardPeriodChange(idx, 'subject', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                                >
                                  <option value="في انتظار اعتماد المعلم">في انتظار اعتماد المعلم</option>
                                  {SUBJECTS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">اسم المعلم</label>
                                <input
                                  type="text"
                                  placeholder="مثال: أ/ محمد عبد الله"
                                  value={period.teacher === 'معلم المادة' ? '' : period.teacher}
                                  onChange={(e) => handleDashboardPeriodChange(idx, 'teacher', e.target.value || 'معلم المادة')}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* فاصل الفسحة */}
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-center font-bold text-xs flex items-center justify-center gap-2">
                          <span>☕</span>
                          <span>استراحة الفسحة (Break) بين الحصة الثالثة والرابعة</span>
                        </div>

                        {/* الحصص 4 إلى 6 */}
                        {dashboardPeriodsDraft.slice(3, 6).map((period, relIdx) => {
                          const actualIdx = relIdx + 3;
                          return (
                            <div key={period.periodNumber} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-600 text-white text-xs font-black">
                                الحصة {period.periodNumber}
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1">المادة</label>
                                  <select
                                    value={period.subject}
                                    onChange={(e) => handleDashboardPeriodChange(actualIdx, 'subject', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                                  >
                                    <option value="في انتظار اعتماد المعلم">في انتظار اعتماد المعلم</option>
                                    {SUBJECTS.map((s) => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1">اسم المعلم</label>
                                  <input
                                    type="text"
                                    placeholder="مثال: أ/ محمد عبد الله"
                                    value={period.teacher === 'معلم المادة' ? '' : period.teacher}
                                    onChange={(e) => handleDashboardPeriodChange(actualIdx, 'teacher', e.target.value || 'معلم المادة')}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>حفظ واعتماد جدول الحصص لهذا اليوم 💾</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 3. Publish & Manage Announcements Tab Content */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddAnnouncementSubmit} className="space-y-4 bg-slate-50 p-4 rounded-3xl border border-slate-200">
                    {annSuccessMsg && (
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{annSuccessMsg}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <span>{editingAnnouncementId ? 'تعديل التنبيه المحدد' : 'نشر تنبيه أو إعلان جديد'}</span>
                      </h5>
                      {editingAnnouncementId && (
                        <button
                          type="button"
                          onClick={handleCancelEditAnnouncement}
                          className="px-2.5 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          إلغاء التعديل ✕
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">عنوان التنبيه *</label>
                      <input
                        type="text"
                        placeholder="مثال: موعد اختبار شهر نوفمبر لمادة العلوم"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">أهمية التنبيه</label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name="prio"
                            value="normal"
                            checked={annPriority === 'normal'}
                            onChange={() => setAnnPriority('normal')}
                          />
                          <span>عادي</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name="prio"
                            value="important"
                            checked={annPriority === 'important'}
                            onChange={() => setAnnPriority('important')}
                          />
                          <span>مهم</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name="prio"
                            value="urgent"
                            checked={annPriority === 'urgent'}
                            onChange={() => setAnnPriority('urgent')}
                          />
                          <span className="text-red-600 font-bold">عاجل وهام</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل التنبيه *</label>
                      <textarea
                        rows={3}
                        placeholder="اكتب التوجيهات أو التعليمات للطلاب وأولياء الأمور..."
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {editingAnnouncementId ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>حفظ التعديلات على التنبيه</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          <span>نشر التنبيه الآن</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* List & Manage Current Announcements */}
                  <div className="space-y-3">
                    <h5 className="font-extrabold text-slate-800 text-xs flex items-center justify-between">
                      <span>إدارة التنبيهات الحالية لهذا الفصل ({currentAnnouncements.length})</span>
                      <span className="text-[11px] text-slate-400 font-normal">يمكنك تعديل أي تنبيه أو مسحه</span>
                    </h5>

                    {currentAnnouncements.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        لا توجد تنبيهات منشورة لهذا الفصل حالياً
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {currentAnnouncements.map((ann) => (
                          <div
                            key={ann.id}
                            className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              editingAnnouncementId === ann.id
                                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/20'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h6 className="font-extrabold text-slate-900 text-xs truncate">
                                  {ann.title}
                                </h6>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    ann.priority === 'urgent'
                                      ? 'bg-red-100 text-red-700'
                                      : ann.priority === 'important'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}
                                >
                                  {ann.priority === 'urgent' ? 'عاجل' : ann.priority === 'important' ? 'مهم' : 'عادي'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">{ann.content}</p>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditAnnouncement(ann)}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="تعديل هذا التنبيه"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAnnouncement(ann.id)}
                                className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                title="مسح التنبيه نهائياً"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">سحابة Firebase مشفرة ومؤمنة (مشروع siaw-1fddc)</span>
          </div>
          <button
            onClick={() => setTeacherModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
