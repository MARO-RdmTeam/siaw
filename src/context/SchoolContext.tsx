import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  Grade,
  Section,
  SectionId,
  StudentGrade,
  SectionSchedule,
  Announcement,
  TeacherUser,
  FirebaseConfig,
} from '../types';
import {
  GRADES,
  SECTIONS,
  INITIAL_GRADES,
  INITIAL_ANNOUNCEMENTS,
  SAMPLE_SCHEDULE_IMAGE,
  generateDefaultTimetable,
} from '../services/mockData';
import {
  initFirebase,
  isFirebaseConnected,
  saveFirebaseConfig,
  clearFirebaseConfig,
  getGradesForClass,
  saveGrade,
  deleteGrade,
  getScheduleForClass,
  saveSchedule,
  getAnnouncementsForClass,
  saveAnnouncement,
  authenticateTeacher,
  signOutTeacher,
} from '../services/firebase';

interface SchoolContextType {
  // Grades & Classes
  grades: Grade[];
  sections: Section[];
  selectedGradeId: number;
  selectedSectionId: SectionId;
  setSelectedGradeId: (id: number) => void;
  setSelectedSectionId: (id: SectionId) => void;
  currentGrade: Grade;
  currentSection: Section;

  // View & Tabs
  activeTab: 'schedule' | 'grades' | 'honor' | 'announcements';
  setActiveTab: (tab: 'schedule' | 'grades' | 'honor' | 'announcements') => void;
  scheduleViewMode: 'table' | 'image';
  setScheduleViewMode: (mode: 'table' | 'image') => void;

  // Eye Comfort Mode
  eyeComfortMode: boolean;
  setEyeComfortMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;

  // Data
  currentGrades: StudentGrade[];
  allGradesList: StudentGrade[];
  currentSchedule: SectionSchedule;
  currentAnnouncements: Announcement[];
  loading: boolean;

