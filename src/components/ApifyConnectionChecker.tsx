import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import brain from "brain";

interface Props {
  onConnectionChange?: (isConnected: boolean) => void;
}

const ApifyConnectionChecker = ({ onConnectionChange }: Props) => {
  const [status, setStatus] = useState<"idle" | "checking" | "connected" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const checkConnection = async () => {
    setStatus("checking");
    setMessage("Checking Apify connection...");
    
    try {
      const response = await brain.check_apify_connection();
      const data = await response.json();
      
      if (data.connected) {
        setStatus("connected");
        onConnectionChange?.(true);
      } else {
        setStatus("error");
        onConnectionChange?.(false);
      }
      
      setMessage(data.message);
    } catch (error) {
      setStatus("error");
      setMessage(`Error checking connection: ${error instanceof Error ? error.message : String(error)}`);
      onConnectionChange?.(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === "connected" && <CheckCircle className="text-green-500" size={20} />}
          {status === "error" && <XCircle className="text-red-500" size={20} />}
          {status === "idle" && <AlertCircle className="text-amber-500" size={20} />}
          {status === "checking" && <Loader2 className="text-blue-500 animate-spin" size={20} />}
          Apify Integration Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status !== "idle" && (
          <Alert className={`mb-4 ${status === "connected" ? "bg-green-50 dark:bg-green-950/30" : 
                            status === "error" ? "bg-red-50 dark:bg-red-950/30" : 
                            "bg-amber-50 dark:bg-amber-950/30"}`}>
            <AlertTitle>
              {status === "connected" ? "Connection Successful" : 
               status === "error" ? "Connection Failed" : 
               "Checking Connection..."}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={checkConnection} 
            disabled={status === "checking"}
            variant={status === "connected" ? "outline" : "default"}
          >
            {status === "checking" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === "idle" && "Check Connection"}
            {status === "connected" && "Check Again"}
            {status === "error" && "Retry Connection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ApifyConnectionChecker };
