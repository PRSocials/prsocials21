import React, { useEffect, useState } from "react";

interface Props {
  text: string;
  className?: string;
}

export function AnimatedHeader({ text, className = "" }: Props) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text.charAt(index));
        setIndex(prevIndex => prevIndex + 1);
      }, 100); // Adjust speed as needed
      
      return () => clearTimeout(timer);
    }
  }, [index, text]);
  
  return (
    <h1 className={`font-bold relative ${className}`}>
      {displayText}
      <span className="animate-pulse inline-block ml-1 -mb-1 w-2 h-8 bg-primary"></span>
    </h1>
  );
}
