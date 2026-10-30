import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/Header';
import { GradeSelector } from './components/GradeSelector';
import { NavigationTabs } from './components/NavigationTabs';
import { ScheduleView } from './components/ScheduleView';
import { GradesView } from './components/GradesView';
import { HonorBoard } from './components/HonorBoard';
import { AnnouncementsView } from './components/AnnouncementsView';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { StudentReportModal } from './components/StudentReportModal';
import { ImageScheduleModal } from './components/ImageScheduleModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

const MainLayout: React.FC = () => {
  const { activeTab, eyeComfortMode } = useSchool();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        eyeComfortMode
          ? 'bg-[#f4f7f6] text-slate-800'
          : 'bg-gradient-to-b from-[#f0f7ff] via-[#f8fafc] to-[#ffffff] text-slate-800'
      }`}
    >
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* Class and Section Selector (Top section from user sketch: "الصفوف") */}
        <GradeSelector />

        {/* Main Display Box from sketch: "عرض الاشياء" */}
        <section className="space-y-4">
          
          {/* Navigation tabs for the display area */}
          <NavigationTabs />

          {/* Active Tab View */}
          <div className="transition-all duration-300">
            {activeTab === 'grades' && <GradesView />}
            {activeTab === 'schedule' && <ScheduleView />}
            {activeTab === 'honor' && <HonorBoard />}
            {activeTab === 'announcements' && <AnnouncementsView />}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Bottom Dock */}
      <MobileBottomNav />

      {/* Global Modals */}
      <TeacherDashboardModal />
      <StudentReportModal />
      <ImageScheduleModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainLayout />
    </SchoolProvider>
  );
}
