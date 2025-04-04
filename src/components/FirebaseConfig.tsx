import { useEffect, useState } from "react";
import brain from "brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface FirebaseStatusResponse {
  initialized: boolean;
  auth_available: boolean;
  firestore_available: boolean;
  message: string;
}

export function FirebaseConfig() {
  const [status, setStatus] = useState<FirebaseStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkFirebaseStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await brain.check_firebase_status();
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error("Error checking Firebase status:", err);
      setError("Failed to check Firebase status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Firebase Configuration Status</CardTitle>
        <CardDescription>
          Check the status of your Firebase configuration and resolve any issues to ensure proper functioning of the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        ) : status ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Firebase SDK Initialized:</span>
                {status.initialized ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Auth Service Available:</span>
                {status.auth_available ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Firestore Service Available:</span>
                {status.firestore_available ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Status Message:</h3>
              <div className={`p-3 rounded-md ${status.initialized && status.auth_available && status.firestore_available ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                <div className="flex items-start">
                  {status.initialized && status.auth_available && status.firestore_available ? (
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              </div>
            </div>

            {(!status.initialized || !status.auth_available || !status.firestore_available) && (
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">Configuration Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-700">
                  <li>Ensure your Firebase service account key is correctly added to Databutton secrets</li>
                  <li>Check that the Firebase project has Firestore database enabled</li>
                  <li>Verify that Firebase Authentication is enabled with the desired providers</li>
                  <li>Update your Firestore security rules to allow proper access</li>
                </ol>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={checkFirebaseStatus} disabled={loading}>
          {loading ? "Checking..." : "Refresh Status"}
        </Button>
      </CardFooter>
    </Card>
  );
}
