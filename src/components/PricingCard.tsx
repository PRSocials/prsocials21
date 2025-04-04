import React from "react";
import { Button } from "./Button";

export interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
  model?: string;
  chatLimit?: string;
}

interface Props {
  plan: PricingPlan;
  onSelectPlan?: () => void;
}

export function PricingCard({ plan, onSelectPlan }: Props) {
  return (
    <div 
      className={`flex flex-col p-6 mx-auto max-w-sm rounded-lg border ${plan.popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'} h-full`}
    >
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-center">{plan.title}</h3>
        <div className="mt-4 flex justify-center items-baseline">
          <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary tracking-tighter">{plan.price}</span>
          {plan.price !== "Free" && <span className="ml-1 text-lg text-muted-foreground font-medium">/month</span>}
        </div>
        <p className="mt-4 text-center text-muted-foreground">{plan.description}</p>

        {plan.model && (
          <div className="mt-4">
            <p className="text-sm text-center"><span className="font-semibold">AI Model:</span> {plan.model}</p>
          </div>
        )}

        {plan.chatLimit && (
          <div className="mt-2">
            <p className="text-sm text-center"><span className="font-semibold">Chat Limit:</span> {plan.chatLimit}</p>
          </div>
        )}

        <ul className="mt-6 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-primary flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {plan.popular && (
        <div className="px-3 py-1 text-sm text-center rounded-full text-primary-foreground bg-primary font-medium mb-4 w-fit mx-auto">
          Most Popular
        </div>
      )}
      
      <div className="mt-4">
        <Button 
          onClick={onSelectPlan} 
          variant={plan.popular ? "primary" : "outline"}
          fullWidth
        >
          {plan.ctaText}
        </Button>
      </div>
    </div>
  );
}
