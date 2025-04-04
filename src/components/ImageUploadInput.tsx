import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Camera } from "lucide-react";
import { useUserGuardContext } from "app";

interface Props {
  onImageUploaded: (file: File, previewUrl: string) => void;
  buttonLabel?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonClassName?: string;
}

export const ImageUploadInput = ({
  onImageUploaded,
  buttonLabel = "Upload Image",
  buttonVariant = "outline",
  buttonClassName = "",
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { user } = useUserGuardContext();

  const processFile = useCallback((file: File) => {
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

    setIsLoading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const result = reader.result as string;
        // Ensure result is a proper data URL
        if (typeof result === 'string' && result.startsWith('data:image/')) {
          console.log("Image successfully processed");
          onImageUploaded(file, result);
          setIsLoading(false);
          toast.success("Image ready for analysis", {
            description: "Your image will be analyzed for social media insights.",
            icon: <ImageIcon className="h-5 w-5 text-brand-green" />
          });
        } else {
          console.error("Invalid image data format");
          toast.error("Failed to process image format");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process image");
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      toast.error("Failed to process image");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [onImageUploaded]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };
  
  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Validate file is an image
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      processFile(file); // Process only the first file
    }
  }, [processFile]);

// No need for clear function anymore

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        className={`relative w-full rounded-lg transition-colors ${isDragging ? 'bg-brand-green/10 border-2 border-dashed border-brand-green' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-testid="drag-drop-area"
      >
        <Button
          variant={buttonVariant}
          className={`gap-2 w-full ${buttonClassName} ${isDragging ? 'opacity-50' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          type="button"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing
            </span>
          ) : (
            <>
              <Camera size={16} />
              {isDragging ? "Drop image here" : buttonLabel}
            </>
          )}
        </Button>
        
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-brand-green text-sm font-medium opacity-75">
              Drop image to analyze
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
