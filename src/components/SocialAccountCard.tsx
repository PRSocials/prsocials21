import React from "react";
import { SocialMediaAccount, SocialPlatform } from "utils/socialMediaStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "utils/cn";

interface SocialAccountCardProps {
  account?: SocialMediaAccount;
  platform: SocialPlatform;
  onConnect: (platform: SocialPlatform) => void;
  onDisconnect: (accountId: string) => void;
  onView: (accountId: string) => void;
  isConnecting?: boolean;
}

const platformData = {
  instagram: {
    name: "Instagram",
    color: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  twitter: {
    name: "Twitter/X",
    color: "bg-blue-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.599-.1-.898a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
      </svg>
    ),
  },
  facebook: {
    name: "Facebook",
    color: "bg-blue-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
      </svg>
    ),
  },
  tiktok: {
    name: "TikTok",
    color: "bg-black",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  linkedin: {
    name: "LinkedIn",
    color: "bg-blue-700",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
      </svg>
    ),
  },
  youtube: {
    name: "YouTube",
    color: "bg-red-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.44a2.56 2.56 0 0 0-1.766 1.778c-.44 1.61-.44 4.986-.44 4.986s0 3.371.44 4.985a2.56 2.56 0 0 0 1.778 1.765c1.568.45 7.83.45 7.83.45s6.265 0 7.831-.45a2.56 2.56 0 0 0 1.767-1.776c.44-1.607.44-4.985.44-4.985s0-3.372-.44-4.99zM9.998 15.348V8.51l5.227 3.424-5.227 3.415z" />
      </svg>
    ),
  },
};

export const SocialAccountCard: React.FC<SocialAccountCardProps> = ({
  account,
  platform,
  onConnect,
  onDisconnect,
  onView,
  isConnecting = false
}) => {
  const isConnected = !!account;
  const { name, color, icon } = platformData[platform];
  
  // Calculate growth trend
  const growthTrend = account?.platformData?.growth || 0;
  const growthTrendText = growthTrend > 0 ? `+${growthTrend}%` : `${growthTrend}%`;
  const growthTrendColor = growthTrend > 0 ? "text-emerald-500" : growthTrend < 0 ? "text-red-500" : "text-gray-500";
  
  return (
    <Card className="overflow-hidden">
      <div className={cn("h-2", color)} />
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-primary">{icon}</span> 
            {name}
          </CardTitle>
          {isConnected && (
            <Badge variant="outline" className="text-emerald-500 border-emerald-500">
              Connected
            </Badge>
          )}
        </div>
        {isConnected ? (
          <CardDescription className="space-y-1">
            <div>@{account.username}</div>
            {account.profileUrl && (
              <a 
                href={account.profileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline truncate block"
              >
                {account.profileUrl}
              </a>
            )}
            {account.mock && (
              <Badge variant="outline" className="mt-1 text-yellow-500 border-yellow-500 text-[10px]">
                Mock Data
              </Badge>
            )}
            {!account.mock && account.useRealData && (
              <Badge variant="outline" className="mt-1 text-emerald-500 border-emerald-500 text-[10px]">
                Real Data
              </Badge>
            )}
          </CardDescription>
        ) : (
          <CardDescription>
            Connect your {name} account to track analytics
          </CardDescription>
        )}
      </CardHeader>
      
      {isConnected && account.platformData && (
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs uppercase text-muted-foreground">Followers</div>
              <div className="text-2xl font-semibold">
                {new Intl.NumberFormat().format(account.platformData.followers || 0)}
                <span className={cn("text-sm font-normal ml-1", growthTrendColor)}>{growthTrendText}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs uppercase text-muted-foreground">Engagement</div>
              <div className="text-2xl font-semibold">
                {account.platformData.engagement}%
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between">
        {isConnected ? (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDisconnect(account.id)}
              className="flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
              Disconnect
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onView(account.id)}
            >
              View Analytics
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            onClick={() => onConnect(platform)}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : "Connect Account"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
