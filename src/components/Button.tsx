import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  fullWidth = false,
}: Props) {
  const baseClasses = "font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/30",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/30",
    outline: "border border-primary text-primary hover:bg-primary/10 focus:ring-primary/30"
  };
  
  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
