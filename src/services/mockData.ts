import type { Grade, Section, StudentGrade, Announcement, DailySchedule } from '../types';

// المرحلة الابتدائية فقط (من الصف الأول حتى السادس الابتدائي)
export const GRADES: Grade[] = [
  { id: 1, name: 'الصف الأول الابتدائي', code: '1', stage: 'ابتدائي' },
  { id: 2, name: 'الصف الثاني الابتدائي', code: '2', stage: 'ابتدائي' },
  { id: 3, name: 'الصف الثالث الابتدائي', code: '3', stage: 'ابتدائي' },
  { id: 4, name: 'الصف الرابع الابتدائي', code: '4', stage: 'ابتدائي' },
  { id: 5, name: 'الصف الخامس الابتدائي', code: '5', stage: 'ابتدائي' },
  { id: 6, name: 'الصف السادس الابتدائي', code: '6', stage: 'ابتدائي' },
];

// الفصول حتى حرف الـ e (أ، ب، ج، د، هـ / e)
export const SECTIONS: Section[] = [
  { id: 'A', name: 'فصل أ (A)', letter: 'A' },
  { id: 'B', name: 'فصل ب (B)', letter: 'B' },
  { id: 'C', name: 'فصل ج (C)', letter: 'C' },
  { id: 'D', name: 'فصل د (D)', letter: 'D' },
  { id: 'E', name: 'فصل هـ (e)', letter: 'e' },
];

export const MONTHS = [
  'شهر أكتوبر',
  'شهر نوفمبر',
  'شهر ديسمبر',
];

export interface SubjectItem {
  name: string;
  hasMonthlyExam: boolean;
}

export const ALL_SUBJECTS_LIST: SubjectItem[] = [
  { name: 'اللغة العربية (العربي)', hasMonthlyExam: true },
  { name: 'الماث (الرياضيات)', hasMonthlyExam: true },
  { name: 'العلوم', hasMonthlyExam: true },
  { name: 'اللغة الإنجليزية', hasMonthlyExam: true },
  { name: 'الدراسات الاجتماعية', hasMonthlyExam: true },
  { name: 'التربية الدينية (الدين)', hasMonthlyExam: true },
  { name: 'التربية الفنية', hasMonthlyExam: false },
  { name: 'النشاط', hasMonthlyExam: false },
];

export const SUBJECTS = ALL_SUBJECTS_LIST.map((s) => s.name);

// المواد المخصصة لاختبارات الشهور (التربية الفنية والنشاط ليس لهما امتحان شهر)
export const MONTHLY_EXAM_SUBJECTS = ALL_SUBJECTS_LIST
  .filter((s) => s.hasMonthlyExam)
  .map((s) => s.name);

export const EVALUATION_OPTIONS = [
  'متفوق',
  'ممتاز',
  'جيد جداً',
  'جيد',
  'مقبول',
  'يحتاج متابعة',
];

// درجات الطلاب المبدئية (قاعدة بيانات بيضاء جاهزة للرصد الفعلي)
export const INITIAL_GRADES: StudentGrade[] = [];

// الحصص الـ 6 (تتخللها استراحة الفسحة Break بعد الحصة 3)
export const TIMES_6_PERIODS = ['', '', '', '', '', ''];

// توليد هيكل الجدول الدراسي (6 حصص بانتظار إدخال المعلم)
export function generateDefaultTimetable(gradeId: number, sectionId: string): DailySchedule[] {
  const days = [
    { name: 'الأحد', index: 0 },
    { name: 'الإثنين', index: 1 },
    { name: 'الثلاثاء', index: 2 },
    { name: 'الأربعاء', index: 3 },
    { name: 'الخميس', index: 4 },
  ];

  return days.map((day) => ({
    dayName: day.name,
    dayIndex: day.index,
    periods: TIMES_6_PERIODS.map((time, pIdx) => ({
      periodNumber: pIdx + 1,
      time,
      subject: 'في انتظار اعتماد المعلم',
      teacher: 'معلم المادة',
      room: `فصل ${gradeId}/${sectionId.toLowerCase()}`,
    })),
  }));
}

// صورة الجدول الافتراضية (فارغة حتى يرفعها المعلم بنفسه)
export const SAMPLE_SCHEDULE_IMAGE = '';

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'موعد الاختبارات الشهرية لشهر نوفمبر',
    content: 'تبدأ الاختبارات الشهرية وفقاً للجدول المرفق، يرجى الاستعداد الجيد والالتزام بالحضور في الموعد المحدد.',
    gradeId: 6,
    sectionId: 'E',
    author: 'إدارة المدرسة',
    date: '2026-10-28',
    priority: 'important',
  },
];
