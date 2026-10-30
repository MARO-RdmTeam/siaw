import React from 'react';
import { Calendar, FileText, Award, Bell, UserCheck, Lock } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentTeacher,
    setTeacherModalOpen,
  } = useSchool();

  const navItems = [
    { id: 'grades' as const, label: 'النتائج والدرجات', icon: FileText },
    { id: 'schedule' as const, label: 'الجدول', icon: Calendar },
    { id: 'honor' as const, label: 'الأوائل', icon: Award },
    { id: 'announcements' as const, label: 'الإعلانات', icon: Bell },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-blue-100 sm:hidden shadow-lg shadow-blue-900/10 px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive ? 'text-blue-600 font-extrabold' : 'text-slate-500'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-blue-50 -translate-y-1 scale-110 shadow-xs' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* Teacher Dashboard Trigger on mobile */}
      <button
        onClick={() => setTeacherModalOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-blue-700 font-bold"
      >
        <div className="p-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
          {currentTeacher ? <UserCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </div>
        <span className="text-[10px] mt-0.5">الإدارة</span>
      </button>
    </div>
  );
};

