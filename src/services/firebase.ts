import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import type { FirebaseConfig, StudentGrade, SectionSchedule, Announcement, TeacherUser } from '../types';

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyCnjszosp6IgI1BrQ6rO7N173MgxnzuALY',
  authDomain: 'siaw-1fddc.firebaseapp.com',
  projectId: 'siaw-1fddc',
  storageBucket: 'siaw-1fddc.firebasestorage.app',
  messagingSenderId: '322698513792',
  appId: '1:322698513792:web:fc429607cef065badcc565',
};

const STORAGE_KEY_LOCAL_GRADES = 'siaw_local_grades';
const STORAGE_KEY_LOCAL_SCHEDULES = 'siaw_local_schedules';
const STORAGE_KEY_LOCAL_ANNOUNCEMENTS = 'siaw_local_announcements';

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

// Retrieve Firebase configuration (locked to official project siaw-1fddc)
export function getStoredFirebaseConfig(): FirebaseConfig {
  return DEFAULT_FIREBASE_CONFIG;
}

// Initialize Firebase with the project credentials
export function initFirebase(_config?: FirebaseConfig | null): {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
} {
  const conf = DEFAULT_FIREBASE_CONFIG; // Locked to prevent tampering

  try {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      appInstance = existingApps[0];
    } else {
      appInstance = initializeApp({
        apiKey: conf.apiKey,
        authDomain: conf.authDomain || `${conf.projectId}.firebaseapp.com`,
        projectId: conf.projectId,
        storageBucket: conf.storageBucket || `${conf.projectId}.appspot.com`,
        messagingSenderId: conf.messagingSenderId || '',
        appId: conf.appId || '',
      });
    }
    firestoreInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
    return { app: appInstance, db: firestoreInstance, auth: authInstance };
  } catch (err) {
    console.error('Failed to initialize Firebase SDK', err);
    return { app: null, db: null, auth: null };
  }
}

export function isFirebaseConnected(): boolean {
  return !!firestoreInstance;
}

// Locked: client modification disabled
export function saveFirebaseConfig(_config: FirebaseConfig): boolean {
  return true;
}

export function clearFirebaseConfig(): void {
  // Client reset disabled to protect permanent connection
}

