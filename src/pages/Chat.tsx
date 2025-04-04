  // Helper function to create a quick response message when user selects an option
  const handleAccountOptionSelected = (option: 'existing' | 'new') => {
    // Add user's selection as a message
    const userMessage = {
      role: 'user' as const,
      content: option === 'existing' 
        ? 'I want assistance with my existing social media profiles.' 
        : 'I want to start a new social media profile/project.'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsLoading(true);
    
    // Add AI response after a short delay
    setTimeout(() => {
      let aiResponseContent = "";
      
      if (option === 'existing') {
        aiResponseContent = "Great! To provide personalized advice for your existing social media profiles, I'll need access to your account data. I'm redirecting you to connect your accounts now.";
      } else {
        // Content for new profiles (no connected accounts)
        aiResponseContent = `Excellent! I'd be happy to help you start a new social media project.

**Prompt Engineering is everything**. Please be detailed as you can for any request so you can get the maximum out of 'PRSocials Advisor'. You can start by using the following prompts or you can use a custom one:

**Prompt 1** - Based on current trends analysis, provide me 3 ideas of profiles that i can create/manage from scratch. Assist me with ideas, tools, logos, images, descriptions, algorithmic analysis, roadmap, for cross-platform profile TikTok / Instagram / Youtube / Facebook

**Prompt 2** - I want to start creating my personal brand to become an influencer. Please craft for me a roadmap/blueprint and assist me along the journey. Feel free to ask me more details.

**Prompt 3** - I want to create a cross-platform profile that will be fully automated from creating content to posting (Based on AI Tools) with the target to make it to be approved for monetization. Please craft for me a roadmap/blueprint and assist me along the journey. Feel free to ask me more details.

**Prompt 4** - Feel free to ask me anything regarding Social Media`;
      }
      
      const aiResponse = {
        role: 'assistant' as const,
        content: aiResponseContent
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // If existing, redirect to connect accounts page after showing the message
      if (option === 'existing') {
        setTimeout(() => {
          goToConnectAccounts();
        }, 2000);
      }
    }, 1500);
  };
  
  // Helper to show prompt suggestions for account with analytics
  const showPromptSuggestions = () => {
    const promptSuggestionsMessage = {
      role: 'assistant' as const,
      content: `**Prompt Engineering is everything**. Please be detailed as you can for any request so you can get the maximum out of 'PRSocials Advisor'. You can start by using the following prompts or you can use a custom one:

**Prompt 1** - Analyze my profile/account connected and provide to me 3 weak/strong points from it. Also provide me recommendations to act forward based on the weak/strong points.

**Prompt 2** - Analyze my profile/account connected and provide to me: The Engagement Rate; Performance Rate; Audience based on the last week of activity. Also provide me advices and recommendations based on the numbers.

**Prompt 3** - Analyze my profile/account connected and provide to me a plan to make the transition from manual Creation/Posting content to full AI Implementation/Automation step by step following the same niche that the profile is using. If you need more details, feel free to ask me.

**Prompt 4** - Feel free to ask me anything regarding Social Media`
    };
    
    setMessages(prev => [...prev, promptSuggestionsMessage]);
  };import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, UserCheck, PlusCircle } from "lucide-react";
import { useUserStore } from "utils/userStore";
import { useSocialMediaStore } from "utils/socialMediaStore";
import { useUserGuardContext } from "app";
import { MainLayout } from "components/MainLayout";
import brain from "brain";

// Types
import { Message, ChatHistoryResponse } from "brain/data-contracts";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "components/Progress";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AccountSelector } from "components/AccountSelector";
// Removed ImageGenerationModal import
import { ImageUploadInput } from "components/ImageUploadInput";

