import React from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: Props) {
  return (
    <div className="flex flex-col p-6 rounded-xl border border-border transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm">
      <div className="h-12 w-12 flex items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
