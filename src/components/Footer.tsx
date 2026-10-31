import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const Footer: React.FC = () => {
  const { currentGrade, currentSection, setTeacherModalOpen } = useSchool();

  return (
    <footer className="mt-16 border-t border-blue-100 bg-white/70 backdrop-blur-sm text-slate-600 text-xs py-10 pb-24 sm:pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 p-1 shadow-xs flex items-center justify-center">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-base font-extrabold text-blue-900 block">
                  مدرسة سعد بن أبي وقاص الرسمية للغات
                </span>
                <span className="text-[11px] font-bold text-slate-400 font-mono">S.I.A.W Language School</span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-md">
              البوابة الإلكترونية المعتمدة للمرحلة الابتدائية لمتابعة جداول الحصص الأسبوعية ونتائج درجات الامتحانات الشهرية لجميع الصفوف والفصول (أ، ب، ج، د، هـ).
            </p>
            <div className="flex items-center gap-2 text-blue-700 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>نظام موثوق ومتوافق مع قواعد بيانات Firebase السحابية</span>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-900 text-sm">روابط سريعة</h5>
            <ul className="space-y-1.5 text-slate-500">
              <li>
                <span className="hover:text-blue-600 cursor-pointer">
                  الفصل النشط الحالي ({currentGrade.name} - {currentSection.letter})
                </span>
              </li>
              <li>
                <span
                  onClick={() => setTeacherModalOpen(true)}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  لوحة إدارة المعلمين وإدخال الدرجات
                </span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer">
                  لوحة شرف الطلاب المتفوقين
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-900 text-sm">الألوان والتصميم</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              طُور التصميم وفق متطلبات المظهر المريح للعين بثيم أبيض وأزرق حديث، وتصفح متوافق 100% مع الهواتف الذكية وأجهزة الكمبيوتر.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-4 h-4 rounded-full bg-blue-600 shadow-xs" title="أزرق ملكي" />
              <span className="w-4 h-4 rounded-full bg-sky-400 shadow-xs" title="سماوي هادئ" />
              <span className="w-4 h-4 rounded-full bg-white border border-slate-300 shadow-xs" title="أبيض ناصع" />
              <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 shadow-xs" title="خلفية مريحة" />
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} • مدرسة سعد بن أبي وقاص الرسمية
          </div>
          <div className="flex items-center gap-1">
            صُمم بعناية وتجربة مستخدم مريحة للعين <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
