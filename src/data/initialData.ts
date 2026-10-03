import {
  City,
  ActivityCategory,
  CompanionProfile,
  User,
  Booking,
  Review,
  CommissionSettings,
  SafetyReport,
  Message,
  TransactionLedger,
  PayoutRecord,
  AuditLog,
  FlaggedMessage
} from '../types';

export const INITIAL_CITIES: City[] = [
  {
    id: 'city-lahore',
    name: 'Lahore',
    province: 'Punjab',
    isActive: true,
    popularAreas: [
      'Gulberg',
      'DHA',
      'Johar Town',
      'Model Town',
      'Garden Town',
      'Muslim Town',
      'Faisal Town',
      'Township',
      'Wapda Town',
      'Canal Road',
      'Mall Road',
      'Cantonment',
      'Bahria Town'
    ]
  },
  {
    id: 'city-karachi',
    name: 'Karachi',
    province: 'Sindh',
    isActive: true,
    popularAreas: [
      'Clifton Block 4',
      'DHA Phase 6',
      'Gulshan-e-Iqbal',
      'Bahria Town',
      'PECHS',
      'Saddar',
      'North Nazimabad'
    ]
  },
  {
    id: 'city-islamabad',
    name: 'Islamabad',
    province: 'Federal Capital',
    isActive: true,
    popularAreas: [
      'F-6 Markaz',
      'F-7 Jinnah Super',
      'F-10 Markaz',
      'Blue Area',
      'E-7',
      'I-8 Markaz',
      'Diplomatic Enclave'
    ]
  },
  {
    id: 'city-rawalpindi',
    name: 'Rawalpindi',
    province: 'Punjab',
    isActive: true,
    popularAreas: [
      'Bahria Town Phase 7',
      'Saddar Cantt',
      'Commercial Market Satellite Town',
      'Chaklala Scheme 3',
      'Westridge'
    ]
  },
  {
    id: 'city-peshawar',
    name: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    isActive: true,
    popularAreas: ['University Town', 'Hayatabad Phase 3', 'Saddar Road', 'Qissa Khwani']
  },
  {
    id: 'city-faisalabad',
    name: 'Faisalabad',
    province: 'Punjab',
    isActive: true,
    popularAreas: ['D Ground Peoples Colony', 'Kohinoor City', 'Madina Town', 'Clock Tower Bazaar']
  }
];

