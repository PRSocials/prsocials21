import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SocialPlatform } from "utils/socialMediaStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, UploadCloud } from "lucide-react";

type FileUploadFormProps = {
  platform: SocialPlatform;
  onUpload: (file: File, fileType: string) => Promise<void>;
  isUploading: boolean;
};

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  platform,
  onUpload,
  isUploading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedFileTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/json",
    "text/html"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      setError("Please upload a CSV or Excel file");
      setSelectedFile(null);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    try {
      // Get file extension for type determination
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const fileType = fileExtension === 'csv' ? 'csv' : 'excel';
      
      await onUpload(selectedFile, fileType);
      
      // Reset form after successful upload
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(`Upload failed: ${(err as Error).message}`);
    }
  };

  const platformLabels: Record<SocialPlatform, string> = {
    instagram: "Instagram",
    twitter: "Twitter/X",
    facebook: "Facebook",
    tiktok: "TikTok",
    youtube: "YouTube",
    linkedin: "LinkedIn",
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);

    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        setError("Please upload a CSV or Excel file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      setSelectedFile(file);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Upload File</TabsTrigger>
        <TabsTrigger value="instructions">How To Export</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="border-2 border-dashed border-primary/30 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="h-12 w-12 text-primary/50" />
            <p className="text-sm text-center">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground text-center">
              CSV, Excel, JSON or HTML files only (5MB max)
            </p>
            {selectedFile && (
              <div className="mt-2 text-sm font-medium text-primary">
                Selected: {selectedFile.name}
              </div>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx,.json,.html"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={!selectedFile || isUploading}>
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Data
                </>
              )}
            </Button>
          </div>
        </form>
      </TabsContent>
      
      <TabsContent value="instructions" className="pt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">How to Export Data from {platformLabels[platform]}</h3>
          
          {platform === "instagram" && (
            <div className="space-y-2">
              <p className="text-sm">For Instagram Business or Creator accounts:</p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>Go to Instagram.com and log in.</li>
                <li>Click your profile picture (top right), then go to Settings.</li>
                <li>Select Settings & Privacy from the left menu.</li>
                <li>Press On 'Meta - Account Centre'</li>
                <li>Go To 'Your information and permissions'</li>
                <li>Press 'Download Your Information'</li>
                <li>Choose HTML or JSON, and click Next.</li>
                <li>Wait Up To 4 Days & Come Back To Reach Your Target.</li>
              </ol>
              <div className="p-3 bg-primary/10 rounded-md mt-2">
                <p className="text-sm font-medium">Required column names:</p>
                <p className="text-xs mt-1">date, followers, engagement, likes, comments, shares, posts</p>
                <p className="text-xs mt-1">Include daily stats with date columns for better analysis.</p>
              </div>
            </div>
          )}
          
          {platform === "twitter" && (
            <div className="space-y-2">
              <p className="text-sm">For X (Twitter) Data Export:</p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>Open the X app or go to X.com</li>
                <li>Click your profile picture or more {">"}  Settings and privacy.</li>
                <li>Go to Your account {">"}  Download an archive of your data.</li>
                <li>Verify your identity (you might need to enter your password or confirm via email/SMS).</li>
                <li>Click Request archive.</li>
                <li>You'll get an email when your data is ready to download (may take 24 hours or more).</li>
                <li>Come Back To Reach Your Target.</li>
              </ol>
              <div className="p-3 bg-primary/10 rounded-md mt-2">
                <p className="text-sm font-medium">Supported file formats:</p>
                <p className="text-xs mt-1">The archive will contain JSON files with your activity data.</p>
                <p className="text-xs mt-1">Upload the most relevant JSON file containing follower or engagement metrics.</p>
              </div>
            </div>
          )}
          
          {platform === "facebook" && (
            <div className="space-y-2">
              <p className="text-sm">For Facebook Data Export:</p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>Open the Facebook app or go to Facebook.com.</li>
                <li>Go to Settings & privacy {">"}  Settings.</li>
                <li>Click Meta (Account Centre) {">"}  Your information and permissions.</li>
                <li>Select 'Download Your Information'</li>
                <li>Choose Date range, Format (HTML or JSON), and Media quality.</li>
                <li>Select specific data (messages, posts, likes, etc.).</li>
                <li>Click Create File.</li>
                <li>Facebook will notify you when the file is ready to download & Come Back To Reach Your Target.</li>
              </ol>
              <div className="p-3 bg-primary/10 rounded-md mt-2">
                <p className="text-sm font-medium">Supported file formats:</p>
                <p className="text-xs mt-1">The archive will contain JSON or HTML files with your Facebook activity data.</p>
                <p className="text-xs mt-1">Upload the most relevant file containing follower or engagement metrics.</p>
              </div>
            </div>
          )}
          
          {platform === "tiktok" && (
            <div className="space-y-2">
              <p className="text-sm">For TikTok Data Export:</p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>Open TikTok app or go to TikTok.com.</li>
                <li>Tap Profile {">"}  Menu (three lines) {">"}  Settings and privacy.</li>
                <li>Tap Account {">"}  Download your data.</li>
                <li>Choose HTML (readable format) or JSON (machine-readable).</li>
                <li>Tap Request data.</li>
                <li>Wait (it may take a few days), then return to Download data to get your file & Come Back To Reach Your Target.</li>
              </ol>
              <div className="p-3 bg-primary/10 rounded-md mt-2">
                <p className="text-sm font-medium">Supported file formats:</p>
                <p className="text-xs mt-1">The archive will contain JSON or HTML files with your TikTok activity data.</p>
                <p className="text-xs mt-1">Upload the most relevant file containing follower or engagement metrics.</p>
              </div>
            </div>
          )}
          
          {platform === "youtube" && (
            <div className="space-y-2">
              <p className="text-sm">For YouTube Data Export:</p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>Go to Google Takeout.</li>
                <li>Click Deselect all, then scroll down and check YouTube and YouTube Music.</li>
                <li>Click All YouTube data included and choose specific data (history, subscriptions, etc.).</li>
                <li>Click Next step, select delivery method (email link, Google Drive, etc.).</li>
                <li>Choose file type & size (ZIP, .tgz).</li>
                <li>Click Create export.</li>
                <li>Google will email you when your data is ready to download & Come Back To Reach Your Target.</li>
              </ol>
              <div className="p-3 bg-primary/10 rounded-md mt-2">
                <p className="text-sm font-medium">Supported file formats:</p>
                <p className="text-xs mt-1">The archive will contain JSON and HTML files with your YouTube activity data.</p>
                <p className="text-xs mt-1">Upload the most relevant file containing subscriber or engagement metrics.</p>
              </div>
            </div>
          )}
          
          {platform === "linkedin" && (
            <div className="space-y-2">
              <p className="text-sm">For LinkedIn Company Page analytics:</p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>Go to your LinkedIn Company Page</li>
                <li>Click "Analytics" dropdown from the top navigation</li>
                <li>Select the type of analytics you want</li>
                <li>Set your date range</li>
                <li>Click "Export" and choose CSV format</li>
              </ol>
              <div className="p-3 bg-primary/10 rounded-md mt-2">
                <p className="text-sm font-medium">Required column names:</p>
                <p className="text-xs mt-1">date, followers, page_views, unique_visitors, engagement_rate</p>
                <p className="text-xs mt-1">For posts, include post_id, content_type, published_date, impressions, clicks, interactions.</p>
              </div>
            </div>
          )}
          
          <Alert>
            <AlertDescription>
              <span className="font-medium">Required data:</span> Your file should include columns for follower count, engagement, posts, and ideally daily or periodic metrics. See the platform-specific column requirements above.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 p-4 border rounded-md bg-card">
            <h4 className="font-medium mb-2">Expected Data Structure</h4>
            <p className="text-sm mb-2">Your CSV or Excel file should contain:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">Account metrics:</span> Overall follower counts, engagement rates, etc.</li>
              <li><span className="font-medium">Time series data:</span> Daily or weekly metrics with dates</li>
              <li><span className="font-medium">Content performance:</span> Individual post/video performance metrics</li>
            </ul>
            <p className="text-sm mt-3">Not sure how to format your data? Download one of our templates from the Templates tab.</p>
          </div>
          
          <div className="pt-2">
            <Button variant="outline" onClick={() => setActiveTab("upload")}>
              Back to Upload
            </Button>
          </div>
        </div>
      </TabsContent>
      

    </Tabs>
  );
};
