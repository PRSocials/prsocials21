import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { PlanDetails, SubscriptionPlan } from "utils/subscriptionStore";

interface Props {
  plan: SubscriptionPlan;
  planDetails?: PlanDetails; // Made optional to handle undefined case
  currentPlan?: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlanCard({ plan, planDetails, currentPlan, onSelect }: Props) {
  // Debug when plan is selected
  const handleSelect = () => {
    console.log(`Selecting plan: ${plan}`);
    onSelect(plan);
  };
  const isCurrent = plan === currentPlan;
  const isFree = plan === "free";

  // Return loading state if planDetails is undefined
  if (!planDetails) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{plan.charAt(0).toUpperCase() + plan.slice(1)}</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const planTitle = plan.charAt(0).toUpperCase() + plan.slice(1);
  
  const planFeatures = {
    free: [
      `${planDetails.chatLimit} Chats/Month`,
      "Chat/Email Support"
    ],
    beginner: [
      "Standard AI Model : Advanced PRSocials Advisor",
      `${planDetails.chatLimit} Chats/Month`,
      "Access to Beginner Chats",
      "Up to 2 Accounts Connected",
      "Support Weekdays : Chat/Email (9 AM - 5 PM)"
    ],
    influencer: [
      "Standard AI Model : Advanced PRSocials Advisor", 
      `${planDetails.chatLimit} Chats/Month`,
      "Everything From Cheaper Plans",
      "Access to Influencer Chats",
      "Up to 5 Accounts Connected",
      "Support Weekdays : Chat/Email (Non-Stop)"
    ],
    corporate: [
      "Ultra AI Model : Expert PRSocials Advisor",
      `${planDetails.chatLimit} Chats/Month`,
      "Everything From Cheaper Plans",
      "Access to Corporate Chats",
      "Up to 10 Accounts Connected",
      "Support Non-Stop: 24/7 Email/Chat support for quick help anytime"
    ],
    mastermind: [
      "Ultra AI Model : Expert PRSocials Advisor",
      `${planDetails.chatLimit} Chats/Month`,
      "Access to Mastermind Chats",
      "Unlimited Accounts Connected",
      "Support Non-Stop: 24/7 VIP support with faster responses (Chat/Email)",
      "Human Advisor: 30-minute monthly call with a PR expert (or you) for strategy"
    ]
  };

  // Highlight cards based on plan
  const getCardStyles = () => {
    if (isCurrent) return "border-green-500 shadow-md shadow-green-500/20";
    if (plan === "mastermind") return "border-purple-500 shadow-md shadow-purple-500/20";
    if (plan === "corporate") return "border-blue-500 shadow-md shadow-blue-500/20";
    if (plan === "influencer") return "border-yellow-500 shadow-md shadow-yellow-500/20";
    return "";
  };

  return (
    <Card className={`flex flex-col h-full ${getCardStyles()}`}>
      <CardHeader className="text-center">
        <div className="flex flex-col items-center">
          <CardTitle className="text-xl text-center">{planTitle}</CardTitle>
        </div>
        <CardDescription className="mt-2 text-center">
          {isFree ? (
            <span className="text-lg font-semibold block">Free Trial</span>
          ) : (
            <span className="text-lg font-semibold block">${planDetails.price}/month</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3 text-sm px-1">
          {planFeatures[plan].map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
              <span className="text-left">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSelect} 
          className="w-full" 
          disabled={isCurrent || isFree}
          variant={isCurrent ? "outline" : "default"}
        >
          {isCurrent ? "Current Plan" : isFree ? "Free Trial" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}