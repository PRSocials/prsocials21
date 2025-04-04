import { create } from 'zustand';
import { toast } from "sonner";
import { persist } from 'zustand/middleware';
import brain from 'brain';

// Subscription plan types
export type SubscriptionPlan = 'free' | 'beginner' | 'influencer' | 'corporate' | 'mastermind';

export interface SubscriptionDetails {
  subscription: SubscriptionPlan;
  subscriptionStatus: string;
  subscriptionId?: string;
  chatLimit: number;
  chatCount: number;
}

export interface PlanDetails {
  chatLimit: number;
  price: number;
}

export interface SubscriptionPlans {
  [key: string]: PlanDetails;
}

interface SubscriptionState {
  // Current user subscription details
  details: SubscriptionDetails | null;
  isLoading: boolean;
  error: Error | null;
  
  // Available plans
  plans: SubscriptionPlans | null;
  isLoadingPlans: boolean;
  
  // Actions
  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  checkout: (priceId: string) => Promise<string | null>;
  cancelSubscription: () => Promise<{status: string, message: string} | null>;
  createCustomerPortal: () => Promise<string | null>;
  verifySession: (sessionId: string) => Promise<{status: string, message: string, plan?: string}>;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      details: null,
      isLoading: false,
      error: null,
      plans: null,
      isLoadingPlans: false,
      
      fetchSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log('Fetching subscription details...');
          const response = await brain.my_subscription();
          const details = await response.json();
          console.log('Subscription details received:', details);
          
          // Force a reload with localStorage cache busting if response is really different 
          // This helps with subscription updates not showing up
          const sessionKey = 'last-sub-check';
          const lastCheck = localStorage.getItem(sessionKey);
          const cacheKey = `${details.subscription}-${details.subscriptionStatus}-${details.chatLimit}`;
          
          if (lastCheck && lastCheck !== cacheKey) {
            console.log('Detected significant subscription change:', { 
              from: lastCheck,
              to: cacheKey
            });
          }
          
          // Update the cache key
          localStorage.setItem(sessionKey, cacheKey);
          
          // Compare with current details to detect changes
          const currentDetails = get().details;
          if (currentDetails) {
            const changes = [];
            if (currentDetails.subscription !== details.subscription) {
              changes.push(`Plan changed: ${currentDetails.subscription} → ${details.subscription}`);
            }
            if (currentDetails.subscriptionStatus !== details.subscriptionStatus) {
              changes.push(`Status changed: ${currentDetails.subscriptionStatus} → ${details.subscriptionStatus}`);
            }
            if (currentDetails.chatLimit !== details.chatLimit) {
              changes.push(`Chat limit changed: ${currentDetails.chatLimit} → ${details.chatLimit}`);
            }
            
            if (changes.length > 0) {
              console.log('Subscription changes detected:', changes);
            }
          }
          
