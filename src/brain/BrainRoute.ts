import {
  AnalyzeImageData,
  ApifyScrapeSocialProfileData,
  AppApisApifyScraperScrapeRequest,
  AppApisSocialScraperScrapeRequest,
  BodyAnalyzeImage,
  BodyUploadSocialData,
  CancelSubscriptionData,
  ChatData,
  ChatRequest,
  CheckApifyConnection2Data,
  CheckApifyConnectionData,
  CheckFirebaseStatusData,
  CheckHealthData,
  CheckoutSessionRequest,
  ClearChatHistoryData,
  CreateCheckoutSessionData,
  CreateCustomerPortalSessionData,
  CreateUserProfile22Data,
  CreateUserProfile2Data,
  CreateUserProfileData,
  DownloadSampleData,
  DownloadTemplateData,
  GenerateImageData,
  GetChatHistoryData,
  GetUserProfile22Data,
  GetUserProfile2Data,
  GetUserProfileData,
  ImageGenerationRequest,
  InitializeFirebaseStatusData,
  ListUsers22Data,
  ListUsers2Data,
  ListUsersData,
  MySubscriptionData,
  PublicStripeWebhookData,
  PublicStripeWebhookGet2Data,
  PublicStripeWebhookGetData,
  PublicStripeWebhookGetStandaloneData,
  PublicStripeWebhookPost2Data,
  PublicStripeWebhookPostData,
  PublicSubscriptionPlansData,
  RunApifyDiagnosticData,
  ScrapeSocialProfileData,
  ScrapeSocialUrlData,
  ScrapeUrlRequest,
  StripeWebhookData,
  SubscriptionPlansData,
  UpdateUserProfile22Data,
  UpdateUserProfile2Data,
  UpdateUserProfileData,
  UpdateUserProfilePayload,
  UploadSocialDataData,
  UserProfile,
  UserProfileRequest,
  VerifySessionData,
  VerifySessionRequest,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Create a new user profile in Firestore
   * @tags dbtn/module:firebase_admin
   * @name create_user_profile
   * @summary Create User Profile
   * @request POST:/routes/create-user-profile
   */
  export namespace create_user_profile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserProfileRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateUserProfileData;
  }

  /**
   * @description Get a user profile by UID from Firestore
   * @tags dbtn/module:firebase_admin
   * @name get_user_profile
   * @summary Get User Profile
   * @request GET:/routes/get-user-profile/{uid}
   */
  export namespace get_user_profile {
    export type RequestParams = {
      /** Uid */
      uid: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserProfileData;
  }

  /**
   * @description Update a user profile by UID in Firestore
   * @tags dbtn/module:firebase_admin
   * @name update_user_profile
   * @summary Update User Profile
   * @request PUT:/routes/update-user-profile/{uid}
   */
  export namespace update_user_profile {
    export type RequestParams = {
      /** Uid */
      uid: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateUserProfilePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateUserProfileData;
  }

  /**
   * @description List all user profiles with pagination from Firestore Admin only endpoint
   * @tags dbtn/module:firebase_admin
   * @name list_users
   * @summary List Users
   * @request GET:/routes/list-users
   */
  export namespace list_users {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Limit
       * @default 100
       */
      limit?: number;
      /**
       * Offset
       * @default 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListUsersData;
  }

  /**
   * No description
   * @tags dbtn/module:firebase
   * @name create_user_profile2
   * @summary Create User Profile2
   * @request POST:/routes/api/create-user-profile
   */
  export namespace create_user_profile2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CreateUserProfile2Data;
  }

  /**
   * No description
   * @tags dbtn/module:firebase
   * @name get_user_profile2
   * @summary Get User Profile2
   * @request GET:/routes/api/get-user-profile
   */
  export namespace get_user_profile2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserProfile2Data;
  }

  /**
   * No description
   * @tags dbtn/module:firebase
   * @name update_user_profile2
   * @summary Update User Profile2
   * @request POST:/routes/api/update-user-profile
   */
  export namespace update_user_profile2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserProfile;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateUserProfile2Data;
  }

  /**
   * No description
   * @tags dbtn/module:firebase
   * @name list_users2
   * @summary List Users2
   * @request GET:/routes/api/list-users
   */
  export namespace list_users2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListUsers2Data;
  }

  /**
   * No description
   * @tags dbtn/module:user_profiles
   * @name create_user_profile22
   * @summary Create User Profile22
   * @request POST:/routes/api/create-user-profile2
   */
  export namespace create_user_profile22 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CreateUserProfile22Data;
  }

  /**
   * No description
   * @tags dbtn/module:user_profiles
   * @name get_user_profile22
   * @summary Get User Profile22
   * @request GET:/routes/api/get-user-profile2
   */
  export namespace get_user_profile22 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserProfile22Data;
  }

  /**
   * No description
   * @tags dbtn/module:user_profiles
   * @name update_user_profile22
   * @summary Update User Profile22
   * @request POST:/routes/api/update-user-profile2
   */
  export namespace update_user_profile22 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserProfile;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateUserProfile22Data;
  }

  /**
   * No description
   * @tags dbtn/module:user_profiles
   * @name list_users22
   * @summary List Users22
   * @request GET:/routes/api/list-users2
   */
  export namespace list_users22 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListUsers22Data;
  }

  /**
   * @description Check Firebase Admin SDK initialization status
   * @tags dbtn/module:firebase_status
   * @name check_firebase_status
   * @summary Check Firebase Status
   * @request GET:/routes/status
   */
  export namespace check_firebase_status {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckFirebaseStatusData;
  }

  /**
   * @description Check if Firebase Admin SDK is initialized
   * @tags dbtn/module:initialize
   * @name initialize_firebase_status
   * @summary Initialize Firebase Status
   * @request GET:/routes/firebase-status
   */
  export namespace initialize_firebase_status {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = InitializeFirebaseStatusData;
  }

  /**
   * No description
   * @tags public, dbtn/module:public_stripe_webhook
   * @name public_stripe_webhook_get_standalone
   * @summary Public Stripe Webhook Get Standalone
   * @request GET:/routes/public-webhook
   */
  export namespace public_stripe_webhook_get_standalone {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PublicStripeWebhookGetStandaloneData;
  }

  /**
   * No description
   * @tags public, dbtn/module:public_stripe_webhook
   * @name public_stripe_webhook_post2
   * @summary Public Stripe Webhook Post2
   * @request POST:/routes/public-webhook
   */
  export namespace public_stripe_webhook_post2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PublicStripeWebhookPost2Data;
  }

  /**
   * No description
   * @tags dbtn/module:social_data_upload
   * @name upload_social_data
   * @summary Upload Social Data
   * @request POST:/routes/social_data_upload/upload
   */
  export namespace upload_social_data {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyUploadSocialData;
    export type RequestHeaders = {};
    export type ResponseBody = UploadSocialDataData;
  }

  /**
   * @description Download a template file for the specified platform.
   * @tags dbtn/module:template_generator
   * @name download_template
   * @summary Download Template
   * @request GET:/routes/template_generator/download/{platform}
   */
  export namespace download_template {
    export type RequestParams = {
      /** Platform */
      platform: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DownloadTemplateData;
  }

  /**
   * @description Download a sample file for the specified platform.
   * @tags dbtn/module:template_generator
   * @name download_sample
   * @summary Download Sample
   * @request GET:/routes/template_generator/download/{platform}/sample
   */
  export namespace download_sample {
    export type RequestParams = {
      /** Platform */
      platform: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DownloadSampleData;
  }

  /**
   * @description Test endpoint to diagnose Apify API connection issues
   * @tags dbtn/module:apify_diagnostic
   * @name run_apify_diagnostic
   * @summary Run Apify Diagnostic
   * @request GET:/routes/apify-diagnostic/full-diagnostic
   */
  export namespace run_apify_diagnostic {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RunApifyDiagnosticData;
  }

  /**
   * @description Check if Apify API is connected and working properly
   * @tags dbtn/module:app_utils
   * @name check_apify_connection2
   * @summary Check Apify Connection2
   * @request GET:/routes/check-apify-connection2
   */
  export namespace check_apify_connection2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckApifyConnection2Data;
  }

  /**
   * @description Check if Apify API is available and perform a basic test scrape
   * @tags dbtn/module:apify_integration
   * @name check_apify_connection
   * @summary Check Apify Connection
   * @request GET:/routes/apify/check-connection
   */
  export namespace check_apify_connection {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckApifyConnectionData;
  }

  /**
   * No description
   * @tags dbtn/module:apify_integration
   * @name scrape_social_url
   * @summary Scrape Social Url
   * @request POST:/routes/apify/scrape
   */
  export namespace scrape_social_url {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ScrapeUrlRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ScrapeSocialUrlData;
  }

  /**
   * No description
   * @tags dbtn/module:social_scraper
   * @name scrape_social_profile
   * @summary Scrape Social Profile
   * @request POST:/routes/social_scraper/scrape
   */
  export namespace scrape_social_profile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AppApisSocialScraperScrapeRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ScrapeSocialProfileData;
  }

  /**
   * @description Scrape a social media profile using Apify
   * @tags dbtn/module:apify_scraper
   * @name apify_scrape_social_profile
   * @summary Apify Scrape Social Profile
   * @request POST:/routes/apify_scraper/scrape
   */
  export namespace apify_scrape_social_profile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AppApisApifyScraperScrapeRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ApifyScrapeSocialProfileData;
  }

  /**
   * No description
   * @tags dbtn/module:chat
   * @name get_chat_history
   * @summary Get Chat History
   * @request GET:/routes/api/chat/history
   */
  export namespace get_chat_history {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetChatHistoryData;
  }

  /**
   * @description Clear the chat history for the current user
   * @tags dbtn/module:clear_history
   * @name clear_chat_history
   * @summary Clear Chat History
   * @request DELETE:/routes/api/chat/history
   */
  export namespace clear_chat_history {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClearChatHistoryData;
  }

  /**
   * No description
   * @tags dbtn/module:stripe
   * @name create_checkout_session
   * @summary Create Checkout Session
   * @request POST:/routes/api/create-checkout-session
   */
  export namespace create_checkout_session {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CheckoutSessionRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateCheckoutSessionData;
  }

  /**
   * No description
   * @tags dbtn/module:stripe
   * @name stripe_webhook
   * @summary Stripe Webhook
   * @request POST:/routes/api/stripe-webhook
   */
  export namespace stripe_webhook {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = StripeWebhookData;
  }

  /**
   * No description
   * @tags dbtn/module:stripe
   * @name subscription_plans
   * @summary Subscription Plans
   * @request GET:/routes/api/subscription-plans
   */
  export namespace subscription_plans {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SubscriptionPlansData;
  }

  /**
   * No description
   * @tags dbtn/module:stripe
   * @name my_subscription
   * @summary My Subscription
   * @request GET:/routes/api/my-subscription
   */
  export namespace my_subscription {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MySubscriptionData;
  }

  /**
   * No description
   * @tags dbtn/module:stripe
   * @name cancel_subscription
   * @summary Cancel Subscription
   * @request POST:/routes/api/cancel-subscription
   */
  export namespace cancel_subscription {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CancelSubscriptionData;
  }

  /**
   * No description
   * @tags dbtn/module:stripe
   * @name verify_session
   * @summary Verify Session
   * @request POST:/routes/api/verify-session
   */
  export namespace verify_session {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VerifySessionRequest;
    export type RequestHeaders = {};
    export type ResponseBody = VerifySessionData;
  }

  /**
   * No description
   * @tags dbtn/module:stripe
   * @name public_stripe_webhook_get
   * @summary Public Stripe Webhook Get
   * @request GET:/routes/api/public-webhook
   */
  export namespace public_stripe_webhook_get {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PublicStripeWebhookGetData;
  }

  /**
   * No description
   * @tags dbtn/module:stripe
   * @name public_stripe_webhook_post
   * @summary Public Stripe Webhook Post
   * @request POST:/routes/api/public-webhook
   */
  export namespace public_stripe_webhook_post {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PublicStripeWebhookPostData;
  }

  /**
   * No description
   * @tags dbtn/module:stripe
   * @name create_customer_portal_session
   * @summary Create Customer Portal Session
   * @request POST:/routes/api/create-customer-portal
   */
  export namespace create_customer_portal_session {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CreateCustomerPortalSessionData;
  }

  /**
   * @description Public endpoint to get subscription plans without requiring authentication
   * @tags public, dbtn/module:stripe_public_api
   * @name public_subscription_plans
   * @summary Public Subscription Plans
   * @request POST:/routes/plans
   */
  export namespace public_subscription_plans {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PublicSubscriptionPlansData;
  }

  /**
   * @description Public GET endpoint for testing webhook connectivity
   * @tags public, dbtn/module:stripe_public_api
   * @name public_stripe_webhook_get2
   * @summary Public Stripe Webhook Get2
   * @request GET:/routes/webhook
   */
  export namespace public_stripe_webhook_get2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PublicStripeWebhookGet2Data;
  }

  /**
   * @description Public endpoint to handle Stripe webhook events without requiring authentication
   * @tags public, dbtn/module:stripe_public_api
   * @name public_stripe_webhook
   * @summary Public Stripe Webhook
   * @request POST:/routes/webhook
   */
  export namespace public_stripe_webhook {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PublicStripeWebhookData;
  }

  /**
   * No description
   * @tags dbtn/module:image_generation
   * @name generate_image
   * @summary Generate Image
   * @request POST:/routes/generate
   */
  export namespace generate_image {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ImageGenerationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = GenerateImageData;
  }

  /**
   * No description
   * @tags dbtn/module:image_analysis
   * @name analyze_image
   * @summary Analyze Image
   * @request POST:/routes/analyze
   */
  export namespace analyze_image {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyAnalyzeImage;
    export type RequestHeaders = {};
    export type ResponseBody = AnalyzeImageData;
  }

  /**
   * No description
   * @tags stream, dbtn/module:chat
   * @name chat
   * @summary Chat
   * @request POST:/routes/api/chat/
   */
  export namespace chat {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChatRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ChatData;
  }
}
