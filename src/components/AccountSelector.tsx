import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocialMediaStore } from "utils/socialMediaStore";
import { useUserGuardContext } from "app";

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountSelect: (accountId: string) => void;
}

export const AccountSelector: React.FC<Props> = ({ open, onOpenChange, onAccountSelect }) => {
  const { user } = useUserGuardContext();
  const { accounts, isLoading, selectedAccountId, setSelectedAccountId, subscribeToAccounts } = useSocialMediaStore();
  const navigate = useNavigate();
  const [selection, setSelection] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid && open) {
      const unsubscribe = subscribeToAccounts(user.uid);
      return () => unsubscribe();
    }
  }, [user?.uid, open, subscribeToAccounts]);

  useEffect(() => {
    // Initialize with currently selected account
    setSelection(selectedAccountId);
  }, [selectedAccountId, open]);

  const handleSelect = () => {
    if (selection) {
      onAccountSelect(selection);
      toast.success("Account selected for personalized PR advice");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="mb-2">Select Account for PR Advice</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="py-6">
            <p className="text-center mb-4">No social media accounts connected.</p>
            <div className="flex justify-center">
              <Button onClick={() => navigate("/connect-accounts")}>\n                Connect an Account\n              </Button>
            </div>
          </div>
        ) : (
          <RadioGroup
            value={selection || ""}
            onValueChange={setSelection}
            className="flex flex-col gap-3 py-4"
          >
            {accounts.map((account) => (
              <div 
                key={account.id} 
                className="flex items-start space-x-3 border border-border rounded-lg p-3 hover:bg-accent/30 transition-colors"
              >
                <RadioGroupItem value={account.id} id={account.id} className="mt-1" />
                <Label htmlFor={account.id} className="flex-1 cursor-pointer">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">@{account.username}</span>
                      <Badge variant="outline" className="capitalize">
                        {account.platform}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      {account.platformData?.followers?.toLocaleString() || "--"} followers
                    </div>
                    {account.platformData?.engagement && (
                      <div className="text-muted-foreground text-sm">
                        {account.platformData.engagement}% engagement
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <DialogFooter>
          <Button
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSelect}
            disabled={!selection || isLoading || accounts.length === 0}
          >
            Select Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