export const INITIAL_ACTIVITIES: ActivityCategory[] = [
  {
    id: 'act-coffee',
    name: 'Coffee & Cafe Meetup',
    description: 'Casual coffee chats, cafe hopping, and relaxed conversations at public cafes.',
    icon: 'Coffee',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-restaurant',
    name: 'Restaurant & Dining',
    description: 'Discovering Pakistani culinary treats, food streets, and public dining spots together.',
    icon: 'Utensils',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-city-tour',
    name: 'City Tour & Heritage Walk',
    description: 'Exploring historic landmarks, museums, monuments, and iconic bazaars with a local.',
    icon: 'Compass',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-event',
    name: 'Public Events & Concerts',
    description: 'Attending literary festivals, art exhibitions, public concerts, or comedy shows.',
    icon: 'Ticket',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-study',
    name: 'Study Partner / Co-Working',
    description: 'Productive co-working sessions at public libraries, campus cafes, and co-working hubs.',
    icon: 'BookOpen',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-language',
    name: 'Language Practice',
    description: 'Urdu, English, Punjabi, Pashto, or regional dialects conversation practice.',
    icon: 'Languages',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-gaming',
    name: 'Board Games & Esports',
    description: 'Playing board games at gaming cafes, chess in the park, or video gaming lounges.',
    icon: 'Gamepad2',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-networking',
    name: 'Professional Networking',
    description: 'Discussing startups, tech trends, careers, and entrepreneurship over tea.',
    icon: 'Briefcase',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-cultural',
    name: 'Cultural Activity',
    description: 'Visiting traditional craft markets, Qawwali nights, and heritage centers.',
    icon: 'Landmark',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-shopping',
    name: 'Shopping Companion',
    description: 'Style advice, outfit matching, and bargaining companionship at malls and bazaars.',
    icon: 'ShoppingBag',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-photography',
    name: 'Photography Walk',
    description: 'Photo walks around historic architecture, parks, and vibrant urban spots.',
    icon: 'Camera',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-sports',
    name: 'Sports & Badminton/Padel',
    description: 'Playing badminton, padel, jogging in public parks, or table tennis.',
    icon: 'Activity',
    isActive: true,
    isPublicOnly: true
  },
  {
    id: 'act-other',
    name: 'Other Approved Activity',
    description: 'Other verified wholesome, public non-sexual social engagements.',
    icon: 'Sparkles',
    isActive: true,
    isPublicOnly: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Tariq Mehmood',
    email: 'admin@meetuppakistan.pk',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    dateOfBirth: '1988-04-12',
    age: 38,
    phonePrivate: '+92 300 1234567',
    isAgeConfirmed: true,
    policyAccepted: true,
    favorites: ['usr-comp-1', 'usr-comp-3'],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'usr-cust-1',
    name: 'Hamza Khan',
    email: 'hamza.k@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    dateOfBirth: '1997-08-20',
    age: 29,
    phonePrivate: '+92 321 9876543',
    isAgeConfirmed: true,
    policyAccepted: true,
    favorites: ['usr-comp-1', 'usr-comp-2'],
    createdAt: '2026-02-15T14:30:00Z'
  },
  {
    id: 'usr-cust-2',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.s@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    dateOfBirth: '2001-03-14',
    age: 25,
    phonePrivate: '+92 333 4567890',
    isAgeConfirmed: true,
    policyAccepted: true,
    favorites: ['usr-comp-3'],
    createdAt: '2026-03-01T09:15:00Z'
  },
  {
    id: 'usr-comp-1',
    name: 'Zainab Bilal',
    email: 'zainab.b@example.com',
    role: 'companion',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    dateOfBirth: '2000-05-19',
    age: 26,
    phonePrivate: '+92 301 5550192',
    isAgeConfirmed: true,
    policyAccepted: true,
    favorites: [],
    createdAt: '2026-01-20T11:00:00Z'
  },
  {
    id: 'usr-comp-2',
    name: 'Bilal Farooq',
    email: 'bilal.f@example.com',
    role: 'companion',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    dateOfBirth: '1998-11-04',
    age: 27,
    phonePrivate: '+92 302 4440183',
    isAgeConfirmed: true,
    policyAccepted: true,
    favorites: [],
    createdAt: '2026-01-22T08:00:00Z'
  },
  {
    id: 'usr-comp-3',
    name: 'Mahnoor Tariq',
    email: 'mahnoor.t@example.com',
    role: 'companion',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    dateOfBirth: '2002-01-29',
    age: 24,
    phonePrivate: '+92 303 3330174',
    isAgeConfirmed: true,
    policyAccepted: true,
    favorites: [],
    createdAt: '2026-02-05T13:45:00Z'
  },
  {
    id: 'usr-comp-4',
    name: 'Shahmeer Ali',
    email: 'shahmeer.a@example.com',
    role: 'companion',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    dateOfBirth: '1996-07-16',
    age: 30,
    phonePrivate: '+92 304 2220165',
    isAgeConfirmed: true,
    policyAccepted: true,
    favorites: [],
    createdAt: '2026-02-18T16:20:00Z'
  }
];

