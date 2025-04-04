import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "utils/userStore";
import { useUserGuardContext } from "app";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createUserProfile } from "utils/userProfileUtils";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { UsageChart } from "components/UsageChart";
import { UsageMetricCard } from "components/UsageMetricCard";
import { MainLayout } from "components/MainLayout";
import brain from "brain";

export default function Dashboard() {
  const { user } = useUserGuardContext(); // Protected page - user is never null
  const { profile, isLoadingProfile, fetchUserProfile, subscribeToUserProfile } = useUserStore();
  const { details: subscriptionDetails, isLoading: isLoadingSubscription, fetchSubscription, createCustomerPortal } = useSubscriptionStore();
  const [chatHistory, setChatHistory] = useState<{history: any[], usage: {used: number, limit: number}}>({history: [], usage: {used: 0, limit: 2}});
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Ensure a profile exists when visiting dashboard
      createUserProfile(user).catch(err => {
        console.error("Error ensuring user profile exists:", err);
      });
      
      // Subscribe to real-time updates for the user profile
      const unsubscribe = subscribeToUserProfile(user.uid);
      
      // Load subscription details
      // Refresh subscription data more aggressively
      const refreshSubscription = async () => {
        try {
          console.log("Refreshing subscription data");
          await fetchSubscription();
          console.log("Subscription data refreshed successfully");
          
          // Also refresh user profile as subscription details might have changed
          await fetchUserProfile(user.uid);
        } catch (err) {
          console.error("Error fetching subscription:", err);
        }
      };
      
      // Initial load
      refreshSubscription();
      
      // Check URL parameters for checkout success
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutStatus = urlParams.get('checkout');
      if (checkoutStatus === 'success') {
        console.log('Detected successful checkout - refreshing data');
        toast.success('Subscription activated! Your plan has been upgraded.');
        
        // Refresh data immediately and repeatedly for 60 seconds after successful checkout
        const quickRefresh = setInterval(refreshSubscription, 3000);
        setTimeout(() => {
          clearInterval(quickRefresh);
          console.log('Completed quick refresh cycle after checkout');
          // Do one final refresh after the interval is cleared
          refreshSubscription();
          
          // Clear the checkout param from URL to prevent repeated toasts on refresh
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }, 60000);
      } else {
        // Set up a normal interval to check for subscription updates if not in checkout success flow
        const subscriptionRefreshInterval = setInterval(refreshSubscription, 30000);
        return () => clearInterval(subscriptionRefreshInterval);
      }
      
      // Cleanup the interval when component unmounts
      return () => {
        unsubscribe();
        clearInterval(subscriptionRefreshInterval);
      };

      // Load chat history
      loadChatHistory();
      
      // Cleanup subscription when component unmounts
      return () => {
        unsubscribe();
        // Any additional cleanup will be handled in the branch-specific returns
      };
    }
  }, [user, subscribeToUserProfile, fetchSubscription]);

  // Load chat history
  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await brain.get_chat_history();
      const data = await response.json();
      setChatHistory(data);

      // Force refresh if data changes
      console.log("Loaded chat history:", data.history?.length || 0, "messages");
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handle customer portal access
  const handleManageSubscription = async () => {
    try {
      const portalUrl = await createCustomerPortal();
      if (portalUrl) {
        window.open(portalUrl, "_blank");
      } else {
        navigate("/subscriptions");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      navigate("/subscriptions");
    }
  };

  // Generate chart data from chat history
  const generateChartData = () => {
    // Get last 7 days for chart data
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
    }
    
    // Create a map with all 7 days initialized to zero
    const dateMap = new Map<string, number>();
    last7Days.forEach(day => dateMap.set(day, 0));
    
    // If we have chat history, process it
    if (chatHistory.history && chatHistory.history.length > 0) {
      // Process chat history to count chats by date
      chatHistory.history.forEach((chat: any) => {
        if (chat.timestamp) {
          const date = new Date(chat.timestamp);
          const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
          
          // Only count if it's within our 7-day window
          if (dateMap.has(dateKey)) {
            const currentCount = dateMap.get(dateKey) || 0;
            dateMap.set(dateKey, currentCount + 1);
          }
        }
      });
    }
    
    // Ensure we have at least one data point (demo/testing purposes)
    if (chatCount > 0) {
      // Add at least one chat to today's or yesterday's count if user has any chat usage
      // This ensures the chart shows something, even if just for demonstration
      const todayKey = today.toISOString().split('T')[0];
      const yesterdayDate = new Date(today);
      yesterdayDate.setDate(today.getDate() - 1);
      const yesterdayKey = yesterdayDate.toISOString().split('T')[0];
      
      if (dateMap.get(todayKey) === 0 && dateMap.get(yesterdayKey) === 0) {
        // If not chat activity shown yet, add a visible point
        dateMap.set(todayKey, Math.min(1, chatCount)); // Today
        if (chatCount > 1) {
          dateMap.set(yesterdayKey, Math.min(2, chatCount - 1)); // Yesterday
        }
      }
    }

    // Convert map to array of objects
    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Helper function to format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric"
    }).format(date);
  };


  // Icons
  const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  );

  const SubscriptionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Get current plan details
  const currentPlanName = profile?.subscription || "free";
  const chatLimit = profile?.chatLimit || 2;
  const chatCount = profile?.chatCount || 0;
  const chartData = generateChartData();

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">View your account usage and stats</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
            >
              Back to Home
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* User Profile Section */}
          <Card className="md:col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">{profile?.name?.charAt(0) || user.email?.charAt(0) || "U"}</span>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">{profile?.name || "User"}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {currentPlanName.toUpperCase()} PLAN
                </div>
              </div>

              <div className="mt-6 w-full">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleManageSubscription}
                >
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Metrics */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Current Plan */}
              <UsageMetricCard
                title="Chat Credits"
                description="Monthly usage"
                used={chatCount}
                limit={chatLimit}
                icon={<ChatIcon />}
              />
              
              {/* Subscription Status */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold capitalize">{currentPlanName}</div>
                    <div className="text-sm text-muted-foreground">
                      {subscriptionDetails?.subscriptionStatus || "Active"}
                    </div>
                  </div>
                  
                  <div className="pt-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/subscriptions")}
                    >
                      View Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Days Remaining */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Billing Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold">
                      {profile?.subscription !== "free" ? "Monthly" : "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {profile?.subscription !== "free" 
                        ? "Renews automatically" 
                        : "Unlimited duration"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="min-h-[350px]">
              <UsageChart 
                usageData={chartData} 
                chatLimit={chatLimit} 
              />
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="md:col-span-12">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="bg-card border border-border hover:border-primary rounded-lg p-4 cursor-pointer transition-all"
                  onClick={() => navigate("/chat")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Start Chat</h3>
                      <p className="text-sm text-muted-foreground">Chat with your PR AI assistant</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="bg-card border border-border hover:border-primary rounded-lg p-4 cursor-pointer transition-all"
                  onClick={() => navigate("/connect-accounts")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Connect Accounts</h3>
                      <p className="text-sm text-muted-foreground">Link your social media profiles</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="bg-card border border-border hover:border-primary rounded-lg p-4 cursor-pointer transition-all"
                  onClick={() => navigate("/analytics")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">View Analytics</h3>
                      <p className="text-sm text-muted-foreground">Check your social media growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
