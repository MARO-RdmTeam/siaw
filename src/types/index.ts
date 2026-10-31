export type SectionId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Section {
  id: SectionId;
  name: string; // e.g. "شعبة أ (A)", "شعبة e (E)"
  letter: string;
}

export interface Grade {
  id: number;
  name: string; // e.g. "الصف السادس"
  code: string; // e.g. "6"
  stage: 'ابتدائي' | 'متوسط' | 'ثانوي';
}

export interface StudentGrade {
  id: string;
  studentName: string;
  seatNumber?: string;
  gradeId: number;
  sectionId: SectionId;
  month: string; // e.g. "شهر أكتوبر", "شهر نوفمبر", "شهر ديسمبر"
  subject: string; // e.g. "الرياضيات", "اللغة العربية"
  score: number;
  maxScore: number;
  evaluation?: string; // e.g. "متفوق", "ممتاز", "جيد جداً", "جيد", "مقبول"
  notes?: string;
  date: string;
  teacherName: string;
}

export interface SchedulePeriod {
  periodNumber: number;
  time: string;
  subject: string;
  teacher: string;
  room?: string;
}

export interface DailySchedule {
  dayName: string; // الأحد، الإثنين...
  dayIndex: number; // 0 for Sunday
  periods: SchedulePeriod[];
}

export interface SectionSchedule {
  gradeId: number;
  sectionId: SectionId;
  imageUrl?: string;
  imageTitle?: string;
  lastUpdated: string;
  timetable: DailySchedule[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  gradeId: number;
  sectionId: SectionId;
  author: string;
  date: string;
  priority: 'normal' | 'important' | 'urgent';
}

export interface TeacherUser {
  id: string;
  name: string;
  subject: string;
  email: string;
  isLoggedIn: boolean;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

