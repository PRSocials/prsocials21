import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserGuardContext } from "app";
import { MainLayout } from "components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useSubscriptionStore, SubscriptionPlan } from "utils/subscriptionStore";
import { toast } from "sonner";

enum VerificationStatus {
  VERIFYING = "verifying",
  SUCCESS = "success",
  ERROR = "error"
}

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const [searchParams] = useSearchParams();
  
  // Get session ID from URL parameters
  const sessionId = searchParams.get("session_id");
  
  // Log all URL parameters for debugging
  console.log('All URL parameters:', Object.fromEntries(searchParams.entries()));
  console.log('Session ID from URL:', sessionId);
  
  const [status, setStatus] = useState<VerificationStatus>(
    sessionId ? VerificationStatus.VERIFYING : VerificationStatus.ERROR
  );
  const [errorMessage, setErrorMessage] = useState<string>(
    sessionId ? "" : "No session ID provided"
  );
  
  const { verifySession, fetchSubscription, details } = useSubscriptionStore();
  
  // Track whether we've done our automatic verification
  const [hasVerified, setHasVerified] = useState(false);
  
  // Try to get session ID from URL hash if not in query params
  useEffect(() => {
    if (!sessionId) {
      // Try to extract from URL hash
      const hash = window.location.hash;
      console.log('URL hash:', hash);
      
      if (hash) {
        // Check if hash contains session_id
        const hashParams = new URLSearchParams(hash.substring(1));
        const hashSessionId = hashParams.get('session_id');
        
        if (hashSessionId) {
          console.log('Found session ID in hash:', hashSessionId);
          // Update URL to include session_id as a proper query param
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('session_id', hashSessionId);
          window.history.replaceState({}, '', newUrl.toString());
          // Reload page to use the new URL with query param
          window.location.reload();
          return;
        }
      }
      
      // Check localStorage for a saved session ID
      const savedSessionId = localStorage.getItem('stripe_session_id');
      if (savedSessionId) {
        console.log('Found saved session ID in localStorage:', savedSessionId);
        // Update URL to include session_id as a proper query param
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('session_id', savedSessionId);
        window.history.replaceState({}, '', newUrl.toString());
        // Reload page to use the new URL with query param
        window.location.reload();
        return;
      }
    }
  }, [sessionId]);
  
  // Check if subscription is already active before attempting verification
  // to handle cases where webhook already updated the subscription
  useEffect(() => {
    const checkExistingSubscription = async () => {
      console.log("Checking existing subscription status:", details);
      if (details && details.subscription !== 'free' && details.subscriptionStatus === 'active') {
        console.log("Already have active subscription, skipping verification");
        setStatus(VerificationStatus.SUCCESS);
        return true;
      }
      return false;
    };
    
    // Only run verification if we have a session ID and no active subscription
    const verifyCheckout = async () => {
      // First check if we already have an active subscription
      const alreadyActive = await checkExistingSubscription();
      if (alreadyActive) return;
      
      if (!sessionId) {
        console.error("No session ID available in URL parameters");
        setStatus(VerificationStatus.ERROR);
        setErrorMessage("No session ID provided");
        return;
      }
      
      // Save session ID to localStorage in case we need it later
      localStorage.setItem('stripe_session_id', sessionId);
      
      console.log("Starting verification process with session ID:", sessionId);
      
      try {
        // Add a longer delay to make sure we're fully authenticated after the redirect
        // This helps with the 401 errors by ensuring Firebase auth is fully initialized
        console.log("Waiting for auth initialization...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        if (!user || !user.uid) {
          console.log("User not yet authenticated, waiting longer...");
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        // Log auth status
        console.log("Auth status:", { 
          isAuthenticated: !!user, 
          userId: user?.uid,
          userEmail: user?.email 
        });
        
        // Refresh subscription first
        console.log("Refreshing subscription before verification...");
        await fetchSubscription();
        
        // Check again if subscription is already active
        const nowActive = await checkExistingSubscription();
        if (nowActive) return;
        
        // Get ready for verification - multiple retries if needed
        let verificationAttempts = 0;
        const maxAttempts = 3;
        let lastError = null;
        
        while (verificationAttempts < maxAttempts) {
          verificationAttempts++;
          console.log(`Verification attempt ${verificationAttempts} of ${maxAttempts}`);
          
          try {
            // Call verify session
            console.log("Calling verifySession with sessionId:", sessionId);
            const result = await verifySession(sessionId);
            console.log(`Attempt ${verificationAttempts} result:`, result);
            
            if (result.status === "success") {
              console.log("Verification successful, updating UI");
              setStatus(VerificationStatus.SUCCESS);
              toast.success("Subscription activated successfully!");
              fetchSubscription(); // Refresh subscription details once more
              return; // Exit on success
            } else {
              console.error(`Attempt ${verificationAttempts} failed:`, result);
              lastError = result.message || "Failed to verify subscription";
              
              // If we get a 401 error, wait then retry
              if (result.message && result.message.includes("Authentication error")) {
                console.log("Authentication error detected, waiting before retry...");
                await new Promise(resolve => setTimeout(resolve, 3000));
                continue; // Skip to next iteration
              }
            }
          } catch (attemptError) {
            console.error(`Error during attempt ${verificationAttempts}:`, attemptError);
            lastError = attemptError instanceof Error ? attemptError.message : "An unexpected error occurred";
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        
        // If we reach here, all verification attempts failed
        // Final check - maybe the subscription was activated via webhook
        await fetchSubscription();
        const subscriptionActiveAnyway = await checkExistingSubscription();
        if (subscriptionActiveAnyway) return;
        
        // If we get here, verification truly failed after all retries
        setStatus(VerificationStatus.ERROR);
        setErrorMessage(lastError || "Failed to verify subscription after multiple attempts");
        toast.error("Subscription verification failed");
        
      } catch (error) {
        console.error("Verification error:", error);
        setStatus(VerificationStatus.ERROR);
        setErrorMessage(
          error instanceof Error ? error.message : "An unexpected error occurred"
        );
        toast.error("Error processing subscription");
      }
    };
    
    // Only run verification once when we have both user and sessionId
    if (!hasVerified && user && sessionId) {
      verifyCheckout();
      setHasVerified(true);
    }
  }, [sessionId, verifySession, fetchSubscription, user, details, hasVerified]);
  
  return (
    <MainLayout>
      <div className="container mx-auto max-w-2xl py-12 flex items-center justify-center h-[calc(100vh-64px)]">
        <Card className="w-full p-8 flex flex-col items-center text-center space-y-6">
          {status === VerificationStatus.VERIFYING && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <h1 className="text-2xl font-bold">Verifying Your Subscription</h1>
              <p className="text-muted-foreground">
                Please wait while we process your subscription. This should only take a moment...
              </p>
            </>
          )}
          
          {status === VerificationStatus.SUCCESS && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h1 className="text-2xl font-bold">Subscription Activated!</h1>
              <p className="text-muted-foreground">
                Thank you for subscribing to PRSocials. Your subscription has been 
                successfully activated and you now have access to all premium features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate("/chat")}
                >
                  Start Chatting
                </Button>
              </div>
            </>
          )}
          
          {status === VerificationStatus.ERROR && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <h1 className="text-2xl font-bold">Verification Failed</h1>
              <p className="text-muted-foreground">
                {errorMessage || "We couldn't verify your subscription. Please try again or contact support."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/subscriptions")}
                >
                  Back to Subscriptions
                </Button>
                <Button 
                  size="lg"
                  variant="destructive"
                  onClick={() => {
                    toast.success("Support request sent");
                    // In a real app, this would open a support form or chat
                  }}
                >
                  Contact Support
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}