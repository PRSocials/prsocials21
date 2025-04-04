import {
  AnalyzeImageData,
  AnalyzeImageError,
  ApifyScrapeSocialProfileData,
  ApifyScrapeSocialProfileError,
  AppApisApifyScraperScrapeRequest,
  AppApisSocialScraperScrapeRequest,
  BodyAnalyzeImage,
  BodyUploadSocialData,
  CancelSubscriptionData,
  ChatData,
  ChatError,
  ChatRequest,
  CheckApifyConnection2Data,
  CheckApifyConnectionData,
  CheckFirebaseStatusData,
  CheckHealthData,
  CheckoutSessionRequest,
  ClearChatHistoryData,
  CreateCheckoutSessionData,
  CreateCheckoutSessionError,
  CreateCustomerPortalSessionData,
  CreateUserProfile22Data,
  CreateUserProfile2Data,
  CreateUserProfileData,
  CreateUserProfileError,
  DownloadSampleData,
  DownloadSampleError,
  DownloadSampleParams,
  DownloadTemplateData,
  DownloadTemplateError,
  DownloadTemplateParams,
  GenerateImageData,
  GenerateImageError,
  GetChatHistoryData,
  GetUserProfile22Data,
  GetUserProfile2Data,
  GetUserProfileData,
  GetUserProfileError,
  GetUserProfileParams,
  ImageGenerationRequest,
  InitializeFirebaseStatusData,
  ListUsers22Data,
  ListUsers2Data,
  ListUsersData,
  ListUsersError,
  ListUsersParams,
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
  ScrapeSocialProfileError,
  ScrapeSocialUrlData,
  ScrapeSocialUrlError,
  ScrapeUrlRequest,
  StripeWebhookData,
  SubscriptionPlansData,
  UpdateUserProfile22Data,
  UpdateUserProfile22Error,
  UpdateUserProfile2Data,
  UpdateUserProfile2Error,
  UpdateUserProfileData,
  UpdateUserProfileError,
  UpdateUserProfileParams,
  UpdateUserProfilePayload,
  UploadSocialDataData,
  UploadSocialDataError,
  UserProfile,
  UserProfileRequest,
  VerifySessionData,
  VerifySessionError,
  VerifySessionRequest,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Create a new user profile in Firestore
   *
   * @tags dbtn/module:firebase_admin
   * @name create_user_profile
   * @summary Create User Profile
   * @request POST:/routes/create-user-profile
   */
  create_user_profile = (data: UserProfileRequest, params: RequestParams = {}) =>
    this.request<CreateUserProfileData, CreateUserProfileError>({
      path: `/routes/create-user-profile`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get a user profile by UID from Firestore
   *
   * @tags dbtn/module:firebase_admin
   * @name get_user_profile
   * @summary Get User Profile
   * @request GET:/routes/get-user-profile/{uid}
   */
  get_user_profile = ({ uid, ...query }: GetUserProfileParams, params: RequestParams = {}) =>
    this.request<GetUserProfileData, GetUserProfileError>({
      path: `/routes/get-user-profile/${uid}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Update a user profile by UID in Firestore
   *
   * @tags dbtn/module:firebase_admin
   * @name update_user_profile
   * @summary Update User Profile
   * @request PUT:/routes/update-user-profile/{uid}
   */
  update_user_profile = (
    { uid, ...query }: UpdateUserProfileParams,
    data: UpdateUserProfilePayload,
    params: RequestParams = {},
  ) =>
    this.request<UpdateUserProfileData, UpdateUserProfileError>({
      path: `/routes/update-user-profile/${uid}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description List all user profiles with pagination from Firestore Admin only endpoint
   *
   * @tags dbtn/module:firebase_admin
   * @name list_users
   * @summary List Users
   * @request GET:/routes/list-users
   */
  list_users = (query: ListUsersParams, params: RequestParams = {}) =>
    this.request<ListUsersData, ListUsersError>({
      path: `/routes/list-users`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:firebase
   * @name create_user_profile2
   * @summary Create User Profile2
   * @request POST:/routes/api/create-user-profile
   */
  create_user_profile2 = (params: RequestParams = {}) =>
    this.request<CreateUserProfile2Data, any>({
      path: `/routes/api/create-user-profile`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:firebase
   * @name get_user_profile2
   * @summary Get User Profile2
   * @request GET:/routes/api/get-user-profile
   */
  get_user_profile2 = (params: RequestParams = {}) =>
    this.request<GetUserProfile2Data, any>({
      path: `/routes/api/get-user-profile`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:firebase
   * @name update_user_profile2
   * @summary Update User Profile2
   * @request POST:/routes/api/update-user-profile
   */
  update_user_profile2 = (data: UserProfile, params: RequestParams = {}) =>
    this.request<UpdateUserProfile2Data, UpdateUserProfile2Error>({
      path: `/routes/api/update-user-profile`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:firebase
   * @name list_users2
   * @summary List Users2
   * @request GET:/routes/api/list-users
   */
  list_users2 = (params: RequestParams = {}) =>
    this.request<ListUsers2Data, any>({
      path: `/routes/api/list-users`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:user_profiles
   * @name create_user_profile22
   * @summary Create User Profile22
   * @request POST:/routes/api/create-user-profile2
   */
  create_user_profile22 = (params: RequestParams = {}) =>
    this.request<CreateUserProfile22Data, any>({
      path: `/routes/api/create-user-profile2`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:user_profiles
   * @name get_user_profile22
   * @summary Get User Profile22
   * @request GET:/routes/api/get-user-profile2
   */
  get_user_profile22 = (params: RequestParams = {}) =>
    this.request<GetUserProfile22Data, any>({
      path: `/routes/api/get-user-profile2`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:user_profiles
   * @name update_user_profile22
   * @summary Update User Profile22
   * @request POST:/routes/api/update-user-profile2
   */
  update_user_profile22 = (data: UserProfile, params: RequestParams = {}) =>
    this.request<UpdateUserProfile22Data, UpdateUserProfile22Error>({
      path: `/routes/api/update-user-profile2`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:user_profiles
   * @name list_users22
   * @summary List Users22
   * @request GET:/routes/api/list-users2
   */
  list_users22 = (params: RequestParams = {}) =>
    this.request<ListUsers22Data, any>({
      path: `/routes/api/list-users2`,
      method: "GET",
      ...params,
    });

  /**
   * @description Check Firebase Admin SDK initialization status
   *
   * @tags dbtn/module:firebase_status
   * @name check_firebase_status
   * @summary Check Firebase Status
   * @request GET:/routes/status
   */
  check_firebase_status = (params: RequestParams = {}) =>
    this.request<CheckFirebaseStatusData, any>({
      path: `/routes/status`,
      method: "GET",
      ...params,
    });

  /**
   * @description Check if Firebase Admin SDK is initialized
   *
   * @tags dbtn/module:initialize
   * @name initialize_firebase_status
   * @summary Initialize Firebase Status
   * @request GET:/routes/firebase-status
   */
  initialize_firebase_status = (params: RequestParams = {}) =>
    this.request<InitializeFirebaseStatusData, any>({
      path: `/routes/firebase-status`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags public, dbtn/module:public_stripe_webhook
   * @name public_stripe_webhook_get_standalone
   * @summary Public Stripe Webhook Get Standalone
   * @request GET:/routes/public-webhook
   */
  public_stripe_webhook_get_standalone = (params: RequestParams = {}) =>
    this.request<PublicStripeWebhookGetStandaloneData, any>({
      path: `/routes/public-webhook`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags public, dbtn/module:public_stripe_webhook
   * @name public_stripe_webhook_post2
   * @summary Public Stripe Webhook Post2
   * @request POST:/routes/public-webhook
   */
  public_stripe_webhook_post2 = (params: RequestParams = {}) =>
    this.request<PublicStripeWebhookPost2Data, any>({
      path: `/routes/public-webhook`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:social_data_upload
   * @name upload_social_data
   * @summary Upload Social Data
   * @request POST:/routes/social_data_upload/upload
   */
  upload_social_data = (data: BodyUploadSocialData, params: RequestParams = {}) =>
    this.request<UploadSocialDataData, UploadSocialDataError>({
      path: `/routes/social_data_upload/upload`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * @description Download a template file for the specified platform.
   *
   * @tags dbtn/module:template_generator
   * @name download_template
   * @summary Download Template
   * @request GET:/routes/template_generator/download/{platform}
   */
  download_template = ({ platform, ...query }: DownloadTemplateParams, params: RequestParams = {}) =>
    this.request<DownloadTemplateData, DownloadTemplateError>({
      path: `/routes/template_generator/download/${platform}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Download a sample file for the specified platform.
   *
   * @tags dbtn/module:template_generator
   * @name download_sample
   * @summary Download Sample
   * @request GET:/routes/template_generator/download/{platform}/sample
   */
  download_sample = ({ platform, ...query }: DownloadSampleParams, params: RequestParams = {}) =>
    this.request<DownloadSampleData, DownloadSampleError>({
      path: `/routes/template_generator/download/${platform}/sample`,
      method: "GET",
      ...params,
    });

  /**
   * @description Test endpoint to diagnose Apify API connection issues
   *
   * @tags dbtn/module:apify_diagnostic
   * @name run_apify_diagnostic
   * @summary Run Apify Diagnostic
   * @request GET:/routes/apify-diagnostic/full-diagnostic
   */
  run_apify_diagnostic = (params: RequestParams = {}) =>
    this.request<RunApifyDiagnosticData, any>({
      path: `/routes/apify-diagnostic/full-diagnostic`,
      method: "GET",
      ...params,
    });

  /**
   * @description Check if Apify API is connected and working properly
   *
   * @tags dbtn/module:app_utils
   * @name check_apify_connection2
   * @summary Check Apify Connection2
   * @request GET:/routes/check-apify-connection2
   */
  check_apify_connection2 = (params: RequestParams = {}) =>
    this.request<CheckApifyConnection2Data, any>({
      path: `/routes/check-apify-connection2`,
      method: "GET",
      ...params,
    });

  /**
   * @description Check if Apify API is available and perform a basic test scrape
   *
   * @tags dbtn/module:apify_integration
   * @name check_apify_connection
   * @summary Check Apify Connection
   * @request GET:/routes/apify/check-connection
   */
  check_apify_connection = (params: RequestParams = {}) =>
    this.request<CheckApifyConnectionData, any>({
      path: `/routes/apify/check-connection`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:apify_integration
   * @name scrape_social_url
   * @summary Scrape Social Url
   * @request POST:/routes/apify/scrape
   */
  scrape_social_url = (data: ScrapeUrlRequest, params: RequestParams = {}) =>
    this.request<ScrapeSocialUrlData, ScrapeSocialUrlError>({
      path: `/routes/apify/scrape`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:social_scraper
   * @name scrape_social_profile
   * @summary Scrape Social Profile
   * @request POST:/routes/social_scraper/scrape
   */
  scrape_social_profile = (data: AppApisSocialScraperScrapeRequest, params: RequestParams = {}) =>
    this.request<ScrapeSocialProfileData, ScrapeSocialProfileError>({
      path: `/routes/social_scraper/scrape`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Scrape a social media profile using Apify
   *
   * @tags dbtn/module:apify_scraper
   * @name apify_scrape_social_profile
   * @summary Apify Scrape Social Profile
   * @request POST:/routes/apify_scraper/scrape
   */
  apify_scrape_social_profile = (data: AppApisApifyScraperScrapeRequest, params: RequestParams = {}) =>
    this.request<ApifyScrapeSocialProfileData, ApifyScrapeSocialProfileError>({
      path: `/routes/apify_scraper/scrape`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:chat
   * @name get_chat_history
   * @summary Get Chat History
   * @request GET:/routes/api/chat/history
   */
  get_chat_history = (params: RequestParams = {}) =>
    this.request<GetChatHistoryData, any>({
      path: `/routes/api/chat/history`,
      method: "GET",
      ...params,
    });

  /**
   * @description Clear the chat history for the current user
   *
   * @tags dbtn/module:clear_history
   * @name clear_chat_history
   * @summary Clear Chat History
   * @request DELETE:/routes/api/chat/history
   */
  clear_chat_history = (params: RequestParams = {}) =>
    this.request<ClearChatHistoryData, any>({
      path: `/routes/api/chat/history`,
      method: "DELETE",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stripe
   * @name create_checkout_session
   * @summary Create Checkout Session
   * @request POST:/routes/api/create-checkout-session
   */
  create_checkout_session = (data: CheckoutSessionRequest, params: RequestParams = {}) =>
    this.request<CreateCheckoutSessionData, CreateCheckoutSessionError>({
      path: `/routes/api/create-checkout-session`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stripe
   * @name stripe_webhook
   * @summary Stripe Webhook
   * @request POST:/routes/api/stripe-webhook
   */
  stripe_webhook = (params: RequestParams = {}) =>
    this.request<StripeWebhookData, any>({
      path: `/routes/api/stripe-webhook`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stripe
   * @name subscription_plans
   * @summary Subscription Plans
   * @request GET:/routes/api/subscription-plans
   */
  subscription_plans = (params: RequestParams = {}) =>
    this.request<SubscriptionPlansData, any>({
      path: `/routes/api/subscription-plans`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stripe
   * @name my_subscription
   * @summary My Subscription
   * @request GET:/routes/api/my-subscription
   */
  my_subscription = (params: RequestParams = {}) =>
    this.request<MySubscriptionData, any>({
      path: `/routes/api/my-subscription`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stripe
   * @name cancel_subscription
   * @summary Cancel Subscription
   * @request POST:/routes/api/cancel-subscription
   */
  cancel_subscription = (params: RequestParams = {}) =>
    this.request<CancelSubscriptionData, any>({
      path: `/routes/api/cancel-subscription`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stripe
   * @name verify_session
   * @summary Verify Session
   * @request POST:/routes/api/verify-session
   */
  verify_session = (data: VerifySessionRequest, params: RequestParams = {}) =>
    this.request<VerifySessionData, VerifySessionError>({
      path: `/routes/api/verify-session`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stripe
   * @name public_stripe_webhook_get
   * @summary Public Stripe Webhook Get
   * @request GET:/routes/api/public-webhook
   */
  public_stripe_webhook_get = (params: RequestParams = {}) =>
    this.request<PublicStripeWebhookGetData, any>({
      path: `/routes/api/public-webhook`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stripe
   * @name public_stripe_webhook_post
   * @summary Public Stripe Webhook Post
   * @request POST:/routes/api/public-webhook
   */
  public_stripe_webhook_post = (params: RequestParams = {}) =>
    this.request<PublicStripeWebhookPostData, any>({
      path: `/routes/api/public-webhook`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stripe
   * @name create_customer_portal_session
   * @summary Create Customer Portal Session
   * @request POST:/routes/api/create-customer-portal
   */
  create_customer_portal_session = (params: RequestParams = {}) =>
    this.request<CreateCustomerPortalSessionData, any>({
      path: `/routes/api/create-customer-portal`,
      method: "POST",
      ...params,
    });

  /**
   * @description Public endpoint to get subscription plans without requiring authentication
   *
   * @tags public, dbtn/module:stripe_public_api
   * @name public_subscription_plans
   * @summary Public Subscription Plans
   * @request POST:/routes/plans
   */
  public_subscription_plans = (params: RequestParams = {}) =>
    this.request<PublicSubscriptionPlansData, any>({
      path: `/routes/plans`,
      method: "POST",
      ...params,
    });

  /**
   * @description Public GET endpoint for testing webhook connectivity
   *
   * @tags public, dbtn/module:stripe_public_api
   * @name public_stripe_webhook_get2
   * @summary Public Stripe Webhook Get2
   * @request GET:/routes/webhook
   */
  public_stripe_webhook_get2 = (params: RequestParams = {}) =>
    this.request<PublicStripeWebhookGet2Data, any>({
      path: `/routes/webhook`,
      method: "GET",
      ...params,
    });

  /**
   * @description Public endpoint to handle Stripe webhook events without requiring authentication
   *
   * @tags public, dbtn/module:stripe_public_api
   * @name public_stripe_webhook
   * @summary Public Stripe Webhook
   * @request POST:/routes/webhook
   */
  public_stripe_webhook = (params: RequestParams = {}) =>
    this.request<PublicStripeWebhookData, any>({
      path: `/routes/webhook`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:image_generation
   * @name generate_image
   * @summary Generate Image
   * @request POST:/routes/generate
   */
  generate_image = (data: ImageGenerationRequest, params: RequestParams = {}) =>
    this.request<GenerateImageData, GenerateImageError>({
      path: `/routes/generate`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:image_analysis
   * @name analyze_image
   * @summary Analyze Image
   * @request POST:/routes/analyze
   */
  analyze_image = (data: BodyAnalyzeImage, params: RequestParams = {}) =>
    this.request<AnalyzeImageData, AnalyzeImageError>({
      path: `/routes/analyze`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * No description
   *
   * @tags stream, dbtn/module:chat
   * @name chat
   * @summary Chat
   * @request POST:/routes/api/chat/
   */
  chat = (data: ChatRequest, params: RequestParams = {}) =>
    this.requestStream<ChatData, ChatError>({
      path: `/routes/api/chat/`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
