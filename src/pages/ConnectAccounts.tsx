import React, { useEffect, useState, useCallback } from "react";
import { useSocialMediaStore, SocialPlatform } from "utils/socialMediaStore";
import { useUserGuardContext } from "app";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { SubscriptionPrompt } from "components/SubscriptionPrompt";
import { ConnectAccountForm } from "components/ConnectAccountForm";
import { MainLayout } from "components/MainLayout";
import { SocialAccountCard } from "components/SocialAccountCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

import { SocialProfileAnalyzer } from "components/SocialProfileAnalyzer";
import brain from "brain";
import { useNavigate } from "react-router-dom";

const ConnectAccounts = () => {
  const [activeTab, setActiveTab] = useState<"connect">("connect");


  const { user } = useUserGuardContext();
  const navigate = useNavigate();
  const { details: subscriptionDetails } = useSubscriptionStore();
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  
  // Determine if user is on free plan
  const isFreeTrial = subscriptionDetails?.subscription === 'free' || !subscriptionDetails;
  const { 
    accounts, 
    isLoading, 
    error, 
    connectAccount, 
    disconnectAccount,
    subscribeToAccounts,
    refreshAccountData
  } = useSocialMediaStore();
  
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  
  // Subscribe to accounts on mount
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeToAccounts(user.uid);
      return () => unsubscribe();
    }
  }, [user?.uid, subscribeToAccounts]);
  
  // If there's an error, show it
  useEffect(() => {
    if (error) {
      toast.error("Error: " + error.message);
    }
  }, [error]);
  
  const handleConnectClick = (platform: SocialPlatform) => {
    // Check if platform is available for the current subscription
    if (!availablePlatforms.includes(platform)) {
      const requiredPlan = getPlatformRequiredPlan(platform);
      toast.error(`${platform} analytics require a ${requiredPlan} plan or higher. Please upgrade your subscription.`);
      setShowSubscriptionPrompt(true);
      return;
    }
    
    // Check account limits based on subscription plan
    const accountLimit = subscriptionDetails?.subscription === 'mastermind' ? Number.MAX_SAFE_INTEGER : 
                       subscriptionDetails?.subscription === 'corporate' ? 10 :
                       subscriptionDetails?.subscription === 'influencer' ? 5 :
                       subscriptionDetails?.subscription === 'beginner' ? 2 : 1;
    
    if (accounts.length >= accountLimit) {
      setShowSubscriptionPrompt(true);
      return;
    }
    
    setSelectedPlatform(platform);
    setShowDialog(true);
  };
  
  const handleFormSubmit = async (formData: any) => {
    if (!selectedPlatform || !user?.uid) return;
    
    setIsConnecting(true);
    try {
      await connectAccount(
        user.uid, 
        formData.platform as SocialPlatform, 
        formData.username, 
        formData.profileUrl, 
        formData.useRealData
      );
      toast.success(`Successfully connected ${formData.username} on ${formData.platform}`);
      setShowDialog(false);
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage.includes('403')) {
        // Special handling for 403 errors (platform blocking scraping)
        toast({
          title: `Connected with simulated data`,
          description: `${formData.platform} blocked our data collection. Using advanced simulated data instead.`,
          duration: 5000
        });
        setShowDialog(false);
      } else {
        toast.error("Failed to connect account: " + errorMessage);
      }
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = async (accountId: string) => {
    try {
      await disconnectAccount(accountId);
      toast.success("Account disconnected");
    } catch (err) {
      toast.error("Failed to disconnect account: " + (err as Error).message);
    }
  };
  
  const handleView = (accountId: string) => {
    navigate(`/analytics?accountId=${accountId}`);
  };
  

  

  
  // List of all supported platforms
  const platforms: SocialPlatform[] = [
    "instagram",
    "twitter",
    "facebook",
    "tiktok",
    "youtube"
  ];
  
  // Determine which platforms are available based on subscription
  const getAvailablePlatforms = (): SocialPlatform[] => {
    // Free trial: Only Instagram and Twitter
    if (subscriptionDetails?.subscription === 'free') {
      return ['instagram', 'twitter'];
    }
    
    // All paid plans: Access to all platforms
    return platforms;
  };
  
  const availablePlatforms = getAvailablePlatforms();
  
  const getPlatformRequiredPlan = (platform: SocialPlatform): string => {
    switch (platform) {
      case 'instagram':
      case 'twitter':
        return 'Free Trial';
      default:
        return 'Beginner';
    }
  };
  
  return (
    <MainLayout>
      <SubscriptionPrompt
        isOpen={showSubscriptionPrompt}
        onClose={() => setShowSubscriptionPrompt(false)}
        title="Premium Feature: Connect Accounts"
        message="Connecting multiple social media accounts is available exclusively to our paid subscribers. Upgrade your plan to track and analyze your social media presence across platforms."
        feature="connect-accounts"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Social Media Data</h1>
            <Button onClick={() => navigate(-1)} variant="outline">
              Back
            </Button>
          </div>
          
          <div className="bg-muted p-4 rounded-lg mb-6 flex items-start gap-3 border border-border">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Account Limits</h3>
              <p className="text-sm text-muted-foreground">
                {subscriptionDetails?.subscription === 'free' && `On the Free Trial plan, you can connect ${accounts.length >= 1 ? "no more accounts" : "one account"} and access Instagram and Twitter data.`}
                {subscriptionDetails?.subscription === 'beginner' && `On the Beginner plan, you can connect up to 2 accounts${accounts.length >= 2 ? ". You've reached your limit" : ". You have ${2 - accounts.length} remaining"} and access all social platforms.`}
                {subscriptionDetails?.subscription === 'influencer' && `On the Influencer plan, you can connect up to 5 accounts${accounts.length >= 5 ? ". You've reached your limit" : ". You have ${5 - accounts.length} remaining"} and access all social platforms.`}
                {subscriptionDetails?.subscription === 'corporate' && `On the Corporate plan, you can connect up to 10 accounts${accounts.length >= 10 ? ". You've reached your limit" : ". You have ${10 - accounts.length} remaining"} and access all social platforms.`}
                {subscriptionDetails?.subscription === 'mastermind' && "On the Mastermind plan, you can connect unlimited accounts and access all social platforms."}
                
                {(subscriptionDetails?.subscription !== 'mastermind') && 
                  <a href="/subscriptions" className="text-primary hover:underline ml-1">Upgrade your subscription</a>}
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SocialProfileAnalyzer 
              onProfileAnalyzed={(success) => {
                if (success) {
                  // After profile is analyzed, you can redirect to analytics
                  // or simply stay on this page
                }
              }}
              redirectToAnalytics={false}
              availablePlatforms={availablePlatforms}
            />
          </div>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect {selectedPlatform} Account</DialogTitle>
              <DialogDescription>
                Enter your {selectedPlatform} username to connect your account and track analytics.
              </DialogDescription>
            </DialogHeader>
            
            {selectedPlatform && (
              <ConnectAccountForm
                selectedPlatform={selectedPlatform}
                onSubmit={handleFormSubmit}
                isSubmitting={isConnecting}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ConnectAccounts;