export const INITIAL_COMPANION_PROFILES: CompanionProfile[] = [
  {
    id: 'usr-comp-1',
    displayName: 'Zainab B.',
    age: 26,
    gender: 'Female',
    cityId: 'city-lahore',
    cityName: 'Lahore',
    area: 'Gulberg',
    bio: 'Curator & heritage researcher. I enjoy sharing architectural walks in the old city, exploring independent bookshops, and engaging in intellectual discussions over specialty coffee in public cafes. 100% strictly public social meetups only.',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    professionalCategory: 'Cultural Guide & Researcher',
    languages: ['Urdu', 'English', 'Punjabi'],
    interests: ['Architecture', 'Art History', 'Specialty Coffee', 'Classical Urdu Literature', 'Museum Visits'],
    activityIds: ['act-coffee', 'act-city-tour', 'act-cultural', 'act-photography', 'act-study'],
    sessionRate: 1500,
    verificationStatus: 'Verified',
    verificationDocsSubmitted: {
      idType: 'CNIC',
      submittedAt: '2026-01-21T12:00:00Z',
      documentNumberMasked: '35201-*****89-2',
      statusNote: 'Verified via Smart CNIC & Identity Review'
    },
    socialLinks: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/zainab-heritage-research',
        isVerifiedByAdmin: true,
        submittedAt: '2026-01-21T12:00:00Z',
        verifiedAt: '2026-01-22T10:00:00Z'
      },
      {
        platform: 'Instagram',
        url: 'https://instagram.com/zainab_heritage_walks',
        isVerifiedByAdmin: true,
        submittedAt: '2026-01-21T12:00:00Z',
        verifiedAt: '2026-01-22T10:00:00Z'
      }
    ],
    rating: 4.95,
    reviewCount: 28,
    completedActivitiesCount: 32,
    responseRate: '98%',
    responseTime: 'Within 15 mins',
    joinedDate: 'January 2026',
    availability: {
      weekdays: true,
      weekends: true,
      timeSlots: ['Afternoon (2PM-5PM)', 'Evening (5PM-9PM)']
    },
    totalBookings: 32,
    createdAt: '2026-01-20T11:00:00Z'
  },
  {
    id: 'usr-comp-2',
    displayName: 'Bilal F.',
    age: 27,
    gender: 'Male',
    cityId: 'city-islamabad',
    cityName: 'Islamabad',
    area: 'F-7 Jinnah Super',
    bio: 'Software engineer and hiking enthusiast. Available for productive co-working sessions at coffee hubs, discussing tech startups, or guided public walks around Trail 3 and Daman-e-Koh. Wholesome companionship and respectful conversation.',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80',
    professionalCategory: 'Tech Professional & Outdoors',
    languages: ['English', 'Urdu', 'Potohari'],
    interests: ['Startups & Tech', 'Hiking', 'Podcasts', 'Chess', 'Espresso Brews'],
    activityIds: ['act-coffee', 'act-networking', 'act-study', 'act-gaming', 'act-sports'],
    sessionRate: 1800,
    verificationStatus: 'Verified',
    verificationDocsSubmitted: {
      idType: 'CNIC',
      submittedAt: '2026-01-23T14:00:00Z',
      documentNumberMasked: '37405-*****43-1',
      statusNote: 'Verified by Compliance Officer'
    },
    socialLinks: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/bilal-farooq-tech',
        isVerifiedByAdmin: true,
        submittedAt: '2026-01-23T14:00:00Z',
        verifiedAt: '2026-01-24T09:00:00Z'
      }
    ],
    rating: 4.88,
    reviewCount: 22,
    completedActivitiesCount: 25,
    responseRate: '95%',
    responseTime: 'Within 30 mins',
    joinedDate: 'January 2026',
    availability: {
      weekdays: false,
      weekends: true,
      timeSlots: ['Morning (9AM-1PM)', 'Afternoon (2PM-6PM)']
    },
    totalBookings: 25,
    createdAt: '2026-01-22T08:00:00Z'
  },
  {
    id: 'usr-comp-3',
    displayName: 'Mahnoor T.',
    age: 24,
    gender: 'Female',
    cityId: 'city-karachi',
    cityName: 'Karachi',
    area: 'Clifton Block 4',
    bio: 'Literature graduate and foodie. Happy to accompany you to Karachi food festivals, public art galleries in Clifton, or practice conversational English and Urdu. Big fan of seaside cafes and tea stalls.',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    professionalCategory: 'Linguistics & Creative Arts',
    languages: ['Urdu', 'English', 'Sindhi'],
    interests: ['Food Crawls', 'Novels & Poetry', 'Theatre', 'Board Games', 'Language Exchange'],
    activityIds: ['act-restaurant', 'act-coffee', 'act-language', 'act-gaming', 'act-event'],
    sessionRate: 2000,
    verificationStatus: 'Verified',
    verificationDocsSubmitted: {
      idType: 'CNIC',
      submittedAt: '2026-02-06T10:00:00Z',
      documentNumberMasked: '42201-*****11-8',
      statusNote: 'Verified with NADRA ID & Public Profile Match'
    },
    socialLinks: [
      {
        platform: 'Instagram',
        url: 'https://instagram.com/mahnoor_karachi_eats',
        isVerifiedByAdmin: true,
        submittedAt: '2026-02-06T10:00:00Z',
        verifiedAt: '2026-02-07T11:00:00Z'
      }
    ],
    rating: 5.0,
    reviewCount: 16,
    completedActivitiesCount: 19,
    responseRate: '100%',
    responseTime: 'Within 10 mins',
    joinedDate: 'February 2026',
    availability: {
      weekdays: true,
      weekends: true,
      timeSlots: ['Afternoon (1PM-4PM)', 'Evening (5PM-8PM)']
    },
    totalBookings: 19,
    createdAt: '2026-02-05T13:45:00Z'
  },
  {
    id: 'usr-comp-4',
    displayName: 'Shahmeer A.',
    age: 30,
    gender: 'Male',
    cityId: 'city-lahore',
    cityName: 'Lahore',
    area: 'DHA',
    bio: 'Professional street and architecture photographer. Happy to guide photography walks through Mall Road, Anarkali, Badshahi Mosque surroundings, or accompany visitors to music concerts and book fairs. Respectful, punctual, and friendly.',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    professionalCategory: 'Professional Photographer',
    languages: ['Urdu', 'English', 'Punjabi'],
    interests: ['Street Photography', 'Music Festivals', 'Pakistani Food', 'Vintage Cameras'],
    activityIds: ['act-photography', 'act-city-tour', 'act-event', 'act-restaurant'],
    sessionRate: 2200,
    verificationStatus: 'Verified',
    verificationDocsSubmitted: {
      idType: 'Passport',
      submittedAt: '2026-02-19T09:00:00Z',
      documentNumberMasked: 'PA-*****921',
      statusNote: 'Verified Pakistani Passport'
    },
    socialLinks: [
      {
        platform: 'Instagram',
        url: 'https://instagram.com/shahmeer_lens',
        isVerifiedByAdmin: true,
        submittedAt: '2026-02-19T09:00:00Z',
        verifiedAt: '2026-02-20T14:00:00Z'
      }
    ],
    rating: 4.92,
    reviewCount: 24,
    completedActivitiesCount: 30,
    responseRate: '96%',
    responseTime: 'Within 20 mins',
    joinedDate: 'February 2026',
    availability: {
      weekdays: true,
      weekends: true,
      timeSlots: ['Morning (8AM-12PM)', 'Evening (4PM-8PM)']
    },
    totalBookings: 30,
    createdAt: '2026-02-18T16:20:00Z'
  }
];

