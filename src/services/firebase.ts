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
  createUserWithEmailAndPassword,
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

const STORAGE_KEY_FIREBASE_CONFIG = 'siaw_firebase_config';
const STORAGE_KEY_LOCAL_GRADES = 'siaw_local_grades';
const STORAGE_KEY_LOCAL_SCHEDULES = 'siaw_local_schedules';
const STORAGE_KEY_LOCAL_ANNOUNCEMENTS = 'siaw_local_announcements';
const STORAGE_KEY_REGISTERED_USERS = 'siaw_registered_users';

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

// Retrieve stored Firebase configuration (defaults to user's siaw-1fddc project)
export function getStoredFirebaseConfig(): FirebaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading Firebase config from storage', err);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

// Initialize Firebase with the project credentials
export function initFirebase(config?: FirebaseConfig | null): {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
} {
  const conf = config || getStoredFirebaseConfig();
  if (!conf || !conf.apiKey || !conf.projectId) {
    return { app: null, db: null, auth: null };
  }

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

export function saveFirebaseConfig(config: FirebaseConfig): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
    initFirebase(config);
    return true;
  } catch (e) {
    console.error('Failed to save Firebase config', e);
    return false;
  }
}

export function clearFirebaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY_FIREBASE_CONFIG);
  appInstance = null;
  firestoreInstance = null;
  authInstance = null;
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

  // 1. Try Firebase Authentication (Cloud)
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
      // If user not found, try creating the account in Firebase Auth automatically
      if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
        try {
          const newCredential = await createUserWithEmailAndPassword(authInstance, cleanEmail, cleanPass);
          const newUser = newCredential.user;
          return {
            success: true,
            user: {
              id: newUser.uid,
              name: teacherName || cleanEmail.split('@')[0],
              subject: subject || 'جميع المواد',
              email: newUser.email || cleanEmail,
              isLoggedIn: true,
            },
          };
        } catch {
          // If creation error, fall through to local fallback
        }
      }
    }
  }

  // 2. Local fallback if Firebase Auth is not yet toggled on in the console or offline
  // Pre-configured Admin account: admin@school.com / admin123
  if (cleanEmail === 'admin@school.com' && cleanPass === 'admin123') {
    return {
      success: true,
      user: {
        id: 'admin-root',
        name: 'مدير النظام (الإدارة العامة)',
        subject: 'الإدارة المدرسية',
        email: cleanEmail,
        isLoggedIn: true,
      },
    };
  }

  // Check locally registered accounts
  const rawUsers = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
  const usersList: Array<{ email: string; pass: string; name: string; subject: string }> = rawUsers
    ? JSON.parse(rawUsers)
    : [];

  const found = usersList.find((u) => u.email === cleanEmail && u.pass === cleanPass);
  if (found) {
    return {
      success: true,
      user: {
        id: 'user-' + Date.now(),
        name: found.name,
        subject: found.subject,
        email: found.email,
        isLoggedIn: true,
      },
    };
  }

  // If password has at least 6 characters, automatically register/allow this teacher!
  if (cleanPass.length >= 6) {
    const newUserRecord = {
      email: cleanEmail,
      pass: cleanPass,
      name: teacherName || cleanEmail.split('@')[0],
      subject: subject || 'المعلم',
    };
    usersList.push(newUserRecord);
    localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(usersList));

    return {
      success: true,
      user: {
        id: 'teacher-' + Date.now(),
        name: newUserRecord.name,
        subject: newUserRecord.subject,
        email: newUserRecord.email,
        isLoggedIn: true,
      },
    };
  }

  return {
    success: false,
    error: 'كلمة المرور غير صحيحة، أو يجب أن تتكون من 6 أحرف على الأقل لحساب جديد',
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
  const item = {
    ...announcement,
    id: announcement.id || 'ann-' + Date.now(),
  };

  const updated = [item, ...allAnnouncements.filter((a) => a.id !== item.id)];
  localStorage.setItem(STORAGE_KEY_LOCAL_ANNOUNCEMENTS, JSON.stringify(updated));
  return item;
}
