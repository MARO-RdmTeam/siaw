import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, PlusCircle, Calendar, User } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const AnnouncementsView: React.FC = () => {
  const { currentGrade, currentSection, currentAnnouncements, setTeacherModalOpen } = useSchool();

  const getPriorityBadge = (priority: 'normal' | 'important' | 'urgent') => {
    switch (priority) {
      case 'urgent':
        return {
          icon: AlertTriangle,
          label: 'عاجل وهام',
          bg: 'bg-red-50 text-red-700 border-red-200',
        };
      case 'important':
        return {
          icon: Info,
          label: 'تنبيه مهم',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      default:
        return {
          icon: CheckCircle,
          label: 'إعلان عام',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Bell className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              إعلانات وتنبيهات فصل {currentGrade.code}/{currentSection.letter.toLowerCase()}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة التوجيهات المدرسية وواجبات الاختبارات والأنشطة
          </p>
        </div>

        <button
          onClick={() => setTeacherModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>نشر تنبيه جديد</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {currentAnnouncements.map((ann) => {
          const badge = getPriorityBadge(ann.priority);
          const Icon = badge.icon;

          return (
            <div
              key={ann.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`p-2 rounded-xl border ${badge.bg}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{ann.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {ann.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {ann.author}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {ann.content}
              </p>
            </div>
          );
        })}

        {currentAnnouncements.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">لا توجد تنبيهات حالياً لهذا الصف</p>
          </div>
        )}
      </div>
    </div>
  );
};

