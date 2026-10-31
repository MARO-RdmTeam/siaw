import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
  Table as TableIcon,
  Maximize2,
  Download,
  Printer,
  Sparkles,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const ScheduleView: React.FC = () => {
  const {
    currentGrade,
    currentSection,
    currentSchedule,
    scheduleViewMode,
    setScheduleViewMode,
    setPreviewImage,
    setTeacherModalOpen,
  } = useSchool();

  // Mobile day tab selection (defaults to current day of week if Sunday-Thursday, else Sunday)
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 Monday...
  const initialDayIndex = currentDayIndex >= 0 && currentDayIndex <= 4 ? currentDayIndex : 0;
  const [selectedDayTab, setSelectedDayTab] = useState<number>(initialDayIndex);

  const daysList = currentSchedule.timetable;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    if (!currentSchedule.imageUrl) return;
    const a = document.createElement('a');
    a.href = currentSchedule.imageUrl;
    a.download = `schedule_${currentGrade.code}_${currentSection.letter}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      
      {/* Schedule Header & Mode Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100/80 text-blue-700">
              <Calendar className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              جدول {currentGrade.name} - فصل {currentSection.letter}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            آخر تحديث معتمد: {currentSchedule.lastUpdated} | يمكنك استعراض الجدول المكتوب أو الصورة المرفوعة
          </p>
        </div>

        {/* View Mode Switcher (Table vs Image) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setScheduleViewMode('table')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              scheduleViewMode === 'table'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>جدول مكتوب</span>
          </button>

          <button
            onClick={() => setScheduleViewMode('image')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              scheduleViewMode === 'image'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>صورة الجدول</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Written Interactive Timetable */}
      {scheduleViewMode === 'table' && (
        <div className="space-y-4">
          
          {/* Day selection tabs for responsive viewing */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {daysList.map((day) => {
              const isSelected = selectedDayTab === day.dayIndex;
              const isToday = day.dayIndex === currentDayIndex;

              return (
                <button
                  key={day.dayName}
                  onClick={() => setSelectedDayTab(day.dayIndex)}
                  className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-blue-600 to-sky-700 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{day.dayName}</span>
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Periods Display for Selected Day (Card view for mobile, Grid view for desktop) */}
          <div className="bg-white rounded-3xl border border-blue-100/90 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <h4 className="font-extrabold text-slate-800 text-base sm:text-lg">
                  حصص يوم {daysList[selectedDayTab]?.dayName || 'الأحد'}
                </h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                إجمالي 6 حصص دراسية
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* الحصص الثلاث الأولى قبل الفسحة */}
              {daysList[selectedDayTab]?.periods.slice(0, 3).map((period) => (
                <div
                  key={period.periodNumber}
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-600 text-white group-hover:scale-105 transition-transform">
                      الحصة {period.periodNumber}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      {period.time}
                    </span>
                  </div>

                  <h5 className="text-base font-extrabold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {period.subject}
                  </h5>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {period.teacher}
                    </span>
                    {period.room && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {period.room}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* بطاقة استراحة الفسحة (Break) بين الحصة 3 والحصة 4 */}
              <div className="col-span-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 flex items-center justify-between font-bold text-xs sm:text-sm shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-amber-200/70 text-amber-950 font-black text-xs">
                    استراحة الفسحة (Break)
                  </span>
                  <span className="text-xs text-amber-800 hidden sm:inline font-semibold">
                    فاصل استراحة بين الحصة الثالثة والرابعة
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-900 bg-white/90 px-3 py-1 rounded-lg border border-amber-200 shadow-xs">
                  10:15 - 10:45 (30 دقيقة)
                </span>
              </div>

              {/* الحصص الثلاث بعد الفسحة */}
              {daysList[selectedDayTab]?.periods.slice(3, 6).map((period) => (
                <div
                  key={period.periodNumber}
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-600 text-white group-hover:scale-105 transition-transform">
                      الحصة {period.periodNumber}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      {period.time}
                    </span>
                  </div>

                  <h5 className="text-base font-extrabold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {period.subject}
                  </h5>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {period.teacher}
                    </span>
                    {period.room && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {period.room}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center gap-2 text-xs text-sky-800">
              <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <span>
                نظام اليوم المدرسي: 6 حصص دراسية تتخللها استراحة فسحة (Break) لمدة 30 دقيقة بعد الحصة الثالثة.
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Mode 2: Uploaded Image Schedule */}
      {scheduleViewMode === 'image' && (
        <div className="bg-white rounded-3xl border border-blue-100/90 p-4 sm:p-6 shadow-sm space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                صورة رسمية معتمدة
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                {currentSchedule.imageTitle || 'جدول الحصص الأسبوعي المعتمد'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewImage(currentSchedule.imageUrl || null)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="تكبير الصورة ملء الشاشة"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>تكبير كامل</span>
              </button>

              <button
                onClick={handleDownloadImage}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="تحميل الصورة إلى جهازك"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="طباعة الجدول"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">طباعة</span>
              </button>
            </div>
          </div>

          <div
            onClick={() => setPreviewImage(currentSchedule.imageUrl || null)}
            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner group cursor-pointer transition-all hover:border-blue-300"
          >
            {currentSchedule.imageUrl ? (
              <img
                src={currentSchedule.imageUrl}
                alt="جدول الحصص المعتمد"
                className="w-full h-auto object-contain max-h-[600px] transition-transform duration-300 group-hover:scale-[1.01]"
              />
            ) : (
              <div className="py-20 text-center">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-bold">لا توجد صورة مرفوعة لهذا الصف حالياً</p>
                <p className="text-xs text-slate-400 mt-1">يمكن للمدرسين رفع صورة الجدول من لوحة الإدارة</p>
              </div>
            )}

            <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="px-4 py-2 rounded-xl bg-white/95 text-blue-900 font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-blue-600" /> انقر هنا لتكبير وعرض الصورة بجودة كاملة
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
            <span className="text-blue-900 font-medium">
              هل أنت معلم هذا الصف وتريد رفع جدول جديد بصيغة صورة أو ملف؟
            </span>
            <button
              onClick={() => setTeacherModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع / تغيير صورة الجدول</span>
            </button>
          </div>

        </div>
      )}

      {/* Monthly Exam Dates Timetable Card */}
      <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl border border-blue-100/90 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">
                مواعيد الاختبارات الشهرية لفصل {currentGrade.code}/{currentSection.letter.toLowerCase()}
              </h4>
              <p className="text-xs text-slate-500">تقويم اختبارات الفصل الدراسي الأول</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-blue-600 px-2 py-0.5 rounded-md bg-blue-50">
              الأحد 2 نوفمبر
            </span>
            <h5 className="font-bold text-slate-800 text-sm mt-2">اختبار الماث (الرياضيات) الشهري</h5>
            <p className="text-xs text-slate-500 mt-1">من الوحدة الأولى إلى الثالثة • الحصة الثانية</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-600 px-2 py-0.5 rounded-md bg-emerald-50">
              الثلاثاء 4 نوفمبر
            </span>
            <h5 className="font-bold text-slate-800 text-sm mt-2">اختبار العلوم الشهري</h5>
            <p className="text-xs text-slate-500 mt-1">تجارب ودورة العناصر • الحصة الثالثة</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-amber-600 px-2 py-0.5 rounded-md bg-amber-50">
              الخميس 6 نوفمبر
            </span>
            <h5 className="font-bold text-slate-800 text-sm mt-2">اختبار اللغة العربية الشهري</h5>
            <p className="text-xs text-slate-500 mt-1">القواعد النحوية والإملاء • الحصة الأولى</p>
          </div>
        </div>
      </div>

    </div>
  );
};
