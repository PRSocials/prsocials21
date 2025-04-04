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

interface MaintenanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const MaintenanceDialog = ({ isOpen, onClose, title, message }: MaintenanceDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="border-green-600/50 bg-black/95">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-green-500">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-300">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-semibold shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300 border-0"
            onClick={onClose}
          >
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
