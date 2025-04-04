import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { MainLayout } from "components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useUserStore } from "utils/userStore";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider, signOut, updateProfile as updateFirebaseProfile } from "firebase/auth";
import { firebaseAuth } from "app";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import { firebaseApp } from "app";

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const { profile, isLoadingProfile, updateProfile } = useUserStore();
  const { details: subscriptionDetails, isLoading: isLoadingSubscription, createCustomerPortal } = useSubscriptionStore();
  
  const [name, setName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    // Only update local state when profile changes to avoid overwriting user edits
    if (profile) {
      // Set profile-related state
      setName(profile.name || "");
      
      // Set preferences with defaults if not present
      setEmailNotifications(profile.preferences?.emailNotifications ?? true);
      setMarketingEmails(profile.preferences?.marketingEmails ?? false);
    }
    
    // Set email from the Firebase auth user object
    if (user) {
      setEmail(user.email || "");
    }
  }, [profile, user]);
  
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    if (!user) {
      toast.error("You need to be logged in to update your profile");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Update both Firestore profile and Firebase auth display name
      await Promise.all([
        // Update Firestore profile with all data
        updateProfile({ 
          name,
          preferences: {
            ...profile?.preferences,
            emailNotifications,
            marketingEmails
          }
        }),
        
        // Update Firebase auth display name
        updateFirebaseProfile(user, { displayName: name }).catch(error => {
          console.error("Error updating Firebase display name:", error);
          // Continue anyway, as the Firestore profile update is more important
        })
      ]);
      
      toast.success("Profile settings saved!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSaveNotifications = async () => {
    if (!user) {
      toast.error("You need to be logged in to update your preferences");
      return;
    }

    try {
      setIsUpdating(true);
      await updateProfile({ 
        preferences: {
          ...profile?.preferences, // Preserve other preferences if they exist
          emailNotifications,
          marketingEmails
        }
      });
      toast.success("Notification preferences saved!");
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error("Failed to update notification preferences");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle name update - also updates Firebase display name
  const handleUpdateName = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    try {
      setIsUpdating(true);
      // Get the current user from Firebase Auth
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Update Firestore profile
      await updateProfile({ name });
      
      // Update Firebase auth display name
      if (user.displayName !== name) {
        try {
          await updateFirebaseProfile(user, { displayName: name });
        } catch (error) {
          console.error("Error updating display name:", error);
        }
      }
      
      toast.success("Name updated successfully");
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle email update
  const handleUpdateEmail = async () => {
    if (!user) {
      toast.error("You need to be logged in to update your email");
      return;
    }
    if (!email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    
    if (!currentPassword) {
      toast.error("Current password is required to update email");
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Don't update if it's the same email
    if (user?.email === email) {
      toast.info("That's already your email address");
      return;
    }

    try {
      setIsUpdating(true);
      toast.info("Verifying your password...");
      
      // Create credential and reauthenticate
      const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update email in Firebase Auth
      toast.info("Updating your email address...");
      await updateEmail(user, email);
      
      // Update the email in Firestore as well
      // Also update the profile through our store to ensure consistency
      await Promise.all([
        // Direct Firestore update
        (() => {
          const firestore = getFirestore(firebaseApp);
          const userRef = doc(firestore, 'users', user.uid);
          return setDoc(userRef, { email }, { merge: true });
        })(),
        
        // Store update
        updateProfile({ email })
      ]);
      
      // Clear sensitive data
      setCurrentPassword("");
      toast.success("Email updated successfully");
    } catch (error: any) {
      console.error("Error updating email:", error);
      
      // Handle specific error cases
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Please login again before changing your email");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use by another account");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email format");
      } else {
        toast.error(`Failed to update email: ${error.message || 'Unknown error'}`); 
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    if (!user) {
      toast.error("You need to be logged in to update your password");
      return;
    }
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    
    if (!newPassword) {
      toast.error("New password cannot be empty");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    // Don't allow the same password
    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      setIsUpdating(true);
      toast.info("Verifying your current password...");
      
      // Create credential and reauthenticate
      const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password in Firebase Auth
      toast.info("Updating your password...");
      await updatePassword(user, newPassword);
      
      // Clear sensitive data from state
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Error updating password:", error);
      
      // Handle specific error cases
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("For security reasons, please login again before changing your password");
        
        // Sign out the user to force them to re-login
        toast.info("Signing you out to re-authenticate...");
        try {
          await signOut(firebaseAuth);
          setTimeout(() => navigate("/login"), 1500); // Give time for toast to be seen
        } catch (signOutError) {
          console.error("Error signing out:", signOutError);
          toast.error("Failed to sign out. Please try logging out and back in manually.");
        }
      } else {
        toast.error(`Failed to update password: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle subscription management
  const handleManageSubscription = async () => {
    if (!user) {
      toast.error("You need to be logged in to manage your subscription");
      navigate("/login");
      return;
    }
    
    if (profile?.subscription === "free") {
      toast.info("You don't have an active subscription to manage");
      navigate("/subscriptions");
      return;
    }
    
    try {
      setIsUpdating(true);
      toast.info("Opening subscription management portal...");
      const portalUrl = await createCustomerPortal();
      
      if (portalUrl) {
        // Open in the same tab to ensure proper auth flow
        window.location.href = portalUrl;
      } else {
        toast.info("Redirecting to subscription page...");
        navigate("/subscriptions");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Could not open subscription management portal");
      navigate("/subscriptions");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle cancel subscription
  const handleCancelSubscription = async () => {
    if (!user) {
      toast.error("You need to be logged in to cancel your subscription");
      return;
    }
    
    if (profile?.subscription === "free") {
      toast.info("You don't have an active subscription to cancel");
      return;
    }
    
    if (subscriptionDetails?.subscriptionStatus === "canceled") {
      toast.info("Your subscription is already canceled");
      return;
    }
    
    if (!confirm("Are you sure you want to cancel your subscription? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsUpdating(true);
      toast.info("Processing your cancellation request...");
      
      // Get cancelSubscription directly from the store to avoid stale functions
      const { cancelSubscription } = useSubscriptionStore.getState();
      
      // The UI will update immediately due to the optimistic update in the store
      const result = await cancelSubscription();
      
      if (result && result.status === "success") {
        toast.success(result.message || "Subscription canceled successfully");
      } else {
        toast.error(result?.message || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container max-w-6xl py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold lg:pl-4">Settings</h1>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="col-span-1">
            <div className="space-y-1 sticky top-6">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  document.getElementById('subscription')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Subscription
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Profile Information
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  document.getElementById('notifications')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Notifications
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Security
              </Button>

            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-3 space-y-8">
            {/* Loading state */}
            {isLoadingProfile && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39FF14]"></div>
              </div>
            )}
            {/* Subscription Section */}
            <section id="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    Manage your subscription plan and billing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold capitalize">{profile?.subscription || "free"} Plan</h3>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {subscriptionDetails?.subscriptionStatus || "Active"}
                        </span>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="text-sm text-muted-foreground">
                        {profile?.subscription === "free" ? (
                          <p>You are currently on the free trial. Upgrade to get more features.</p>
                        ) : (
                          <p>Your {profile?.subscription} plan renews automatically each month.</p>
                        )}
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button 
                          onClick={() => navigate("/subscriptions")}
                          variant="outline"
                        >
                          View Plans
                        </Button>
                        
                        {profile?.subscription !== "free" && (
                          <>
                            <Button 
                              onClick={handleManageSubscription}
                              className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-semibold shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300 border-0"
                              disabled={isUpdating || isLoadingSubscription}
                            >
                              {isUpdating ? "Loading..." : "Manage Subscription"}
                            </Button>
                            <Button 
                              onClick={handleCancelSubscription}
                              variant="destructive"
                              disabled={isUpdating || isLoadingSubscription || subscriptionDetails?.subscriptionStatus === "canceled"}
                            >
                              {subscriptionDetails?.subscriptionStatus === "canceled" ? "Subscription Canceled" : "Cancel Subscription"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            

            {/* Profile Section */}
            <section id="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleUpdateName}
                    disabled={isUpdating}
                    className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-semibold shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300 border-0"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </section>
            

            {/* Notifications Section */}
            <section id="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about your account via email</p>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={emailNotifications}
                        onCheckedChange={(checked) => {
                          // Set local state first for immediate UI update
                          setEmailNotifications(checked);
                          
                          // Save notification preferences in background
                          // Use a timeout to avoid React state update conflicts
                          setTimeout(() => {
                            updateProfile({ 
                              preferences: {
                                ...profile?.preferences,
                                emailNotifications: checked,
                                marketingEmails
                              }
                            }).catch(error => {
                              console.error("Error updating email notifications:", error);
                              toast.error("Failed to update email notifications");
                              setEmailNotifications(!checked); // Revert UI if failed
                            });
                          }, 0);
                        }}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive emails about new features and offers</p>
                      </div>
                      <Switch 
                        id="marketing-emails" 
                        checked={marketingEmails}
                        onCheckedChange={(checked) => {
                          // Set local state first for immediate UI update
                          setMarketingEmails(checked);
                          
                          // Save marketing preferences in background
                          // Use a timeout to avoid React state update conflicts
                          setTimeout(() => {
                            updateProfile({
                              preferences: {
                                ...profile?.preferences,
                                emailNotifications,
                                marketingEmails: checked
                              } 
                            }).catch(error => {
                              console.error("Error updating marketing preferences:", error);
                              toast.error("Failed to update marketing preferences");
                              setMarketingEmails(!checked); // Revert UI if failed
                            });
                          }, 0);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveNotifications}
                    disabled={isUpdating}
                    className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-semibold shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300 border-0"
                  >
                    {isUpdating ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardFooter>
              </Card>
            </section>
            
            {/* Security Section */}
            <section id="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password Update */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          placeholder="Enter your current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button 
                        onClick={handleUpdatePassword} 
                        disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                        className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-semibold shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300 border-0"
                      >
                        {isUpdating ? "Updating..." : "Change Password"}
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Email Update */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Change Email</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-change">Email</Label>
                        <Input 
                          id="email-change" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="Your email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current-password-email">Current Password</Label>
                        <Input 
                          id="current-password-email" 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          placeholder="Enter your current password"
                        />
                      </div>
                      <Button 
                        onClick={handleUpdateEmail} 
                        disabled={isUpdating || !email.trim() || !currentPassword || user?.email === email}
                        className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-semibold shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300 border-0"
                      >
                        {isUpdating ? "Updating..." : "Change Email"}
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Account Actions */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Account Actions</h3>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto text-destructive hover:text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => {
                        toast.info("Account deletion is not currently implemented. Please contact support for assistance.");
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}