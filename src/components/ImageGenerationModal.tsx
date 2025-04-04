// This file is kept for reference but will no longer be used directly in the app
// The image generation functionality is now integrated directly into the Chat component

// This file is kept for reference but will no longer be used directly in the app
// The image generation functionality is now integrated directly into the Chat component

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImageIcon } from "lucide-react";
import brain from "brain";
import { toast } from "sonner";

export interface Props {
  onImageGenerated: (imageUrls: string[], prompt: string) => void;
  buttonLabel?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonClassName?: string;
}

export const ImageGenerationModal = ({
  onImageGenerated,
  buttonLabel = "Generate Image",
  buttonVariant = "secondary",
  buttonClassName = "",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [socialPurpose, setSocialPurpose] = useState<string>("");
  const [brandIdentity, setBrandIdentity] = useState<string>("");
  const [size, setSize] = useState<string>("1024x1024");
  const [style, setStyle] = useState<string>("vivid");
  const [quality, setQuality] = useState<string>("standard");
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt || prompt.trim() === "") {
      toast.error("Please enter a prompt for the image");
      return;
    }

    setLoading(true);
    setPreviewImages([]);

    try {
      const response = await brain.generate_image({
        prompt,
        n: 1,
        size,
        style,
        quality,
        social_purpose: socialPurpose || undefined,
        brand_identity: brandIdentity || undefined,
      });

      const result = await response.json();
      setPreviewImages(result.image_urls);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseImages = () => {
    if (previewImages.length > 0) {
      onImageGenerated(previewImages, prompt);
      setOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setPrompt("");
    setSocialPurpose("");
    setBrandIdentity("");
    setSize("1024x1024");
    setStyle("vivid");
    setQuality("standard");
    setPreviewImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          className={`gap-2 ${buttonClassName}`}
          onClick={() => {
            setOpen(true);
            resetForm();
          }}
        >
          <ImageIcon size={16} />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Image for Social Media</DialogTitle>
          <DialogDescription>
            Create AI-generated images optimized for your social media content
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="prompt">Image Description</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what you want to see in the image..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="socialPurpose">Social Media Purpose</Label>
              <Select
                value={socialPurpose}
                onValueChange={setSocialPurpose}
              >
                <SelectTrigger id="socialPurpose">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any purpose</SelectItem>
                  <SelectItem value="post">Regular Post</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="ad">Advertisement</SelectItem>
                  <SelectItem value="profile">Profile Picture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="size">Image Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">Square (1024×1024)</SelectItem>
                  <SelectItem value="1792x1024">Landscape (1792×1024)</SelectItem>
                  <SelectItem value="1024x1792">Portrait (1024×1792)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vivid">Vivid</SelectItem>
                  <SelectItem value="natural">Natural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quality">Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger id="quality">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="hd">HD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="brandIdentity">Brand Identity (Optional)</Label>
            <Input
              id="brandIdentity"
              placeholder="Brand colors, style, tone, etc."
              value={brandIdentity}
              onChange={(e) => setBrandIdentity(e.target.value)}
            />
          </div>

          {previewImages.length > 0 && (
            <div className="grid gap-2 mt-4">
              <Label>Preview</Label>
              <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto p-2 bg-secondary/20 rounded-md">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                    <img
                      src={url}
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {previewImages.length > 0 ? (
            <Button
              type="button"
              onClick={handleUseImages}
              className="w-full sm:w-auto" 
              disabled={loading}
            >
              Use Image{previewImages.length > 1 ? "s" : ""}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleGenerate}
              className="w-full sm:w-auto gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Generate
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (previewImages.length > 0) {
                setPreviewImages([]);
              } else {
                setOpen(false);
              }
            }}
            className="w-full sm:w-auto"
            disabled={loading}
          >
            {previewImages.length > 0 ? "Try Another" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
