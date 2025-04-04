import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialPlatform } from "utils/socialMediaStore";
import { InfoIcon } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  profileUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  platform: z.string(),
  useRealData: z.boolean().default(true),
});

interface ConnectAccountFormProps {
  selectedPlatform: SocialPlatform;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting?: boolean;
}

export const ConnectAccountForm: React.FC<ConnectAccountFormProps> = ({
  selectedPlatform,
  onSubmit,
  isSubmitting = false,
}) => {
  const [useRealData, setUseRealData] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      profileUrl: "",
      platform: selectedPlatform,
      useRealData: true,
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({ ...values, useRealData });
  }

  const platformLabels: Record<SocialPlatform, string> = {
    instagram: "Instagram",
    twitter: "Twitter/X",
    facebook: "Facebook",
    tiktok: "TikTok",
    youtube: "YouTube",
    linkedin: "LinkedIn",
  };

  const platformUrlExamples: Record<SocialPlatform, string> = {
    instagram: "https://www.instagram.com/username",
    twitter: "https://twitter.com/username",
    facebook: "https://www.facebook.com/username",
    tiktok: "https://www.tiktok.com/@username",
    youtube: "https://www.youtube.com/@username",
    linkedin: "https://www.linkedin.com/in/username",
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <input type="hidden" {...register("platform")} value={selectedPlatform} />

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder={`Your ${selectedPlatform} username`}
              {...register("username", { required: true })}
            />
            {errors.username && (
              <p className="text-xs text-destructive mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="profileUrl">Profile URL</Label>
            <Input
              id="profileUrl"
              placeholder={platformUrlExamples[selectedPlatform]}
              {...register("profileUrl", { required: true })}
            />
            <p className="text-xs text-muted-foreground">
              Provide the full URL to your profile for data scraping
            </p>
            {errors.profileUrl && (
              <p className="text-xs text-destructive mt-1">
                {errors.profileUrl.message}
              </p>
            )}
          </div>


        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : "Connect Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
