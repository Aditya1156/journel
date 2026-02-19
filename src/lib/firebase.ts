import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATRPG50Oua1p5XaWyF03HNMfMBJ1IYAlU",
  authDomain: "studio-7174564616-7a8a8.firebaseapp.com",
  projectId: "studio-7174564616-7a8a8",
  storageBucket: "studio-7174564616-7a8a8.firebasestorage.app",
  messagingSenderId: "111368949838",
  appId: "1:111368949838:web:7a0014d197245865efb31f",
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Auth functions
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, googleProvider);
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Send verification email
  if (userCredential.user) {
    await sendEmailVerification(userCredential.user);
  }
  return userCredential;
};

export const logOut = async (): Promise<void> => {
  return signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

export const sendVerificationEmail = async (user: User): Promise<void> => {
  return sendEmailVerification(user);
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, app };
export type { User, UserCredential };