          set({ details, isLoading: false });
        } catch (error) {
          console.error('Error fetching subscription:', error);
          
          // Special handling for Firebase permission errors
          if (error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied') {
            console.warn('Firebase permission denied - likely due to security rules configuration');
            toast.error(
              'Firebase permission error. Please update security rules in your Firebase console. Visit the Config page for instructions.',
              { duration: 8000 }
            );
          }
          
          set({ error: error as Error, isLoading: false });
        }
      },
      
      fetchPlans: async () => {
        set({ isLoadingPlans: true });
        try {
          // Try the authenticated endpoint first
          try {
            console.log('Trying authenticated plans endpoint...');
            const response = await brain.subscription_plans();
            const plans = await response.json();
            console.log('Plans received from authenticated endpoint:', plans);
            set({ plans, isLoadingPlans: false });
            return;
          } catch (authError) {
            console.warn('Error fetching authenticated plans, falling back to public endpoint:', authError);
          }
          
          // Fall back to public endpoint if authenticated one fails
          console.log('Trying public plans endpoint...');
          try {
            const baseUrl = window.location.origin;
            const apiUrl = `${baseUrl}/_projects/3cbfdca0-f781-4d65-8f3c-458e464d4560/dbtn/devx/app/routes/api/stripe_public_api/plans`;
            
            const publicResponse = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (publicResponse.ok) {
              const publicPlans = await publicResponse.json();
              console.log('Plans received from public endpoint:', publicPlans);
              set({ plans: publicPlans, isLoadingPlans: false });
              return;
            } else {
              console.error('Public plans endpoint failed:', publicResponse.status);
              throw new Error(`Public plans endpoint failed: ${publicResponse.status}`);
            }
          } catch (publicError) {
            console.error('Error fetching from public plans endpoint:', publicError);
            throw publicError;
          }
        } catch (error) {
          console.error('All plans fetch attempts failed:', error);
          set({ isLoadingPlans: false });
        }
      },
      
      checkout: async (priceId: string) => {
        try {
          // Validate the price ID before calling API
          if (!priceId || typeof priceId !== 'string' || priceId.trim() === '') {
            throw new Error('Invalid price ID provided');
          }
          
          // Get current URL for success/cancel URLs
          const baseUrl = window.location.origin;
          
          // In Databutton, we need to handle the base path correctly
          // Extract the base path from the current URL
          let appBasePath = '';
          const pathSegments = window.location.pathname.split('/');
          
          // If we're in the app, the last segment will be 'subscriptions' or similar
          // We want everything except that last segment
          if (pathSegments.length > 1) {
            // Keep all segments except the last one
            appBasePath = pathSegments.slice(0, -1).join('/');
          }
          
          console.log(`Creating checkout with priceId: ${priceId}`);
          console.log(`Base URL: ${baseUrl}, App Base Path: ${appBasePath}`);
          
          // Build full URLs for success and cancel paths
          // Make sure Stripe directly includes the session_id parameter correctly
          const successUrl = `${baseUrl}${appBasePath}/subscription-success`;
          const cancelUrl = `${baseUrl}${appBasePath}/subscriptions?checkout=canceled`;
          
          console.log(`Success URL: ${successUrl}`);
          console.log(`Cancel URL: ${cancelUrl}`);
          
          // Store user state in localStorage before redirecting to Stripe
          // This will help us recover auth state after redirect
          try {
            // Import Firebase auth directly to ensure we can use persistence
            const { firebaseAuth } = await import('app');
            if (firebaseAuth.currentUser) {
              console.log('Storing user state for auth recovery after redirect');
              localStorage.setItem('stripe_redirect_uid', firebaseAuth.currentUser.uid);
              localStorage.setItem('stripe_redirect_email', firebaseAuth.currentUser.email || '');
              // Get a fresh token and store it
              const token = await firebaseAuth.currentUser.getIdToken(true);
              localStorage.setItem('stripe_redirect_token', token);
            }
          } catch (e) {
            console.error('Error storing auth state:', e);
          }
          
          console.log('Making API call to create checkout session...');
          const response = await brain.create_checkout_session({
            priceId,
            successUrl,
            cancelUrl,
          });
          
          console.log('API response status:', response.status);
          
          if (!response.ok) {
            let errorMessage = 'Checkout API error';
            try {
              const errorData = await response.json();
              console.error('Checkout API error:', errorData);
              errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch (e) {
              console.error('Error parsing error response:', e);
              // Try to get text response if JSON parsing fails
              try {
                const textError = await response.text();
                console.error('Error text response:', textError);
                if (textError) errorMessage = textError;
              } catch (textError) {
                console.error('Failed to get error text:', textError);
              }
            }
            throw new Error(errorMessage);
          }
          
          const data = await response.json();
          console.log('Checkout response:', data);
          
          // Check the response format - our backend now returns { status, checkoutUrl } format
          if (data.status === 'error') {
            console.error('Error from checkout endpoint:', data.message);
            throw new Error(data.message || 'Unable to create checkout session');
          }
          
          // Make sure we got a checkout URL back - the format can be either legacy or new
          const checkoutUrl = data.checkoutUrl || (data.status === 'success' && data.checkoutUrl);
          if (!checkoutUrl) {
            console.error('No checkout URL in response:', data);
            throw new Error('No checkout URL returned from server');
          }
          
          // Return the checkout URL
          return checkoutUrl;
        } catch (error) {
          console.error('Error creating checkout session:', error);
          throw error;
        }
      },
      
      cancelSubscription: async () => {
        try {
          // Start with an optimistic update to immediately show canceled status
          const currentDetails = get().details;
          if (currentDetails) {
            // Create a copy with updated status
            const updatedDetails = {
              ...currentDetails,
              subscriptionStatus: 'canceled'
            };
            
            // Update the state immediately for better UX
            set({ details: updatedDetails });
            
            console.log('Optimistically updated subscription status to canceled');
          }
          
          // Make the actual API call
          const response = await brain.cancel_subscription();
          const result = await response.json();
          
          if (result && result.status === 'success') {
            // If the API call was successful, fetch the updated details
            await get().fetchSubscription();
            return result;
          } else {
            // If there was an error, revert the optimistic update
            await get().fetchSubscription();
            return result || { status: 'error', message: 'Failed to cancel subscription' };
          }
        } catch (error) {
          console.error('Error canceling subscription:', error);
          // Revert optimistic update on error
          await get().fetchSubscription();
          return { status: 'error', message: 'An error occurred while canceling the subscription' };
        }
      },
      
      createCustomerPortal: async () => {
        try {
          const response = await brain.create_customer_portal_session();
          const result = await response.json();
          
          return result.url;
        } catch (error) {
          console.error('Error creating customer portal session:', error);
          return null;
        }
      },
      
      verifySession: async (sessionId: string) => {
        try {
          console.log(`Verifying session ID: ${sessionId}`);
          if (!sessionId) {
            return { status: 'error', message: 'No session ID provided' };
          }
          
          // Try to recover auth state from localStorage that we saved before redirect
          let storedUid = null;
          let storedEmail = null;
          let storedToken = null;
          
          try {
            console.log('Attempting to recover auth state from localStorage...');
            storedUid = localStorage.getItem('stripe_redirect_uid');
            storedEmail = localStorage.getItem('stripe_redirect_email');
            storedToken = localStorage.getItem('stripe_redirect_token');
            
            if (storedUid && storedEmail) {
              console.log(`Found stored auth state: ${storedEmail}`);
              // Log current auth state for debugging
              const { firebaseAuth } = await import('app');
              console.log('Current auth state:', { 
                currentUser: firebaseAuth.currentUser ? 'yes' : 'no',
                storedTokenAvailable: !!storedToken
              });
            }
          } catch (e) {
            console.error('Error recovering auth state:', e);
          }
          
          // Priority 1: Try to refresh subscription and see if it's already active
          console.log('Step 1: Checking if subscription is already active...');
          try {
            // Refresh subscription details directly
            console.log('Refreshing subscription data...');
            await get().fetchSubscription();
            
            // If successful, check if we have an active subscription
            const details = get().details;
            console.log('Current subscription details:', details);
            
            if (details && details.subscription !== 'free' && details.subscriptionStatus === 'active') {
              console.log('✅ Subscription already activated and active!');
              return { 
                status: 'success', 
                message: 'Subscription is active', 
                plan: details.subscription 
              };
            }
          } catch (refreshError) {
            console.error('Error refreshing subscription data:', refreshError);
          }

          // Priority 2: Try calling verify-session with our brain client
          console.log('Step 2: Calling verify-session API...');
          try {
            // Ensure we have fresh auth by waiting a moment
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Making API call to verify session...');
            const response = await brain.verify_session({ session_id: sessionId });
            console.log('API response status:', response.status);
            
            if (response.ok) {
              // Successfully got a response from the verification endpoint
              try {
                const result = await response.json();
                console.log('Session verification result:', result);
                
                // Refresh subscription details after verification
                if (result.status === 'success') {
                  console.log('✅ Verification successful with standard API call');
                  await get().fetchSubscription();
                  return result;
                } else {
                  console.log('API verification returned error status:', result);
                }
              } catch (jsonError) {
                console.error('Error parsing verification result JSON:', jsonError);
              }
            } else {
              console.log('API verification failed with status:', response.status);
            }
          } catch (verifyError) {
            console.error('Error during standard verification:', verifyError);
          }
          
          // Priority 3: Try direct API call with auth token
          console.log('Step 3: Trying direct API call with stored token...');
          try {
            const { API_URL, firebaseAuth } = await import('app');
            let idToken = storedToken;
            
            // If we have a current user, get a fresh token instead
            if (firebaseAuth.currentUser) {
              console.log('Getting fresh token from current user...');
              try {
                idToken = await firebaseAuth.currentUser.getIdToken(true);
              } catch (tokenError) {
                console.error('Error getting fresh token:', tokenError);
              }
            }
            
            // Only proceed if we have a token
            if (idToken) {
              console.log('Token available, proceeding with direct API call');
              const verifyUrl = `${API_URL}/routes/api/verify-session`;
              
              console.log(`Calling verify endpoint directly: ${verifyUrl}`);
              const response = await fetch(verifyUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ session_id: sessionId }),
                credentials: 'include'
              });
              
              if (response.ok) {
                const result = await response.json();
                console.log('Direct API verification result:', result);
                
                // Refresh subscription details after verification
                if (result.status === 'success') {
                  console.log('✅ Direct API verification successful');
                  await get().fetchSubscription();
                  return result;
                }
              } else {
                console.error('Direct API verification failed:', response.status);
              }
            } else {
              console.log('No auth token available for direct API call');
            }
          } catch (directApiError) {
            console.error('Error with direct API call:', directApiError);
          }
          
          // Priority 4: Try once more to fetch subscription, maybe webhook processed it by now
          console.log('Step 4: Checking subscription one more time after delay...');
          try {
            // Wait 3 seconds and try one final time
            await new Promise(resolve => setTimeout(resolve, 3000));
            await get().fetchSubscription();
            
            // Check if it updated
            const updatedDetails = get().details;
            if (updatedDetails && updatedDetails.subscription !== 'free' && updatedDetails.subscriptionStatus === 'active') {
              console.log('✅ Subscription activated on final check!');
              return { 
                status: 'success', 
                message: 'Subscription activated successfully', 
                plan: updatedDetails.subscription 
              };
            }
          } catch (finalRefreshError) {
            console.error('Error on final subscription refresh:', finalRefreshError);
          }
          
          // If we get here, all verification attempts failed
          console.log('❌ All verification methods failed');
          return { 
            status: 'error', 
            message: 'Unable to verify your subscription. Please contact support if your subscription does not activate within a few minutes.' 
          };
        } catch (error) {
          console.error('Unhandled error in verification process:', error);
          return {
            status: 'error',
            message: error instanceof Error ? error.message : 'An unexpected error occurred during verification'
          };
        }
      },
      
      reset: () => set({ details: null, error: null }),
    }),
    {
      name: 'subscription-storage',
      // Only persist plans data, not loading states or errors
      partialize: (state) => ({ plans: state.plans }),
    }
  )
);