// ================= AUTHENTICATION (EMAIL & PASSWORD) =================
export async function authenticateTeacher(
  email: string,
  pass: string,
  teacherName?: string,
  subject?: string
): Promise<{ success: boolean; user?: TeacherUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' };
  }

  // 1. Firebase Authentication (Cloud) - Strict Authorization Check
  if (authInstance) {
    try {
      const userCredential = await signInWithEmailAndPassword(authInstance, cleanEmail, cleanPass);
      const fbUser = userCredential.user;

      return {
        success: true,
        user: {
          id: fbUser.uid,
          name: fbUser.displayName || teacherName || cleanEmail.split('@')[0],
          subject: subject || 'جميع المواد',
          email: fbUser.email || cleanEmail,
          isLoggedIn: true,
        },
      };
    } catch (fbErr: any) {
      console.warn('Firebase Auth error:', fbErr.code);
      let errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      
      if (
        fbErr.code === 'auth/user-not-found' ||
        fbErr.code === 'auth/invalid-credential' ||
        fbErr.code === 'auth/invalid-login-credentials'
      ) {
        errorMsg = 'هذا البريد الإلكتروني غير مضاف في قائمة المعلمين المصرح لهم في Firebase. يُسمح فقط بالدخول للحسابات التي يضيفها المسؤول في Firebase.';
      } else if (fbErr.code === 'auth/wrong-password') {
        errorMsg = 'كلمة المرور غير صحيحة لحساب هذا المعلم في Firebase.';
      } else if (fbErr.code === 'auth/invalid-email') {
        errorMsg = 'صيغة البريد الإلكتروني غير صالحة.';
      } else if (fbErr.code === 'auth/too-many-requests') {
        errorMsg = 'تم حظر المحاولات مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى المحاولة بعد قليل.';
      }

      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  // Fallback for offline emergency admin only
  if (cleanEmail === 'admin@school.com' && cleanPass === 'admin123') {
    return {
      success: true,
      user: {
        id: 'admin-root',
        name: 'مدير النظام (حساب الطوارئ)',
        subject: 'الإدارة المدرسية',
        email: cleanEmail,
        isLoggedIn: true,
      },
    };
  }

  return {
    success: false,
    error: 'خدمة Firebase غير متصلة أو أن هذا البريد غير مصرح له بالدخول في Firebase.',
  };
}

export async function signOutTeacher(): Promise<void> {
  if (authInstance) {
    try {
      await firebaseSignOut(authInstance);
    } catch (e) {
      console.warn('Signout error', e);
    }
  }
}

// ================= GRADES SYNC =================
export async function getGradesForClass(
  gradeId: number,
  sectionId: string,
  initialData: StudentGrade[]
): Promise<StudentGrade[]> {
  if (firestoreInstance) {
    try {
      const q = query(
        collection(firestoreInstance, 'student_grades'),
        where('gradeId', '==', gradeId),
        where('sectionId', '==', sectionId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as StudentGrade),
          id: docSnap.id,
        }));
      } else {
        const classInitial = initialData.filter((g) => g.gradeId === gradeId && g.sectionId === sectionId);
        for (const item of classInitial) {
          try {
            await addDoc(collection(firestoreInstance, 'student_grades'), item);
          } catch (e) {
            console.warn('Seeding failed', e);
          }
        }
        return classInitial;
      }
    } catch (err) {
      console.warn('Firebase query failed, falling back to local data', err);
    }
  }

  const localRaw = localStorage.getItem(STORAGE_KEY_LOCAL_GRADES);
  if (localRaw) {
    try {
      const allLocal: StudentGrade[] = JSON.parse(localRaw);
      return allLocal.filter((g) => g.gradeId === gradeId && g.sectionId === sectionId);
    } catch (e) {
      console.error(e);
    }
  }

  return initialData.filter((g) => g.gradeId === gradeId && g.sectionId === sectionId);
}

export async function saveGrade(newGrade: StudentGrade, allLocalGrades: StudentGrade[]): Promise<StudentGrade> {
  const gradeWithId = {
    ...newGrade,
    id: newGrade.id || 'g-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
  };

  if (firestoreInstance) {
    try {
      const docRef = await addDoc(collection(firestoreInstance, 'student_grades'), gradeWithId);
      gradeWithId.id = docRef.id;
    } catch (err) {
      console.warn('Failed to save to Firestore, stored locally', err);
    }
  }

  const updated = [gradeWithId, ...allLocalGrades.filter((g) => g.id !== gradeWithId.id)];
  localStorage.setItem(STORAGE_KEY_LOCAL_GRADES, JSON.stringify(updated));

  return gradeWithId;
}

export async function deleteGrade(id: string, allLocalGrades: StudentGrade[]): Promise<boolean> {
  if (firestoreInstance) {
    try {
      await deleteDoc(doc(firestoreInstance, 'student_grades', id));
    } catch (err) {
      console.warn('Failed to delete from Firestore', err);
    }
  }

  const updated = allLocalGrades.filter((g) => g.id !== id);
  localStorage.setItem(STORAGE_KEY_LOCAL_GRADES, JSON.stringify(updated));
  return true;
}

export async function updateGrade(updatedGrade: StudentGrade, allLocalGrades: StudentGrade[]): Promise<StudentGrade> {
  if (firestoreInstance && updatedGrade.id) {
    try {
      await setDoc(doc(firestoreInstance, 'student_grades', updatedGrade.id), updatedGrade, { merge: true });
    } catch (err) {
      console.warn('Failed to update in Firestore, stored locally', err);
    }
  }

  const updated = allLocalGrades.map((g) => (g.id === updatedGrade.id ? updatedGrade : g));
  localStorage.setItem(STORAGE_KEY_LOCAL_GRADES, JSON.stringify(updated));

  return updatedGrade;
}

