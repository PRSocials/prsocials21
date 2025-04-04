import { User, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { firebaseApp, firebaseAuth } from "app";
import { UserProfile } from "./userStore";
import brain from "brain";

// Initialize Firestore directly
const firebaseFirestore = getFirestore(firebaseApp);

/**
 * Creates a new user profile in Firestore
 * This should be called after a user signs up
 */
export const createUserProfile = async (user: User, displayName?: string): Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid: user.uid,
    name: displayName || user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    createdAt: new Date().toISOString(),
    subscription: 'free', // Default subscription tier
    chatCount: 0, // Initialize chat count
    chatLimit: 2, // Free tier chat limit
  };

  // Check if the profile already exists
  const docRef = doc(firebaseFirestore, 'users', user.uid);
  const docSnap = await getDoc(docRef);

  // Only create if it doesn't exist
  if (!docSnap.exists()) {
    try {
      // Try to create via Firestore directly
      await setDoc(docRef, userProfile);
      console.log('User profile created in Firestore:', user.uid);
    } catch (error) {
      console.error('Error creating user profile in Firestore:', error);
      
      // Fall back to API if Firestore fails
      try {
        // Try new endpoint first
        let response = await brain.create_user_profile2();
        let data = await response.json();
        
        // Fall back to original endpoint if needed
        if (!data.success) {
          console.log('Falling back to original create profile endpoint');
          response = await brain.create_user_profile();
          data = await response.json();
        }
        
        if (data.success) {
          console.log('User profile created via API:', user.uid);
        } else {
          console.error('Failed to create user profile via API:', data.message);
        }
      } catch (apiError) {
        console.error('Error creating user profile via API:', apiError);
      }
    }
  }

  return userProfile;
};

/**
 * Updates a user's chat count in Firestore
 */
export const incrementChatCount = async (userId: string): Promise<void> => {
  const docRef = doc(firebaseFirestore, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const userData = docSnap.data() as UserProfile;
    await setDoc(docRef, {
      ...userData,
      chatCount: (userData.chatCount || 0) + 1,
    }, { merge: true });
  }
};

/**
 * Gets the current chat count for a user
 */
export const getChatUsage = async (userId: string): Promise<{ used: number, limit: number }> => {
  const docRef = doc(firebaseFirestore, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const userData = docSnap.data() as UserProfile;
    return {
      used: userData.chatCount || 0,
      limit: userData.chatLimit || 2,
    };
  }
  
  return { used: 0, limit: 2 };
};

/**
 * Register a new user and automatically sign them in
 */
export const registerUser = async (
  email: string, 
  password: string,
  displayName?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    
    // Create user profile in Firestore
    await createUserProfile(userCredential.user, displayName);
    
    return { 
      success: true, 
      message: "Account created and signed in successfully" 
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    let message = "Failed to create account";
    
    if (error.code === "auth/email-already-in-use") {
      message = "Email is already in use";
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email format";
    } else if (error.code === "auth/weak-password") {
      message = "Password is too weak";
    }
    
    return { success: false, message };
  }
};
