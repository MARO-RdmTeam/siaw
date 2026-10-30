import React from 'react';
import { Calendar, Award, FileText, Bell } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, currentGrades, currentAnnouncements } = useSchool();

  const tabs = [
    {
      id: 'grades' as const,
      name: 'درجات الامتحانات الشهرية',
      icon: FileText,
      count: currentGrades.length,
      color: 'blue',
      badge: 'النتائج',
    },
    {
      id: 'schedule' as const,
      name: 'جدول الحصص والامتحانات',
      icon: Calendar,
      count: null,
      color: 'sky',
      badge: 'الجدول',
    },
    {
      id: 'honor' as const,
      name: 'لوحة الشرف والمتفوقين',
      icon: Award,
      count: currentGrades.filter((g) => g.score >= 90).length,
      color: 'amber',
      badge: '🌟 المتفوقين',
    },
    {
      id: 'announcements' as const,
      name: 'تنبيهات وإعلانات الصف',
      icon: Bell,
      count: currentAnnouncements.length,
      color: 'indigo',
      badge: 'إشعارات',
    },
  ];

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 backdrop-blur-sm scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[170px] sm:min-w-0 py-3 px-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-white text-blue-800 shadow-md shadow-blue-500/10 scale-101 border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-300 ${
                  isActive ? 'text-blue-600 scale-110' : 'text-slate-500'
                }`}
              />
              <span className="truncate">{tab.name}</span>
              {tab.count !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
