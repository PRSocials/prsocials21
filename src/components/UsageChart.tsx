import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatUsage {
  date: string;
  count: number;
}

interface UsageChartProps {
  usageData: ChatUsage[];
  chatLimit: number;
}

export const UsageChart: React.FC<UsageChartProps> = ({ usageData, chatLimit }) => {
  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric"
    }).format(date);
  };

  // Format tick for x-axis
  const formatTick = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric"
    }).format(date);
  };
  
  // Determine Y-axis domain based on data and limit
  const maxCount = Math.max(...usageData.map(item => item.count), 1); // At least 1
  const yMax = Math.max(maxCount * 1.2, chatLimit * 1.1, 5); // Ensure minimum scale

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Chat Usage</CardTitle>
        <CardDescription>Your chat activity over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={usageData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorLimit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatTick} 
                tick={{ fill: "#a1a1aa" }} 
                axisLine={{ stroke: "#27272a" }}
                tickLine={{ stroke: "#27272a" }}
              />
              <YAxis 
                tick={{ fill: "#a1a1aa" }} 
                axisLine={{ stroke: "#27272a" }}
                tickLine={{ stroke: "#27272a" }}
                domain={[0, yMax]}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a" }}
                labelFormatter={value => formatDate(value as string)}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#10B981" 
                strokeWidth={2}
                fill="url(#colorUsage)" 
                name="Chats Used"
                activeDot={{ r: 6 }}
              />
              <ReferenceLine 
                y={chatLimit} 
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="5 5" 
                label={{
                  value: `Limit: ${chatLimit}`,
                  position: 'right',
                  fill: '#EF4444',
                  fontSize: 12
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