export const INITIAL_COMMISSION: CommissionSettings = {
  defaultPercentage: 10,
  minPercentage: 5,
  maxPercentage: 25,
  updatedAt: '2026-01-01T00:00:00Z'
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'MUP-20261003-1047',
    customerId: 'usr-cust-1',
    customerName: 'Hamza Khan',
    companionId: 'usr-comp-1',
    companionName: 'Zainab B.',
    companionPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    activityId: 'act-coffee',
    activityName: 'Coffee & Cafe Meetup',
    cityId: 'city-lahore',
    cityName: 'Lahore',
    publicMeetupVenue: "Gloria Jean's Coffees, MM Alam Road, Gulberg",
    date: '2026-10-04',
    startTime: '16:00',
    durationHours: 2,
    grossAmount: 3000,
    commissionPercentage: 10,
    platformCommission: 300,
    providerFee: 60,
    companionAmount: 2700,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    transactionId: 'txn_20261003_1047',
    specialNotes: 'Looking forward to discussing local art and coffee brewing.',
    createdAt: '2026-10-03T09:30:00Z',
    updatedAt: '2026-10-03T10:15:00Z'
  },
  {
    id: 'MUP-20260928-8921',
    customerId: 'usr-cust-2',
    customerName: 'Ayesha Siddiqui',
    companionId: 'usr-comp-3',
    companionName: 'Mahnoor T.',
    companionPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    activityId: 'act-restaurant',
    activityName: 'Restaurant & Dining',
    cityId: 'city-karachi',
    cityName: 'Karachi',
    publicMeetupVenue: 'Café Flo, Clifton Block 4, Karachi',
    date: '2026-09-29',
    startTime: '19:00',
    durationHours: 2,
    grossAmount: 4000,
    commissionPercentage: 10,
    platformCommission: 400,
    providerFee: 80,
    companionAmount: 3600,
    status: 'Completed',
    paymentStatus: 'Paid',
    transactionId: 'txn_20260928_8921',
    specialNotes: 'Dinner meetup at cafe patio.',
    createdAt: '2026-09-28T11:20:00Z',
    updatedAt: '2026-09-29T21:30:00Z',
    hasCustomerReviewed: true,
    hasCompanionReviewed: true
  },
  {
    id: 'MUP-20261002-3310',
    customerId: 'usr-cust-1',
    customerName: 'Hamza Khan',
    companionId: 'usr-comp-2',
    companionName: 'Bilal F.',
    companionPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    activityId: 'act-study',
    activityName: 'Study Partner / Co-Working',
    cityId: 'city-islamabad',
    cityName: 'Islamabad',
    publicMeetupVenue: 'Burning Brownie / Coffee Planet, F-6 Markaz',
    date: '2026-10-05',
    startTime: '14:00',
    durationHours: 3,
    grossAmount: 5400,
    commissionPercentage: 10,
    platformCommission: 540,
    providerFee: 108,
    companionAmount: 4860,
    status: 'Pending Payment',
    paymentStatus: 'Pending',
    specialNotes: 'Working together on tech product roadmaps in public cafe.',
    createdAt: '2026-10-02T15:40:00Z',
    updatedAt: '2026-10-02T15:40:00Z'
  }
];

