import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  PlusCircle,
  Calendar,
  User,
  Edit3,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import type { Announcement } from '../types';

export const AnnouncementsView: React.FC = () => {
  const {
    currentGrade,
    currentSection,
    currentAnnouncements,
    setTeacherModalOpen,
    currentTeacher,
    updateAnnouncement,
    removeAnnouncement,
  } = useSchool();

  // Edit Announcement State
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editPriority, setEditPriority] = useState<'normal' | 'important' | 'urgent'>('important');

  const handleStartEdit = (ann: Announcement) => {
    setEditingAnn(ann);
    setEditTitle(ann.title);
    setEditContent(ann.content);
    setEditPriority(ann.priority);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnn) return;
    await updateAnnouncement({
      ...editingAnn,
      title: editTitle.trim(),
      content: editContent.trim(),
      priority: editPriority,
    });
    setEditingAnn(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من مسح هذا التنبيه نهائياً؟')) {
      await removeAnnouncement(id);
    }
  };

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

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                    {badge.label}
                  </span>

                  {currentTeacher && (
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => handleStartEdit(ann)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="تعديل هذا التنبيه"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="مسح هذا التنبيه"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
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

      {/* Edit Announcement Modal */}
      {editingAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                <h4 className="font-bold text-sm sm:text-base">تعديل بيانات التنبيه</h4>
              </div>
              <button
                onClick={() => setEditingAnn(null)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان التنبيه *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مستوى الأهمية</label>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editPrio"
                      value="normal"
                      checked={editPriority === 'normal'}
                      onChange={() => setEditPriority('normal')}
                    />
                    <span>عادي</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editPrio"
                      value="important"
                      checked={editPriority === 'important'}
                      onChange={() => setEditPriority('important')}
                    />
                    <span>مهم</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editPrio"
                      value="urgent"
                      checked={editPriority === 'urgent'}
                      onChange={() => setEditPriority('urgent')}
                    />
                    <span className="text-red-600 font-bold">عاجل وهام</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل التنبيه *</label>
                <textarea
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAnn(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

