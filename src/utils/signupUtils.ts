import { firebaseAuth } from 'app';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createUserProfile } from './userProfileUtils';
import { useUserStore } from './userStore';

/**
 * Register a new user with email and password
 */
export const registerWithEmailPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    // Create user profile
    await createUserProfile(userCredential.user);
    // Set user in store
    useUserStore.getState().setAuthUser(userCredential.user);
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Register a new user with Google
 */
export const registerWithGoogle = async (): Promise<boolean> => {
  try {
    const userCredential = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    // Create user profile
    await createUserProfile(userCredential.user);
    // Set user in store
    useUserStore.getState().setAuthUser(userCredential.user);
    return true;
  } catch (error) {
    console.error('Google registration error:', error);
    throw error;
  }
};
