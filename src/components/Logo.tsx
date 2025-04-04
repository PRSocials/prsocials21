import React from "react";
import { cn } from "utils/cn";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: Props) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl"
  };
  
  return (
    <div className={cn(
      "font-bold tracking-tight flex items-center",
      sizeClasses[size],
      className
    )}>
      <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
        <span className="text-primary">PR</span>
        <span className="text-white">Socials</span>
      </Link>
    </div>
  );
}
