import React from 'react';
import { ShieldCheck, MapPin, AlertOctagon, Heart, Phone, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onOpenTerms: () => void;
  onOpenGuidelines: () => void;
  onOpenSafetyGuide: () => void;
  onOpenSafetyCenter: () => void;
  onNavigateToAdmin: () => void;
  onSelectCity: (cityId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onOpenGuidelines,
  onOpenSafetyGuide,
  onOpenSafetyCenter,
  onNavigateToAdmin,
  onSelectCity
}) => {
  const { cities, activities } = useApp();

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* Strict Safety Notice Box in Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                18+ Adult Social Activities Marketplace (Non-Sexual)
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                  Legal Compliance
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                MeetUp.pk strictly prohibits prostitution, sexual solicitation, adult escorting, and private residence/hotel meetings. All connections are for legitimate public activities (coffee, food, city tours, language practice, gaming, and networking).
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSafetyCenter}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition shrink-0 flex items-center gap-1.5 border border-slate-700"
          >
            <MapPin className="w-3.5 h-3.5" />
            Public Safety Protocols
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
              MP
            </div>
            <span className="font-extrabold text-lg text-white">MeetUp.pk</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
            <strong>"Meet. Connect. Experience."</strong> Pakistan's premier verified social companionship platform connecting adults for everyday experiences in public spaces.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 space-y-1">
            <p>Police Emergency Helpline: 15</p>
            <p>Rescue Emergency Service: 1122</p>
            <p>Punjab Women Protection: 1043 • Sindh: 1094</p>
          </div>
        </div>

        {/* Launch Cities */}
        <div className="space-y-3">
          <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Launch & Expanding Cities
          </h5>
          <ul className="space-y-1.5 text-slate-400">
            {cities.map(city => (
              <li key={city.id}>
                <button
                  onClick={() => onSelectCity(city.id)}
                  className={`hover:text-emerald-400 transition text-left cursor-pointer ${
                    city.isActive ? 'text-slate-300 font-medium' : 'text-slate-600'
                  }`}
                >
                  {city.name} {city.isActive ? '✓' : '(Upcoming)'}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Approved Activities */}
        <div className="space-y-3">
          <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Approved Public Activities
          </h5>
          <ul className="space-y-1.5 text-slate-400">
            {activities.slice(0, 7).map(act => (
              <li key={act.id} className="hover:text-emerald-400 transition">
                {act.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Governance */}
        <div className="space-y-3">
          <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Trust & Governance
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={onOpenTerms} className="hover:text-white transition cursor-pointer">
                Terms of Service (18+)
              </button>
            </li>
            <li>
              <button onClick={onOpenGuidelines} className="hover:text-white transition cursor-pointer">
                Community Guidelines
              </button>
            </li>
            <li>
              <button onClick={onOpenSafetyGuide} className="hover:text-white transition cursor-pointer">
                Emergency Helplines & Tips
              </button>
            </li>
            <li>
              <button onClick={onOpenSafetyCenter} className="hover:text-white transition cursor-pointer">
                Safety Center
              </button>
            </li>
            <li>
              <button onClick={onNavigateToAdmin} className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1 cursor-pointer">
                <Sparkles className="w-3 h-3" />
                Admin Console (/admin)
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 MeetUp.pk. All rights reserved. Strictly 18+ Adults Only.</p>
          <p className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Crafted for safe, wholesome public social connections in Pakistan</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
