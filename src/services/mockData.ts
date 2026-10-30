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
  'منتصف الفصل الدراسي',
  'شهر فبراير',
  'شهر مارس',
];

export const SUBJECTS = [
  'القرآن الكريم والتربية الإسلامية',
  'لغتي الجميلة (اللغة العربية)',
  'الرياضيات',
  'العلوم',
  'اللغة الإنجليزية',
  'الدراسات الاجتماعية',
  'المهارات الرقمية والحاسب',
  'التربية الفنية',
  'التربية البدنية والدفاع عن النفس',
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
    subject: 'الرياضيات',
    score: 98,
    maxScore: 100,
    notes: 'ممتاز جداً ومتفوق في العمليات الحسابية',
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
    subject: 'الرياضيات',
    score: 95,
    maxScore: 100,
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
    subject: 'الرياضيات',
    score: 88,
    maxScore: 100,
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
    subject: 'الرياضيات',
    score: 100,
    maxScore: 100,
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
    subject: 'لغتي الجميلة (اللغة العربية)',
    score: 94,
    maxScore: 100,
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
    subject: 'الرياضيات',
    score: 79,
    maxScore: 100,
    notes: 'جيد، يُرجى التركيز أكثر على مراجعة الكسور',
    date: '2026-10-24',
    teacherName: 'أ. طارق عبد الرحمن',
  },

  // الصف الأول / فصل A (1/A)
  {
    id: 'g-1a-1',
    studentName: 'علي إبراهيم الدوسري',
    seatNumber: '1001',
    gradeId: 1,
    sectionId: 'A',
    month: 'شهر أكتوبر',
    subject: 'لغتي الجميلة (اللغة العربية)',
    score: 100,
    maxScore: 100,
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
    subject: 'الرياضيات',
    score: 95,
    maxScore: 100,
    notes: 'إتقان تام للعد والعمليات البسيطة',
    date: '2026-10-24',
    teacherName: 'أ. نورة الغامدي',
  },
];

// توليد الجدول الأسبوعي
export function generateDefaultTimetable(gradeId: number, sectionId: string): DailySchedule[] {
  const days = [
    { name: 'الأحد', index: 0 },
    { name: 'الإثنين', index: 1 },
    { name: 'الثلاثاء', index: 2 },
    { name: 'الأربعاء', index: 3 },
    { name: 'الخميس', index: 4 },
  ];

  const subjectsPool = [
    { subject: 'القرآن الكريم', teacher: 'أ. عبد الله السيد' },
    { subject: 'لغتي الجميلة', teacher: 'أ. مصطفى الشافعي' },
    { subject: 'الرياضيات', teacher: 'أ. طارق عبد الرحمن' },
    { subject: 'العلوم', teacher: 'أ. هناء السعيد' },
    { subject: 'اللغة الإنجليزية', teacher: 'أ. يوسف إبراهيم' },
    { subject: 'الدراسات الاجتماعية', teacher: 'أ. سالم الشهري' },
    { subject: 'المهارات الرقمية', teacher: 'أ. إيمان ناصر' },
    { subject: 'التربية الفنية والبدنية', teacher: 'أ. سامر قاسم' },
  ];

  const times = [
    '07:30 - 08:15',
    '08:15 - 09:00',
    '09:00 - 09:45',
    '10:15 - 11:00',
    '11:00 - 11:45',
    '11:45 - 12:30',
    '12:30 - 01:15',
  ];

  return days.map((day, dayIdx) => {
    return {
      dayName: day.name,
      dayIndex: day.index,
      periods: times.map((time, pIdx) => {
        const itemIdx = (dayIdx * 3 + pIdx + gradeId + sectionId.charCodeAt(0)) % subjectsPool.length;
        const sub = subjectsPool[itemIdx];
        return {
          periodNumber: pIdx + 1,
          time,
          subject: sub.subject,
          teacher: sub.teacher,
          room: `قاعة ${gradeId}/${sectionId.toLowerCase()}`,
        };
      }),
    };
  });
}

