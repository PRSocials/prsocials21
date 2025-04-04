import React, { useState } from "react";
import { PageTransition } from "components/PageTransition";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { Logo } from "components/Logo";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "utils/cn";
import { firebaseAuth } from "app";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
  const { user } = useUserGuardContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Scroll to top when pathname changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Update the page title
  React.useEffect(() => {
    const pageName = navItems.find(item => item.href === location.pathname)?.title || 'Home';
    document.title = `PRSocials | ${pageName}`;
  }, [location.pathname]);

  // Icons
  const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  );

  const AnalyticsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );

  const AccountsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  );

  const SubscriptionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 2.586l-6.707 6.707-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7.5-7.5a1 1 0 00-1.414-1.414L14 5.586z" clipRule="evenodd" />
    </svg>
  );

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <DashboardIcon />
    },
    {
      title: "Chat",
      href: "/chat",
      icon: <ChatIcon />
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <AnalyticsIcon />
    },
    {
      title: "Connect Accounts",
      href: "/connect-accounts",
      icon: <AccountsIcon />
    },
    {
      title: "Subscription",
      href: "/subscriptions",
      icon: <SubscriptionIcon />
    },

  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await firebaseAuth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background dark flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-primary/10 hover:text-primary group",
                    isActive(item.href) ? "bg-primary/20 text-primary" : "text-foreground"
                  )}
                >
                  <span className={cn(
                    "p-1 rounded-md",
                    isActive(item.href) ? "bg-primary/30" : "bg-muted group-hover:bg-primary/20"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-full flex justify-center items-center mb-2 h-10"
                  onClick={() => navigate("/settings")}
                >
                  <SettingsIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="mb-2">
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={handleSignOut}
          >
            <LogoutIcon />
            <span className="ml-2">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-card border-b border-border p-4">
        <div className="flex justify-between items-center">
          <Logo size="sm" />
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-card">
              <div className="flex flex-col h-full">
                <div className="py-4">
                  <Logo />
                </div>
                
                <nav className="flex-1 overflow-y-auto">
                  <ul className="space-y-2 p-2">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-primary/10 hover:text-primary",
                            isActive(item.href) ? "bg-primary/20 text-primary" : "text-foreground"
                          )}
                          onClick={() => setIsMobileNavOpen(false)}
                        >
                          <span className={cn(
                            "p-1 rounded-md",
                            isActive(item.href) ? "bg-primary/30" : "bg-muted"
                          )}>
                            {item.icon}
                          </span>
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                <div className="p-4 border-t border-border mt-auto">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-full flex justify-center items-center mb-2 h-10"
                    onClick={() => {
                      navigate("/settings");
                      setIsMobileNavOpen(false);
                    }}
                  >
                    <SettingsIcon />
                  </Button>
                  <div className="mb-2">
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start" 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileNavOpen(false);
                    }}
                  >
                    <LogoutIcon />
                    <span className="ml-2">Sign Out</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
};

export { MainLayout };