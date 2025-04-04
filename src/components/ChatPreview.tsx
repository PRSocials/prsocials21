import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "app";

// Message bubble styles similar to the Chat component

interface MessageProps {
  content: string;
  isUser: boolean;
  className?: string;
}

const Message: React.FC<MessageProps> = ({ content, isUser, className }) => (
  <div className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"} ${className || ''}`}>
    <div
      className={`relative max-w-[75%] px-4 py-2 rounded-2xl ${isUser
        ? "bg-primary rounded-tr-none mr-2"
        : "bg-card rounded-tl-none border border-border ml-2"}`}
    >
      <div className={`${isUser ? "text-black" : ""} prose prose-invert prose-sm max-w-none text-left`}
      >
        <ReactMarkdown
          components={{
            h3: ({ children }) => <h3 className={`text-lg font-bold mt-3 mb-2 ${isUser ? "text-black" : "text-brand-green"}`}>{children}</h3>,
            strong: ({ children }) => <strong className={`font-bold ${isUser ? "text-black" : "text-brand-green"}`}>{children}</strong>,
            ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ children }) => <code className="bg-black/30 rounded px-1 py-0.5 text-xs">{children}</code>,
            p: ({ children }) => <p className={isUser ? "text-black" : ""}>{children}</p>,
            img: ({ src, alt }) => (
              <div className="my-2">
                <img src={src} alt={alt || "Generated image"} className="rounded-md max-w-full" />
              </div>
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  </div>
);

export const ChatPreview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [inputValue, setInputValue] = useState("");
  
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    
    if (user) {
      // Redirect to chat if logged in
      navigate("/chat");
    } else {
      // Redirect to signup if not logged in
      navigate("/sign-up");
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-white/10 p-4 flex justify-between items-center" style={{ backgroundColor: '#2a2a2a' }}>
        <div>
          <h1 className="text-lg font-bold">PRSocials Advisor</h1>
          <p className="text-muted-foreground text-xs">Social Media Algorithmic Advisor</p>
        </div>
        <div>
          <Badge variant="outline" className="capitalize">
            PRSocials AI
          </Badge>
        </div>
      </header>
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" style={{ backgroundColor: '#2a2a2a' }}>
        <Message 
          isUser={false} 
          content="Hi! I'm your PR Media Assistant Powered By PRSocials. Would you like to find how can i provide value to you and your platforms?"
        />
        
        <Message 
          isUser={true} 
          content="Hi, Definitely! I'd like to know what features you offer."
        />
        
        <Message 
          isUser={false} 
          content="I'd be happy to share what makes PRSocials unique! Here's how our advanced features can revolutionize your social media strategy:"
        />
        
        <Message 
          isUser={false} 
          content={`• **Algorithmic Analysis** — Uncover hidden patterns in platform algorithms unavailable to standard social tools

• **Advanced Metrics Dashboard** — Track engagement, reach, and conversion metrics beyond what native analytics provide

• **100% Individualized Strategy** — Every piece of advice is tailored specifically to your unique profile and goals

• **AI Image Generation & Analysis** — Create and optimize visual content with cutting-edge AI technology

• **Zero-to-Hero Profile Building** — Strategic frameworks to build profiles from scratch to significant following

• **Full Content Automation** — End-to-end creation and publishing workflows that save hours of manual work

• **Seamless AI Integration** — Connect your entire digital ecosystem for a unified growth approach

• **Ad Campaign Management** — Plan, deploy, and maintain fully individualized tailored solutions for ads campaigns`}
        />
      </div>
      
      {/* Input area */}
      <div className="border-t border-white/10 p-4" style={{ backgroundColor: '#2a2a2a' }}>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ask anything about social media..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md h-10 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/* Custom scrollbar styles */
const styles = document.createElement('style');
styles.innerHTML = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #10b981;
    border-radius: 999px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #0ea572;
  }
`;
document.head.appendChild(styles);