import { firebaseApp } from "app";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// Initialize Firestore
export const db = getFirestore(firebaseApp);

// Helper for getting a user reference
export const getUserRef = (userId: string) => {
  return doc(db, "users", userId);
};

// Create initial user profile
export const createUserProfile = async (user: User) => {
  try {
    const userRef = getUserRef(user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user profile
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        subscription: "free",
        chatCount: 0,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        settings: {}
      });
      console.log("Created new user profile in Firestore");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const userRef = getUserRef(userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, data: any) => {
  try {
    const userRef = getUserRef(userId);
    await updateDoc(userRef, data);
    console.log("Updated user profile");
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Subscribe to user profile changes
export const subscribeToUserProfile = (userId: string, callback: (data: DocumentData | null) => void) => {
  const userRef = getUserRef(userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error subscribing to user profile:", error);
    callback(null);
  });
};

// Get subscription plans
export const getSubscriptionPlans = async () => {
  try {
    const plansCollection = collection(db, "plans");
    const plansSnapshot = await getDoc(doc(plansCollection, "plans_list"));
    
    if (plansSnapshot.exists()) {
      return plansSnapshot.data().plans;
    }
    
    // Fallback plans if not found in Firestore
    return [
      {
        id: "free_trial",
        name: "Free Trial",
        price: 0,
        priceId: null,
        description: "Try out PRSocials with limited features",
        chatLimit: 2,
        features: [
          "2 Chats/Month",
          "Chat/Email Support"
        ],
        model: "standard",
        recommended: false,
        order: 1
      },
      {
        id: "beginner",
        name: "Beginner",
        price: 4.99,
        priceId: "price_TEST_BEGINNER",
        description: "Perfect for starting your social media journey",
        chatLimit: 20,
        features: [
          "Standard AI Model: Quick PR tips for social media",
          "Access Free Community: Join a PRSocials community for peer support and tips",
          "Support Weekdays: Chat/Email support Monday–Friday - 9 AM–5 PM"
        ],
        model: "standard",
        recommended: false,
        order: 2
      },
      {
        id: "influencer",
        name: "Influencer",
        price: 9.99,
        priceId: "price_TEST_INFLUENCER",
        description: "For growing influencers seeking more features",
        chatLimit: 50,
        features: [
          "Everything From Cheaper Plans",
          "Extended Limits",
          "Support Weekdays: Chat/Email support Monday–Friday - Non-Stop",
          "Access to Influencers Chats: View (read-only) curated influencer Q&A threads monthly"
        ],
        model: "standard",
        recommended: true,
        order: 3
      },
      {
        id: "corporate",
        name: "Corporate",
        price: 19.99,
        priceId: "price_TEST_CORPORATE",
        description: "For businesses and marketing teams",
        chatLimit: 30,
        features: [
          "Everything From Cheaper Plans",
          "Ultra AI Model: Advanced PR strategies with smarter, detailed responses",
          "Access Free Community: Full participation (post and reply) in the community",
          "Support Non-Stop: 24/7 Email/Chat support for quick help anytime",
          "Access to Influencers Chats: Join monthly live influencer chats (ask questions, limited spots)"
        ],
        model: "ultra",
        recommended: false,
        order: 4
      },
      {
        id: "mastermind",
        name: "Mastermind",
        price: 39.99,
        priceId: "price_TEST_MASTERMIND", 
        description: "Complete access to all PRSocials features",
        chatLimit: 100,
        features: [
          "Ultra AI Model: Expert-level PR playbooks and tailored advice",
          "Access Free Community: VIP status in the community (badge, priority replies)",
          "Support Non-Stop: 24/7 VIP support with faster responses (Chat/Email)",
          "Human Advisor: 30-minute monthly call with a PR expert for strategy",
          "Access to Influencers Chats: Full access to all influencer chats + exclusive quarterly events"
        ],
        model: "ultra",
        recommended: false,
        order: 5
      }
    ];
  } catch (error) {
    console.error("Error getting subscription plans:", error);
    // Return fallback plans
    return [];
  }
};

// Subscribe to auth state changes and create user profile if needed
export const initializeUserProfile = (callback: (user: User | null) => void) => {
  const auth = getAuth(firebaseApp);
  
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Attempt to create user profile (will only create if doesn't exist)
        await createUserProfile(user);
      } catch (error) {
        console.error("Error initializing user profile:", error);
      }
    }
    callback(user);
  });
};
