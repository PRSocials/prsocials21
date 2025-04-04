import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "components/Progress";
import { cva } from "class-variance-authority";
import { cn } from "utils/cn";

interface UsageMetricCardProps {
  title: string;
  description?: string;
  used: number;
  limit: number;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const progressVariants = cva(
  "h-2",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        danger: "bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const UsageMetricCard: React.FC<UsageMetricCardProps> = ({
  title,
  description,
  used,
  limit,
  icon,
  variant = "default",
}) => {
  // Calculate percentage used
  const percentage = Math.min(Math.round((used / limit) * 100), 100);
  
  // Determine variant based on usage if not explicitly set
  const autoVariant = 
    variant === "default" 
      ? percentage >= 90 
        ? "danger" 
        : percentage >= 75 
          ? "warning" 
          : "success"
      : variant;
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </div>
        {icon && (
          <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {used} / {limit}
        </div>
        <Progress 
          value={percentage} 
          className="h-2 mt-2" 
          indicatorClassName={cn(progressVariants({ variant: autoVariant }))}
        />
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {percentage}% used
          {percentage >= 90 && " - Consider upgrading your plan"}
        </p>
      </CardFooter>
    </Card>
  );
};
