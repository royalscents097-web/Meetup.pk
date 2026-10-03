import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  CompanionProfile,
  City,
  ActivityCategory,
  Booking,
  Review,
  Message,
  SafetyReport,
  CommissionSettings,
  NotificationItem,
  TransactionLedger,
  PayoutRecord,
  AuditLog,
  FlaggedMessage,
  UserRole,
  VerificationStatus,
  BookingStatus,
  PaymentStatus,
  PayoutStatus,
  ReportStatus,
  ReportCategory,
  SocialLink
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_COMPANION_PROFILES,
  INITIAL_CITIES,
  INITIAL_ACTIVITIES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_MESSAGES,
  INITIAL_REPORTS,
  INITIAL_COMMISSION,
  INITIAL_TRANSACTIONS,
  INITIAL_PAYOUTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_FLAGGED_MESSAGES
} from '../data/initialData';
import { PaymentService, PaymentIntent } from '../services/paymentService';
import { AntiBypassService } from '../services/antiBypassService';
import { AnalyticsService } from '../services/analytics';

interface AppContextType {
  currentUser: User;
  users: User[];
  currentRole: UserRole;
  companionProfiles: CompanionProfile[];
  cities: City[];
  activities: ActivityCategory[];
  bookings: Booking[];
  transactions: TransactionLedger[];
  payouts: PayoutRecord[];
  reviews: Review[];
  messages: Message[];
  reports: SafetyReport[];
  auditLogs: AuditLog[];
  flaggedMessages: FlaggedMessage[];
  blockedUserIds: string[];
  commissionSettings: CommissionSettings;
  notifications: NotificationItem[];
  selectedCityId: string;
  setSelectedCityId: (id: string) => void;
  // User Actions
  switchUser: (userId: string) => void;
  registerUser: (userData: {
    name: string;
    email: string;
    role: UserRole;
    dateOfBirth: string;
    phonePrivate: string;
    isAgeConfirmed: boolean;
    policyAccepted: boolean;
  }) => { success: boolean; error?: string };
  toggleFavorite: (companionId: string) => void;
  updateProfile: (profileData: Partial<CompanionProfile>) => void;
  submitVerification: (docType: 'CNIC' | 'Passport', docNumber: string) => void;
  submitSocialLink: (platform: SocialLink['platform'], url: string) => void;
  // Booking & Payment Actions
  createBooking: (params: {
    companionId: string;
    activityId: string;
    cityId: string;
    date: string;
    startTime: string;
    durationHours: number;
    publicMeetupVenue: string;
    specialNotes?: string;
  }) => { success: boolean; bookingId?: string; error?: string };
  completeBookingPayment: (params: {
    bookingId: string;
    paymentMethod: 'EasyPaisa' | 'JazzCash' | 'Card' | 'Bank Transfer';
  }) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  updateBookingStatus: (bookingId: string, status: BookingStatus, suggestedTime?: string) => void;
  updatePaymentStatus: (bookingId: string, paymentStatus: PaymentStatus) => void;
  // Messaging Actions
  sendMessage: (bookingId: string, text: string) => { success: boolean; flagged?: boolean };
  // Review Actions
  addReview: (params: {
    bookingId: string;
    targetId: string;
    rating: number;
    communicationRating?: number;
    reliabilityRating?: number;
    activityRating?: number;
    safetyRating?: number;
    comment: string;
    activityName: string;
  }) => { success: boolean; error?: string };
  replyToReview: (reviewId: string, comment: string) => void;
  reportReview: (reviewId: string) => void;
  // Safety Actions
  submitReport: (params: {
    reportedUserId: string;
    reportedUserName: string;
    category: ReportCategory;
    description: string;
    bookingId?: string;
  }) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  // Admin Governance Actions
  adminUpdateCommission: (percentage: number) => void;
  adminAddCity: (name: string, province: string, areas: string[]) => void;
  adminToggleCity: (cityId: string) => void;
  adminAddCityArea: (cityId: string, areaName: string) => void;
  adminAddActivity: (name: string, description: string, icon: string) => void;
  adminToggleActivity: (activityId: string) => void;
  adminVerifyCompanion: (companionId: string, status: VerificationStatus, note?: string) => void;
  adminVerifySocialLink: (companionId: string, platform: string, verify: boolean) => void;
  adminUpdateReport: (reportId: string, status: ReportStatus, notes?: string) => void;
  adminResolveFlaggedMessage: (flaggedId: string, action: 'cleared' | 'warned' | 'suspended') => void;
  adminDeleteReview: (reviewId: string) => void;
  adminSuspendUser: (userId: string) => void;
  adminUpdatePayoutStatus: (payoutId: string, status: PayoutStatus) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mup_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('mup_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // Default to Hamza (customer)
  });

  const [companionProfiles, setCompanionProfiles] = useState<CompanionProfile[]>(() => {
    const saved = localStorage.getItem('mup_companion_profiles');
    return saved ? JSON.parse(saved) : INITIAL_COMPANION_PROFILES;
  });

  const [cities, setCities] = useState<City[]>(() => {
    const saved = localStorage.getItem('mup_cities');
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  const [activities, setActivities] = useState<ActivityCategory[]>(() => {
    const saved = localStorage.getItem('mup_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('mup_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [transactions, setTransactions] = useState<TransactionLedger[]>(() => {
    const saved = localStorage.getItem('mup_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [payouts, setPayouts] = useState<PayoutRecord[]>(() => {
    const saved = localStorage.getItem('mup_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mup_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('mup_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reports, setReports] = useState<SafetyReport[]>(() => {
    const saved = localStorage.getItem('mup_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('mup_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>(() => {
    const saved = localStorage.getItem('mup_flagged_messages');
    return saved ? JSON.parse(saved) : INITIAL_FLAGGED_MESSAGES;
  });

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mup_blocked_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings>(() => {
    const saved = localStorage.getItem('mup_commission');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSION;
  });

  const [selectedCityId, setSelectedCityId] = useState<string>('all');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: currentUser.id,
      title: 'Welcome to MeetUp.pk',
      message: 'Remember: All meetups must strictly take place in public venues (cafes, restaurants, tours).',
      type: 'safety',
      read: false,
      createdAt: new Date().toISOString()
    }
  ]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('mup_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('mup_current_user', JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem('mup_companion_profiles', JSON.stringify(companionProfiles));
  }, [companionProfiles]);
  useEffect(() => {
    localStorage.setItem('mup_cities', JSON.stringify(cities));
  }, [cities]);
  useEffect(() => {
    localStorage.setItem('mup_activities', JSON.stringify(activities));
  }, [activities]);
  useEffect(() => {
    localStorage.setItem('mup_bookings', JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem('mup_transactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('mup_payouts', JSON.stringify(payouts));
  }, [payouts]);
  useEffect(() => {
    localStorage.setItem('mup_reviews', JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem('mup_messages', JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem('mup_reports', JSON.stringify(reports));
  }, [reports]);
  useEffect(() => {
    localStorage.setItem('mup_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('mup_flagged_messages', JSON.stringify(flaggedMessages));
  }, [flaggedMessages]);
  useEffect(() => {
    localStorage.setItem('mup_blocked_users', JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);
  useEffect(() => {
    localStorage.setItem('mup_commission', JSON.stringify(commissionSettings));
  }, [commissionSettings]);

  const logAudit = (
    action: string,
    targetType: AuditLog['targetType'],
    targetId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const calculateAge = (dobString: string): number => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const toggleFavorite = (companionId: string) => {
    setCurrentUser(prev => {
      const favs = prev.favorites || [];
      const updated = favs.includes(companionId)
        ? favs.filter(id => id !== companionId)
        : [...favs, companionId];
      return { ...prev, favorites: updated };
    });
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id) {
          const favs = u.favorites || [];
          const updated = favs.includes(companionId)
            ? favs.filter(id => id !== companionId)
            : [...favs, companionId];
          return { ...u, favorites: updated };
        }
        return u;
      })
    );
  };

  const registerUser = (userData: {
    name: string;
    email: string;
    role: UserRole;
    dateOfBirth: string;
    phonePrivate: string;
    isAgeConfirmed: boolean;
    policyAccepted: boolean;
  }) => {
    if (!userData.isAgeConfirmed) {
      return { success: false, error: 'You must confirm that you are at least 18 years old.' };
    }
    if (!userData.policyAccepted) {
      return { success: false, error: 'You must accept the strict Non-Sexual Social Activity Policy.' };
    }
    const age = calculateAge(userData.dateOfBirth);
    if (age < 18) {
      return {
        success: false,
        error: 'Registration declined: MeetUp.pk is strictly restricted to adults aged 18 and older.'
      };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar:
        userData.role === 'companion'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      dateOfBirth: userData.dateOfBirth,
      age,
      phonePrivate: userData.phonePrivate,
      isAgeConfirmed: true,
      policyAccepted: true,
      favorites: [],
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    if (userData.role === 'companion') {
      const newProfile: CompanionProfile = {
        id: newUser.id,
        displayName: userData.name,
        age,
        gender: 'Male',
        cityId: cities[0]?.id || 'city-lahore',
        cityName: cities[0]?.name || 'Lahore',
        area: 'Gulberg',
        bio: 'Hello! I am a newly registered companion on MeetUp.pk. Available for public social coffee, study, language practice, or city walks.',
        profilePhoto: newUser.avatar,
        professionalCategory: 'Social & Cultural Companion',
        languages: ['Urdu', 'English'],
        interests: ['Coffee', 'Books', 'Culture'],
        activityIds: ['act-coffee', 'act-study'],
        sessionRate: 1500,
        verificationStatus: 'Pending Verification',
        socialLinks: [],
        rating: 0,
        reviewCount: 0,
        completedActivitiesCount: 0,
        responseRate: '100%',
        responseTime: 'Within 30 mins',
        joinedDate: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        availability: {
          weekdays: true,
          weekends: true,
          timeSlots: ['Afternoon (1PM-5PM)', 'Evening (5PM-8PM)']
        },
        totalBookings: 0,
        createdAt: new Date().toISOString()
      };
      setCompanionProfiles(prev => [...prev, newProfile]);
    }

    return { success: true };
  };

  const updateProfile = (profileData: Partial<CompanionProfile>) => {
    // Scan bio for contact or bypass patterns
    if (profileData.bio) {
      const scan = AntiBypassService.scanText(profileData.bio);
      if (scan.isFlagged) {
        setFlaggedMessages(prev => [
          {
            id: `flg-${Date.now()}`,
            messageId: 'bio_update',
            bookingId: 'N/A',
            senderId: currentUser.id,
            senderName: currentUser.name,
            flaggedText: profileData.bio || '',
            detectedPattern: scan.patternsDetected.join(', '),
            status: 'pending_review',
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
      }
    }

    setCompanionProfiles(prev =>
      prev.map(p => {
        if (p.id === currentUser.id) {
          return { ...p, ...profileData, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const submitVerification = (docType: 'CNIC' | 'Passport', docNumber: string) => {
    const masked =
      docNumber.length > 5 ? `${docNumber.slice(0, 4)}*****${docNumber.slice(-3)}` : 'DOC-*****';

    setCompanionProfiles(prev =>
      prev.map(p => {
        if (p.id === currentUser.id) {
          return {
            ...p,
            verificationStatus: 'Pending Verification',
            verificationDocsSubmitted: {
              idType: docType,
              submittedAt: new Date().toISOString(),
              documentNumberMasked: masked,
              statusNote: 'Documents submitted. Awaiting administrative compliance verification.'
            }
          };
        }
        return p;
      })
    );
  };

  const submitSocialLink = (platform: SocialLink['platform'], url: string) => {
    setCompanionProfiles(prev =>
      prev.map(p => {
        if (p.id === currentUser.id) {
          const links = p.socialLinks ? [...p.socialLinks] : [];
          const existingIdx = links.findIndex(l => l.platform === platform);
          const linkObj: SocialLink = {
            platform,
            url,
            isVerifiedByAdmin: false,
            submittedAt: new Date().toISOString()
          };
          if (existingIdx >= 0) {
            links[existingIdx] = linkObj;
          } else {
            links.push(linkObj);
          }
          return { ...p, socialLinks: links };
        }
        return p;
      })
    );
  };

  const createBooking = (params: {
    companionId: string;
    activityId: string;
    cityId: string;
    date: string;
    startTime: string;
    durationHours: number;
    publicMeetupVenue: string;
    specialNotes?: string;
  }) => {
    const companion = companionProfiles.find(c => c.id === params.companionId);
    if (!companion) return { success: false, error: 'Companion not found' };

    const activity = activities.find(a => a.id === params.activityId);
    if (!activity) return { success: false, error: 'Activity not found' };

    const city = cities.find(c => c.id === params.cityId);

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `MUP-${yyyy}${mm}${dd}-${randomSuffix}`;

    const grossAmount = companion.sessionRate * params.durationHours;
    const commPct = commissionSettings.defaultPercentage;
    const platformCommission = Math.round((grossAmount * commPct) / 100);
    const providerFee = Math.round(grossAmount * 0.02);
    const companionAmount = grossAmount - platformCommission;

    const newBooking: Booking = {
      id: bookingId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      companionId: companion.id,
      companionName: companion.displayName,
      companionPhoto: companion.profilePhoto,
      activityId: activity.id,
      activityName: activity.name,
      cityId: params.cityId,
      cityName: city ? city.name : companion.cityName,
      publicMeetupVenue: params.publicMeetupVenue,
      date: params.date,
      startTime: params.startTime,
      durationHours: params.durationHours,
      grossAmount,
      commissionPercentage: commPct,
      platformCommission,
      providerFee,
      companionAmount,
      status: 'Pending Payment',
      paymentStatus: 'Pending',
      specialNotes: params.specialNotes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    AnalyticsService.track('booking_started', {
      bookingId,
      companionId: companion.id,
      activityId: activity.id,
      grossAmount
    });

    return { success: true, bookingId };
  };

  const completeBookingPayment = async (params: {
    bookingId: string;
    paymentMethod: 'EasyPaisa' | 'JazzCash' | 'Card' | 'Bank Transfer';
  }) => {
    const booking = bookings.find(b => b.id === params.bookingId);
    if (!booking) return { success: false, error: 'Booking record not found' };

    AnalyticsService.track('payment_started', { bookingId: booking.id });

    // Step 1: Create server-side Payment Intent
    const intent = await PaymentService.createPaymentIntent(
      booking,
      commissionSettings.defaultPercentage
    );

    // Step 2: Record in Transaction Ledger
    const transaction = PaymentService.recordTransaction(intent, params.paymentMethod);
    setTransactions(prev => [transaction, ...prev]);

    // Step 3: Create companion payout record
    const payout = PaymentService.createPayoutRecord(transaction);
    setPayouts(prev => [payout, ...prev]);

    // Step 4: Update booking state to Confirmed & Paid
    setBookings(prev =>
      prev.map(b => {
        if (b.id === params.bookingId) {
          return {
            ...b,
            status: 'Confirmed',
            paymentStatus: 'Paid',
            transactionId: transaction.transaction_id,
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      })
    );

    AnalyticsService.track('payment_completed', {
      bookingId: booking.id,
      transactionId: transaction.transaction_id,
      grossAmount: transaction.gross_amount
    });

    return { success: true, transactionId: transaction.transaction_id };
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, suggestedTime?: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const updated: Booking = {
            ...b,
            status,
            updatedAt: new Date().toISOString()
          };
          if (suggestedTime) {
            updated.suggestedTime = suggestedTime;
          }
          if (status === 'Completed') {
            updated.paymentStatus = 'Paid';
            AnalyticsService.track('booking_completed', { bookingId: b.id });
          }
          return updated;
        }
        return b;
      })
    );
  };

  const updatePaymentStatus = (bookingId: string, paymentStatus: PaymentStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, paymentStatus, updatedAt: new Date().toISOString() } : b))
    );
  };

  const sendMessage = (bookingId: string, text: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false };

    const recipientId = currentUser.id === booking.customerId ? booking.companionId : booking.customerId;

    // Anti-Bypass Scanning
    const scan = AntiBypassService.scanText(text);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
      isFlaggedForBypass: scan.isFlagged
    };

    setMessages(prev => [...prev, newMsg]);

    if (scan.isFlagged) {
      setFlaggedMessages(prev => [
        {
          id: `flg-${Date.now()}`,
          messageId: newMsg.id,
          bookingId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          flaggedText: text,
          detectedPattern: scan.patternsDetected.join(', '),
          status: 'pending_review',
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }

    return { success: true, flagged: scan.isFlagged };
  };

  const addReview = (params: {
    bookingId: string;
    targetId: string;
    rating: number;
    communicationRating?: number;
    reliabilityRating?: number;
    activityRating?: number;
    safetyRating?: number;
    comment: string;
    activityName: string;
  }) => {
    const booking = bookings.find(b => b.id === params.bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };
    if (booking.status !== 'Completed') {
      return { success: false, error: 'Only completed bookings can generate reviews.' };
    }

    const reviewerRole = currentUser.id === booking.customerId ? 'customer' : 'companion';

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookingId: params.bookingId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerRole,
      targetId: params.targetId,
      rating: params.rating,
      communicationRating: params.communicationRating || params.rating,
      reliabilityRating: params.reliabilityRating || params.rating,
      activityRating: params.activityRating || params.rating,
      safetyRating: params.safetyRating || params.rating,
      comment: params.comment,
      activityName: params.activityName,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);

    setBookings(prev =>
      prev.map(b => {
        if (b.id === params.bookingId) {
          if (reviewerRole === 'customer') {
            return { ...b, hasCustomerReviewed: true };
          } else {
            return { ...b, hasCompanionReviewed: true };
          }
        }
        return b;
      })
    );

    if (reviewerRole === 'customer') {
      setCompanionProfiles(prev =>
        prev.map(comp => {
          if (comp.id === params.targetId) {
            const newTotalCount = comp.reviewCount + 1;
            const newRating = Number(((comp.rating * comp.reviewCount + params.rating) / newTotalCount).toFixed(2));
            return {
              ...comp,
              rating: newRating,
              reviewCount: newTotalCount,
              completedActivitiesCount: (comp.completedActivitiesCount || 0) + 1
            };
          }
          return comp;
        })
      );
    }

    AnalyticsService.track('review_submitted', {
      bookingId: params.bookingId,
      rating: params.rating
    });

    return { success: true };
  };

  const replyToReview = (reviewId: string, comment: string) => {
    setReviews(prev =>
      prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            companionReply: {
              comment,
              repliedAt: new Date().toISOString()
            }
          };
        }
        return r;
      })
    );
  };

  const reportReview = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, isReported: true } : r))
    );
  };

  const submitReport = (params: {
    reportedUserId: string;
    reportedUserName: string;
    category: ReportCategory;
    description: string;
    bookingId?: string;
  }) => {
    const newReport: SafetyReport = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reportedUserId: params.reportedUserId,
      reportedUserName: params.reportedUserName,
      category: params.category,
      description: params.description,
      bookingId: params.bookingId,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);

    AnalyticsService.track('report_submitted', {
      category: params.category,
      reportedUserId: params.reportedUserId
    });
  };

  const blockUser = (userId: string) => {
    if (!blockedUserIds.includes(userId)) {
      setBlockedUserIds(prev => [...prev, userId]);
    }
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds(prev => prev.filter(id => id !== userId));
  };

  // ADMIN GOVERNANCE ACTIONS
  const adminUpdateCommission = (percentage: number) => {
    setCommissionSettings(prev => ({
      ...prev,
      defaultPercentage: percentage,
      updatedAt: new Date().toISOString()
    }));
    logAudit('UPDATE_COMMISSION', 'commission', 'default', `Changed commission to ${percentage}%`);
  };

  const adminAddCity = (name: string, province: string, areas: string[]) => {
    const newCity: City = {
      id: `city-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      province,
      isActive: true,
      popularAreas: areas.length > 0 ? areas : ['Main Boulevard', 'City Center']
    };
    setCities(prev => [...prev, newCity]);
    logAudit('ADD_CITY', 'city', newCity.id, `Added city ${name} (${province})`);
  };

  const adminToggleCity = (cityId: string) => {
    setCities(prev =>
      prev.map(c => (c.id === cityId ? { ...c, isActive: !c.isActive } : c))
    );
    logAudit('TOGGLE_CITY', 'city', cityId, `Toggled active state`);
  };

  const adminAddCityArea = (cityId: string, areaName: string) => {
    setCities(prev =>
      prev.map(c => {
        if (c.id === cityId && !c.popularAreas.includes(areaName)) {
          return { ...c, popularAreas: [...c.popularAreas, areaName] };
        }
        return c;
      })
    );
    logAudit('ADD_CITY_AREA', 'city', cityId, `Added area ${areaName}`);
  };

  const adminAddActivity = (name: string, description: string, icon: string) => {
    const newAct: ActivityCategory = {
      id: `act-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      description,
      icon: icon || 'Sparkles',
      isActive: true,
      isPublicOnly: true
    };
    setActivities(prev => [...prev, newAct]);
    logAudit('ADD_ACTIVITY', 'activity', newAct.id, `Added non-sexual activity: ${name}`);
  };

  const adminToggleActivity = (activityId: string) => {
    setActivities(prev =>
      prev.map(a => (a.id === activityId ? { ...a, isActive: !a.isActive } : a))
    );
    logAudit('TOGGLE_ACTIVITY', 'activity', activityId, `Toggled activity active state`);
  };

  const adminVerifyCompanion = (companionId: string, status: VerificationStatus, note?: string) => {
    setCompanionProfiles(prev =>
      prev.map(c => {
        if (c.id === companionId) {
          return {
            ...c,
            verificationStatus: status,
            verificationDocsSubmitted: c.verificationDocsSubmitted
              ? {
                  ...c.verificationDocsSubmitted,
                  statusNote: note || `Updated to ${status} by Compliance Admin.`
                }
              : undefined
          };
        }
        return c;
      })
    );
    logAudit('VERIFY_COMPANION', 'companion', companionId, `Set status to ${status}. Note: ${note || 'None'}`);
  };

  const adminVerifySocialLink = (companionId: string, platform: string, verify: boolean) => {
    setCompanionProfiles(prev =>
      prev.map(c => {
        if (c.id === companionId && c.socialLinks) {
          const updatedLinks = c.socialLinks.map(l => {
            if (l.platform === platform) {
              return {
                ...l,
                isVerifiedByAdmin: verify,
                verifiedAt: verify ? new Date().toISOString() : undefined,
                verifiedByAdminId: verify ? currentUser.id : undefined
              };
            }
            return l;
          });
          return { ...c, socialLinks: updatedLinks };
        }
        return c;
      })
    );
    logAudit('VERIFY_SOCIAL_LINK', 'social_link', `${companionId}_${platform}`, `Set verified to ${verify}`);
  };

  const adminUpdateReport = (reportId: string, status: ReportStatus, notes?: string) => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status, adminNotes: notes || r.adminNotes } : r))
    );
    logAudit('UPDATE_REPORT', 'user', reportId, `Report marked ${status}. Note: ${notes || ''}`);
  };

  const adminResolveFlaggedMessage = (flaggedId: string, action: 'cleared' | 'warned' | 'suspended') => {
    setFlaggedMessages(prev =>
      prev.map(f => (f.id === flaggedId ? { ...f, status: action } : f))
    );
    logAudit('RESOLVE_FLAGGED_MESSAGE', 'user', flaggedId, `Flagged message action: ${action}`);
  };

  const adminDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    logAudit('DELETE_REVIEW', 'booking', reviewId, `Deleted review from platform`);
  };

  const adminSuspendUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u))
    );
    setCompanionProfiles(prev =>
      prev.map(c => (c.id === userId ? { ...c, verificationStatus: 'Suspended' } : c))
    );
    logAudit('SUSPEND_USER', 'user', userId, `Toggled suspension state`);
  };

  const adminUpdatePayoutStatus = (payoutId: string, status: PayoutStatus) => {
    setPayouts(prev =>
      prev.map(p => (p.payout_id === payoutId ? { ...p, payout_status: status, processed_at: new Date().toISOString() } : p))
    );
    logAudit('UPDATE_PAYOUT', 'companion', payoutId, `Payout updated to ${status}`);
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1]);
    setCompanionProfiles(INITIAL_COMPANION_PROFILES);
    setCities(INITIAL_CITIES);
    setActivities(INITIAL_ACTIVITIES);
    setBookings(INITIAL_BOOKINGS);
    setTransactions(INITIAL_TRANSACTIONS);
    setPayouts(INITIAL_PAYOUTS);
    setReviews(INITIAL_REVIEWS);
    setMessages(INITIAL_MESSAGES);
    setReports(INITIAL_REPORTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setFlaggedMessages([]);
    setBlockedUserIds([]);
    setCommissionSettings(INITIAL_COMMISSION);
    setSelectedCityId('all');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        currentRole: currentUser.role,
        companionProfiles,
        cities,
        activities,
        bookings,
        transactions,
        payouts,
        reviews,
        messages,
        reports,
        auditLogs,
        flaggedMessages,
        blockedUserIds,
        commissionSettings,
        notifications,
        selectedCityId,
        setSelectedCityId,
        switchUser,
        registerUser,
        toggleFavorite,
        updateProfile,
        submitVerification,
        submitSocialLink,
        createBooking,
        completeBookingPayment,
        updateBookingStatus,
        updatePaymentStatus,
        sendMessage,
        addReview,
        replyToReview,
        reportReview,
        submitReport,
        blockUser,
        unblockUser,
        adminUpdateCommission,
        adminAddCity,
        adminToggleCity,
        adminAddCityArea,
        adminAddActivity,
        adminToggleActivity,
        adminVerifyCompanion,
        adminVerifySocialLink,
        adminUpdateReport,
        adminResolveFlaggedMessage,
        adminDeleteReview,
        adminSuspendUser,
        adminUpdatePayoutStatus,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
