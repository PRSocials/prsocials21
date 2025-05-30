import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth } from 'app/auth';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createUserProfile } from 'utils/userProfileUtils';
import { useUserStore } from 'utils/userStore';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { firebaseApp } from 'app';

type Props = {
  onSuccess?: () => void;
};

export const EmailPasswordLogin: React.FC<Props> = ({ onSuccess }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      toast.success('Successfully signed in!');
      // Navigate to dashboard on successful login
      navigate('/dashboard');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Failed to sign in';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email format';
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get functions from useUserStore at the component level
  const { fetchUserProfile } = useUserStore();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting Google login from domain:', window.location.hostname);
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
      
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      const user = userCredential.user;
      
      // Get firestore instance
      const firestore = getFirestore(firebaseApp);
      const userRef = doc(firestore, 'users', user.uid);
      
      try {
        // Attempt to create user profile
        // First try using the utility function which handles both Firestore direct and API fallback
        const userProfile = await createUserProfile(user);
        
        // If newly created, ensure display name is set (Google often provides this)
        if (user.displayName && (!userProfile.name || userProfile.name === user.email?.split('@')[0])) {
          await setDoc(userRef, {
            name: user.displayName
          }, { merge: true });
        }
        
        // Update user store to ensure UI is in sync
        await fetchUserProfile(user.uid);
        
      } catch (profileError) {
        console.error('Error creating/updating profile:', profileError);
        // Even if profile creation fails, the auth was successful
      }
      
      toast.success('Successfully signed in with Google!');
      // Navigate to dashboard on successful Google login
      navigate('/dashboard');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Google login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Current domain:', window.location.hostname);
      
      let message = 'Google sign-in failed';
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in popup was closed before completing the sign-in';
      } else if (error.code === 'auth/popup-blocked') {
        message = 'Sign-in popup was blocked by your browser';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = `This domain (${window.location.hostname}) is not authorized in Firebase. Add it in your Firebase Console.`;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button 
              type="button"
              className="text-sm text-primary hover:text-primary/90"
              onClick={() => toast.info('Please contact support to reset your password')}
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : 'Sign in'}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleGoogleLogin}
        disabled={isLoading}
        type="button"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </Button>
    </div>
  );
};