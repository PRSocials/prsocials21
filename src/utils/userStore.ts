import { create } from 'zustand';
import { toast } from "sonner";
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, getFirestore, setDoc } from 'firebase/firestore';
import { firebaseApp } from 'app';

// Initialize Firestore directly
const firebaseFirestore = getFirestore(firebaseApp);

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  subscription: 'free' | 'beginner' | 'influencer' | 'corporate' | 'mastermind';
  chatCount: number;
  chatLimit: number;
  preferences?: {
    emailNotifications?: boolean;
    marketingEmails?: boolean;
  };
}

interface UserState {
  // Firebase auth user
  authUser: User | null;
  // Firestore user profile
  profile: UserProfile | null;
  // Loading states
  isLoadingProfile: boolean;
  error: Error | null;
  
  // Actions
  setAuthUser: (user: User | null) => void;
  fetchUserProfile: (userId: string) => Promise<void>;
  subscribeToUserProfile: (userId: string) => () => void; // Returns unsubscribe function
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  
  // Reset store
  reset: () => void;
}

const initialState = {
  authUser: null,
  profile: null,
  isLoadingProfile: false,
  error: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setAuthUser: (user) => set({ authUser: user }),
      
      fetchUserProfile: async (userId) => {
        set({ isLoadingProfile: true, error: null });
        try {
          const docRef = doc(firebaseFirestore, 'users', userId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            set({ profile: docSnap.data() as UserProfile, isLoadingProfile: false });
          } else {
            set({ profile: null, isLoadingProfile: false, error: new Error('User profile not found') });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          set({ isLoadingProfile: false, error: error as Error });
        }
      },
      
      subscribeToUserProfile: (userId) => {
        set({ isLoadingProfile: true, error: null });
        
        const unsubscribe = onSnapshot(
          doc(firebaseFirestore, 'users', userId),
          (docSnap) => {
            if (docSnap.exists()) {
              set({ profile: docSnap.data() as UserProfile, isLoadingProfile: false });
            } else {
              set({ profile: null, isLoadingProfile: false });
            }
          },
          (error) => {
            console.error('Error subscribing to user profile:', error);
            
            // Show a helpful message for permission errors
            if (error.code === "permission-denied") {
              console.warn("Firebase permission denied - likely due to security rules configuration");
              toast.error(
                "Firebase permission error. Please update security rules in your Firebase console. Visit the Config page for instructions.",
                { duration: 8000 }
              );
            }
            
            set({ isLoadingProfile: false, error: error as Error });
          }
        );
        
        return unsubscribe;
      },
      
      updateProfile: async (data: Partial<UserProfile>) => {
        // Get the current Firebase auth user directly from the auth service
        // rather than relying on the store's authUser which may not be synced
        const { authUser } = get();
        const { firebaseAuth } = await import('app');
        const currentUser = firebaseAuth.currentUser || authUser;
        
        if (!currentUser) {
          throw new Error('User not authenticated');
        }
        
        try {
          // Update the profile in Firestore
          const userRef = doc(firebaseFirestore, 'users', currentUser.uid);
          await setDoc(userRef, data, { merge: true });
          
          // Update local state
          set(state => ({
            ...state,
            profile: state.profile ? { ...state.profile, ...data } : null
          }));
          
          return;
        } catch (error) {
          console.error('Error updating user profile:', error);
          throw error;
        }
      },
      
      reset: () => set(initialState),
    }),
    {
      name: 'user-store',
      // Only persist the authUser
      partialize: (state) => ({ authUser: state.authUser }),
    }
  )
);
