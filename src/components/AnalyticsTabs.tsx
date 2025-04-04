import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { randomBetween } from "utils/utils";

// Mock data generator for campaigns
export const generateCampaignData = () => {
  return [
    { name: 'Brand Awareness', reach: randomBetween(15000, 25000), engagement: randomBetween(3, 7), conversion: randomBetween(1, 4), roi: randomBetween(2, 8) },
    { name: 'Lead Generation', reach: randomBetween(8000, 15000), engagement: randomBetween(4, 9), conversion: randomBetween(2, 6), roi: randomBetween(3, 10) },
    { name: 'Content Promotion', reach: randomBetween(20000, 35000), engagement: randomBetween(5, 10), conversion: randomBetween(1, 3), roi: randomBetween(2, 6) },
    { name: 'Product Launch', reach: randomBetween(40000, 60000), engagement: randomBetween(6, 12), conversion: randomBetween(2, 5), roi: randomBetween(4, 12) },
    { name: 'Event Promotion', reach: randomBetween(10000, 20000), engagement: randomBetween(7, 15), conversion: randomBetween(3, 8), roi: randomBetween(5, 15) }
  ];
};

// Mock data generator for platforms
export const generatePlatformData = () => {
  return [
    { platform: 'Instagram', followers: randomBetween(10000, 50000), engagement: randomBetween(2, 6), growth: randomBetween(1, 8) },
    { platform: 'TikTok', followers: randomBetween(8000, 40000), engagement: randomBetween(3, 8), growth: randomBetween(5, 12) },
    { platform: 'Twitter', followers: randomBetween(5000, 30000), engagement: randomBetween(1, 4), growth: randomBetween(1, 6) },
    { platform: 'LinkedIn', followers: randomBetween(3000, 20000), engagement: randomBetween(1, 3), growth: randomBetween(2, 5) },
    { platform: 'YouTube', followers: randomBetween(2000, 15000), engagement: randomBetween(4, 10), growth: randomBetween(2, 7) }
  ];
};

// Platform growth trend data
export const generatePlatformGrowthTrend = () => {
  return [
    { month: 'Jan', 'Instagram': 2.5, 'TikTok': 3.8, 'Twitter': 1.2, 'LinkedIn': 0.9, 'YouTube': 1.5 },
    { month: 'Feb', 'Instagram': 3.1, 'TikTok': 4.2, 'Twitter': 1.5, 'LinkedIn': 1.1, 'YouTube': 1.8 },
    { month: 'Mar', 'Instagram': 3.5, 'TikTok': 5.0, 'Twitter': 1.7, 'LinkedIn': 1.3, 'YouTube': 2.1 },
    { month: 'Apr', 'Instagram': 4.2, 'TikTok': 6.5, 'Twitter': 2.0, 'LinkedIn': 1.6, 'YouTube': 2.7 },
    { month: 'May', 'Instagram': 5.0, 'TikTok': 8.2, 'Twitter': 2.3, 'LinkedIn': 1.9, 'YouTube': 3.5 },
    { month: 'Jun', 'Instagram': 5.5, 'TikTok': 9.8, 'Twitter': 2.8, 'LinkedIn': 2.2, 'YouTube': 4.1 }
  ];
};