// ================= SCHEDULE SYNC =================
export async function getScheduleForClass(
  gradeId: number,
  sectionId: string,
  defaultSchedule: SectionSchedule
): Promise<SectionSchedule> {
  const key = `${gradeId}_${sectionId}`;

  if (firestoreInstance) {
    try {
      const q = query(
        collection(firestoreInstance, 'schedules'),
        where('gradeId', '==', gradeId),
        where('sectionId', '==', sectionId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as SectionSchedule;
      } else {
        try {
          await setDoc(doc(firestoreInstance, 'schedules', key), defaultSchedule);
        } catch (e) {
          console.warn('Seed schedule error', e);
        }
      }
    } catch (err) {
      console.warn('Failed to get schedule from Firestore', err);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEY_LOCAL_SCHEDULES);
  if (raw) {
    try {
      const dict: Record<string, SectionSchedule> = JSON.parse(raw);
      if (dict[key]) {
        return dict[key];
      }
    } catch (e) {
      console.error(e);
    }
  }

  return defaultSchedule;
}

export async function saveSchedule(schedule: SectionSchedule): Promise<void> {
  const key = `${schedule.gradeId}_${schedule.sectionId}`;

  if (firestoreInstance) {
    try {
      await setDoc(doc(firestoreInstance, 'schedules', key), schedule);
    } catch (err) {
      console.warn('Failed to save schedule to Firestore', err);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_SCHEDULES);
    const dict: Record<string, SectionSchedule> = raw ? JSON.parse(raw) : {};
    dict[key] = schedule;
    localStorage.setItem(STORAGE_KEY_LOCAL_SCHEDULES, JSON.stringify(dict));
  } catch (err) {
    console.error('Failed to save schedule locally', err);
  }
}

// ================= ANNOUNCEMENTS SYNC =================
export async function getAnnouncementsForClass(
  gradeId: number,
  sectionId: string,
  initialAnnouncements: Announcement[]
): Promise<Announcement[]> {
  if (firestoreInstance) {
    try {
      const q = query(
        collection(firestoreInstance, 'announcements'),
        where('gradeId', '==', gradeId),
        where('sectionId', '==', sectionId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as Announcement),
          id: docSnap.id,
        }));
      }
    } catch (err) {
      console.warn('Firebase announcements query failed, falling back to local data', err);
    }
  }

  const localRaw = localStorage.getItem(STORAGE_KEY_LOCAL_ANNOUNCEMENTS);
  if (localRaw) {
    try {
      const all: Announcement[] = JSON.parse(localRaw);
      return all.filter((a) => a.gradeId === gradeId && a.sectionId === sectionId);
    } catch (e) {
      console.error(e);
    }
  }
  return initialAnnouncements.filter((a) => a.gradeId === gradeId && a.sectionId === sectionId);
}

export async function saveAnnouncement(announcement: Announcement, allAnnouncements: Announcement[]): Promise<Announcement> {
  const item: Announcement = {
    ...announcement,
    id: announcement.id || 'ann-' + Date.now(),
  };

  if (firestoreInstance) {
    try {
      await setDoc(doc(firestoreInstance, 'announcements', item.id), item, { merge: true });
    } catch (err) {
      console.warn('Failed to save announcement to Firestore, stored locally', err);
    }
  }

  const updated = [item, ...allAnnouncements.filter((a) => a.id !== item.id)];
  localStorage.setItem(STORAGE_KEY_LOCAL_ANNOUNCEMENTS, JSON.stringify(updated));
  return item;
}

export async function deleteAnnouncement(id: string, allAnnouncements: Announcement[]): Promise<boolean> {
  if (firestoreInstance) {
    try {
      await deleteDoc(doc(firestoreInstance, 'announcements', id));
    } catch (err) {
      console.warn('Failed to delete announcement from Firestore', err);
    }
  }

  const updated = allAnnouncements.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY_LOCAL_ANNOUNCEMENTS, JSON.stringify(updated));
  return true;
}
