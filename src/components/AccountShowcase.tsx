import React, { useEffect, useRef, useState } from 'react';
import { cn } from 'utils/cn';

interface AccountData {
  username: string;
  platform: 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'linkedin';
  growthPercent: number;
  followers: string;
  timeframe: string;
  testimonial?: string;
}

interface AccountShowcaseProps {
  className?: string;
}

const accounts: AccountData[] = [
  {
    username: '@fitnessgirl',
    platform: 'instagram',
    growthPercent: 278,
    followers: '352K+',
    timeframe: '6 months',
    testimonial: 'PRSocials helped me understand what content resonates with my fitness audience.'
  },
  {
    username: '@tech_insider',
    platform: 'youtube',
    growthPercent: 185,
    followers: '982K+',
    timeframe: '8 months',
    testimonial: 'The AI analysis of my tech reviews completely changed my content strategy.'
  },
  {
    username: '@dance_trends',
    platform: 'tiktok',
    growthPercent: 347,
    followers: '1.2M+',
    timeframe: '5 months',
    testimonial: 'From 300K to over 1M followers using PRSocials strategies!'
  },
  {
    username: '@crypto_daily',
    platform: 'twitter',
    growthPercent: 156,
    followers: '248K+',
    timeframe: '7 months',
    testimonial: 'The insights on tweet timing and topics doubled my engagement rate.'
  },
  {
    username: '@marketing_pro',
    platform: 'linkedin',
    growthPercent: 142,
    followers: '78K+',
    timeframe: '9 months',
    testimonial: 'PRSocials helped me establish real thought leadership in my industry.'
  },
  {
    username: '@travel_moments',
    platform: 'instagram',
    growthPercent: 213,
    followers: '425K+',
    timeframe: '10 months',
    testimonial: 'The personalized strategy turned my travel photos into a thriving brand.'
  },
  {
    username: '@gaming_clips',
    platform: 'youtube',
    growthPercent: 298,
    followers: '1.7M+',
    timeframe: '12 months',
    testimonial: 'PRSocials AI told me exactly what gaming content would perform best.'
  },
];

const AccountCard: React.FC<{ account: AccountData, keyPrefix?: string }> = ({ account, keyPrefix = '' }) => {
  return (
    <div className="flex-shrink-0 w-80 rounded-lg bg-black/20 border border-primary/20 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-primary mb-2">
        <PlatformIcon platform={account.platform} />
        <span className="font-semibold">{account.username}</span>
      </div>
      
      <div className="flex justify-between mb-2">
        <div>
          <div className="text-2xl font-bold">{account.followers}</div>
          <div className="text-xs text-muted-foreground">Followers</div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">+{account.growthPercent}%</div>
          <div className="text-xs text-muted-foreground">Growth in {account.timeframe}</div>
        </div>
      </div>
      
      {account.testimonial && (
        <p className="text-sm mt-3 italic text-muted-foreground">"{account.testimonial}"</p>
      )}
    </div>
  );
};

const PlatformIcon: React.FC<{ platform: AccountData['platform'] }> = ({ platform }) => {
  switch (platform) {
    case 'instagram':
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return null;
  }
};

export function AccountShowcase({ className }: AccountShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationPaused, setAnimationPaused] = useState(false);

  // Mouse interaction handlers
  const handleMouseEnter = () => setAnimationPaused(true);
  const handleMouseLeave = () => setAnimationPaused(false);

  return (
    <div 
      className={cn("w-full overflow-hidden py-6", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mb-2 text-center text-sm text-muted-foreground">Trusted by creators and businesses worldwide</div>
      
      <div className="relative w-full overflow-hidden">
        <div 
          ref={containerRef}
          className={cn(
            "flex gap-6 transition-transform duration-300",
            !animationPaused && "animate-marquee"
          )}
          style={{ width: 'fit-content' }}
        >
          {/* First set of accounts */}
          {accounts.map((account, index) => (
            <AccountCard key={index} account={account} />
          ))}
          
          {/* Duplicate accounts for seamless looping */}
          {accounts.map((account, index) => (
            <AccountCard key={`duplicate-${index}`} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
}
