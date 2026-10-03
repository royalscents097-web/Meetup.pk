import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Globe2,
  Heart,
  Star,
  Sparkles,
  ShieldAlert,
  Ban,
  Calendar,
  Lock,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Share2,
  CornerDownRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompanionProfile } from '../types';
import { BookingModal } from './BookingModal';
import { ReportModal } from './ReportModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: CompanionProfile;
  onOpenBookingDirect?: (comp: CompanionProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  companion,
  onOpenBookingDirect
}) => {
  const { activities, reviews, blockUser, blockedUserIds, currentUser, toggleFavorite, reportReview } = useApp();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const companionActivities = activities.filter(a => companion.activityIds.includes(a.id));
  const companionReviews = reviews.filter(r => r.targetId === companion.id);
  const isBlocked = blockedUserIds.includes(companion.id);
  const isFavorited = currentUser.favorites?.includes(companion.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col text-slate-100">
          {/* Header Image Cover */}
          <div className="relative h-48 sm:h-56 bg-slate-950 overflow-hidden shrink-0">
            <img
              src={companion.profilePhoto}
              alt={companion.displayName}
              className="w-full h-full object-cover opacity-50 filter blur-xs scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

            {/* Close & Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer border border-slate-700"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleFavorite(companion.id)}
                className={`p-2 rounded-full transition cursor-pointer border border-slate-700 ${
                  isFavorited
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar & Primary Badges */}
            <div className="absolute -bottom-6 left-6 flex items-end gap-4">
              <div className="relative">
                <img
                  src={companion.profilePhoto}
                  alt={companion.displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl"
                />
                {companion.verificationStatus === 'Verified' && (
                  <span
                    className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow border-2 border-slate-900"
                    title="Verified Adult Companion"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="pb-8 text-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {companion.displayName}
                  </h2>
                  <span className="text-slate-300 font-medium text-xs sm:text-sm">
                    {companion.age} yrs • {companion.gender}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{companion.cityName} • {companion.area}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-emerald-400 font-semibold">{companion.professionalCategory}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 pt-10 overflow-y-auto space-y-6">
            {copiedLink && (
              <div className="p-2 bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs text-center rounded-xl">
                Profile link copied to clipboard!
              </div>
            )}

            {/* Key Platform Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Session Rate
                </span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-400">
                  PKR {companion.sessionRate.toLocaleString()}
                  <span className="text-[10px] font-normal text-slate-400"> /hr</span>
                </span>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Rating
                </span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {companion.rating > 0 ? companion.rating.toFixed(1) : 'New'}
                  </span>
                  <span className="text-[10px] text-slate-400">({companion.reviewCount})</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Completed
                </span>
                <span className="text-sm sm:text-base font-extrabold text-white">
                  {companion.completedActivitiesCount || companion.totalBookings} activities
                </span>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Response Speed
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-300 block mt-0.5">
                  {companion.responseTime || 'Within 15 mins'}
                </span>
              </div>
            </div>

            {/* Non-Sexual Activity Policy Banner */}
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Strict Non-Sexual Activity Policy Accepted:</strong>
                All activities offered by {companion.displayName} take place solely in open public places (licensed cafes, restaurants, tours, malls). Prostitution, sexual solicitation, and private home/hotel room bookings are strictly prohibited.
              </div>
            </div>

            {/* About / Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About {companion.displayName}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                {companion.bio}
              </p>
            </div>

            {/* Activities Offered with Prices */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Approved Activities Offered
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {companionActivities.map(act => (
                  <div
                    key={act.id}
                    className="p-3 rounded-2xl border border-slate-800 bg-slate-800/40 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block">{act.name}</span>
                      <span className="text-slate-400 text-[11px] leading-tight block">
                        {act.description}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs whitespace-nowrap">
                      PKR {companion.sessionRate.toLocaleString()}/hr
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages & Interests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                  Languages
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {companion.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Interests & Topics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {companion.interests.map((int, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/80"
                    >
                      {int}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Schedule */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Availability Schedule
              </h4>
              <div className="p-3.5 bg-slate-800/50 border border-slate-800 rounded-2xl text-xs space-y-1.5">
                <div className="flex gap-4">
                  <span className={`font-semibold ${companion.availability.weekdays ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {companion.availability.weekdays ? '✓ Weekdays Available' : '✕ Weekdays Unavailable'}
                  </span>
                  <span className={`font-semibold ${companion.availability.weekends ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {companion.availability.weekends ? '✓ Weekends Available' : '✕ Weekends Unavailable'}
                  </span>
                </div>
                <div className="text-slate-400 pt-1">
                  <strong className="text-slate-300">Preferred Hours:</strong> {companion.availability.timeSlots.join(' • ')}
                </div>
              </div>
            </div>

            {/* Public Social Links (Verified by Platform) */}
            {companion.socialLinks && companion.socialLinks.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                  Public Social Profiles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {companion.socialLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-slate-800 bg-slate-800/40 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-white flex items-center gap-1">
                          {link.platform}
                          {link.isVerifiedByAdmin ? (
                            <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800">
                              ✓ Verified by platform
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400 font-medium px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-900">
                              Verification pending
                            </span>
                          )}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-emerald-300 text-[11px] truncate max-w-[200px] flex items-center gap-1 underline"
                        >
                          {link.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Reviews Section with Breakdown & Companion Reply */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  Verified Reviews ({companionReviews.length})
                </h4>
                <span className="text-[11px] text-slate-500">
                  Only completed bookings generate reviews
                </span>
              </div>

              {companionReviews.length === 0 ? (
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
                  No public reviews posted yet for this companion.
                </div>
              ) : (
                <div className="space-y-3">
                  {companionReviews.map(rev => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl border border-slate-800 bg-slate-800/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rev.reviewerName}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed">{rev.comment}</p>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400">
                          {rev.activityName}
                        </span>

                        {!rev.isReported ? (
                          <button
                            onClick={() => reportReview(rev.id)}
                            className="text-slate-500 hover:text-red-400 text-[10px] transition"
                          >
                            Report review
                          </button>
                        ) : (
                          <span className="text-amber-400 text-[10px]">Under moderation</span>
                        )}
                      </div>

                      {/* Companion Reply */}
                      {rev.companionReply && (
                        <div className="mt-2 p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 text-[11px] space-y-1">
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <CornerDownRight className="w-3 h-3" />
                            {companion.displayName} (Companion Reply):
                          </span>
                          <p className="text-slate-300">{rev.companionReply.comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy & Safety Information Note */}
            <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Privacy Guaranteed:</strong> Exact residence, CNIC, and phone numbers are never exposed. Meetups take place exclusively at public commercial venues.
              </span>
            </div>

            {/* Report & Block Options */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Report Profile
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => blockUser(companion.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  {isBlocked ? 'Blocked' : 'Block User'}
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                ID: {companion.id}
              </span>
            </div>
          </div>

          {/* Sticky Footer CTA */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Session Fee
              </span>
              <span className="text-lg font-extrabold text-emerald-400">
                PKR {companion.sessionRate.toLocaleString()}
                <span className="text-xs font-normal text-slate-400"> / hour</span>
              </span>
            </div>

            <button
              onClick={() => {
                if (onOpenBookingDirect) {
                  onOpenBookingDirect(companion);
                } else {
                  setIsBookingModalOpen(true);
                }
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Request Booking
            </button>
          </div>
        </div>
      </div>

      {/* Sub modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        companion={companion}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedUserId={companion.id}
        reportedUserName={companion.displayName}
      />
    </>
  );
};
