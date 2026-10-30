import React from 'react';
import {
  GraduationCap,
  Eye,
  EyeOff,
  UserCheck,
  Lock,
  Database,
  Sparkles,
  Search,
  School,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const Header: React.FC = () => {
  const {
    currentGrade,
    currentSection,
    eyeComfortMode,
    setEyeComfortMode,
    searchQuery,
    setSearchQuery,
    currentTeacher,
    setTeacherModalOpen,
    firebaseConnected,
    triggerCelebration,
  } = useSchool();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-300 border-b border-blue-100 bg-white/95 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerCelebration}
              className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
              title="مدرسة سعد بن أبي وقاص الابتدائية"
            >
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-blue-950 flex items-center gap-1.5">
                  مدرسة <span className="text-blue-600">سعد بن أبي وقاص</span> الابتدائية
                </h1>
                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3 text-blue-500" /> البوابة الرسمية
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                متابعة جداول الحصص ونتائج ودرجات الامتحانات الشهرية
              </p>
            </div>
          </div>

          {/* Quick Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث باسم الطالب أو رقم الجلوس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Eye Comfort Mode Toggle */}
            <button
              onClick={() => setEyeComfortMode((prev) => !prev)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                eyeComfortMode
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-inner'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title={eyeComfortMode ? 'إلغاء وضع راحة العين' : 'تفعيل وضع راحة العين'}
            >
              {eyeComfortMode ? (
                <>
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span className="hidden xl:inline text-amber-700">مريح للعين</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  <span className="hidden xl:inline text-slate-600">راحة العين</span>
                </>
              )}
            </button>

            {/* Firebase Status Pill */}
            <div
              onClick={() => setTeacherModalOpen(true)}
              className={`cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                firebaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              }`}
              title="اتصال Firebase السحابي"
            >
              <Database className={`w-3.5 h-3.5 ${firebaseConnected ? 'text-emerald-600' : 'text-blue-500'}`} />
              <span>{firebaseConnected ? 'Firebase سحابي' : 'تخزين مباشر'}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  firebaseConnected ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
              />
            </div>

            {/* Teacher Dashboard Trigger Button */}
            <button
              onClick={() => setTeacherModalOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {currentTeacher ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span className="truncate max-w-[100px] sm:max-w-none">{currentTeacher.name}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>دخول الإدارة</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Selected Class Banner on Mobile */}
        <div className="flex md:hidden items-center justify-between pb-2.5 pt-0.5 text-xs text-slate-600 border-t border-slate-100">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <School className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentGrade.name} - فصل {currentSection.letter}</span>
          </div>
          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono font-bold">
            {currentGrade.id}/{currentSection.letter.toLowerCase()}
          </span>
        </div>

      </div>
    </header>
  );
};
