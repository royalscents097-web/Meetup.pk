import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Lock,
  PhoneCall,
  AlertOctagon,
  Users,
  CheckCircle,
  EyeOff
} from 'lucide-react';

interface SafetyCenterViewProps {
  onOpenGuidelines: () => void;
  onOpenTerms: () => void;
}

export const SafetyCenterView: React.FC<SafetyCenterViewProps> = ({
  onOpenGuidelines,
  onOpenTerms
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Platform Trust & Integrity
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          MeetUp.pk Safety Center
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Our core architecture is engineered around adult transparency, non-sexual boundaries, and accountable public meetups across Pakistan.
        </p>
      </div>

      {/* Core Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Strictly 18+ Adults Only */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">1. Strict 18+ Age Enforcement</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            MeetUp.pk is restricted strictly to legal adults aged 18 and older. Registration requires explicit date of birth entry, digital identity cross-validation, and legal acknowledgement. Attempting to register as a minor is blocked and violates Pakistani cyber regulations.
          </p>
        </div>

        {/* 2. Non-Sexual Activity Policy */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-950 text-red-400 border border-red-800">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">2. Zero Tolerance for Sexual Services</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            MeetUp.pk is NOT an escort or adult service. Prostitution, solicitation, erotic messaging, overnight bookings, or private apartment/hotel room visits are strictly forbidden. Accounts violating this are banned and reported to relevant authorities.
          </p>
        </div>

        {/* 3. Public Places Rule */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">3. Public Commercial Venues Only</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All meetings must occur in well-lit, open public establishments (licensed cafes, reputable restaurants, shopping malls, cultural festivals, public parks). If a companion or customer requests a private venue, politely decline and report immediately.
          </p>
        </div>

        {/* 4. Payment Protection & Escrow */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">4. Keep Payments On-Platform</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Never send offline bank transfers, cash in advance, or accept off-platform payment links. Platform escrow guarantees dispute resolution and refund capability if a meetup does not occur or terms are violated.
          </p>
        </div>
      </div>

      {/* Emergency Helplines in Pakistan */}
      <div className="p-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-lg text-white">Emergency Helplines in Pakistan</h3>
        </div>
        <p className="text-xs text-slate-300">
          Save these critical emergency contact numbers in your phone before attending any social gathering:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Police Emergency</span>
            <span className="font-extrabold text-white text-base">15</span>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rescue & Medical</span>
            <span className="font-extrabold text-white text-base">1122</span>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Punjab Women Helpline</span>
            <span className="font-extrabold text-white text-base">1043</span>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Sindh Women Helpline</span>
            <span className="font-extrabold text-white text-base">1094</span>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee */}
      <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <EyeOff className="w-5 h-5 text-emerald-400" />
          Privacy & Anti-Doxxing Protection
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          MeetUp.pk never displays residential addresses, CNIC card images, private phone numbers, or personal banking credentials on public profiles. Only the city and general commercial area (e.g., Gulberg, DHA, F-7, Clifton) are visible.
        </p>
        <div className="pt-2 flex items-center gap-4 text-xs font-bold text-emerald-400">
          <button onClick={onOpenGuidelines} className="hover:underline">
            Read Community Guidelines
          </button>
          <span>•</span>
          <button onClick={onOpenTerms} className="hover:underline">
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};