export const INITIAL_TRANSACTIONS: TransactionLedger[] = [
  {
    transaction_id: 'txn_20261003_1047',
    booking_id: 'MUP-20261003-1047',
    customer_id: 'usr-cust-1',
    companion_id: 'usr-comp-1',
    gross_amount: 3000,
    platform_fee: 300,
    provider_fee: 60,
    net_amount: 2700,
    currency: 'PKR',
    payment_method: 'EasyPaisa',
    status: 'success',
    idempotency_key: 'idem_mup_1047',
    created_at: '2026-10-03T09:30:00Z',
    completed_at: '2026-10-03T09:35:00Z'
  },
  {
    transaction_id: 'txn_20260928_8921',
    booking_id: 'MUP-20260928-8921',
    customer_id: 'usr-cust-2',
    companion_id: 'usr-comp-3',
    gross_amount: 4000,
    platform_fee: 400,
    provider_fee: 80,
    net_amount: 3600,
    currency: 'PKR',
    payment_method: 'Card',
    status: 'success',
    idempotency_key: 'idem_mup_8921',
    created_at: '2026-09-28T11:20:00Z',
    completed_at: '2026-09-28T11:22:00Z'
  }
];

export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    payout_id: 'pay_20260930_01',
    companion_id: 'usr-comp-3',
    booking_id: 'MUP-20260928-8921',
    gross_amount: 4000,
    platform_fee: 400,
    net_amount: 3600,
    payout_status: 'Paid',
    payout_method: 'Bank Transfer IBAN',
    account_title: 'Mahnoor Tariq',
    account_number_masked: 'PK45MEZN*****4819',
    created_at: '2026-09-30T09:00:00Z',
    processed_at: '2026-09-30T14:30:00Z'
  },
  {
    payout_id: 'pay_20261003_02',
    companion_id: 'usr-comp-1',
    booking_id: 'MUP-20261003-1047',
    gross_amount: 3000,
    platform_fee: 300,
    net_amount: 2700,
    payout_status: 'Eligible',
    payout_method: 'EasyPaisa Wallet',
    account_title: 'Zainab Bilal',
    account_number_masked: '0301-*****92',
    created_at: '2026-10-03T10:20:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookingId: 'MUP-20260928-8921',
    reviewerId: 'usr-cust-2',
    reviewerName: 'Ayesha Siddiqui',
    reviewerRole: 'customer',
    targetId: 'usr-comp-3',
    rating: 5,
    communicationRating: 5,
    reliabilityRating: 5,
    activityRating: 5,
    safetyRating: 5,
    comment: 'Mahnoor was wonderful company! We met at Cafe Flo in Clifton, discussed classical Urdu literature, and shared great food recommendations. Very punctual and respectful.',
    activityName: 'Restaurant & Dining',
    companionReply: {
      comment: 'Thank you so much Ayesha! It was an absolute delight meeting you and exploring literature over dinner.',
      repliedAt: '2026-09-30T14:00:00Z'
    },
    createdAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'rev-2',
    bookingId: 'MUP-20260928-8921',
    reviewerId: 'usr-comp-3',
    reviewerName: 'Mahnoor T.',
    reviewerRole: 'companion',
    targetId: 'usr-cust-2',
    rating: 5,
    communicationRating: 5,
    reliabilityRating: 5,
    activityRating: 5,
    safetyRating: 5,
    comment: 'Ayesha was extremely courteous, on time, and respected all public guidelines. A pleasure to spend the evening with!',
    activityName: 'Restaurant & Dining',
    createdAt: '2026-09-30T11:15:00Z'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    bookingId: 'MUP-20261003-1047',
    senderId: 'usr-cust-1',
    senderName: 'Hamza Khan',
    recipientId: 'usr-comp-1',
    text: "Hello Zainab, looking forward to our coffee meetup tomorrow at Gloria Jean's MM Alam! Let me know if the 4 PM slot works perfectly for you.",
    timestamp: '2026-10-03T10:00:00Z'
  },
  {
    id: 'msg-2',
    bookingId: 'MUP-20261003-1047',
    senderId: 'usr-comp-1',
    senderName: 'Zainab B.',
    recipientId: 'usr-cust-1',
    text: "Hi Hamza! Yes, 4 PM at Gloria Jean's is perfect. I will be at the outdoor patio area. See you tomorrow!",
    timestamp: '2026-10-03T10:14:00Z'
  }
];

