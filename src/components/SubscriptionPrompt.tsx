import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  feature?: string;
}

export const SubscriptionPrompt: React.FC<Props> = ({
  isOpen,
  onClose,
  title = "Upgrade Required",
  message = "This feature is only available for paid subscribers.",
  feature = "feature",
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate("/subscription");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="border-green-600/50 bg-black/95">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-green-500">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-300">
            <p className="mb-4">{message}</p>
            <p className="mb-2">Upgrade your plan to unlock:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Advanced analytics and reporting</li>
              <li>Connect multiple social media accounts</li>
              <li>Premium AI-powered PR recommendations</li>
              <li>And much more...</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3">
          <AlertDialogAction
            className="bg-gray-700 hover:bg-gray-600 text-white"
            onClick={onClose}
          >
            Maybe Later
          </AlertDialogAction>
          <AlertDialogAction
            className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-semibold shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300 border-0"
            onClick={handleUpgrade}
          >
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