// صورة الجدول الرسمية المعتمدة
export const SAMPLE_SCHEDULE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e40af" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="3" />
  
  <rect x="0" y="0" width="1200" height="130" rx="20" fill="url(#headerGrad)" />
  <text x="600" y="55" font-family="Cairo, Arial, sans-serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">
    وزارة التعليم - مدرسة سعد بن أبي وقاص الابتدائية
  </text>
  <text x="600" y="100" font-family="Cairo, Arial, sans-serif" font-size="24" fill="#e0f2fe" text-anchor="middle">
    الجدول المدرسي الأسبوعي المعتمد | العام الدراسي 2026 - 2027
  </text>

  <circle cx="1080" cy="65" r="45" fill="rgba(255,255,255,0.15)" stroke="#ffffff" stroke-dasharray="4 2" stroke-width="2"/>
  <text x="1080" y="70" font-family="Cairo, sans-serif" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="bold">معتمد رسمياً</text>

  <g transform="translate(40, 160)">
    <rect x="0" y="0" width="1120" height="50" rx="8" fill="#f1f5f9" stroke="#94a3b8" />
    <text x="1040" y="32" font-family="Cairo, sans-serif" font-size="18" font-weight="bold" fill="#1e293b" text-anchor="middle">اليوم</text>
    <text x="910" y="32" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle">الحصة 1</text>
    <text x="770" y="32" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle">الحصة 2</text>
    <text x="630" y="32" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle">الحصة 3</text>
    <text x="490" y="32" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#d97706" text-anchor="middle">فسحة واستراحة</text>
    <text x="350" y="32" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle">الحصة 4</text>
    <text x="210" y="32" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle">الحصة 5</text>
    <text x="70" y="32" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle">الحصة 6</text>
  </g>

  <g transform="translate(40, 225)">
    <rect x="0" y="0" width="1120" height="85" rx="8" fill="#eff6ff" stroke="#bfdbfe" />
    <text x="1040" y="50" font-family="Cairo, sans-serif" font-size="20" font-weight="bold" fill="#1d4ed8" text-anchor="middle">الأحد</text>
    <text x="910" y="42" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">رياضيات</text>
    <text x="910" y="65" font-family="Cairo, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">أ. طارق</text>
    <text x="770" y="42" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">لغتي الجميلة</text>
    <text x="770" y="65" font-family="Cairo, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">أ. مصطفى</text>
    <text x="630" y="42" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">علوم</text>
    <text x="630" y="65" font-family="Cairo, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">أ. هناء</text>
    <rect x="420" y="10" width="140" height="65" rx="6" fill="#fef3c7" stroke="#fcd34d" />
    <text x="490" y="48" font-family="Cairo, sans-serif" font-size="15" font-weight="bold" fill="#92400e" text-anchor="middle">وجبة وصلاة</text>
    <text x="350" y="42" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">لغة إنجليزية</text>
    <text x="350" y="65" font-family="Cairo, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">أ. يوسف</text>
    <text x="210" y="42" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">دراسات</text>
    <text x="210" y="65" font-family="Cairo, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">أ. سالم</text>
    <text x="70" y="42" font-family="Cairo, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">مهارات رقمية</text>
    <text x="70" y="65" font-family="Cairo, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">أ. إيمان</text>
  </g>

  <g transform="translate(40, 730)">
    <text x="1120" y="40" font-family="Cairo, sans-serif" font-size="14" fill="#64748b" text-anchor="end">
      • يبدأ الطابور الصباحي الساعة 07:15 صباحاً • يرجى الالتزام بالزي المدرسي الموحد
    </text>
    <text x="0" y="40" font-family="Cairo, sans-serif" font-size="14" font-weight="bold" fill="#2563eb" text-anchor="start">
      إدارة مدرسة سعد بن أبي وقاص الابتدائية
    </text>
  </g>
</svg>
`);

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