// Campaign Analytics Tab content
// Advanced Analysis Components
const CampaignHeatmap = () => {
  // Generate heatmap data
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
  const heatmapData = weekdays.map(day => {
    const result = { day };
    timeSlots.forEach(time => {
      // Higher engagement during work hours and evenings
      let baseValue = 0;
      const hour = parseInt(time.split(':')[0]);
      if (hour >= 8 && hour <= 11) baseValue = 50; // Morning
      else if (hour >= 12 && hour <= 14) baseValue = 70; // Lunch
      else if (hour >= 17 && hour <= 22) baseValue = 80; // Evening
      else if (hour >= 1 && hour <= 6) baseValue = 10; // Night
      else baseValue = 30; // Other times
      
      // Add some randomness
      result[time] = baseValue + randomBetween(-20, 20);
      // Ensure value is between 0-100
      result[time] = Math.max(0, Math.min(100, result[time]));
    });
    return result;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Engagement Heatmap</CardTitle>
        <CardDescription>
          Best times to post by day of week (engagement level)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="flex border-b pb-2 mb-2">
              <div className="w-16"></div>
              {weekdays.map(day => (
                <div key={day} className="w-12 text-center font-medium">{day}</div>
              ))}
            </div>
            
            {[9, 12, 15, 18, 21].map(hour => (
              <div key={hour} className="flex items-center py-1">
                <div className="w-16 text-sm text-muted-foreground">{`${hour}:00`}</div>
                {weekdays.map(day => {
                  const value = heatmapData.find(d => d.day === day)[`${hour}:00`];
                  let bgColor = '';
                  if (value < 20) bgColor = 'bg-emerald-900/10';
                  else if (value < 40) bgColor = 'bg-emerald-700/20';
                  else if (value < 60) bgColor = 'bg-emerald-600/40';
                  else if (value < 80) bgColor = 'bg-emerald-500/60';
                  else bgColor = 'bg-emerald-500/90';
                  
                  return (
                    <div 
                      key={`${day}-${hour}`} 
                      className={`w-12 h-10 ${bgColor} rounded m-1 flex items-center justify-center`}
                      title={`${day} at ${hour}:00 - Engagement: ${value}%`}
                    >
                      <span className="text-xs font-medium">{value > 50 ? `${value}%` : ''}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FunnelChart = () => {
  const funnelData = [
    { name: 'Impressions', value: randomBetween(80000, 120000) },
    { name: 'Reach', value: randomBetween(40000, 70000) },
    { name: 'Engagement', value: randomBetween(10000, 25000) },
    { name: 'Click-through', value: randomBetween(5000, 15000) },
    { name: 'Conversion', value: randomBetween(500, 2000) },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Conversion Funnel</CardTitle>
        <CardDescription>
          Visualizing the user journey through campaign touchpoints
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={funnelData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
            />
            <Tooltip formatter={(value) => [new Intl.NumberFormat().format(value), 'Count']} />
            <Bar 
              dataKey="value" 
              fill="#22c55e"
              label={{ position: 'right', formatter: (value) => new Intl.NumberFormat().format(value) }} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const CampaignsTab = () => {
  const campaignData = generateCampaignData();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Overview</CardTitle>
          <CardDescription>
            Compare the effectiveness of different campaign types
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={campaignData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reach" name="Reach" fill="#22c55e" />
              <Bar dataKey="engagement" name="Engagement %" fill="#8884d8" />
              <Bar dataKey="conversion" name="Conversion %" fill="#ff8042" />
              <Bar dataKey="roi" name="ROI %" fill="#0088fe" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Campaign Effectiveness</CardTitle>
          <CardDescription>
            Detailed breakdown of campaign metrics and KPIs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {campaignData.map((campaign, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h3 className="font-medium mb-2">{campaign.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reach:</span>
                    <span className="font-medium">{new Intl.NumberFormat().format(campaign.reach)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Engagement:</span>
                    <span className="font-medium">{campaign.engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Conversion:</span>
                    <span className="font-medium">{campaign.conversion}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ROI:</span>
                    <span className={`font-medium ${campaign.roi > 5 ? 'text-emerald-500' : campaign.roi < 2 ? 'text-red-500' : ''}`}
                      >
                      {campaign.roi}x
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <CampaignHeatmap />
        <FunnelChart />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Timeline</CardTitle>
          <CardDescription>
            Track performance metrics over campaign duration
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { day: 1, reach: 5000, engagement: 3.2, conversions: 120 },
                { day: 2, reach: 7500, engagement: 3.8, conversions: 180 },
                { day: 3, reach: 9000, engagement: 4.1, conversions: 220 },
                { day: 4, reach: 12000, engagement: 4.8, conversions: 280 },
                { day: 5, reach: 15000, engagement: 5.2, conversions: 350 },
                { day: 6, reach: 18000, engagement: 5.5, conversions: 420 },
                { day: 7, reach: 22000, engagement: 5.8, conversions: 480 },
                { day: 8, reach: 25000, engagement: 6.2, conversions: 520 },
                { day: 9, reach: 27000, engagement: 6.5, conversions: 580 },
                { day: 10, reach: 30000, engagement: 6.8, conversions: 650 },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Campaign Day', position: 'insideBottom', offset: -5 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
              <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
              <YAxis yAxisId="right2" orientation="right" stroke="#ff8042" hide />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="reach" name="Reach" stroke="#22c55e" />
              <Line yAxisId="right" type="monotone" dataKey="engagement" name="Engagement %" stroke="#8884d8" />
              <Line yAxisId="right2" type="monotone" dataKey="conversions" name="Conversions" stroke="#ff8042" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <CompetitorComparison />
        <ContentTypeDistribution />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Engagement Metrics</CardTitle>
          <CardDescription>
            Detailed comparison of user interaction by platform
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { platform: 'Instagram', likes: randomBetween(400, 800), comments: randomBetween(40, 120), shares: randomBetween(30, 90), saves: randomBetween(50, 150) },
                { platform: 'TikTok', likes: randomBetween(1000, 2000), comments: randomBetween(100, 300), shares: randomBetween(200, 500), saves: randomBetween(80, 200) },
                { platform: 'Twitter', likes: randomBetween(300, 600), comments: randomBetween(50, 150), shares: randomBetween(100, 300), saves: randomBetween(30, 80) },
                { platform: 'LinkedIn', likes: randomBetween(200, 400), comments: randomBetween(30, 80), shares: randomBetween(40, 100), saves: randomBetween(20, 60) },
                { platform: 'YouTube', likes: randomBetween(500, 1000), comments: randomBetween(80, 200), shares: randomBetween(50, 120), saves: randomBetween(30, 90) },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" name="Likes" fill="#8884d8" />
              <Bar dataKey="comments" name="Comments" fill="#22c55e" />
              <Bar dataKey="shares" name="Shares" fill="#82ca9d" />
              <Bar dataKey="saves" name="Saves" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audience Overlap Analysis</CardTitle>
          <CardDescription>
            Understanding shared audience between platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {[
              { pair: 'Instagram & TikTok', overlap: `${randomBetween(25, 40)}%`, color: 'bg-purple-500' },
              { pair: 'Instagram & Twitter', overlap: `${randomBetween(15, 30)}%`, color: 'bg-blue-500' },
              { pair: 'TikTok & Twitter', overlap: `${randomBetween(10, 25)}%`, color: 'bg-green-500' },
              { pair: 'Instagram & LinkedIn', overlap: `${randomBetween(5, 20)}%`, color: 'bg-yellow-500' },
              { pair: 'YouTube & TikTok', overlap: `${randomBetween(20, 35)}%`, color: 'bg-red-500' },
            ].map((item, index) => (
              <div key={index} className="border border-border rounded-lg p-4 w-48 text-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${item.color} flex items-center justify-center mb-3`}>
                  <span className="text-white text-lg font-bold">{item.overlap}</span>
                </div>
                <div className="text-sm font-medium">{item.pair}</div>
                <div className="text-xs text-muted-foreground mt-1">Audience Overlap</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-center text-muted-foreground">
            This analysis helps identify cross-promotion opportunities between platforms with high audience overlap
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Platforms Analytics Tab content
// Advanced platform-specific components
const CompetitorComparison = () => {
  const data = [
    { name: 'Your Brand', instagram: randomBetween(20000, 40000), tiktok: randomBetween(15000, 35000), twitter: randomBetween(10000, 25000) },
    { name: 'Competitor A', instagram: randomBetween(15000, 50000), tiktok: randomBetween(10000, 40000), twitter: randomBetween(8000, 30000) },
    { name: 'Competitor B', instagram: randomBetween(10000, 60000), tiktok: randomBetween(5000, 45000), twitter: randomBetween(5000, 35000) },
    { name: 'Competitor C', instagram: randomBetween(8000, 70000), tiktok: randomBetween(3000, 50000), twitter: randomBetween(3000, 40000) },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Analysis</CardTitle>
        <CardDescription>
          Follower comparison across major platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [new Intl.NumberFormat().format(value), 'Followers']} />
            <Legend />
            <Bar dataKey="instagram" name="Instagram" fill="#8884d8" />
            <Bar dataKey="tiktok" name="TikTok" fill="#22c55e" />
            <Bar dataKey="twitter" name="Twitter" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ContentTypeDistribution = () => {
  const platformData = [
    { name: 'Instagram', photos: 45, videos: 30, carousels: 25 },
    { name: 'TikTok', photos: 5, videos: 90, carousels: 5 },
    { name: 'Twitter', photos: 35, videos: 25, carousels: 40 },
    { name: 'LinkedIn', photos: 30, videos: 20, carousels: 50 },
    { name: 'YouTube', photos: 5, videos: 90, carousels: 5 },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Type Distribution</CardTitle>
        <CardDescription>
          Optimal content types by platform
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={platformData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            stackOffset="expand"
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(value) => `${value}%`} />
            <YAxis type="category" dataKey="name" />
            <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
            <Legend />
            <Bar dataKey="photos" name="Photos" stackId="a" fill="#8884d8" />
            <Bar dataKey="videos" name="Videos" stackId="a" fill="#22c55e" />
            <Bar dataKey="carousels" name="Carousels/Threads" stackId="a" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const PlatformsTab = () => {
  const platformData = generatePlatformData();
  const growthTrendData = generatePlatformGrowthTrend();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cross-Platform Performance</CardTitle>
          <CardDescription>
            Comparison of key metrics across social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={platformData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="followers" name="Followers" fill="#22c55e" />
              <Bar yAxisId="right" dataKey="engagement" name="Engagement %" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="growth" name="Growth %" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Growth Comparison</CardTitle>
          <CardDescription>
            Monthly growth rate compared across platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthTrendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Growth %', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
              <Legend />
              <Line type="monotone" dataKey="Instagram" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="TikTok" stroke="#22c55e" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Twitter" stroke="#82ca9d" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="LinkedIn" stroke="#ffc658" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="YouTube" stroke="#ff8042" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
