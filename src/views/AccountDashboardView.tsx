import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Calendar,
  MessageSquare,
  CreditCard,
  Star,
  Heart,
  Settings,
  DollarSign,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialLink, CompanionProfile } from '../types';
import { CompanionCard } from '../components/CompanionCard';

interface AccountDashboardViewProps {
  onNavigateToBookings: () => void;
  onNavigateToMessages: () => void;
  onNavigateToSafetyCenter: () => void;
  onNavigateToEditProfile: () => void;
  onOpenBookingDirect?: (comp: CompanionProfile) => void;
}

export const AccountDashboardView: React.FC<AccountDashboardViewProps> = ({
  onNavigateToBookings,
  onNavigateToMessages,
  onNavigateToSafetyCenter,
  onNavigateToEditProfile,
  onOpenBookingDirect
}) => {
  const {
    currentUser,
    companionProfiles,
    bookings,
    transactions,
    payouts,
    reviews,
    submitSocialLink,
    replyToReview
  } = useApp();

  type TabType =
    | 'overview'
    | 'bookings'
    | 'transactions'
    | 'favorites'
    | 'social_links'
    | 'payouts'
    | 'reviews';

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Social link submission state for companions
  const [newPlatform, setNewPlatform] = useState<SocialLink['platform']>('Instagram');
  const [newUrl, setNewUrl] = useState('');
  const [socialSubmitted, setSocialSubmitted] = useState(false);

  // Review reply state
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const isCompanion = currentUser.role === 'companion';
  const myCompanionProfile = companionProfiles.find(p => p.id === currentUser.id);

  // Filter user records
  const myBookings = bookings.filter(
    b => b.customerId === currentUser.id || b.companionId === currentUser.id
  );
  const myTransactions = transactions.filter(
    t => t.customer_id === currentUser.id || t.companion_id === currentUser.id
  );
  const myPayouts = payouts.filter(p => p.companion_id === currentUser.id);
  const myReviews = reviews.filter(
    r => (isCompanion ? r.targetId === currentUser.id : r.reviewerId === currentUser.id)
  );
  const favoriteCompanions = companionProfiles.filter(c =>
    currentUser.favorites?.includes(c.id)
  );

  const totalEarnings = myPayouts
    .filter(p => p.payout_status === 'Paid')
    .reduce((sum, p) => sum + p.net_amount, 0);

  const eligiblePayout = myPayouts
    .filter(p => p.payout_status === 'Eligible')
    .reduce((sum, p) => sum + p.net_amount, 0);

  const handleAddSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    submitSocialLink(newPlatform, newUrl.trim());
    setNewUrl('');
    setSocialSubmitted(true);
    setTimeout(() => setSocialSubmitted(false), 2000);
  };

  const handleReplyReviewSubmit = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim());
    setReplyReviewId(null);
    setReplyText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Top Profile Summary Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {currentUser.name}
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentUser.email} • Age {currentUser.age} (18+ Verified)
            </p>
            {isCompanion && myCompanionProfile && (
              <p className="text-xs text-emerald-400 font-semibold">
                {myCompanionProfile.cityName} ({myCompanionProfile.area}) • Rate: PKR {myCompanionProfile.sessionRate.toLocaleString()}/hr
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isCompanion ? (
            <button
              onClick={onNavigateToEditProfile}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Edit Profile & Rates
            </button>
          ) : (
            <button
              onClick={onNavigateToSafetyCenter}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Safety Center
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold text-slate-400 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-emerald-400 font-extrabold shadow-sm'
              : 'hover:text-white'
          }`}
        >
          Account Overview
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-slate-800 text-emerald-400 font-extrabold shadow-sm'
              : 'hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          My Bookings ({myBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'transactions'
              ? 'bg-slate-800 text-emerald-400 font-extrabold shadow-sm'
              : 'hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Payments ({myTransactions.length})
        </button>

        {isCompanion ? (
          <>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'payouts'
                  ? 'bg-slate-800 text-emerald-400 font-extrabold shadow-sm'
                  : 'hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Earnings & Payouts
            </button>
            <button
              onClick={() => setActiveTab('social_links')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'social_links'
                  ? 'bg-slate-800 text-emerald-400 font-extrabold shadow-sm'
                  : 'hover:text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Social Links
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'bg-slate-800 text-emerald-400 font-extrabold shadow-sm'
                : 'hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Favorites ({favoriteCompanions.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'bg-slate-800 text-emerald-400 font-extrabold shadow-sm'
              : 'hover:text-white'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          Reviews ({myReviews.length})
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</span>
              <div className="text-xl font-extrabold text-white">{myBookings.length}</div>
              <span className="text-[11px] text-slate-500">Public Sessions</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {isCompanion ? 'Earnings Cleared' : 'Total Spent'}
              </span>
              <div className="text-xl font-extrabold text-emerald-400">
                PKR {(isCompanion ? totalEarnings : myTransactions.reduce((s, t) => s + t.gross_amount, 0)).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">Escrow Audited</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Reviews</span>
              <div className="text-xl font-extrabold text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                {myReviews.length}
              </div>
              <span className="text-[11px] text-slate-500">Verified Ratings</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Identity Status</span>
              <div className="text-sm font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                18+ Confirmed
              </div>
              <span className="text-[11px] text-slate-500">Non-Sexual Pledge</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={onNavigateToBookings}
              className="p-5 bg-slate-900 rounded-3xl border border-slate-800 hover:border-emerald-500 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition">
                  Manage Active Bookings
                </h4>
                <p className="text-xs text-slate-400">
                  Accept/decline requests, coordinate public venues, and review receipts.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition" />
            </div>

            <div
              onClick={onNavigateToMessages}
              className="p-5 bg-slate-900 rounded-3xl border border-slate-800 hover:border-emerald-500 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition">
                  In-App Messaging
                </h4>
                <p className="text-xs text-slate-400">
                  Communicate with companions under platform protection with anti-bypass scanning.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      )}

      {/* 2. BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2">
            <h3 className="font-extrabold text-sm text-white">Booking Records</h3>
            <button onClick={onNavigateToBookings} className="text-xs text-emerald-400 font-bold hover:underline">
              Full Booking Desk →
            </button>
          </div>
          {myBookings.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 text-xs text-slate-400">
              No bookings created yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {myBookings.map(b => (
                <div key={b.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-emerald-400 block">{b.id}</span>
                    <span className="text-white font-semibold">{b.activityName}</span> • <span className="text-slate-400">{b.date} at {b.startTime}</span>
                    <span className="block text-slate-500 text-[11px]">{b.publicMeetupVenue}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-bold text-white block">PKR {b.grossAmount.toLocaleString()}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PAYMENTS & TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-white">Payment Ledger</h3>
            <p className="text-xs text-slate-400">
              Verified transactions held in platform escrow. Card and banking credentials are never stored.
            </p>
          </div>

          {myTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No transaction history recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Txn Ref</th>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Gross Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {myTransactions.map(t => (
                    <tr key={t.transaction_id}>
                      <td className="p-3 font-mono font-bold text-white">{t.transaction_id}</td>
                      <td className="p-3 font-mono text-emerald-400">{t.booking_id}</td>
                      <td className="p-3 font-bold text-white">PKR {t.gross_amount.toLocaleString()}</td>
                      <td className="p-3 font-semibold">{t.payment_method}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. COMPANION PAYOUTS TAB */}
      {isCompanion && activeTab === 'payouts' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-white">Earnings & Payout Status</h3>
              <p className="text-xs text-slate-400">
                Net companion compensation after configured {10}% platform fee deduction.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligible for Payout</span>
              <span className="text-lg font-extrabold text-emerald-400">PKR {eligiblePayout.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Payout Records
            </span>
            {myPayouts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No payouts processed yet. Completed bookings automatically generate eligible payouts.
              </div>
            ) : (
              myPayouts.map(p => (
                <div
                  key={p.payout_id}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-white block">{p.payout_id}</span>
                    <span className="text-slate-400">Method: {p.payout_method} ({p.account_number_masked})</span>
                    <span className="text-[10px] text-slate-500 block">Booking: {p.booking_id}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-bold text-emerald-400 block">PKR {p.net_amount.toLocaleString()}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.payout_status === 'Paid'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {p.payout_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. PUBLIC SOCIAL LINKS (COMPANION ONLY) */}
      {isCompanion && activeTab === 'social_links' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-white">Public Social Media Profiles</h3>
            <p className="text-xs text-slate-400">
              Submit your own public Instagram, LinkedIn, TikTok, or Facebook URL. Admin verification is required before display.
            </p>
          </div>

          {socialSubmitted && (
            <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Social link submitted! Awaiting administrator audit and verification badge.
            </div>
          )}

          <form onSubmit={handleAddSocialLink} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase block">Add Social Profile URL</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={newPlatform}
                onChange={e => setNewPlatform(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium"
              >
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="TikTok">TikTok</option>
              </select>

              <input
                type="url"
                required
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="https://instagram.com/yourhandle"
                className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Submit Social Profile
            </button>
          </form>

          {/* Current Links */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Submitted Links</span>
            {myCompanionProfile?.socialLinks.map((link, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{link.platform}</span>
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-300 block text-[11px] underline">
                    {link.url}
                  </a>
                </div>
                {link.isVerifiedByAdmin ? (
                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">
                    ✓ Public Social Profile — Verified by platform
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-amber-400 px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-900">
                    Pending Admin Verification
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. FAVORITES TAB (CUSTOMER ONLY) */}
      {!isCompanion && activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-white">Saved Companion Profiles</h3>
          {favoriteCompanions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 text-xs text-slate-400">
              No companions saved yet. Click the heart icon on any companion card to bookmark them!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteCompanions.map(c => (
                <CompanionCard key={c.id} companion={c} onOpenBookingDirect={onOpenBookingDirect} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
          <h3 className="font-extrabold text-base text-white">
            {isCompanion ? 'Reviews Received from Verified Outings' : 'Reviews You Have Written'}
          </h3>
          {myReviews.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No reviews recorded yet. Reviews can be posted only after completed bookings.
            </div>
          ) : (
            <div className="space-y-3">
              {myReviews.map(r => (
                <div key={r.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{r.reviewerName}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      ★ {r.rating}
                    </span>
                  </div>
                  <p className="text-slate-300">{r.comment}</p>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {r.activityName} • Booking: {r.bookingId}
                  </span>

                  {/* Companion Reply */}
                  {r.companionReply ? (
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-emerald-300">
                      <strong>Your Reply:</strong> {r.companionReply.comment}
                    </div>
                  ) : (
                    isCompanion && (
                      <div className="pt-1">
                        {replyReviewId === r.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              placeholder="Write a polite response to this review..."
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-xs"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReplyReviewSubmit(r.id)}
                                className="px-3 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-lg"
                              >
                                Post Reply
                              </button>
                              <button
                                onClick={() => setReplyReviewId(null)}
                                className="px-2 py-1 text-slate-400 text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReplyReviewId(r.id);
                              setReplyText('');
                            }}
                            className="text-emerald-400 hover:underline text-[11px] font-semibold"
                          >
                            Reply to Review
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