export const INITIAL_REPORTS: SafetyReport[] = [
  {
    id: 'rep-1',
    reporterId: 'usr-comp-1',
    reporterName: 'Zainab B.',
    reportedUserId: 'usr-unknown-99',
    reportedUserName: 'SuspiciousUser101',
    category: 'Private Location Pressure',
    description: 'User sent an inquiry asking if we could meet at their private apartment or hotel instead of a public cafe. I immediately declined and informed them of platform rules.',
    status: 'Under Review',
    adminNotes: 'Investigating user IP and previous inquiries. Account flagged for suspension if repeated.',
    createdAt: '2026-09-20T14:10:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminId: 'usr-admin',
    adminName: 'Tariq Mehmood',
    action: 'VERIFY_COMPANION',
    targetType: 'companion',
    targetId: 'usr-comp-1',
    details: 'Approved government CNIC and verified public LinkedIn profile.',
    timestamp: '2026-01-22T10:00:00Z'
  },
  {
    id: 'log-2',
    adminId: 'usr-admin',
    adminName: 'Tariq Mehmood',
    action: 'UPDATE_COMMISSION',
    targetType: 'commission',
    targetId: 'default',
    details: 'Set default platform commission to 10%.',
    timestamp: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_FLAGGED_MESSAGES: FlaggedMessage[] = [];
