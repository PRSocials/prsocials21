import React, { useEffect, useState } from "react";
import { SubscriptionPlanCard } from "components/SubscriptionPlanCard";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { MainLayout } from "components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";

export default function Subscriptions() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  
  const {
    details,
    plans,
    isLoading,
    isLoadingPlans,
    error,
    fetchSubscription,
    fetchPlans,
    checkout,
    cancelSubscription,
    createCustomerPortal
  } = useSubscriptionStore();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);
  
  useEffect(() => {
    fetchSubscription();
    fetchPlans();
  }, [fetchSubscription, fetchPlans]);

  useEffect(() => {
    if (error) {
      console.error("Subscription store error:", error);
      toast.error(`Failed to load subscription data: ${error.message}`);
    }
  }, [error]);
  
  const handleSelectPlan = async (plan: string) => {
    console.log(`Plan selected: ${plan}`);
    if (!plans) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    let priceId = urlParams.get(`price_${plan}`);
    
    if (!priceId) {
      switch (plan) {
        case "beginner":
          priceId = "price_1R3TTdIRl6gJZ8ZEiOYJiNCN";
          break;
        case "influencer":
          priceId = "price_1R3TUHIRl6gJZ8ZEHOS6rOYQ";
          break;
        case "corporate":
          priceId = "price_1R3TV2IRl6gJZ8ZEUtXKnlS4";
          break;
        case "mastermind":
          priceId = "price_1R3TVbIRl6gJZ8ZEfK8PNEK5";
          break;
        default:
          toast.error("Invalid plan selected");
          return;
      }
    }
    
    if (details?.subscription === plan && details?.subscriptionStatus === "active") {
      toast.info("You are already subscribed to this plan");
      return;
    }
    
    setIsCheckingOut(true);
    toast.info("Preparing checkout...");
    
    try {
      console.log(`Creating checkout session with priceId: ${priceId}`);
      const checkoutUrl = await checkout(priceId);
      
      console.log(`Checkout URL: ${checkoutUrl}`);
      if (checkoutUrl) {
        toast.success("Redirecting to checkout...");
        console.log(`Navigating to Stripe checkout URL: ${checkoutUrl}`);
        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 1000);
      } else {
        console.error("Checkout failed: No checkout URL returned");
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes("No such price")) {
        errorMessage = "The selected subscription plan is not available. Please try a different plan or contact support.";
      }
      toast.error(`Checkout error: ${errorMessage}`);
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!details || !details.subscriptionId) return;
    
    setIsProcessingCancel(true);
    
    try {
      const result = await cancelSubscription();
      
      if (result?.status === "success") {
        toast.success(result.message || "Subscription canceled successfully");
      } else {
        toast.error("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast.error("An error occurred while canceling your subscription");
    } finally {
      setIsProcessingCancel(false);
    }
  };
  
  const isSubscribed = details?.subscription !== "free" && 
                      details?.subscriptionStatus !== "canceled" &&
                      details?.subscriptionStatus !== "none";
  
  const isCanceling = details?.subscriptionStatus === "canceling";
  
  if (isLoading || isLoadingPlans || !plans || !details) {
    return (
      <div className="container max-w-7xl mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto py-8 space-y-8 text-center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
          <h1 className="text-3xl font-bold text-center mx-auto">Subscription Plans</h1>
          {isSubscribed && (
            <div>
              <Button 
                variant="destructive" 
                size="sm"
                disabled={isCanceling || isProcessingCancel}
                onClick={handleCancelSubscription}
              >
                {isProcessingCancel && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessingCancel ? "Canceling..." : "Cancel Subscription"}
              </Button>
            </div>
          )}
        </div>
        
        {isCanceling && (
          <Alert className="bg-amber-900/20 border-amber-900 text-amber-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Subscription Cancellation Pending</AlertTitle>
            <AlertDescription>
              Your subscription will remain active until the end of the current billing period, after which it will be canceled.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 justify-center">
            <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
            <TabsTrigger value="usage">Usage & Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 my-8 w-fit mx-auto">
              {[
                { plan: "free", details: plans.free },
                { plan: "beginner", details: plans.beginner },
                { plan: "influencer", details: plans.influencer },
                { plan: "corporate", details: plans.corporate },
                { plan: "mastermind", details: plans.mastermind },
              ].map(({ plan, details: planDetails }) => (
                <SubscriptionPlanCard
                  key={plan}
                  plan={plan as any}
                  planDetails={planDetails}
                  currentPlan={details.subscription}
                  onSelect={handleSelectPlan}
                />
              ))}
            </div>
            
            {isCheckingOut && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-background p-6 rounded-lg shadow-lg flex flex-col items-center max-w-md w-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Redirecting to Checkout</h3>
                  <p className="text-center text-muted-foreground">Please wait while we redirect you to our secure payment processor...</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="usage">
            <div className="my-8 space-y-6 max-w-3xl mx-auto">
              <div className="bg-background-secondary rounded-lg p-6 border">
                <h3 className="text-xl font-semibold mb-4 text-center">Current Subscription</h3>
                <div className="space-y-3 text-center md:text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium">{details.subscription.charAt(0).toUpperCase() + details.subscription.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize">{details.subscriptionStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chat Limit</span>
                    <span className="font-medium">{details.chatLimit} chats/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Used Chats</span>
                    <span className="font-medium">{details.chatCount} chats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining Chats</span>
                    <span className="font-medium">{Math.max(0, details.chatLimit - details.chatCount)} chats</span>
                  </div>
                </div>
              </div>
              
              {details?.subscriptionId && (
                <div className="bg-background-secondary rounded-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-4 text-center">Payment Information</h3>
                  <div className="flex items-center justify-between p-4 border rounded-md bg-background">
                    <div className="flex">
                      <CreditCard className="h-6 w-6 mr-3 text-primary mt-1" />
                      <div className="flex flex-col items-start">
                        <p className="font-medium">Manage Billing</p>
                        <p className="text-sm text-muted-foreground">Update payment method or view invoices</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="ml-auto" 
                      onClick={async () => {
                        try {
                          const portalUrl = await createCustomerPortal();
                          if (portalUrl) {
                            window.location.href = portalUrl;
                          } else {
                            toast.error("Failed to open customer portal");
                          }
                        } catch (error) {
                          console.error("Error opening customer portal:", error);
                          toast.error("An error occurred while opening the portal");
                        }
                      }}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}