import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReportCategory } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: string;
  reportedUserName: string;
  bookingId?: string;
}

const REPORT_CATEGORIES: ReportCategory[] = [
  'Sexual Solicitation / Escort',
  'Private Location Pressure',
  'Harassment / Inappropriate Behavior',
  'Underage User',
  'Fraud / Scam',
  'Impersonation',
  'No Show',
  'Other Safety Concern'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserName,
  bookingId
}) => {
  const { submitReport, blockUser } = useApp();
  const [category, setCategory] = useState<ReportCategory>('Sexual Solicitation / Escort');
  const [description, setDescription] = useState('');
  const [shouldBlock, setShouldBlock] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitReport({
      reportedUserId,
      reportedUserName,
      category,
      description,
      bookingId
    });

    if (shouldBlock) {
      blockUser(reportedUserId);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-red-950 text-white border-b border-red-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Report Safety Concern</h3>
              <p className="text-xs text-red-300">Reporting: {reportedUserName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-red-300 hover:text-white hover:bg-red-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Report Received</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Our safety compliance desk reviews all reports 24/7. Immediate protective actions including profile suspension will be enforced if violations are verified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 leading-normal flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                MeetUp Pakistan has a zero-tolerance policy against sexual solicitation, private room pressure, harassment, and unauthorized conduct.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Violation Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ReportCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {REPORT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Details & Evidence *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Please describe what occurred in detail (e.g. unsolicited messages, request to meet at private hotel, verbal pressure)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="blockUserCheck"
                checked={shouldBlock}
                onChange={e => setShouldBlock(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
              />
              <label htmlFor="blockUserCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                Also block {reportedUserName} from sending me future messages or booking requests
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!description.trim()}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold shadow transition"
              >
                Submit Safety Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
