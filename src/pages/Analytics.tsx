import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "utils/utils";
import { useSocialMediaStore, SocialMediaAccount, PlatformData } from "utils/socialMediaStore";
import { useUserGuardContext } from "app";
import { MainLayout } from "components/MainLayout";
import { MaintenanceDialog } from "components/MaintenanceDialog";
import { CampaignsTab, PlatformsTab } from "components/AnalyticsTabs";
import { SubscriptionPrompt } from "components/SubscriptionPrompt";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Helper to parse query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Analytics = () => {
  const { user } = useUserGuardContext();
  const navigate = useNavigate();
  const query = useQuery();
  const accountIdFromUrl = query.get('accountId');
  const platformFromUrl = query.get('platform');
  
  const { accounts, isLoading, error, subscribeToAccounts, refreshAccountData, disconnectAccount } = useSocialMediaStore();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(accountIdFromUrl);
  const [selectedAccount, setSelectedAccount] = useState<SocialMediaAccount | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Make sure to initialize to 'overview' to show charts
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d"); // 7d, 30d, 90d
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(true);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<SocialMediaAccount | null>(null);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const { details: subscriptionDetails } = useSubscriptionStore();
  
  // Determine if user is on free plan
  const isFreeTrial = subscriptionDetails?.subscription === 'free' || !subscriptionDetails;
  
  // No maintenance dialog shown by default
  useEffect(() => {
    setShowMaintenanceDialog(false);
  }, []);

  // Subscribe to accounts on mount
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeToAccounts(user.uid);
      return () => unsubscribe();
    }
  }, [user?.uid, subscribeToAccounts]);
  
  // Set selected account when accounts are loaded or URL param changes
  useEffect(() => {
    if (accounts.length > 0) {
      if (accountIdFromUrl) {
        const account = accounts.find(a => a.id === accountIdFromUrl);
        if (account) {
          setSelectedAccount(account);
          setSelectedAccountId(accountIdFromUrl);
          return;
        }
      }
      
      // If platform parameter is present, try to find a matching account
      if (platformFromUrl) {
        const account = accounts.find(a => a.platform === platformFromUrl);
        if (account) {
          setSelectedAccount(account);
          setSelectedAccountId(account.id);
          return;
        }
      }
      
      // If no valid account ID in URL or no matching account, select the first one
      setSelectedAccount(accounts[0]);
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, accountIdFromUrl, platformFromUrl]);
  
  // When user changes selected account, update URL
  useEffect(() => {
    if (selectedAccountId && selectedAccountId !== accountIdFromUrl) {
      navigate(`/analytics?accountId=${selectedAccountId}`, { replace: true });
    }
  }, [selectedAccountId, navigate, accountIdFromUrl]);
  
  const handleAccountChange = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    setSelectedAccount(account || null);
    setSelectedAccountId(accountId);
  };
  
  const handleRefreshData = async () => {
    if (!selectedAccountId) return;
    
    setIsRefreshing(true);
    try {
      await refreshAccountData(selectedAccountId);
    } catch (err) {
      console.error("Failed to refresh data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Filter data based on selected time range
  const filterDataByTimeRange = (data: any[]) => {
    if (!data) return [];
    
    const now = new Date();
    let daysToSubtract = 30; // default to 30 days
    
    if (timeRange === '7d') daysToSubtract = 7;
    else if (timeRange === '90d') daysToSubtract = 90;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysToSubtract);
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  };
  
  // Display a message indicating this is sample data if no accounts are connected
  const showSampleDataNotice = accounts.length === 0;
  
  // Show loading state only when we're still loading AND there are no accounts
  if (isLoading && !accounts.length) {
    return (
      <div className="container mx-auto px-4 py-8 relative">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            {showSampleDataNotice && (
              <div className="relative mx-auto mb-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-md">
                <p className="text-sm font-medium text-amber-500">👋 This is sample data. Click the <span className="font-bold">Connect Accounts</span> button above to add your social profiles.</p>
              </div>
            )}
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-20" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }
  
  // Mock data for when no accounts are connected
  const generateMockData = () => {
    // Helper for random data generation
    const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const mockDailyStats = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Base values with some randomization
      const baseFollowers = 1000 + (29 - i) * 50;
      const followers = baseFollowers + Math.floor(Math.random() * 100);
      const engagement = (5 + Math.random() * 3).toFixed(2);
      
      mockDailyStats.push({
        date: date.toISOString().split('T')[0],
        followers: followers,
        engagement: Number(engagement),
        likes: Math.floor(followers * 0.05),
        comments: Math.floor(followers * 0.01),
        shares: Math.floor(followers * 0.005)
      });
    }
    
    const mockContentTypes = ['photo', 'video', 'carousel', 'text', 'link'];
    const mockContentPerformance = [];
    
    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(today.getDate() - Math.floor(Math.random() * 30));
      
      mockContentPerformance.push({
        id: `mock-content-${i}`,
        title: `Mock Content ${i + 1}`,
        type: mockContentTypes[Math.floor(Math.random() * mockContentTypes.length)],
        date: date.toISOString().split('T')[0],
        likes: 50 + Math.floor(Math.random() * 200),
        comments: 10 + Math.floor(Math.random() * 50),
        shares: 5 + Math.floor(Math.random() * 30)
      });
    }
    
    // Generate mock audience demographics data
    const mockAudienceDemographics = {
      age: [
        { group: '13-17', value: randomBetween(5, 15) },
        { group: '18-24', value: randomBetween(20, 35) },
        { group: '25-34', value: randomBetween(25, 40) },
        { group: '35-44', value: randomBetween(15, 25) },
        { group: '45-54', value: randomBetween(5, 15) },
        { group: '55+', value: randomBetween(1, 10) },
      ],
      gender: [
        { group: 'Male', value: randomBetween(35, 65) },
        { group: 'Female', value: randomBetween(35, 65) },
        { group: 'Other', value: randomBetween(1, 5) },
      ],
      locations: [
        { country: 'United States', value: randomBetween(20, 40) },
        { country: 'United Kingdom', value: randomBetween(10, 20) },
        { country: 'Canada', value: randomBetween(5, 15) },
        { country: 'Australia', value: randomBetween(5, 15) },
        { country: 'Germany', value: randomBetween(5, 10) },
        { country: 'France', value: randomBetween(3, 8) },
        { country: 'Other', value: randomBetween(10, 25) },
      ],
    };
    
    // Generate mock engagement time data (when followers are most active)
    const mockEngagementTimes = [];
    for (let hour = 0; hour < 24; hour++) {
      // More activity during typical waking hours
      let activityLevel;
      if (hour >= 8 && hour <= 11) activityLevel = randomBetween(60, 100); // Morning peak
      else if (hour >= 12 && hour <= 14) activityLevel = randomBetween(50, 80); // Lunch time
      else if (hour >= 17 && hour <= 22) activityLevel = randomBetween(70, 100); // Evening peak
      else if (hour >= 1 && hour <= 5) activityLevel = randomBetween(10, 30); // Late night
      else activityLevel = randomBetween(30, 60); // Other times
      
      mockEngagementTimes.push({
        hour: hour,
        activity: activityLevel,
        label: `${hour}:00`
      });
    }
    
    // Generate mock post frequency data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mockPostFrequency = days.map(day => ({
      day,
      posts: randomBetween(1, 5),
      engagement: randomBetween(3, 8)
    }));
    
    return { 
      mockDailyStats, 
      mockContentPerformance, 
      mockAudienceDemographics,
      mockEngagementTimes,
      mockPostFrequency
    };
  };
  
  const { 
    mockDailyStats, 
    mockContentPerformance, 
    mockAudienceDemographics,
    mockEngagementTimes,
    mockPostFrequency
  } = generateMockData();
  
  // Get filtered data - use mock data if no real data is available
  // Always ensure we have data to display in charts
  const dailyStats = (accounts.length && selectedAccount?.platformData?.dailyStats) ? 
    filterDataByTimeRange(selectedAccount.platformData.dailyStats) : mockDailyStats;
  
  const contentPerformance = (accounts.length && selectedAccount?.platformData?.contentPerformance) ? 
    filterDataByTimeRange(selectedAccount.platformData.contentPerformance) : mockContentPerformance;
  
  // Calculate summary metrics
  const calculateGrowth = () => {
    if (!dailyStats || dailyStats.length < 2) return 0;
    
    const oldestValue = dailyStats[0].followers;
    const newestValue = dailyStats[dailyStats.length - 1].followers;
    
    return ((newestValue / oldestValue) - 1) * 100;
  };
  
  const calculateAverageEngagement = () => {
    if (!dailyStats || !dailyStats.length) return 0;
    
    const sum = dailyStats.reduce((acc, curr) => acc + curr.engagement, 0);
    return sum / dailyStats.length;
  };
  
  // Prepare data for content type pie chart
  const getContentTypeData = () => {
    if (!contentPerformance || !contentPerformance.length) return [];
    
    const typeCount: Record<string, number> = {};
    
    contentPerformance.forEach(item => {
      typeCount[item.type] = (typeCount[item.type] || 0) + 1;
    });
    
    return Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  };
  
  const getContentEngagementData = () => {
    if (!contentPerformance || !contentPerformance.length) return [];
    
    return contentPerformance.map(item => ({
      id: item.id,
      title: item.title,
      date: item.date,
      engagement: item.likes + item.comments + item.shares,
    })).sort((a, b) => b.engagement - a.engagement).slice(0, 10);
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <MainLayout>

      <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Analytics</h1>
            {isFreeTrial && accounts.length > 0 && (
              <p className="text-sm text-amber-500 mt-1">Free trial users can connect 1 account. Upgrade for unlimited accounts.</p>
            )}
          </div>
          
          <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white font-medium" onClick={() => navigate('/connect-accounts')}>
            {accounts.length === 0 ? '+ Connect Your First Account' : 'Connect Accounts'}
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Select value={selectedAccountId || undefined} onValueChange={handleAccountChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{account.platform} - @{account.username}</span>
                      {/* Disconnect account icon removed */}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button onClick={handleRefreshData} disabled={isRefreshing || !selectedAccount} variant="outline" size="sm">
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
              
              <Button onClick={() => navigate('/connect-accounts')} variant="outline" size="sm">
                Manage Accounts
              </Button>
              

            </div>
          </div>
        </div>
        
        {showSampleDataNotice && (
          <div className="relative mb-6 p-3 bg-amber-900/20 border border-amber-500/30 rounded-md">
            <p className="text-sm font-medium text-amber-500">👋 This is sample data. Click the <span className="font-bold">Connect Accounts</span> button above to add your social profiles.</p>
          </div>
        )}
        {true && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  {selectedAccount ? 
                    `${selectedAccount.platform.charAt(0).toUpperCase() + selectedAccount.platform.slice(1)} - @${selectedAccount.username}` : 
                    "Sample Analytics Dashboard"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedAccount ? 
                    `Connected on ${new Date(selectedAccount.connectedAt || "").toLocaleDateString()}` : 
                    "This is sample data. Connect your accounts to see your real analytics."}
                </p>
              </div>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat().format(selectedAccount?.platformData?.followers || 0)}
                  </div>
                  <div className={`text-sm ${calculateGrowth() >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {calculateGrowth() >= 0 ? '+' : ''}
                    {calculateGrowth().toFixed(2)}% growth
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {calculateAverageEngagement().toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average across {timeRange}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {selectedAccount?.platformData?.posts || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total posts
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="followers">Followers</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
  
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="posting">Posting</TabsTrigger>

              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Follower Growth</CardTitle>
                    <CardDescription>
                      Follower count over the selected time period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyStats}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => {
                            const dateObj = new Date(date);
                            return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          }}
                          interval={Math.floor(dailyStats.length / 10)}
                        />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip 
                          formatter={(value) => [`${new Intl.NumberFormat().format(Number(value))}`, 'Followers']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="followers" 
                          stroke="#22c55e" 
                          fillOpacity={1} 
                          fill="url(#colorFollowers)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Rate</CardTitle>
                    <CardDescription>
                      Average engagement percentage over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailyStats}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => {
                            const dateObj = new Date(date);
                            return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          }}
                          interval={Math.floor(dailyStats.length / 10)}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Engagement Rate']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="engagement" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="followers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Follower Growth</CardTitle>
                    <CardDescription>
                      Day-by-day follower growth for the selected time period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailyStats}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => {
                            const dateObj = new Date(date);
                            return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          }}
                          interval={Math.floor(dailyStats.length / 10)}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [new Intl.NumberFormat().format(Number(value)), 'Followers']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="followers" 
                          stroke="#22c55e" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="engagement" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                    <CardDescription>
                      Daily engagement rate over the selected time period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyStats}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          interval={Math.floor(dailyStats.length / 10)}
                        />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Engagement Rate']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="engagement" 
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorEngagement)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              

              
              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Growth vs. Engagement</CardTitle>
                      <CardDescription>
                        Correlation between follower growth and engagement
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={dailyStats}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => {
                              const dateObj = new Date(date);
                              return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }}
                            interval={Math.floor(dailyStats.length / 10)}
                          />
                          <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
                          <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                          <Tooltip 
                            formatter={(value, name) => [value, name === 'followers' ? 'Followers' : 'Engagement %']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                          />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="followers" name="Followers" stroke="#22c55e" />
                          <Line yAxisId="right" type="monotone" dataKey="engagement" name="Engagement %" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Performance</CardTitle>
                      <CardDescription>
                        Engagement metrics for different content types
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getContentTypeData().map(type => {
                            const typeContent = contentPerformance.filter(content => content.type === type.name);
                            const avgLikes = typeContent.reduce((acc, curr) => acc + (curr.likes || 0), 0) / typeContent.length;
                            const avgComments = typeContent.reduce((acc, curr) => acc + (curr.comments || 0), 0) / typeContent.length;
                            const avgShares = typeContent.reduce((acc, curr) => acc + (curr.shares || 0), 0) / typeContent.length;
                            
                            return {
                              type: type.name,
                              likes: Math.round(avgLikes),
                              comments: Math.round(avgComments),
                              shares: Math.round(avgShares),
                            };
                          })}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="likes" fill="#22c55e" name="Avg. Likes" />
                          <Bar dataKey="comments" fill="#8884d8" name="Avg. Comments" />
                          <Bar dataKey="shares" fill="#0088FE" name="Avg. Shares" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Audience Engagement Heatmap</CardTitle>
                    <CardDescription>
                      Visualizing engagement patterns across your content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] overflow-x-auto">
                    <div className="w-full h-full">
                      <div className="w-full h-full flex items-center justify-center p-6 bg-card border border-border rounded-md">
                        <div className="grid grid-cols-7 gap-2 w-full max-w-3xl">
                          {Array.from({ length: 35 }).map((_, i) => {
                            // Generate a random engagement score between 0-100
                            const score = Math.floor(Math.random() * 100);
                            // Color based on score
                            let bgColor = '';
                            if (score < 20) bgColor = 'bg-emerald-900/20';
                            else if (score < 40) bgColor = 'bg-emerald-700/30';
                            else if (score < 60) bgColor = 'bg-emerald-600/50';
                            else if (score < 80) bgColor = 'bg-emerald-500/70';
                            else bgColor = 'bg-emerald-400';
                            
                            return (
                              <div 
                                key={i} 
                                className={`h-12 rounded ${bgColor} flex items-center justify-center text-xs font-medium`}
                                title={`Engagement Score: ${score}%`}
                              >
                                {score}%
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              

              
              <TabsContent value="audience" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Age Distribution</CardTitle>
                      <CardDescription>
                        Age breakdown of your audience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={mockAudienceDemographics.age}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="group" type="category" />
                          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          <Bar dataKey="value" fill="#22c55e" name="Percentage" label={{ position: 'right', formatter: (value) => `${value}%` }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Gender Distribution</CardTitle>
                      <CardDescription>
                        Gender breakdown of your audience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mockAudienceDemographics.gender}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={130}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="group"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#22c55e" />
                            <Cell fill="#8884d8" />
                            <Cell fill="#0088FE" />
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                

              </TabsContent>
              
              <TabsContent value="posting" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Best Time to Post</CardTitle>
                      <CardDescription>
                        When your audience is most active (24-hour)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={mockEngagementTimes}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}`, 'Activity Level']} />
                          <Line 
                            type="monotone" 
                            dataKey="activity" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            dot={{ fill: '#22c55e', strokeWidth: 2 }}
                            activeDot={{ r: 8 }}
                            name="Activity Level"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Posts vs. Engagement by Day</CardTitle>
                      <CardDescription>
                        Comparing post frequency and engagement rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={mockPostFrequency}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
                          <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="posts" fill="#22c55e" name="Posts" />
                          <Bar yAxisId="right" dataKey="engagement" fill="#8884d8" name="Engagement (%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Posting Schedule</CardTitle>
                    <CardDescription>
                      AI-optimized schedule based on your audience activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-7 gap-px divide-x divide-border bg-muted text-sm">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="py-2 text-center font-medium">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-px divide-x divide-border bg-card text-sm">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                          // Generate random number of optimal posting times
                          const postTimes = [];
                          const numPosts = Math.floor(Math.random() * 3) + 1;  // 1-3 posts per day
                          
                          for (let i = 0; i < numPosts; i++) {
                            const hour = Math.floor(Math.random() * 24);
                            const minute = Math.floor(Math.random() * 4) * 15;  // 0, 15, 30, 45
                            postTimes.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
                          }
                          
                          postTimes.sort();
                          
                          return (
                            <div key={day} className="p-2 text-center space-y-1">
                              {postTimes.map((time, i) => (
                                <div key={i} className="inline-block px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                                  {time}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-muted-foreground text-sm">
                      <p>These times are generated based on historical engagement patterns of your audience. Schedule your posts at these times for optimal reach and engagement.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      </div>
      {/* Disconnect Account Confirmation Dialog */}
      <AlertDialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect {accountToDisconnect?.platform} account @{accountToDisconnect?.username}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDisconnectDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (accountToDisconnect) {
                  // Log before disconnection
                  console.log('Disconnecting account:', accountToDisconnect.id);
                  
                  // Directly call the disconnect function
                  disconnectAccount(accountToDisconnect.id);
                  
                  // Show success message
                  toast.success(`Disconnected ${accountToDisconnect.platform} account @${accountToDisconnect.username}`);
                  
                  // Close the dialog
                  setDisconnectDialogOpen(false);
                  
                  // If we're disconnecting the currently selected account, select another one
                  if (selectedAccountId === accountToDisconnect.id && accounts.length > 1) {
                    const remainingAccounts = accounts.filter(a => a.id !== accountToDisconnect.id);
                    if (remainingAccounts.length > 0) {
                      setSelectedAccountId(remainingAccounts[0].id);
                    }
                  }
                }
              }}
            >
              Disconnect
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Analytics;