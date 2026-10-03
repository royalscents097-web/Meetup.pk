export type UserRole = 'customer' | 'companion' | 'admin';

export type Gender = 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';

export type VerificationStatus = 'Pending Verification' | 'Verified' | 'Rejected' | 'Suspended';

export type BookingStatus =
  | 'Pending Payment'
  | 'Paid'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Declined'
  | 'Disputed'
  | 'Refunded';

export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded' | 'Failed' | 'Not Applicable';

export type PayoutStatus = 'Pending' | 'Eligible' | 'Processing' | 'Paid' | 'Failed' | 'Held';

export type ReportStatus = 'Pending' | 'Under Review' | 'Resolved' | 'Dismissed';

export type ReportCategory =
  | 'Sexual Solicitation / Escort'
  | 'Harassment / Inappropriate Behavior'
  | 'Underage User'
  | 'Fraud / Scam'
  | 'Private Location Pressure'
  | 'External Payment Bypass'
  | 'Impersonation'
  | 'No Show'
  | 'Other Safety Concern';

export interface SocialLink {
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn';
  url: string;
  isVerifiedByAdmin: boolean;
  submittedAt: string;
  verifiedAt?: string;
  verifiedByAdminId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  dateOfBirth: string; // YYYY-MM-DD
  age: number;
  phonePrivate: string; // Securely stored, NEVER shown publicly or in search
  isAgeConfirmed: boolean;
  policyAccepted: boolean;
  favorites: string[]; // Companion IDs
  createdAt: string;
  updatedAt?: string;
  isSuspended?: boolean;
}

export interface City {
  id: string;
  name: string;
  province: string;
  isActive: boolean;
  popularAreas: string[];
}

export interface ActivityCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  isPublicOnly: boolean;
}

export interface CompanionProfile {
  id: string; // Relates to User.id
  displayName: string;
  age: number;
  gender: Gender;
  cityId: string;
  cityName: string;
  area: string; // Searchable general area (e.g. Gulberg, DHA, F-7), NEVER exact home address
  bio: string;
  profilePhoto: string;
  professionalCategory: string; // e.g. "Creative & Cultural Guide", "Tech Professional", "Linguistics Tutor"
  languages: string[];
  interests: string[];
  activityIds: string[]; // Activities offered
  activityPricing?: { activityId: string; price: number }[];
  sessionRate: number; // PKR starting rate
  verificationStatus: VerificationStatus;
  verificationDocsSubmitted?: {
    idType: 'CNIC' | 'Passport';
    submittedAt: string;
    documentNumberMasked: string; // e.g. 35201-*****12-3
    statusNote?: string;
  };
  socialLinks: SocialLink[];
  rating: number; // 1-5
  reviewCount: number;
  completedActivitiesCount: number; // e.g. 32 completed activities
  responseRate: string; // e.g. "98%"
  responseTime: string; // e.g. "Within 15 mins"
  joinedDate: string; // e.g. "January 2026"
  availability: {
    weekdays: boolean;
    weekends: boolean;
    timeSlots: string[]; // e.g. ["Afternoon (1PM-5PM)", "Evening (5PM-9PM)"]
  };
  totalBookings: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string; // Format: MUP-YYYYMMDD-XXXX
  customerId: string;
  customerName: string;
  companionId: string;
  companionName: string;
  companionPhoto: string;
  activityId: string;
  activityName: string;
  cityId: string;
  cityName: string;
  publicMeetupVenue: string; // Public venue strictly (e.g. Gloria Jean's Gulberg, Espresso Clifton)
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "16:00"
  durationHours: number;
  grossAmount: number; // PKR
  commissionPercentage: number; // e.g. 10
  platformCommission: number; // PKR
  providerFee?: number; // PKR payment gateway fee
  companionAmount: number; // PKR
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  specialNotes?: string;
  suggestedTime?: string;
  createdAt: string;
  updatedAt: string;
  hasCustomerReviewed?: boolean;
  hasCompanionReviewed?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'customer' | 'companion';
  targetId: string; // Companion or Customer ID
  rating: number; // Overall rating (1-5)
  communicationRating?: number; // 1-5
  reliabilityRating?: number; // 1-5
  activityRating?: number; // 1-5
  safetyRating?: number; // 1-5
  comment: string;
  activityName: string;
  companionReply?: {
    comment: string;
    repliedAt: string;
  };
  isReported?: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: string;
  isFlaggedForBypass?: boolean;
}

export interface FlaggedMessage {
  id: string;
  messageId: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  flaggedText: string;
  detectedPattern: string; // e.g. "Pakistani Phone Number", "External Payment Keyword"
  status: 'pending_review' | 'cleared' | 'warned' | 'suspended';
  createdAt: string;
}

export interface TransactionLedger {
  transaction_id: string;
  booking_id: string;
  customer_id: string;
  companion_id: string;
  gross_amount: number;
  platform_fee: number;
  provider_fee: number;
  net_amount: number;
  currency: 'PKR';
  payment_method: 'EasyPaisa' | 'JazzCash' | 'Card' | 'Bank Transfer';
  status: 'pending' | 'success' | 'refunded' | 'disputed' | 'failed';
  idempotency_key: string;
  created_at: string;
  completed_at?: string;
}

export interface PayoutRecord {
  payout_id: string;
  companion_id: string;
  booking_id: string;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  payout_status: PayoutStatus;
  payout_method: string;
  account_title?: string;
  account_number_masked?: string;
  created_at: string;
  processed_at?: string;
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  bookingId?: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'companion' | 'user' | 'booking' | 'commission' | 'social_link' | 'city' | 'activity';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface CommissionSettings {
  defaultPercentage: number;
  minPercentage: number;
  maxPercentage: number;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventName:
    | 'profile_view'
    | 'search'
    | 'filter_used'
    | 'booking_started'
    | 'payment_started'
    | 'payment_completed'
    | 'booking_completed'
    | 'review_submitted'
    | 'report_submitted';
  properties: Record<string, any>;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'system' | 'safety' | 'verification' | 'payout';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
