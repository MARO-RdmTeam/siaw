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

// درجات الطلاب المبدئية
export const INITIAL_GRADES: StudentGrade[] = [
  // الصف السادس / فصل E (6/e)
  {
    id: 'g-6e-1',
    studentName: 'أحمد محمود العلي',
    seatNumber: '6010',
    gradeId: 6,
    sectionId: 'E',
    month: 'شهر أكتوبر',
    subject: 'الماث (الرياضيات)',
    score: 98,
    maxScore: 100,
    evaluation: 'متفوق',
    notes: 'متفوق وممتاز جداً في حل المسائل الحسابية',
    date: '2026-10-24',
    teacherName: 'أ. طارق عبد الرحمن',
  },
  {
    id: 'g-6e-2',
    studentName: 'سارة خالد المنصور',
    seatNumber: '6011',
    gradeId: 6,
    sectionId: 'E',
    month: 'شهر أكتوبر',
    subject: 'الماث (الرياضيات)',
    score: 95,
    maxScore: 100,
    evaluation: 'متفوق',
    notes: 'إجابة نموذجية ومستوى رائع',
    date: '2026-10-24',
    teacherName: 'أ. طارق عبد الرحمن',
  },
  {
    id: 'g-6e-3',
    studentName: 'عمر ياسين الشامي',
    seatNumber: '6012',
    gradeId: 6,
    sectionId: 'E',
    month: 'شهر أكتوبر',
    subject: 'الماث (الرياضيات)',
    score: 88,
    maxScore: 100,
    evaluation: 'جيد جداً',
    notes: 'جيد جداً مع تحسن ملحوظ في الهندسة',
    date: '2026-10-24',
    teacherName: 'أ. طارق عبد الرحمن',
  },
  {
    id: 'g-6e-4',
    studentName: 'مريم حسن النجار',
    seatNumber: '6013',
    gradeId: 6,
    sectionId: 'E',
    month: 'شهر أكتوبر',
    subject: 'الماث (الرياضيات)',
    score: 100,
    maxScore: 100,
    evaluation: 'متفوق',
    notes: 'الدرجة الكاملة، أداء استثنائي متألق!',
    date: '2026-10-24',
    teacherName: 'أ. طارق عبد الرحمن',
  },
  {
    id: 'g-6e-5',
    studentName: 'فاطمة الزهراء بكر',
    seatNumber: '6014',
    gradeId: 6,
    sectionId: 'E',
    month: 'شهر أكتوبر',
    subject: 'العلوم',
    score: 92,
    maxScore: 100,
    evaluation: 'ممتاز',
    notes: 'تفاعل ممتاز في التجارب المعملية',
    date: '2026-10-22',
    teacherName: 'أ. هناء السعيد',
  },
  {
    id: 'g-6e-6',
    studentName: 'أحمد محمود العلي',
    seatNumber: '6010',
    gradeId: 6,
    sectionId: 'E',
    month: 'شهر أكتوبر',
    subject: 'اللغة العربية (العربي)',
    score: 94,
    maxScore: 100,
    evaluation: 'ممتاز',
    notes: 'إعراب متميز وخط جميل',
    date: '2026-10-20',
    teacherName: 'أ. مصطفى الشافعي',
  },
  {
    id: 'g-6e-7',
    studentName: 'سارة خالد المنصور',
    seatNumber: '6011',
    gradeId: 6,
    sectionId: 'E',
    month: 'شهر أكتوبر',
    subject: 'اللغة الإنجليزية',
    score: 97,
    maxScore: 100,
    evaluation: 'متفوق',
    notes: 'Excellent grammar and reading comprehension',
    date: '2026-10-21',
    teacherName: 'أ. يوسف إبراهيم',
  },
  {
    id: 'g-6e-8',
    studentName: 'يوسف رامي الكردي',
    seatNumber: '6015',
    gradeId: 6,
    sectionId: 'E',
    month: 'شهر أكتوبر',
    subject: 'الدراسات الاجتماعية',
    score: 79,
    maxScore: 100,
    evaluation: 'جيد',
    notes: 'جيد، يُرجى التركيز أكثر على مراجعة الخرائط والتاريخ',
    date: '2026-10-24',
    teacherName: 'أ. سالم الشهري',
  },

  // الصف الأول / فصل A (1/A)
  {
    id: 'g-1a-1',
    studentName: 'علي إبراهيم الدوسري',
    seatNumber: '1001',
    gradeId: 1,
    sectionId: 'A',
    month: 'شهر أكتوبر',
    subject: 'اللغة العربية (العربي)',
    score: 100,
    maxScore: 100,
    evaluation: 'متفوق',
    notes: 'قراءة رائعة وحفظ متقن للحروف',
    date: '2026-10-23',
    teacherName: 'أ. وفاء العتيبي',
  },
  {
    id: 'g-1a-2',
    studentName: 'ريما فهد العبدالله',
    seatNumber: '1002',
    gradeId: 1,
    sectionId: 'A',
    month: 'شهر أكتوبر',
    subject: 'التربية الدينية (الدين)',
    score: 95,
    maxScore: 100,
    evaluation: 'ممتاز',
    notes: 'حفظ متقن للآيات والأحاديث',
    date: '2026-10-24',
    teacherName: 'أ. عبد الله السيد',
  },
];

// مواعيد الحصص الـ 6 (تتخللها استراحة الفسحة Break بعد الحصة 3)
export const TIMES_6_PERIODS = [
  '08:00 - 08:45',
  '08:45 - 09:30',
  '09:30 - 10:15',
  '10:45 - 11:30',
  '11:30 - 12:15',
  '12:15 - 01:00',
];

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
    author: 'إدارة مدرسة سعد بن أبي وقاص',
    date: '2026-10-28',
    priority: 'important',
  },
  {
    id: 'ann-2',
    title: 'نشاط عملي لمادة العلوم - المجسمات البيئية',
    content: 'المطلوب من طلاب فصل 6/e إحضار المواد اللازمة لتنفيذ مجسم دورة المياه في الطبيعة يوم الأربعاء القادم.',
    gradeId: 6,
    sectionId: 'E',
    author: 'أ. هناء السعيد (معلمة العلوم)',
    date: '2026-10-26',
    priority: 'normal',
  },
  {
    id: 'ann-3',
    title: 'تكريم المتفوقين في اختبار شهر أكتوبر',
    content: 'تهنئ إدارة مدرسة سعد بن أبي وقاص جميع أبنائنا المتفوقين وسيتم توزيع شهادات التقدير في الطابور الصباحي.',
    gradeId: 6,
    sectionId: 'E',
    author: 'أ. طارق عبد الرحمن',
    date: '2026-10-25',
    priority: 'urgent',
  },
];
