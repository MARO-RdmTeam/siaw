import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Lock,
  PlusCircle,
  Upload,
  Database,
  CheckCircle2,
  Bell,
  Sparkles,
  LogOut,
  Save,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { MONTHS, SUBJECTS } from '../services/mockData';
import { DEFAULT_FIREBASE_CONFIG } from '../services/firebase';
import type { FirebaseConfig, SectionId } from '../types';

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
    addNewAnnouncement,
    currentSchedule,
    firebaseConnected,
    updateFirebaseSettings,
    disconnectFirebase,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'grades' | 'schedule' | 'announcements' | 'firebase'>('grades');

  // Teacher Email & Password Authentication State (Login Only, No Registration)
  const [email, setEmail] = useState('admin@school.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Add Grade Form State
  const [targetGradeId, setTargetGradeId] = useState<number>(selectedGradeId);
  const [targetSectionId, setTargetSectionId] = useState<SectionId>(selectedSectionId);
  const [studentName, setStudentName] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [gradeMonth, setGradeMonth] = useState(MONTHS[0]);
  const [gradeSubject, setGradeSubject] = useState(SUBJECTS[0]);
  const [score, setScore] = useState<number>(95);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [notes, setNotes] = useState('');
  const [gradeSuccessMsg, setGradeSuccessMsg] = useState('');

  // Schedule Image Upload State
  const [scheduleImageMode, setScheduleImageMode] = useState<'image' | 'table'>('image');
  const [scheduleImageUrl, setScheduleImageUrl] = useState(currentSchedule.imageUrl || '');
  const [scheduleImageTitle, setScheduleImageTitle] = useState(currentSchedule.imageTitle || '');
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState('');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'important' | 'urgent'>('important');
  const [annSuccessMsg, setAnnSuccessMsg] = useState('');

  // Firebase Config State (pre-filled with your project credentials)
  const [fbApiKey, setFbApiKey] = useState(DEFAULT_FIREBASE_CONFIG.apiKey);
  const [fbProjectId, setFbProjectId] = useState(DEFAULT_FIREBASE_CONFIG.projectId);
  const [fbAuthDomain, setFbAuthDomain] = useState(DEFAULT_FIREBASE_CONFIG.authDomain);
  const [fbStorageBucket, setFbStorageBucket] = useState(DEFAULT_FIREBASE_CONFIG.storageBucket);
  const [fbAppId, setFbAppId] = useState(DEFAULT_FIREBASE_CONFIG.appId);
  const [fbSuccessMsg, setFbSuccessMsg] = useState('');

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

  // Quick fill Admin credentials
  const handleQuickCredential = () => {
    setAuthError('');
    setEmail('admin@school.com');
    setPassword('admin123');
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
      seatNumber: seatNumber.trim() || undefined,
      gradeId: targetGradeId,
      sectionId: targetSectionId,
      month: gradeMonth,
      subject: gradeSubject,
      score: Number(score),
      maxScore: Number(maxScore),
      notes: notes.trim() || undefined,
      teacherName: currentTeacher ? currentTeacher.name : 'أ. طارق عبد الرحمن',
    });

    setGradeSuccessMsg('تمت إضافة الدرجة بنجاح إلى سجل درجات الفصل!');
    setStudentName('');
    setSeatNumber('');
    setNotes('');
    setTimeout(() => setGradeSuccessMsg(''), 4000);
  };

  // Quick fill sample student
  const handleQuickFillStudent = () => {
    const samples = [
      'عبد الله محمد القحطاني',
      'ريم إبراهيم العتيبي',
      'سلمان فيصل الحربي',
      'دانة فهد الدوسري',
      'زياد عادل المالكي',
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setStudentName(picked);
    setSeatNumber('60' + Math.floor(10 + Math.random() * 89));
    setScore(Math.floor(88 + Math.random() * 13));
    setNotes('أداء ممتاز ومشاركة مميزة في الحصة');
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

  // Handle Announcement Submit
  const handleAddAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      alert('يرجى ملء عنوان وتفاصيل التنبيه');
      return;
    }

    await addNewAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      gradeId: targetGradeId,
      sectionId: targetSectionId,
      author: currentTeacher ? `${currentTeacher.name} (${currentTeacher.subject})` : 'إدارة مدرسة سعد بن أبي وقاص',
      priority: annPriority,
    });

    setAnnSuccessMsg('تم نشر الإعلان بنجاح في لوحة إعلانات الفصل!');
    setAnnTitle('');
    setAnnContent('');
    setTimeout(() => setAnnSuccessMsg(''), 4000);
  };

  // Handle Firebase Save
  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbApiKey || !fbProjectId) {
      alert('يرجى إدخال على الأقل API Key و Project ID');
      return;
    }

    const conf: FirebaseConfig = {
      apiKey: fbApiKey.trim(),
      authDomain: fbAuthDomain.trim() || `${fbProjectId}.firebaseapp.com`,
      projectId: fbProjectId.trim(),
      storageBucket: fbStorageBucket.trim() || `${fbProjectId}.appspot.com`,
      messagingSenderId: '',
      appId: fbAppId.trim() || '',
    };

    const ok = updateFirebaseSettings(conf);
    if (ok) {
      setFbSuccessMsg('تم ربط إعدادات Firebase بنجاح!');
      setTimeout(() => setFbSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
              <UserCheck className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                لوحة إدارة المعلمين | مدرسة سعد بن أبي وقاص
              </h3>
              <p className="text-xs text-blue-200">
                تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
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

                {/* Quick login helper */}
                <div className="pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleQuickCredential}
                    className="w-full py-2 px-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>تعبئة حساب المدير الافتراضي (admin@school.com / admin123)</span>
                  </button>
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
                        مسجل الدخول
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

              {/* Navigation Tabs inside dashboard */}
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

                <button
                  onClick={() => setActiveTab('firebase')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'firebase' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>إعدادات Firebase</span>
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
                    <button
                      type="button"
                      onClick={handleQuickFillStudent}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> تعبئة طالب عينة
                    </button>
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
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

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        رقم الجلوس (اختياري)
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: 6012"
                        value={seatNumber}
                        onChange={(e) => setSeatNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">المادة</label>
                      <select
                        value={gradeSubject}
                        onChange={(e) => setGradeSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
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
                        onChange={(e) => setScore(Number(e.target.value))}
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
                        onChange={(e) => setMaxScore(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-slate-600 bg-white"
                      />
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
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500">
                        الحصص مسجلة تلقائياً لجميع أيام الأسبوع (الأحد إلى الخميس) بواقع 7 حصص يومياً. يمكنك تعديل الحصص أو التبديل لعرض الجدول المكتوب.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setScheduleSuccessMsg('تم تحديث جدول الحصص بنجاح!');
                          setTimeout(() => setScheduleSuccessMsg(''), 3000);
                        }}
                        className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                      >
                        حفظ التعديلات على الجدول المكتوب
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Publish Announcement Tab Content */}
              {activeTab === 'announcements' && (
                <form onSubmit={handleAddAnnouncementSubmit} className="space-y-4">
                  {annSuccessMsg && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{annSuccessMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">عنوان التنبيه</label>
                    <input
                      type="text"
                      placeholder="مثال: موعد اختبار شهر نوفمبر لمادة العلوم"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل التنبيه</label>
                    <textarea
                      rows={3}
                      placeholder="اكتب التوجيهات أو التعليمات للطلاب وأولياء الأمور..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>نشر التنبيه الآن</span>
                  </button>
                </form>
              )}

              {/* 4. Firebase Settings Tab Content */}
              {activeTab === 'firebase' && (
                <div className="space-y-4">
                  {fbSuccessMsg && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{fbSuccessMsg}</span>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span>حالة الاتصال: {firebaseConnected ? '🟢 متصل بسحابة Firebase Firestore' : '🔵 الوضع المحلي الفوري (LocalStorage)'}</span>
                    </div>
                    <p>
                      مشروعك مربوط الآن مباشرة بـ Firebase: <strong className="font-mono">siaw-1fddc</strong>.
                    </p>
                  </div>

                  <form onSubmit={handleSaveFirebase} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Firebase API Key *
                      </label>
                      <input
                        type="text"
                        placeholder="AIzaSy..."
                        value={fbApiKey}
                        onChange={(e) => setFbApiKey(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Firebase Project ID *
                      </label>
                      <input
                        type="text"
                        placeholder="my-school-project"
                        value={fbProjectId}
                        onChange={(e) => setFbProjectId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Auth Domain (اختياري)
                        </label>
                        <input
                          type="text"
                          placeholder="my-school.firebaseapp.com"
                          value={fbAuthDomain}
                          onChange={(e) => setFbAuthDomain(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Storage Bucket (اختياري)
                        </label>
                        <input
                          type="text"
                          placeholder="my-school.appspot.com"
                          value={fbStorageBucket}
                          onChange={(e) => setFbStorageBucket(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          App ID (اختياري)
                        </label>
                        <input
                          type="text"
                          placeholder="1:123456789:web:abcdef"
                          value={fbAppId}
                          onChange={(e) => setFbAppId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                      >
                        تحديث وحفظ مفاتيح Firebase
                      </button>

                      {firebaseConnected && (
                        <button
                          type="button"
                          onClick={disconnectFirebase}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-red-600 font-bold text-xs cursor-pointer"
                        >
                          فصل الربط
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>مدرسة سعد بن أبي وقاص الابتدائية • لوحة الإدارة</span>
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