  // Teacher / Firebase Auth
  currentTeacher: TeacherUser | null;
  teacherModalOpen: boolean;
  setTeacherModalOpen: (open: boolean) => void;
  loginTeacher: (
    email: string,
    pass: string,
    name?: string,
    subject?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logoutTeacher: () => void;
  firebaseConnected: boolean;
  updateFirebaseSettings: (config: FirebaseConfig) => boolean;
  disconnectFirebase: () => void;

  // Modals & UI helpers
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  selectedStudentReport: StudentGrade | null;
  setSelectedStudentReport: (grade: StudentGrade | null) => void;
  triggerCelebration: () => void;

  // Mutations
  addNewGrade: (gradeData: Omit<StudentGrade, 'id' | 'date'>) => Promise<void>;
  removeGrade: (gradeId: string) => Promise<void>;
  updateScheduleImage: (imageUrl: string, title?: string) => Promise<void>;
  updateTimetableSchedule: (schedule: SectionSchedule) => Promise<void>;
  addNewAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedGradeId, setSelectedGradeId] = useState<number>(6);
  const [selectedSectionId, setSelectedSectionId] = useState<SectionId>('E');
  const [activeTab, setActiveTab] = useState<'schedule' | 'grades' | 'honor' | 'announcements'>('grades');
  const [scheduleViewMode, setScheduleViewMode] = useState<'table' | 'image'>('table');
  const [eyeComfortMode, setEyeComfortMode] = useState<boolean>(() => {
    return localStorage.getItem('siaw_eye_comfort') === 'true';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('الكل');
  const [selectedSubject, setSelectedSubject] = useState<string>('الكل');

  // Grades state
  const [allGradesList, setAllGradesList] = useState<StudentGrade[]>(() => {
    const saved = localStorage.getItem('siaw_local_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });
  const [currentGrades, setCurrentGrades] = useState<StudentGrade[]>([]);

  // Schedule state
  const [currentSchedule, setCurrentSchedule] = useState<SectionSchedule>(() => ({
    gradeId: 6,
    sectionId: 'E',
    imageUrl: SAMPLE_SCHEDULE_IMAGE,
    imageTitle: 'جدول الحصص الأسبوعي الرسمي - معتمد من إدارة المدرسة',
    lastUpdated: '2026-10-25',
    timetable: generateDefaultTimetable(6, 'E'),
  }));

  // Announcements state
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('siaw_local_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });
  const [currentAnnouncements, setCurrentAnnouncements] = useState<Announcement[]>([]);

  // Teacher Auth State
  const [currentTeacher, setCurrentTeacher] = useState<TeacherUser | null>(() => {
    const saved = localStorage.getItem('siaw_teacher_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [teacherModalOpen, setTeacherModalOpen] = useState<boolean>(false);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);

  // Modals state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedStudentReport, setSelectedStudentReport] = useState<StudentGrade | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    initFirebase();
    setFirebaseConnected(isFirebaseConnected());
  }, []);

  useEffect(() => {
    localStorage.setItem('siaw_eye_comfort', eyeComfortMode ? 'true' : 'false');
    if (eyeComfortMode) {
      document.documentElement.classList.add('eye-comfort-theme');
    } else {
      document.documentElement.classList.remove('eye-comfort-theme');
    }
  }, [eyeComfortMode]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      const classGrades = await getGradesForClass(selectedGradeId, selectedSectionId, allGradesList);
      const defaultSched: SectionSchedule = {
        gradeId: selectedGradeId,
        sectionId: selectedSectionId,
        imageUrl: SAMPLE_SCHEDULE_IMAGE,
        imageTitle: `جدول الصف ${selectedGradeId}/${selectedSectionId.toLowerCase()} المعتمد`,
        lastUpdated: '2026-10-28',
        timetable: generateDefaultTimetable(selectedGradeId, selectedSectionId),
      };
      const sched = await getScheduleForClass(selectedGradeId, selectedSectionId, defaultSched);
      const anns = await getAnnouncementsForClass(selectedGradeId, selectedSectionId, allAnnouncements);

      if (isMounted) {
        setCurrentGrades(classGrades);
        setCurrentSchedule(sched);
        setCurrentAnnouncements(anns);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedGradeId, selectedSectionId, allGradesList, allAnnouncements]);

  const currentGrade = GRADES.find((g) => g.id === selectedGradeId) || GRADES[5];
  const currentSection = SECTIONS.find((s) => s.id === selectedSectionId) || SECTIONS[4];

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#f59e0b', '#10b981', '#6366f1'],
      });
    } catch (e) {
      console.warn('Confetti error', e);
    }
  };

  const loginTeacher = async (
    email: string,
    pass: string,
    name?: string,
    subject?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await authenticateTeacher(email, pass, name, subject);
    if (res.success && res.user) {
      setCurrentTeacher(res.user);
      localStorage.setItem('siaw_teacher_user', JSON.stringify(res.user));
      return { success: true };
    }
    return { success: false, error: res.error || 'فشل تسجيل الدخول' };
  };

  const logoutTeacher = () => {
    signOutTeacher();
    setCurrentTeacher(null);
    localStorage.removeItem('siaw_teacher_user');
  };

  const updateFirebaseSettings = (config: FirebaseConfig): boolean => {
    const success = saveFirebaseConfig(config);
    setFirebaseConnected(isFirebaseConnected());
    return success;
  };

  const disconnectFirebase = () => {
    clearFirebaseConfig();
    setFirebaseConnected(false);
  };

  const addNewGrade = async (gradeData: Omit<StudentGrade, 'id' | 'date'>) => {
    const newGradeItem: StudentGrade = {
      ...gradeData,
      id: 'grade-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    const saved = await saveGrade(newGradeItem, allGradesList);
    setAllGradesList((prev) => [saved, ...prev.filter((g) => g.id !== saved.id)]);

    if (saved.gradeId === selectedGradeId && saved.sectionId === selectedSectionId) {
      setCurrentGrades((prev) => [saved, ...prev.filter((g) => g.id !== saved.id)]);
    }

    if (saved.score >= 90) {
      triggerCelebration();
    }
  };

  const removeGrade = async (gradeId: string) => {
    await deleteGrade(gradeId, allGradesList);
    setAllGradesList((prev) => prev.filter((g) => g.id !== gradeId));
    setCurrentGrades((prev) => prev.filter((g) => g.id !== gradeId));
  };

  const updateScheduleImage = async (imageUrl: string, title?: string) => {
    const updated: SectionSchedule = {
      ...currentSchedule,
      imageUrl,
      imageTitle: title || currentSchedule.imageTitle || 'جدول الحصص المرفوع',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saveSchedule(updated);
    setCurrentSchedule(updated);
  };

  const updateTimetableSchedule = async (schedule: SectionSchedule) => {
    await saveSchedule(schedule);
    setCurrentSchedule(schedule);
  };

  const addNewAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'date'>) => {
    const item: Announcement = {
      ...announcementData,
      id: 'ann-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    const saved = await saveAnnouncement(item, allAnnouncements);
    setAllAnnouncements((prev) => [saved, ...prev]);
    if (saved.gradeId === selectedGradeId && saved.sectionId === selectedSectionId) {
      setCurrentAnnouncements((prev) => [saved, ...prev]);
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        grades: GRADES,
        sections: SECTIONS,
        selectedGradeId,
        selectedSectionId,
        setSelectedGradeId,
        setSelectedSectionId,
        currentGrade,
        currentSection,

        activeTab,
        setActiveTab,
        scheduleViewMode,
        setScheduleViewMode,

        eyeComfortMode,
        setEyeComfortMode,

        searchQuery,
        setSearchQuery,
        selectedMonth,
        setSelectedMonth,
        selectedSubject,
        setSelectedSubject,

        currentGrades,
        allGradesList,
        currentSchedule,
        currentAnnouncements,
        loading,

        currentTeacher,
        teacherModalOpen,
        setTeacherModalOpen,
        loginTeacher,
        logoutTeacher,
        firebaseConnected,
        updateFirebaseSettings,
        disconnectFirebase,

        previewImage,
        setPreviewImage,
        selectedStudentReport,
        setSelectedStudentReport,
        triggerCelebration,

        addNewGrade,
        removeGrade,
        updateScheduleImage,
        updateTimetableSchedule,
        addNewAnnouncement,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
