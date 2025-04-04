import React from "react";
import { FirebaseConfig } from "components/FirebaseConfig";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

export default function ConfigPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">System Configuration</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <div className="space-y-8">
          <FirebaseConfig />
          
          {/* You can add more configuration sections here as needed */}
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
            <h3 className="font-medium mb-2">Firebase Configuration Instructions</h3>
            <p className="mb-4">
              To properly configure Firebase for PRSocials, follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to the Firebase Console at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.firebase.google.com</a></li>
              <li>Select your PRSocials project</li>
              <li>Set up Authentication with Email/Password and Google providers</li>
              <li>Enable Firestore Database</li>
              <li>Set up proper Firestore security rules (see example below)</li>
              <li>Generate a new service account key (Project Settings → Service accounts)</li>
              <li>Add the service account key JSON to Databutton secrets with the key "FIREBASE_SERVICE_ACCOUNT"</li>
            </ol>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Example Firestore Security Rules</h4>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto text-sm">
                {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read their own chats
    match /chats/{chatId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Allow authenticated users to read subscription plans
    match /plans/{planId} {
      allow read: if request.auth != null;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-card p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Firebase Configuration Guide</h2>
        
        <Alert className="mb-4 bg-amber-500/10 text-amber-500 border-amber-500/50">
          <AlertTitle className="font-bold">Firebase Security Rules Required</AlertTitle>
          <AlertDescription>
            If you're seeing "Firebase not available" or "Missing or insufficient permissions" errors, 
            you need to update your Firebase Firestore security rules.
          </AlertDescription>
        </Alert>
        
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Required Firestore Security Rules</h3>
          <p className="mb-2">Copy and paste these rules in your Firebase Console:</p>
          <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own profile data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own customer data
    match /customers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own social media accounts
    match /social_accounts/{accountId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Add other collection rules as needed
  }
}`}          </div>
        
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">How to Update Firebase Security Rules</h3>
            
            <div className="mb-4 flex space-x-3">
              <Button 
                onClick={() => window.open('https://console.firebase.google.com', '_blank')}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Open Firebase Console
              </Button>
              
              <Button 
                onClick={() => window.open('https://console.firebase.google.com/project/_/firestore/rules', '_blank')}
                variant="outline"
                className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
              >
                Go Directly to Firestore Rules
              </Button>
            </div>
            
            <ol className="list-decimal pl-6 space-y-2">
              
              <li>Go to the <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Firebase Console</a></li>
              
              <li>Select your project</li>
              
              <li>Navigate to <strong>Firestore Database</strong> in the left sidebar</li>
              
              <li>Click on the <strong>Rules</strong> tab</li>
              
              <li>Replace the existing rules with the ones provided above</li>
              
              <li>Click <strong>Publish</strong></li>
              
              <li>Refresh this page to confirm the changes are working</li>
            
            </ol>
          </div>
        </div>
      </div>
    
    </div>
  );
}
