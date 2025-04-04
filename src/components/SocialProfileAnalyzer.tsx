import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "./Spinner";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSocialMediaStore, SocialPlatform } from "utils/socialMediaStore";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useUserGuardContext } from "app";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { API_URL } from "app";
import brain from "brain";
import { ScrapeRequest } from "types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const profileSchema = z.object({
  platform: z.enum(["instagram", "twitter", "facebook", "tiktok", "youtube", "linkedin"], {
    required_error: "Please select a platform",
  }),
  username: z.string().min(1, {
    message: "Please enter a username",
  }),
});

type FormValues = z.infer<typeof profileSchema>;

interface SocialProfileAnalyzerProps {
  onProfileAnalyzed?: (success: boolean) => void;
  redirectToAnalytics?: boolean;
  availablePlatforms?: SocialPlatform[];
}

export const SocialProfileAnalyzer: React.FC<SocialProfileAnalyzerProps> = ({
  onProfileAnalyzed,
  redirectToAnalytics = false,
  availablePlatforms,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    platformDetected?: SocialPlatform;
    profileUsername?: string;
  } | null>(null);
  const { user } = useUserGuardContext();
  const { connectAccount, accounts, getAccountLimit } = useSocialMediaStore();
  const { details: subscriptionDetails } = useSubscriptionStore();
  
  // Determine subscription plan and corresponding model
  const currentPlan = subscriptionDetails?.subscription || 'free';
  
  // All supported platforms
  const defaultPlatforms: SocialPlatform[] = [
    "instagram",
    "twitter",
    "facebook",
    "tiktok",
    "youtube",
    "linkedin"
  ];
  
  // Get available platforms based on subscription
  const getAvailablePlatforms = (): SocialPlatform[] => {
    if (!currentPlan || currentPlan === 'free') {
      return ['instagram', 'twitter'];
    } else {
      // All paid plans get all platforms
      return defaultPlatforms;
    }
  };
  
  // Use provided platforms or default to subscription-based availability
  const platforms = availablePlatforms || getAvailablePlatforms();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      platform: platforms.includes("instagram") ? "instagram" : platforms[0],
      username: "",
    },
  });

  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear results when component mounts
    setResult(null);
  }, []);

  const handleAnalyzeProfile = async (values: FormValues) => {
    if (!user?.uid) {
      toast.error("You must be logged in to analyze profiles");
      return;
    }
    
    // Check if platform is allowed on current subscription
    const currentSubscription = currentPlan || 'free';
    const allowedPlatforms = getAvailablePlatforms();
    
    if (!allowedPlatforms.includes(values.platform as SocialPlatform)) {
      // Determine required plan
      let requiredPlan = "Beginner";
      if (values.platform === 'instagram' || values.platform === 'twitter') {
        requiredPlan = "Free Trial";
      }
      
      toast.error(`${values.platform} analytics require a ${requiredPlan} plan or higher. Please upgrade your subscription.`);
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      // Call our API to scrape the profile using the platform and username directly
      console.log(`Fetching real data for ${values.platform} account: ${values.username}`);
      
      // Extract platform and username directly from the form
      const platform = values.platform;
      const username = values.username;
      
      // Construct a generic profile URL for reference (not used for scraping, but for storage)
      const profileUrl = `https://${platform}.com/${username}`;
      
      const requestBody: ScrapeRequest = {
        platform,
        username,
        profile_url: profileUrl // Still included but not critical for API request
      };
      
      console.log('Request body:', requestBody);
      
      // Use apify_scrape_social_profile directly to avoid double API calls
      const response = await brain.apify_scrape_social_profile(requestBody);
      const data = await response.json();
      console.log(`API response data:`, data);
      
      if (data.success && data.data) {
        // Got successful profile data from the scraper
        // Check if account limit is reached
        const accountLimit = getAccountLimit(currentPlan);
        const currentAccounts = accounts.filter(acc => acc.userId === user.uid);
        
        // Check if user has reached account limit
        if (currentAccounts.length >= accountLimit) {
          throw new Error(`You've reached the maximum of ${accountLimit} social media ${accountLimit === 1 ? 'account' : 'accounts'} for your ${currentPlan} plan. Please upgrade to add more accounts.`);
        }
        
        // Check if the platform is available for the current subscription
        const allowedPlatforms = getAvailablePlatforms();
        if (!allowedPlatforms.includes(platform as SocialPlatform)) {
          throw new Error(`${platform} analytics require a higher subscription plan. Please upgrade to access this platform.`);
        }
        
        await connectAccount(
          user.uid,
          platform as SocialPlatform,
          username,
          profileUrl,  // Use the constructed URL
          true,  // Use real data
          currentPlan // Pass subscription plan
        );
        
        // Accept the data as valid regardless of whether any values are zero
        const successMsg = `Successfully analyzed ${platform} profile`;
        
        setResult({
          success: true,
          message: successMsg,
          platformDetected: platform as SocialPlatform,
          profileUsername: username
        });
        
        toast.success(successMsg);
        
        if (onProfileAnalyzed) {
          onProfileAnalyzed(true);
        }
      } else {
        // API returned an error
        setResult({
          success: false,
          message: data.error || "Failed to analyze profile"
        });
        
        toast.error(data.error || "Failed to analyze profile");
        
        if (onProfileAnalyzed) {
          onProfileAnalyzed(false);
        }
      }
    } catch (error) {
      console.error("Error analyzing profile:", error);
      
      // Provide more specific error messages based on HTTP status codes
      let errorMessage = "Unknown error";
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setResult({
        success: false,
        message: `Error: ${errorMessage}`
      });
      
      toast.error(`Error analyzing profile: ${errorMessage}`);
      
      if (onProfileAnalyzed) {
        onProfileAnalyzed(false);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Analyze Social Media Profile</CardTitle>
        <CardDescription>
          Enter a social media username to analyze the account and get personalized PR advice.
          
          {/* Show platform availability based on subscription */}
          <div className="mt-2 space-y-1 text-sm">
            <div className="text-primary font-medium">Your {currentPlan === 'free' ? 'Free Trial' : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan:</div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-primary">•</span> 
                {currentPlan === 'free' && "Instagram, Twitter analytics (1 account limit)"}
                {currentPlan === 'beginner' && "Instagram, Twitter, Facebook analytics (2 accounts limit)"}
                {currentPlan === 'influencer' && "Instagram, Twitter, Facebook, TikTok analytics (5 accounts limit)"}
                {currentPlan === 'corporate' && "All platforms analytics (10 accounts limit)"}
                {currentPlan === 'mastermind' && "All platforms analytics (unlimited accounts)"}
              </div>
              {(currentPlan !== 'mastermind') && (
                <div className="text-muted-foreground text-xs italic">
                  <a href="/subscriptions" className="text-primary hover:underline">Upgrade your plan</a> for additional platforms and accounts
                </div>
              )}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAnalyzeProfile)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isAnalyzing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platforms.includes("instagram") && <SelectItem value="instagram">Instagram</SelectItem>}
                      {platforms.includes("twitter") && <SelectItem value="twitter">Twitter/X</SelectItem>}
                      {platforms.includes("facebook") && <SelectItem value="facebook">Facebook</SelectItem>}
                      {platforms.includes("tiktok") && <SelectItem value="tiktok">TikTok</SelectItem>}
                      {platforms.includes("youtube") && <SelectItem value="youtube">YouTube</SelectItem>}
                      {platforms.includes("linkedin") && <SelectItem value="linkedin">LinkedIn</SelectItem>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="username" 
                        disabled={isAnalyzing}
                      />
                    </FormControl>
                    <Button type="submit" disabled={isAnalyzing}>
                      {isAnalyzing ? <Spinner className="mr-2" /> : null}
                      {isAnalyzing ? "Analyzing..." : "Analyze"}
                    </Button>
                  </div>
                  <FormDescription>
                    Enter the username without @ symbol (e.g., "prsocials" for Instagram)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        {result && (
          <Alert className={`mt-4 ${result.success ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}`}>
            {result.success ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
            <AlertTitle>{result.success ? "Success!" : "Error"}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
        
        {result?.success && redirectToAnalytics && (
          <Alert className="mt-4 bg-success/10 border-success">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle>Profile analyzed!</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Your <span className="font-semibold">{result.platformDetected}</span> profile has been successfully analyzed. The data is now available in your Analytics dashboard.</p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={() => navigate(`/analytics?platform=${result.platformDetected}`)}
              >
                View Analytics
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-6 text-sm text-muted-foreground">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
            <p className="font-medium">Privacy Notice</p>
          </div>
          <p>We only collect publicly available data from the profile you provide. 
            Your data is processed securely and is only used to provide you with analytics 
            and personalized PR advice.</p>
        </div>
      </CardContent>
    </Card>
  );
};