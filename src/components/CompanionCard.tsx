import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Star,
  Globe2,
  Sparkles,
  Calendar,
  MoreVertical,
  ShieldAlert,
  Ban,
  Heart,
  Briefcase,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { CompanionProfile } from '../types';
import { useApp } from '../context/AppContext';
import { ProfileModal } from './ProfileModal';
import { BookingModal } from './BookingModal';
import { ReportModal } from './ReportModal';
import { AnalyticsService } from '../services/analytics';

interface CompanionCardProps {
  companion: CompanionProfile;
  onOpenBookingDirect?: (companion: CompanionProfile) => void;
}

export const CompanionCard: React.FC<CompanionCardProps> = ({ companion, onOpenBookingDirect }) => {
  const { activities, blockUser, blockedUserIds, currentUser, toggleFavorite } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isBlocked = blockedUserIds.includes(companion.id);
  if (isBlocked) return null;

  const isFavorited = currentUser.favorites?.includes(companion.id);

  const offeredActivities = activities
    .filter(a => companion.activityIds.includes(a.id))
    .slice(0, 3);

  const handleCardClick = () => {
    AnalyticsService.track('profile_view', { companionId: companion.id, name: companion.displayName });
    setIsProfileOpen(true);
  };

  return (
    <>
      <div className="group bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-emerald-500/60 shadow-lg hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300 flex flex-col overflow-hidden text-white backdrop-blur-sm">
        {/* Top Image & Verification Badge */}
        <div className="relative h-60 sm:h-64 bg-slate-950 overflow-hidden cursor-pointer" onClick={handleCardClick}>
          <img
            src={companion.profilePhoto}
            alt={companion.displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/30" />

          {/* Verification Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {companion.verificationStatus === 'Verified' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                ✓ Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-medium shadow-md">
                Pending Verification
              </span>
            )}
          </div>

          {/* Top Right: Favorite Button & Rate Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(companion.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition ${
                isFavorited
                  ? 'bg-rose-600/90 text-white'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-900/90'
              }`}
              title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
            </button>

            <span className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-emerald-400 font-extrabold text-xs shadow-md border border-slate-700/60">
              PKR {companion.sessionRate.toLocaleString()}
              <span className="text-[10px] font-normal text-slate-400">/session</span>
            </span>
          </div>

          {/* Bottom Overlay on Image: Name & Location */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg drop-shadow-sm flex items-center gap-1.5 text-white">
                {companion.displayName}
                <span className="text-xs font-semibold text-slate-300">
                  • {companion.age} yrs
                </span>
              </h3>
              {companion.rating > 0 && (
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold text-amber-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{companion.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{companion.cityName} • {companion.area}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          {/* Professional Category & Stats */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium text-emerald-400/90 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-emerald-400" />
              {companion.professionalCategory || 'Social Companion'}
            </span>
            <span className="text-slate-300 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {companion.completedActivitiesCount || companion.totalBookings || 0} completed activities
            </span>
          </div>

          {/* Short Bio snippet */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {companion.bio}
          </p>

          {/* Activity Tags */}
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1.5">
              {offeredActivities.map(act => (
                <span
                  key={act.id}
                  className="px-2 py-0.5 rounded-lg bg-emerald-950/60 text-emerald-300 text-[11px] font-medium border border-emerald-800/50"
                >
                  {act.name}
                </span>
              ))}
              {companion.activityIds.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-medium">
                  +{companion.activityIds.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Languages & Response Speed */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-slate-500" />
              <span className="truncate max-w-[130px]">{companion.languages.join(' • ')}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{companion.responseTime || 'Fast reply'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleCardClick}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition text-center cursor-pointer border border-slate-700"
            >
              View Profile
            </button>
            <button
              onClick={() => {
                if (onOpenBookingDirect) {
                  onOpenBookingDirect(companion);
                } else {
                  setIsBookingOpen(true);
                }
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Request Booking
            </button>

            {/* Quick Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700"
                title="Options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <div className="absolute bottom-full right-0 mb-1 w-36 bg-slate-900 rounded-xl shadow-xl border border-slate-800 py-1 z-20 text-xs">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setIsReportOpen(true);
                    }}
                    className="w-full px-3 py-1.5 text-left text-red-400 hover:bg-slate-800 flex items-center gap-1.5 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Report
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      blockUser(companion.id);
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 transition"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Block User
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        companion={companion}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        companion={companion}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportedUserId={companion.id}
        reportedUserName={companion.displayName}
      />
    </>
  );
};
