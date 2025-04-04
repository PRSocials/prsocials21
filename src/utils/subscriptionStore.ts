import { create } from 'zustand';
import { toast } from "sonner";
import { persist } from 'zustand/middleware';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://prsocials-backend.onrender.com';

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
  details: SubscriptionDetails | null;
  isLoading: boolean;
  error: Error | null;
  plans: SubscriptionPlans | null;
  isLoadingPlans: boolean;
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
          console.log('Fetching subscription details from backend...');
          const response = await fetch(`${BACKEND_URL}/api/my-subscription`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          if (!response.ok) throw new Error(`Backend responded with ${response.status}`);
          const details = await response.json();
          console.log('Subscription details received:', details);
          set({ details, isLoading: false });
        } catch (error) {
          console.error('Error fetching subscription:', error);
          set({ error: error as Error, isLoading: false });
        }
      },
      
      fetchPlans: async () => {
        set({ isLoadingPlans: true });
        try {
          console.log('Fetching plans from backend...');
          const response = await fetch(`${BACKEND_URL}/api/subscription-plans`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) throw new Error(`Backend responded with ${response.status}`);
          const plans = await response.json();
          console.log('Plans received:', plans);
          set({ plans, isLoadingPlans: false });
        } catch (error) {
          console.error('Error fetching plans:', error);
          set({ isLoadingPlans: false });
        }
      },
      
      checkout: async (priceId: string) => {
        try {
          if (!priceId || typeof priceId !== 'string' || priceId.trim() === '') {
            throw new Error('Invalid price ID provided');
          }
          
          const baseUrl = window.location.origin;
          let appBasePath = '';
          const pathSegments = window.location.pathname.split('/');
          if (pathSegments.length > 1) appBasePath = pathSegments.slice(0, -1).join('/');
          
          console.log(`Creating checkout with priceId: ${priceId}`);
          const successUrl = `${baseUrl}${appBasePath}/subscription-success`;
          const cancelUrl = `${baseUrl}${appBasePath}/subscriptions?checkout=canceled`;
          
          const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, successUrl, cancelUrl }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Checkout API error');
          }
          
          const data = await response.json();
          const checkoutUrl = data.checkoutUrl;
          if (!checkoutUrl) throw new Error('No checkout URL returned');
          
          return checkoutUrl;
        } catch (error) {
          console.error('Error creating checkout session:', error);
          throw error;
        }
      },
      
      cancelSubscription: async () => {
        try {
          const currentDetails = get().details;
          if (currentDetails) {
            set({ details: { ...currentDetails, subscriptionStatus: 'canceled' } });
            console.log('Optimistically updated subscription status to canceled');
          }
          
          const response = await fetch(`${BACKEND_URL}/api/cancel-subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          const result = await response.json();
          
          if (result.status === 'success') {
            await get().fetchSubscription();
            return result;
          } else {
            await get().fetchSubscription();
            return result || { status: 'error', message: 'Failed to cancel subscription' };
          }
        } catch (error) {
          console.error('Error canceling subscription:', error);
          await get().fetchSubscription();
          return { status: 'error', message: 'An error occurred while canceling the subscription' };
        }
      },
      
      createCustomerPortal: async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/create-customer-portal-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
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
          if (!sessionId) return { status: 'error', message: 'No session ID provided' };
          
          const response = await fetch(`${BACKEND_URL}/api/verify-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId }),
          });
          
          if (!response.ok) throw new Error('Session verification failed');
          const result = await response.json();
          
          if (result.status === 'success') {
            await get().fetchSubscription();
            return result;
          }
          return result;
        } catch (error) {
          console.error('Error verifying session:', error);
          return { status: 'error', message: 'Unable to verify subscription' };
        }
      },
      
      reset: () => set({ details: null, error: null }),
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({ plans: state.plans }),
    }
  )
);