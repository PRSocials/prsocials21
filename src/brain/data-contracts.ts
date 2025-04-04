/** ApifyConnectionCheckResult */
export interface ApifyConnectionCheckResult {
  /** Connected */
  connected: boolean;
  /** Message */
  message: string;
}

/** ApifyConnectionResponse */
export interface ApifyConnectionResponse {
  /** Connected */
  connected: boolean;
  /** Message */
  message: string;
  /** Api Token Configured */
  api_token_configured?: boolean;
  /** Test Actor Available */
  test_actor_available?: boolean;
}

/** Body_analyze_image */
export interface BodyAnalyzeImage {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** Body_upload_social_data */
export interface BodyUploadSocialData {
  /** Platform */
  platform: string;
  /** Userid */
  userId: string;
  /**
   * File
   * @format binary
   */
  file: File;
}

/** ChatHistoryResponse */
export interface ChatHistoryResponse {
  /** History */
  history: object[];
  /** Usage */
  usage: Record<string, number>;
}

/** ChatRequest */
export interface ChatRequest {
  /** Messages */
  messages: Message[];
  /**
   * Stream
   * @default false
   */
  stream?: boolean;
  /** Image Data */
  image_data?: string | null;
}

/** CheckoutSessionRequest */
export interface CheckoutSessionRequest {
  /** Priceid */
  priceId: string;
  /** Successurl */
  successUrl: string;
  /** Cancelurl */
  cancelUrl: string;
}

/** FirebaseStatusResponse */
export interface FirebaseStatusResponse {
  /** Initialized */
  initialized: boolean;
  /** Auth Available */
  auth_available: boolean;
  /** Firestore Available */
  firestore_available: boolean;
  /** Message */
  message: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** ImageGenerationRequest */
export interface ImageGenerationRequest {
  /**
   * Prompt
   * Detailed description of the image you want to generate
   */
  prompt: string;
  /**
   * N
   * Number of images to generate
   * @min 1
   * @max 4
   * @default 1
   */
  n?: number;
  /**
   * Size
   * Size of the image
   * @default "1024x1024"
   */
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  /**
   * Style
   * Image style
   * @default "vivid"
   */
  style?: "vivid" | "natural";
  /**
   * Quality
   * Image quality
   * @default "standard"
   */
  quality?: "standard" | "hd";
  /**
   * Social Purpose
   * The social media purpose for this image (post, story, ad, etc.)
   */
  social_purpose?: string | null;
  /**
   * Brand Identity
   * Brand identity elements to include (colors, style, etc.)
   */
  brand_identity?: string | null;
}

/** ImageGenerationResponse */
export interface ImageGenerationResponse {
  /**
   * Image Urls
   * URLs of the generated images
   */
  image_urls: string[];
  /**
   * Prompt
   * The prompt that was used for generation
   */
  prompt: string;
  /**
   * Enhanced Prompt
   * The PR-enhanced prompt that was used for generation
   */
  enhanced_prompt: string;
}

/** Message */
export interface Message {
  /** Role */
  role: string;
  /** Content */
  content: string;
}

/** PlatformData */
export interface PlatformData {
  /** Followers */
  followers?: number | null;
  /** Following */
  following?: number | null;
  /** Posts */
  posts?: number | null;
  /** Engagement */
  engagement?: number | null;
  /** Growth */
  growth?: number | null;
  /** Views */
  views?: number | null;
  /** Likes */
  likes?: number | null;
  /** Comments */
  comments?: number | null;
  /** Shares */
  shares?: number | null;
  /** Dailystats */
  dailyStats?: object[] | null;
  /** Contentperformance */
  contentPerformance?: object[] | null;
}

/** ScrapeResponse */
export interface ScrapeResponse {
  /** Success */
  success: boolean;
  data?: ScrapedData | null;
  /** Error */
  error?: string | null;
}

/** ScrapeUrlRequest */
export interface ScrapeUrlRequest {
  /** Url */
  url: string;
}

/** ScrapeUrlResponse */
export interface ScrapeUrlResponse {
  /** Success */
  success: boolean;
  /** Message */
  message?: string;
  data?: SocialMediaProfile;
}

/** ScrapedData */
export interface ScrapedData {
  /** Followers */
  followers?: number | null;
  /** Following */
  following?: number | null;
  /** Posts */
  posts?: number | null;
  /** Engagement */
  engagement?: number | null;
  /** Growth */
  growth?: number | null;
  /** Views */
  views?: number | null;
  /** Likes */
  likes?: number | null;
  /** Comments */
  comments?: number | null;
  /** Shares */
  shares?: number | null;
  /** Dailystats */
  dailyStats?: object[] | null;
  /** Contentperformance */
  contentPerformance?: object[] | null;
}

/** SocialDataUploadResponse */
export interface SocialDataUploadResponse {
  /** Success */
  success: boolean;
  data?: PlatformData | null;
  /** Error */
  error?: string | null;
}

/** SocialMediaProfile */
export interface SocialMediaProfile {
  platform: SocialPlatform;
  /** Username */
  username?: string | null;
  /** Profile Url */
  profile_url: string;
  /** Followers */
  followers?: number | null;
  /** Following */
  following?: number | null;
  /** Posts */
  posts?: number | null;
  /** Engagement */
  engagement?: number | null;
  /** Growth */
  growth?: number | null;
  /** Views */
  views?: number | null;
  /** Likes */
  likes?: number | null;
  /** Comments */
  comments?: number | null;
  /** Shares */
  shares?: number | null;
  /** Display Name */
  display_name?: string | null;
  /** Bio */
  bio?: string | null;
  /** Profile Image */
  profile_image?: string | null;
  /** Scrape Date */
  scrape_date?: string | null;
  /** Daily Stats */
  daily_stats?: object[] | null;
  /** Content Performance */
  content_performance?: object[] | null;
  /** Raw Data */
  raw_data?: object | null;
}

/** SocialPlatform */
export enum SocialPlatform {
  Instagram = "instagram",
  Twitter = "twitter",
  Facebook = "facebook",
  Tiktok = "tiktok",
  Youtube = "youtube",
  Linkedin = "linkedin",
}

/** UserListResponse */
export interface UserListResponse {
  /** Success */
  success: boolean;
  /** Users */
  users?: UserProfile[] | null;
  /** Message */
  message?: string | null;
}

/** UserProfile */
export interface UserProfile {
  /** Uid */
  uid: string;
  /** Name */
  name?: string | null;
  /** Email */
  email: string;
  /** Createdat */
  createdAt: string;
  /**
   * Subscription
   * @default "free"
   */
  subscription?: string;
  /**
   * Subscriptionstatus
   * @default "none"
   */
  subscriptionStatus?: string;
  /** Subscriptionid */
  subscriptionId?: string | null;
  /**
   * Chatcount
   * @default 0
   */
  chatCount?: number;
  /**
   * Chatlimit
   * @default 2
   */
  chatLimit?: number;
}

/** UserProfileRequest */
export interface UserProfileRequest {
  /** Uid */
  uid: string;
  /** Email */
  email?: string | null;
  /** Displayname */
  displayName?: string | null;
  /** Photourl */
  photoURL?: string | null;
}

/** UserProfileResponse */
export interface UserProfileResponse {
  /** Success */
  success: boolean;
  profile?: UserProfile | null;
  /** Message */
  message?: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** VerifySessionRequest */
export interface VerifySessionRequest {
  /** Session Id */
  session_id: string;
}

/** ScrapeRequest */
export interface AppApisApifyScraperScrapeRequest {
  /** Platform */
  platform: string;
  /** Username */
  username: string;
  /** Profile Url */
  profile_url?: string | null;
}

/** ScrapeRequest */
export interface AppApisSocialScraperScrapeRequest {
  /** Platform */
  platform: string;
  /** Username */
  username: string;
  /** Profile Url */
  profile_url: string;
}

export type CheckHealthData = HealthResponse;

/** Response Create User Profile */
export type CreateUserProfileData = object;

export type CreateUserProfileError = HTTPValidationError;

export interface GetUserProfileParams {
  /** Uid */
  uid: string;
}

/** Response Get User Profile */
export type GetUserProfileData = object;

export type GetUserProfileError = HTTPValidationError;

/** Update Data */
export type UpdateUserProfilePayload = object;

export interface UpdateUserProfileParams {
  /** Uid */
  uid: string;
}

/** Response Update User Profile */
export type UpdateUserProfileData = object;

export type UpdateUserProfileError = HTTPValidationError;

export interface ListUsersParams {
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
}

/** Response List Users */
export type ListUsersData = object;

export type ListUsersError = HTTPValidationError;

export type CreateUserProfile2Data = UserProfileResponse;

export type GetUserProfile2Data = UserProfileResponse;

export type UpdateUserProfile2Data = UserProfileResponse;

export type UpdateUserProfile2Error = HTTPValidationError;

/** Response List Users2 */
export type ListUsers2Data = object;

export type CreateUserProfile22Data = UserProfileResponse;

export type GetUserProfile22Data = UserProfileResponse;

export type UpdateUserProfile22Data = UserProfileResponse;

export type UpdateUserProfile22Error = HTTPValidationError;

export type ListUsers22Data = UserListResponse;

export type CheckFirebaseStatusData = FirebaseStatusResponse;

/** Response Initialize Firebase Status */
export type InitializeFirebaseStatusData = object;

/** Response Public Stripe Webhook Get Standalone */
export type PublicStripeWebhookGetStandaloneData = Record<string, string>;

/** Response Public Stripe Webhook Post2 */
export type PublicStripeWebhookPost2Data = Record<string, string>;

export type UploadSocialDataData = SocialDataUploadResponse;

export type UploadSocialDataError = HTTPValidationError;

export interface DownloadTemplateParams {
  /** Platform */
  platform: string;
}

export type DownloadTemplateData = any;

export type DownloadTemplateError = HTTPValidationError;

export interface DownloadSampleParams {
  /** Platform */
  platform: string;
}

export type DownloadSampleData = any;

export type DownloadSampleError = HTTPValidationError;

export type RunApifyDiagnosticData = any;

export type CheckApifyConnection2Data = ApifyConnectionCheckResult;

export type CheckApifyConnectionData = ApifyConnectionResponse;

export type ScrapeSocialUrlData = ScrapeUrlResponse;

export type ScrapeSocialUrlError = HTTPValidationError;

export type ScrapeSocialProfileData = ScrapeResponse;

export type ScrapeSocialProfileError = HTTPValidationError;

export type ApifyScrapeSocialProfileData = ScrapeResponse;

export type ApifyScrapeSocialProfileError = HTTPValidationError;

export type GetChatHistoryData = ChatHistoryResponse;

export type ClearChatHistoryData = any;

/** Response Create Checkout Session */
export type CreateCheckoutSessionData = object;

export type CreateCheckoutSessionError = HTTPValidationError;

/** Response Stripe Webhook */
export type StripeWebhookData = Record<string, string>;

/** Response Subscription Plans */
export type SubscriptionPlansData = Record<string, object>;

/** Response My Subscription */
export type MySubscriptionData = object;

/** Response Cancel Subscription */
export type CancelSubscriptionData = Record<string, string>;

/** Response Verify Session */
export type VerifySessionData = Record<string, string>;

export type VerifySessionError = HTTPValidationError;

/** Response Public Stripe Webhook Get */
export type PublicStripeWebhookGetData = Record<string, string>;

/** Response Public Stripe Webhook Post */
export type PublicStripeWebhookPostData = Record<string, string>;

/** Response Create Customer Portal Session */
export type CreateCustomerPortalSessionData = Record<string, string>;

/** Response Public Subscription Plans */
export type PublicSubscriptionPlansData = Record<string, object>;

/** Response Public Stripe Webhook Get2 */
export type PublicStripeWebhookGet2Data = Record<string, string>;

/** Response Public Stripe Webhook */
export type PublicStripeWebhookData = Record<string, string>;

export type GenerateImageData = ImageGenerationResponse;

export type GenerateImageError = HTTPValidationError;

export type AnalyzeImageData = any;

export type AnalyzeImageError = HTTPValidationError;

export type ChatData = any;

export type ChatError = HTTPValidationError;
