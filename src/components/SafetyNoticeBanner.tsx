import React from 'react';
import { ShieldAlert, MapPin, EyeOff, AlertTriangle } from 'lucide-react';

interface SafetyNoticeBannerProps {
  onOpenGuidelines?: () => void;
  onOpenSafetyGuide?: () => void;
}

export const SafetyNoticeBanner: React.FC<SafetyNoticeBannerProps> = ({
  onOpenGuidelines,
  onOpenSafetyGuide
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border-b border-emerald-800/60 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30 text-xs shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              18+ ONLY
            </span>
            <span className="text-slate-200">
              <strong className="text-white">Strict Non-Sexual Activity Policy:</strong> MeetUp Pakistan is an adult social companionship platform exclusively for wholesome public meetups. Prostitution, sexual services, and private hotel/residence bookings are strictly prohibited.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenGuidelines && (
              <button
                onClick={onOpenGuidelines}
                className="underline hover:text-emerald-300 font-medium transition cursor-pointer text-slate-300"
              >
                Community Guidelines
              </button>
            )}
            <span className="text-slate-600">|</span>
            {onOpenSafetyGuide && (
              <button
                onClick={onOpenSafetyGuide}
                className="underline hover:text-emerald-300 font-medium transition cursor-pointer text-slate-300 flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                Public Places Rule
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
