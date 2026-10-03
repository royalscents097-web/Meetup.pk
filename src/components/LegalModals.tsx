import React from 'react';
import { X, ShieldCheck, AlertOctagon, PhoneCall, MapPin, CheckCircle, Lock } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Terms of Service</h3>
              <p className="text-xs text-slate-400">MeetUp Pakistan • Last Updated: October 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900">
            <h4 className="font-bold flex items-center gap-2 text-base text-red-800">
              <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
              1. Strict 18+ & Non-Sexual Platform Mandate
            </h4>
            <p className="mt-1.5 text-xs text-red-800/90 leading-normal">
              MeetUp Pakistan is strictly an adult platform for legitimate social companionship, cultural exploration, networking, and public activities. We strictly prohibit prostitution, commercial sex work, sexual solicitation, adult escorting, or any exchange of money for sexual favors. Any violation will result in immediate permanent account termination, IP ban, and reporting to relevant Pakistani legal authorities.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-1">2. Age Requirement</h4>
            <p>
              Users must be at least 18 years of age to register as a Customer or Companion. Providing a false date of birth or attempting to bypass age verification violates these terms and may lead to prosecution under applicable cybercrime regulations.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-1">3. Public Places Rule</h4>
            <p>
              All companion sessions MUST take place in public, visible spaces such as licensed cafes, restaurants, shopping centers, art galleries, public parks, libraries, or ticketed events. Bookings at private residential apartments, hotel rooms, or secluded private vehicles are explicitly barred.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-1">4. Bookings, Cancellations & Refunds</h4>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Bookings are confirmed only after companion acceptance.</li>
              <li>Customers may cancel pending requests at zero cost. For confirmed bookings, cancellation guidelines apply to protect companion time.</li>
              <li>If a companion fails to appear (No-Show) or violates safety rules, the transaction is marked Disputed or Refunded.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-1">5. Platform Commission</h4>
            <p>
              MeetUp Pakistan deducts a transparent platform commission (configurable by administration, currently defaulting to 10%) from completed bookings to fund identity verification, server hosting, customer support, and safety auditing. The remaining amount is disbursed to the companion.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-1">6. Privacy & Identity Security</h4>
            <p>
              To protect all participants, sensitive identity documents (such as CNIC copies, private phone numbers, residential addresses, and exact live coordinates) are never published on user-facing profiles. Only approximate districts/areas (e.g., Gulberg, F-7, Clifton) are visible.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-1">7. Reviews & Dispute Resolution</h4>
            <p>
              Only parties of completed bookings may submit genuine ratings and reviews. Reviews containing defamatory, obscene, or fraudulent remarks are moderated and removed by platform administrators.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export const CommunityGuidelinesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-white border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Community Guidelines</h3>
              <p className="text-xs text-emerald-300">Safety, Respect & Legitimate Social Outings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h4 className="font-bold text-emerald-900 text-base mb-1">Our Core Mission</h4>
            <p className="text-emerald-800 text-xs">
              MeetUp Pakistan empowers adults to find trusted, verified companions to share everyday public experiences — from trying a new coffee spot, attending a literary festival, touring historic monuments in Lahore, to practicing spoken English or playing board games.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-600" />
              Strictly Prohibited Conduct (Zero-Tolerance)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'Sexual solicitation, escorting, or prostitution',
                'Hotel-room or private residence bookings',
                'Explicit sexual talk, photos, or messaging',
                'Harassment, stalking, or boundary violations',
                'Underage users (strictly 18+ required)',
                'Human trafficking, coercion, or intimidation',
                'Fake profiles, impersonation, or stolen photos',
                'Soliciting loans, financial fraud, or crypto scams'
              ].map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 bg-red-50/70 border border-red-100 rounded-lg text-xs text-red-900 font-medium">
                  <span className="text-red-600 font-bold shrink-0">✕</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Expected Courtesies & Best Practices
            </h4>
            <div className="space-y-2 text-xs">
              <p className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>Punctuality & Reliability:</strong> Respect each other's time. If running late, notify your companion through in-app messaging immediately.
              </p>
              <p className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>Public Places Always:</strong> Always meet at well-lit, populated commercial spots. If a partner suggests moving to a private secluded spot, politely decline and report the user.
              </p>
              <p className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>Mutual Respect:</strong> Maintain professional, friendly social boundaries at all times.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
          >
            Acknowledge Guidelines
          </button>
        </div>
      </div>
    </div>
  );
};

export const SafetyGuidelinesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Public Meetup & Personal Safety Guide</h3>
              <p className="text-xs text-slate-400">Practical Safety Measures for Pakistan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-sm text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                1. Public Venues Only
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose recognized cafes (e.g. Second Cup, Coffee Bean, Gloria Jean's), food courts, malls (Centaurus, Emporium, Dolmen), or ticketed festivals. Never agree to private residences or personal hotel rooms.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                2. Inform a Friend or Family Member
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Share your meetup location, date, time, and companion's public profile name with a trusted friend before heading out. Keep your phone charged.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                3. Keep Finances on Platform
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Do not wire money directly through non-verified informal channels. All session fees and commission calculations are formally tracked on your booking receipt.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                4. Trust Your Instincts
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If someone asks questions that make you uncomfortable or pressures you to violate boundaries, leave immediately. Use our in-app "Report" and "Block" buttons.
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <h4 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-700" />
              Emergency Helplines in Pakistan
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-amber-900">
              <div className="bg-white/80 p-2 rounded border border-amber-200">
                <span className="font-bold block">Police Emergency:</span> 15
              </div>
              <div className="bg-white/80 p-2 rounded border border-amber-200">
                <span className="font-bold block">Rescue / Ambulance:</span> 1122
              </div>
              <div className="bg-white/80 p-2 rounded border border-amber-200">
                <span className="font-bold block">Women Helpline (Punjab):</span> 1043
              </div>
              <div className="bg-white/80 p-2 rounded border border-amber-200">
                <span className="font-bold block">Women Helpline (Sindh):</span> 1094
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
