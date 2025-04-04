import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "components/Logo";
import { cn } from "utils/cn";
import { Button } from "@/components/ui/button";
import { PricingCard, PricingPlan } from "components/PricingCard";
import { FeatureCard } from "components/FeatureCard";
import { AnimatedHeader } from "components/AnimatedHeader";
import { useCurrentUser, firebaseAuth } from "app";
import { MacbookFrame } from "components/MacbookFrame";
import { ChatPreview } from "components/ChatPreview";
import { ScrollToTop } from "components/ScrollToTop";
import { AccountShowcase } from "components/AccountShowcase";

// Hero section background with grid and gradient
const HeroBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-black bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)]">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
    </div>
  </div>
);

// Feature icons
const AlgorithmIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const MetricsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const StrategyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ContentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const IntegrationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

const CampaignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

// Define pricing plans
const pricingPlans: PricingPlan[] = [
  {
    title: "Free Trial",
    price: "Free",
    description: "Perfect for trying out PRSocials",
    model: "Standard",
    chatLimit: "2 Chats/Month",
    features: [
      "Chat/Email Support",
    ],
    ctaText: "Get Started"
  },
  {
    title: "Beginner",
    price: "$4.99",
    description: "For those just starting their social media journey",
    model: "Standard AI Model : Advanced PRSocials Advisor",
    chatLimit: "20 Chats/Month",
    features: [
      "Standard AI Model : Advanced PRSocials Advisor",
      "Limits : 20 Chats/Month",
      "Access to Beginner Chats",
      "Up to 2 Accounts Connected",
      "Support Weekdays : Chat/Email (9 AM - 5 PM)"
    ],
    ctaText: "Get Started"
  },
  {
    title: "Influencer",
    price: "$9.99",
    description: "For growing influencers looking to expand their reach",
    model: "Standard AI Model : Advanced PRSocials Advisor",
    chatLimit: "50 Chats/Month",
    popular: true,
    features: [
      "Standard AI Model : Advanced PRSocials Advisor",
      "Limits : 50 Chats/Month",
      "Everything From Cheaper Plans",
      "Access to Influencer Chats",
      "Up to 5 Accounts Connected",
      "Support Weekdays : Chat/Email (Non-Stop)"
    ],
    ctaText: "Get Started"
  },
  {
    title: "Corporate",
    price: "$19.99",
    description: "For businesses managing multiple social accounts",
    model: "Ultra AI Model : Expert PRSocials Advisor",
    chatLimit: "30 Chats/Month",
    features: [
      "Ultra AI Model : Expert PRSocials Advisor",
      "Limits : 30 Chats/Month",
      "Everything From Cheaper Plans",
      "Access to Corporate Chats",
      "Up to 10 Accounts Connected",
      "Support Non-Stop: 24/7 Email/Chat support for quick help anytime"
    ],
    ctaText: "Get Started"
  },
  {
    title: "Mastermind",
    price: "$39.99",
    description: "For professionals who demand the best in social media management",
    model: "Ultra AI Model : Expert PRSocials Advisor",
    chatLimit: "100 Chats/Month",
    features: [
      "Ultra AI Model : Expert PRSocials Advisor",
      "Limits : 100 Chats/Month",
      "Access to Mastermind Chats",
      "Unlimited Accounts Connected",
      "Support Non-Stop: 24/7 VIP support with faster responses (Chat/Email)",
      "Human Advisor: 30-minute monthly call with a PR expert (or you) for strategy"
    ],
    ctaText: "Get Started"
  }
];

export default function App() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [isNavVisible, setIsNavVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  
  // Handle scroll event to hide/show navbar
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <ScrollToTop />
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border transition-transform duration-300 ease-in-out transform ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex-1"></div>
          <Logo className="flex-1 justify-center" />
          <div className="space-x-2 hidden md:flex flex-1 justify-end">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/chat")}
                >
                  Chat
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                >
                  My Account
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate("/sign-up")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-24 md:pb-24 overflow-hidden">
        <HeroBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* MacBook Frame with Chat UI Preview */}
            <MacbookFrame>
              <ChatPreview />
            </MacbookFrame>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button 
                size="lg"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
              <Button variant="outline" size="lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* Gradient orbs */}
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-30"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Our Product Is Unique & How Our Product Brings Value To Your Platforms/Profiles?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Our Platform Use The Most Advanced Types of AI Available In The Market Pre-Configured For Social Media Assistant.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<AlgorithmIcon />}
              title="Algorithmic Analysis"
              description="Master the mechanics behind each platform with exclusive insights into algorithm patterns that typical tools can't detect."
            />
            <FeatureCard 
              icon={<MetricsIcon />}
              title="Advanced Metrics Dashboard"
              description="Visualize your growth with deep-dive analytics and performance metrics that reveal hidden opportunities most creators miss."
            />
            <FeatureCard 
              icon={<StrategyIcon />}
              title="Individualized Strategy"
              description="Receive completely personalized growth roadmaps built around your specific niche, audience demographics, and platform goals."
            />
            <FeatureCard 
              icon={<ImageIcon />}
              title="AI Image Generation"
              description="Transform concepts into scroll-stopping visuals with our AI technology that knows exactly what performs best for your target audience."
            />
            <FeatureCard 
              icon={<ProfileIcon />}
              title="Zero-to-Hero Profiles"
              description="Start from nothing and build authority with proven frameworks that have helped accounts reach 100K+ followers in record time."
            />
            <FeatureCard 
              icon={<ContentIcon />}
              title="Content Automation"
              description="Reclaim your creative time with intelligent workflows that handle everything from content ideation to optimized publishing schedules."
            />
            <FeatureCard 
              icon={<IntegrationIcon />}
              title="Seamless AI Integration"
              description="Unify your entire digital presence with intelligent connections that ensure consistent messaging and style across all platforms."
            />
            <FeatureCard 
              icon={<CampaignIcon />}
              title="Ad Campaign Management"
              description="Maximize ROI with data-driven ad campaigns designed to target your ideal audience with precision and convert at exceptional rates."             
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Select the perfect plan for your social media needs and level up your online presence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard 
                key={index}
                plan={plan}
                onSelectPlan={() => {
                  // Redirect to subscription page if logged in, otherwise to signup
                  if (user) {
                    navigate('/subscriptions');
                  } else {
                    navigate('/sign-up');
                  }
                }} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Account Showcase - Before CTA Content */}
          <AccountShowcase className="mb-16" />
          
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready To Bring More Value To Your Social Media Presence?</h2>
            <Button 
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <Logo size="sm" className="mb-4" />
            <div className="text-muted-foreground text-sm mb-4">
              &copy; {new Date().getFullYear()} PRSocials. All rights reserved.
            </div>
            <div>
              <a href="mailto:prsocialshq@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">Contact - prsocialshq@gmail.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