// Message bubble styles
const MessageBubble: React.FC<{ 
  role: string; 
  content: string;
  onPromptClick?: (text: string) => void; 
}> = ({ 
  role, 
  content,
  onPromptClick
}) => {
  const isUser = role === "user";
  
  // Extract prompt content and potentially render buttons
  const renderContent = () => {
    if (!isUser && content.includes("Prompt Engineering is everything") && onPromptClick) {
      // This is a prompt suggestion message
      const parts = [];
      
      // Split the content by the prompts
      const promptRegex = /\*\*Prompt (\d+)\*\* - ([^\n]+(?:\n(?!\*\*Prompt \d+\*\*)[^\n]+)*)/g;
      const matches = Array.from(content.matchAll(promptRegex));
      
      // Add intro text (everything before first prompt)
      const introEndIndex = content.indexOf("**Prompt 1**");
      const introText = content.substring(0, introEndIndex).trim();
      parts.push(
        <div key="intro" className="mb-4">
          <ReactMarkdown>{introText}</ReactMarkdown>
        </div>
      );
      
      // Process each prompt
      matches.forEach((match) => {
        const promptNum = match[1];
        const promptText = match[2].trim();
        
        // Make 4th prompt static, others clickable
        if (promptNum === "4") {
          parts.push(
            <div key={`prompt-${promptNum}`} className="mb-2">
              <p>
                <strong className="text-brand-green">Prompt {promptNum}</strong> - {promptText}
              </p>
            </div>
          );
        } else {
          parts.push(
            <button
              key={`prompt-${promptNum}`}
              className="prompt-suggestion block w-full text-left my-3 p-2 bg-black/20 hover:bg-brand-green/30 border border-brand-green/30 rounded-lg transition-colors cursor-pointer"
              onClick={() => onPromptClick(promptText)}
            >
              <p>
                <strong className="text-brand-green">Prompt {promptNum}</strong> - {promptText}
              </p>
            </button>
          );
        }
      });

      // Add custom prompt message at the end
      parts.push(
        <div key="custom-prompt" className="mt-4 text-center italic text-gray-400">
          You can also use a custom prompt, feel free to ask me anything regarding Social Media.
        </div>
      );
      
      return <div>{parts}</div>;
    }
    
    // Regular message content
    return (
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
    );
  };
  
  return (
    <div
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[75%] px-4 py-2 rounded-2xl ${isUser
          ? "bg-primary rounded-tr-none mr-2"
          : "bg-card rounded-tl-none border border-border ml-2"}`}
      >
        <div className={`${isUser ? "text-black" : ""} prose prose-invert prose-sm max-w-none`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

interface ChatHistory {
  timestamp: string;
  messages: Message[];
}

interface ChatUsage {
  used: number;
  limit: number;
}

export default function Chat() {
  const { user } = useUserGuardContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatUsage, setChatUsage] = useState<ChatUsage>({ used: 0, limit: 2 });
  const profile = useUserStore((state) => state.profile);
  const { accounts, isLoading: isLoadingAccounts, subscribeToAccounts } = useSocialMediaStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // State for account selector dialog, image upload, and image generation
  const [accountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isDraggingOverChat, setIsDraggingOverChat] = useState(false);
  
  // Initial load and scroll to bottom
  useEffect(() => {
    loadChatHistory();
    
    // Subscribe to social accounts
    if (user?.uid) {
      const unsubscribe = subscribeToAccounts(user.uid);
      return () => unsubscribe();
    }
  }, [user?.uid]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Show prompt suggestions when accounts are loaded and available
  useEffect(() => {
    // Only show suggestions if:
    // 1. We have accounts
    // 2. We're not currently loading messages
    // 3. We have at least one message (the welcome message)
    // 4. The last message is from the assistant (not in the middle of a conversation)
    if (
      accounts.length > 0 && 
      !isLoading && 
      messages.length === 1 && 
      messages[0].role === "assistant" && 
      messages[0].content.includes("Welcome") // Only for the welcome message
    ) {
      showPromptSuggestions();
    }
  }, [accounts, isLoading, messages]);
  
  // Show prompt suggestions when accounts are loaded and available
  useEffect(() => {
    // Only show suggestions if:
    // 1. We have accounts
    // 2. We're not currently loading messages
    // 3. We have at least one message (the welcome message)
    // 4. The last message is from the assistant (not in the middle of a conversation)
    if (
      accounts.length > 0 && 
      !isLoading && 
      messages.length === 1 && 
      messages[0].role === "assistant" && 
      messages[0].content.includes("Welcome") // Only for the welcome message
    ) {
      showPromptSuggestions();
    }
  }, [accounts, isLoading, messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Load chat history
  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await brain.get_chat_history();
      const data = await response.json();
      
      // If there's history, load the last conversation
      if (data.history && data.history.length > 0) {
        const lastChat = data.history[data.history.length - 1];
        setMessages(lastChat.messages);
      } else {
        // Add welcome message if no history
        setMessages([
          {
            role: "assistant",
            content: "Hello! I'm your PR Media Assistant. How can I help you improve your social media presence today?"
          }
        ]);
      }
      
      // Set usage info
      setChatUsage(data.usage);
      
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history");
    } finally {
      setIsLoading(false);
      // Clear image after sending
      setImageFile(null);
      setImageBase64(null);
    }
  };
  
  // Handle image upload
  const handleImageUpload = (file: File, previewUrl: string) => {
    try {
      setImageFile(file);
      
      // Extract base64 data from the preview URL
      const parts = previewUrl.split(',');
      if (parts.length !== 2) {
        console.error("Invalid image data format");
        toast.error("Invalid image format");
        return;
      }
      
      const base64Data = parts[1].trim();
      console.log("Base64 image data length:", base64Data.length);
      setImageBase64(base64Data);
      
      // Focus input after adding image
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      
      // Visual feedback
      toast.success("Image ready for analysis");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
      setImageFile(null);
      setImageBase64(null);
    }
  };
  
  // Process file for upload
  const processFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const result = reader.result as string;
        // Ensure result is a proper data URL
        if (typeof result === 'string' && result.startsWith('data:image/')) {
          handleImageUpload(file, result);
        } else {
          console.error("Invalid image data format");
          toast.error("Failed to process image format");
        }
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process image");
      }
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      toast.error("Failed to process image");
    };
    reader.readAsDataURL(file);
  };
  
  // Handle paste event for images
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault(); // Prevent default paste behavior for images
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          return;
        }
      }
    }
  };
  
  // Handle drag and drop events for the whole chat area
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverChat(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDraggingOverChat(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverChat(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };
  
  // Handle sending a message
  const handleSend = async () => {
    if ((!input.trim() && !imageBase64) || isLoading) return;
    
    // Check usage limits
    if (chatUsage.used >= chatUsage.limit) {
      toast.error(
        "You've reached your chat limit. Please upgrade your subscription to continue.",
        {
          action: {
            label: "Upgrade",
            onClick: () => navigate("/subscriptions")
          }
        }
      );
      return;
    }
    
    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    try {
      setIsLoading(true);
      
      // Use streaming for real-time responses
      try {
        // Add a placeholder for assistant message
        let currentAssistantMessage = "";
        setMessages(prev => [...prev, { role: "assistant" as const, content: currentAssistantMessage }]);
        
        // Get streaming response
        for await (const chunk of brain.chat({
          messages: [...messages, userMessage],
          stream: true,
          image_data: imageBase64 ? imageBase64 : undefined
        })) {
          // Check if this is a "Thinking..." message or error message
          if (chunk.includes("Thinking...")) {
            // Show typing indicator instead of "Thinking..."
            continue;
          } else if (chunk.startsWith("\r")) {
            // Clear line command, skip
            continue;
          } else if (chunk.startsWith("Error:")) {
            // Error message
            toast.error(chunk);
            // Remove the assistant message
            setMessages(prev => prev.slice(0, -1));
            break;
          }
          
          // Append new chunk to the current message
          currentAssistantMessage += chunk;
          
          // Update the last message (which is the assistant's) with a typing effect
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { 
              role: "assistant", 
              content: currentAssistantMessage + (Math.random() > 0.7 ? '▌' : '') // Add blinking cursor effect
            };
            return newMessages;
          });
          
          // Small random delay between updates to simulate human typing
          await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
        }
        
        // Final update to remove the cursor
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "assistant") {
            newMessages[newMessages.length - 1] = { 
              role: "assistant", 
              content: currentAssistantMessage // Remove cursor
            };
          }
          return newMessages;
        });
        
        // Update usage
        setChatUsage(prev => ({
          ...prev,
          used: prev.used + 1
        }));
      } catch (streamError) {
        console.error("Streaming error:", streamError);
        toast.error("Error with streaming response. Trying standard request...");
        
        // Remove the incomplete assistant message
        setMessages(prev => prev.slice(0, -1));
        
        // Fallback to non-streaming approach
        const response = await brain.chat({
          messages: [...messages, userMessage],
          stream: false,
          image_data: imageBase64 ? imageBase64 : undefined
        });
        
        const data = await response.json();
        
        setMessages((prev) => [
          ...prev,
          { role: "assistant" as const, content: data.reply }
        ]);
        
        // Update usage
        setChatUsage(prev => ({
          ...prev,
          used: prev.used + 1
        }));
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response from the AI");
      
      // Remove the assistant placeholder message if there's an error
      setMessages(prev => {
        if (prev[prev.length - 1]?.role === "assistant") {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
      // Clear image after sending
      setImageFile(null);
      setImageBase64(null);
    }
  };
  

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Clear chat history
  const clearChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await brain.clear_chat_history();
      const data = await response.json();
      
      if (data.success) {
        setMessages([
          {
            role: "assistant",
            content: "Hello! I'm your PR Media Assistant. How can I help you improve your social media presence today?"
          }
        ]);
        toast.success("Chat history cleared successfully");
      } else {
        toast.error("Failed to clear chat history");
      }
    } catch (error) {
      console.error("Error clearing chat history:", error);
      toast.error("Failed to clear chat history");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Redirect to connect accounts page
  const goToConnectAccounts = () => {
    navigate("/ConnectAccounts");
  };
  
  // Helper function to create a quick response message when user selects an option
  const handleAccountOptionSelected = (option: 'existing' | 'new') => {
    // Add user's selection as a message
    const userMessage = {
      role: 'user' as const,
      content: option === 'existing' 
        ? 'I want assistance with my existing social media profiles.' 
        : 'I want to start a new social media profile/project.'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsLoading(true);
    
    // Add AI response after a short delay
    setTimeout(() => {
      let aiResponseContent = "";
      
      if (option === 'existing') {
        aiResponseContent = "Great! To provide personalized advice for your existing social media profiles, I'll need access to your account data. I'm redirecting you to connect your accounts now.";
      } else {
        // Content for new profiles (no connected accounts)
        aiResponseContent = `Excellent! I'd be happy to help you start a new social media project.

**Prompt Engineering is everything**. Please be detailed as you can for any request so you can get the maximum out of 'PRSocials Advisor'. You can start by using the following prompts or you can use a custom one:

**Prompt 1** - Based on current trends analysis, provide me 3 ideas of profiles that i can create/manage from scratch. Assist me with ideas, tools, logos, images, descriptions, algorithmic analysis, roadmap, for cross-platform profile TikTok / Instagram / Youtube / Facebook

**Prompt 2** - I want to start creating my personal brand to become an influencer. Please craft for me a roadmap/blueprint and assist me along the journey. Feel free to ask me more details.

**Prompt 3** - I want to create a cross-platform profile that will be fully automated from creating content to posting (Based on AI Tools) with the target to make it to be approved for monetization. Please craft for me a roadmap/blueprint and assist me along the journey. Feel free to ask me more details.`;
      }
      
      const aiResponse = {
        role: 'assistant' as const,
        content: aiResponseContent
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // If existing, redirect to connect accounts page after showing the message
      if (option === 'existing') {
        setTimeout(() => {
          goToConnectAccounts();
        }, 2000);
      }
    }, 1500);
  };
  
  // Helper to show prompt suggestions for account with analytics
  const showPromptSuggestions = () => {
    const promptSuggestionsMessage = {
      role: 'assistant' as const,
      content: `**Prompt Engineering is everything**. Please be detailed as you can for any request so you can get the maximum out of 'PRSocials Advisor'. You can start by using the following prompts or you can use a custom one:

**Prompt 1** - Analyze my profile/account connected and provide to me 3 weak/strong points from it. Also provide me recommendations to act forward based on the weak/strong points.

**Prompt 2** - Analyze my profile/account connected and provide to me: The Engagement Rate; Performance Rate; Audience based on the last week of activity. Also provide me advices and recommendations based on the numbers.

**Prompt 3** - Analyze my profile/account connected and provide to me a plan to make the transition from manual Creation/Posting content to full AI Implementation/Automation step by step following the same niche that the profile is using. If you need more details, feel free to ask me.`
    };
    
    setMessages(prev => [...prev, promptSuggestionsMessage]);
  };
  
  // Handle account selection
  const handleAccountSelect = (accountId: string) => {
    const selectedAccount = accounts.find(account => account.id === accountId);
    if (selectedAccount) {
      toast.success(`Now using @${selectedAccount.username} (${selectedAccount.platform}) for personalized advice`);
      
      // Add a system message indicating account selection
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `I'll now provide advice tailored to your @${selectedAccount.username} ${selectedAccount.platform} account. What would you like to know?`
        }
      ]);
      
      // Show prompt suggestions for accounts with analytics
      showPromptSuggestions();
    }
  };
  
  // Subscription tier name
  const subscriptionTier = profile?.subscription || "free";
  
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="border-b border-white/10 p-4 flex justify-between items-center" style={{ backgroundColor: '#2a2a2a' }}>
          <div>
            <h1 className="text-2xl font-bold">PRSocials Advisor</h1>
            <p className="text-muted-foreground">Social Media Algorithmic Advisor</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="flex space-x-2 mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearChatHistory}
                disabled={isLoading || messages.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear History
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAccountSelectorOpen(true)}
                disabled={accounts.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Choose Account
              </Button>
            </div>
            <Badge variant="outline" className="capitalize">
              {subscriptionTier} Plan
            </Badge>
            <div className="text-sm text-muted-foreground">
              {chatUsage.used} of {chatUsage.limit} chats used
            </div>
            <div className="w-40">
              <Progress 
                value={(chatUsage.used / chatUsage.limit) * 100} 
                className="h-2" 
                indicatorClassName={
                  chatUsage.used >= chatUsage.limit 
                    ? "bg-destructive" 
                    : chatUsage.used > chatUsage.limit * 0.8 
                      ? "bg-amber-500" 
                      : undefined
                }
              />
            </div>
            {accounts.length > 0 ? (
              <Badge variant="secondary" className="mt-1">
                {accounts.length} Connected {accounts.length === 1 ? "Account" : "Accounts"}
              </Badge>
            ) : null}
          </div>
        </header>
        
        {/* Chat messages area */}
        <div 
          className={`flex-1 overflow-y-auto p-4 relative ${isDraggingOverChat ? 'bg-brand-green/10' : ''}`} 
          style={{ backgroundColor: '#2a2a2a' }}
          ref={chatContainerRef}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isDraggingOverChat && (
            <div className="absolute inset-0 border-2 border-dashed border-brand-green/60 rounded-md z-10 flex items-center justify-center bg-black/20 pointer-events-none">
              <div className="bg-black/70 p-4 rounded-xl flex items-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-brand-green font-medium">Drop image to analyze</span>
              </div>
            </div>
          )}
          <div className="container mx-auto max-w-4xl">
            {/* Connected accounts info banner */}
            {accounts.length === 0 && (
              <div className="mb-6 rounded-lg border border-yellow-600/30 bg-yellow-500/10 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <p className="text-yellow-200 font-semibold">No connected accounts detected</p>
                  </div>
                  <p className="text-yellow-200 text-sm mb-4">
                    To get the most out of PRSocials, please choose one of the following options:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    {/* Option 1: Existing profiles */}
                    <div className="border border-yellow-500/30 rounded-lg p-4 hover:bg-yellow-500/10 transition-colors cursor-pointer" 
                      onClick={() => handleAccountOptionSelected('existing')}>
                      <div className="flex items-center mb-2">
                        <UserCheck className="h-5 w-5 text-brand-green mr-2" />
                        <h3 className="text-brand-green font-medium">Assist with existing profiles</h3>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Connect your existing social media accounts to get personalized analytics and growth strategies.
                      </p>
                    </div>
                    
                    {/* Option 2: New project */}
                    <div className="border border-yellow-500/30 rounded-lg p-4 hover:bg-yellow-500/10 transition-colors cursor-pointer"
                      onClick={() => handleAccountOptionSelected('new')}>
                      <div className="flex items-center mb-2">
                        <PlusCircle className="h-5 w-5 text-brand-green mr-2" />
                        <h3 className="text-brand-green font-medium">Start a new project</h3>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Get guidance on creating and growing new social media profiles from scratch.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-500/20 p-3 border-t border-yellow-600/30">
                  <p className="text-yellow-200 text-xs text-center">
                    Connecting your accounts enables our AI to provide data-driven recommendations tailored to your specific needs.
                  </p>
                </div>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <MessageBubble 
                key={index} 
                role={msg.role} 
                content={msg.content} 
                onPromptClick={(text) => {
                  setInput(text);
                  setTimeout(() => handleSend(), 100);
                }}
              />
            ))}
            <div ref={messagesEndRef} />
            
            {isLoading && (
              <div className="flex w-full justify-start mb-4">
                <div className="relative max-w-[80%] px-4 py-3 rounded-xl bg-card rounded-tl-none border border-border">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Input area */}
        <div className="border-t border-white/10 p-4" style={{ backgroundColor: '#2a2a2a' }}>
          <div className="container mx-auto max-w-4xl">
            {imageBase64 && (
              <div className="p-3 mb-2 bg-black/20 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-12 w-12 rounded bg-black/40 overflow-hidden">
                    <img 
                      src={`data:image/jpeg;base64,${imageBase64}`} 
                      alt="Uploaded for analysis" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        console.error("Image preview error");
                        e.currentTarget.src = "https://placehold.co/100x100/2a2a2a/4ade80?text=Image";
                      }}
                    />
                  </div>
                  <span className="text-sm text-brand-green flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image ready for analysis
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10" 
                  onClick={() => {
                    setImageFile(null);
                    setImageBase64(null);
                    toast.info("Image removed");
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            )}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Reset image generation state when user types
                    setIsGeneratingImage(false);
                  }}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder="Ask me anything about improving your social media or type 'Generate [description]' to create an image..." 
                  className="flex-1 resize-none rounded-xl w-full"
                  disabled={isLoading || chatUsage.used >= chatUsage.limit}
                  rows={3}
                  style={{ minHeight: '80px' }}
                />
                {isGeneratingImage && (
                  <div className="absolute bottom-2 right-2 text-xs text-brand-green flex items-center gap-1 bg-black/60 px-2 py-1 rounded-md">
                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Image generation enabled
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleSend} 
                  className="rounded-xl flex-1"
                  disabled={isLoading || (!input.trim() && !imageBase64) || chatUsage.used >= chatUsage.limit}
                >
                  {isLoading || isGeneratingImage ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isGeneratingImage ? 'Generating' : 'Sending'}
                    </span>
                  ) : "Send"}
                </Button>

                <ImageUploadInput
                  onImageUploaded={handleImageUpload}
                  buttonLabel="Analyze Image"
                  buttonVariant="outline"
                  buttonClassName="h-10"
                />
              </div>
            </div>
            
            {chatUsage.used >= chatUsage.limit && (
              <div className="mt-2 text-center">
                <p className="text-sm text-destructive mb-2">You've reached your chat limit for this month</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/subscriptions")}
                >
                  Upgrade Your Plan
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Account Selector Dialog */}
      <AccountSelector 
        open={accountSelectorOpen}
        onOpenChange={setAccountSelectorOpen}
        onAccountSelect={handleAccountSelect}
      />
    </MainLayout>
  );
}