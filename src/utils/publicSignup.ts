import { firebaseAuth } from 'app/auth';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createUserProfile } from './userProfileUtils';

/**
 * Public utility for signing up users without requiring authentication
 */
export const publicSignup = {
  /**
   * Register a new user with email and password
   */
  async registerWithEmail(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await createUserProfile(userCredential.user);
      return true;
    } catch (error: any) {
      console.error('Email registration error:', error);
      throw error;
    }
  },

  /**
   * Sign in with Google (also creates new account if user doesn't exist)
   */
  async signInWithGoogle(): Promise<boolean> {
    try {
      console.log('Attempting Google login from domain:', window.location.hostname);
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
      
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      await createUserProfile(userCredential.user);
      return true;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Current domain:', window.location.hostname);
      throw error;
    }
  }
};
