import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from 'app';
import { useUserStore } from 'utils/userStore';

interface Props {
  children: React.ReactNode;
}

/**
 * Component that manages authentication state and user profile synchronization
 * Place this at the root of your app to ensure user state is synchronized everywhere
 */
export function UserAuthCheck({ children }: Props) {
  const { setAuthUser, subscribeToUserProfile, reset } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, async (user) => {
      console.log('Auth state changed:', user ? `User ${user.uid}` : 'No user');
      
      // Update auth user in store
      setAuthUser(user);
      
      // If user is logged in, subscribe to their profile
      let unsubscribeProfile: (() => void) | undefined;
      if (user) {
        unsubscribeProfile = subscribeToUserProfile(user.uid);
      } else {
        // Reset profile data when logged out
        reset();
      }
      
      // Clean up profile subscription when auth state changes
      return () => {
        if (unsubscribeProfile) {
          unsubscribeProfile();
        }
      };
    });
    
    // Clean up auth subscription when component unmounts
    return () => {
      unsubscribeAuth();
    };
  }, [setAuthUser, subscribeToUserProfile, reset, navigate]);

  return <>{children}</>;
}
