import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Calendar,
  DollarSign,
  Percent,
  Star,
  ShieldAlert,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
  Search,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Ban,
  FileText,
  Activity,
  CreditCard,
  ExternalLink,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationStatus, ReportStatus, PayoutStatus } from '../types';
import { AnalyticsService } from '../services/analytics';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    companionProfiles,
    bookings,
    transactions,
    payouts,
    reviews,
    reports,
    auditLogs,
    flaggedMessages,
    cities,
    activities,
    commissionSettings,
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
  } = useApp();

  type AdminTab =
    | 'overview'
    | 'verification'
    | 'users'
    | 'companions'
    | 'bookings'
    | 'transactions'
    | 'payouts'
    | 'anti_bypass'
    | 'reports'
    | 'reviews'
    | 'commissions'
    | 'cities'
    | 'activities'
    | 'audit_logs'
    | 'analytics';

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Commission Form State
  const [customCommission, setCustomCommission] = useState(commissionSettings.defaultPercentage);
  const [commissionSuccess, setCommissionSuccess] = useState(false);

  // New City Form State
  const [newCityName, setNewCityName] = useState('');
  const [newCityProvince, setNewCityProvince] = useState('Punjab');
  const [newCityAreas, setNewCityAreas] = useState('');

  // Add Area to City State
  const [selectedCityForArea, setSelectedCityForArea] = useState(cities[0]?.id || 'city-lahore');
  const [newAreaName, setNewAreaName] = useState('');

  // New Activity Form State
  const [newActName, setNewActName] = useState('');
  const [newActDesc, setNewActDesc] = useState('');

  // Manual Review Note State
  const [reviewNote, setReviewNote] = useState('');

  // KPI Calculations
  const totalUsers = users.length;
  const verifiedCompanions = companionProfiles.filter(c => c.verificationStatus === 'Verified').length;
  const pendingVerification = companionProfiles.filter(c => c.verificationStatus === 'Pending Verification').length;
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const grossBookingValue = bookings.reduce((sum, b) => sum + b.grossAmount, 0);
  const platformRevenue = transactions.reduce((sum, t) => sum + t.platform_fee, 0);
  const totalRefunds = bookings.filter(b => b.status === 'Refunded').length;
  const totalDisputes = bookings.filter(b => b.status === 'Disputed').length;
  const reportedProfiles = new Set(reports.map(r => r.reportedUserId)).size;

  const handleUpdateCommission = (pct: number) => {
    adminUpdateCommission(pct);
    setCustomCommission(pct);
    setCommissionSuccess(true);
    setTimeout(() => setCommissionSuccess(false), 2000);
  };

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    const areas = newCityAreas.split(',').map(s => s.trim()).filter(Boolean);
    adminAddCity(newCityName.trim(), newCityProvince, areas);
    setNewCityName('');
    setNewCityAreas('');
  };

  const handleAddAreaToCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    adminAddCityArea(selectedCityForArea, newAreaName.trim());
    setNewAreaName('');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActName.trim() || !newActDesc.trim()) return;
    adminAddActivity(newActName.trim(), newActDesc.trim(), 'Sparkles');
    setNewActName('');
    setNewActDesc('');
  };

  const analyticsEvents = AnalyticsService.getEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-800">
              /admin
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Executive Governance & Operations Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            MeetUp.pk Compliance & Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervise verification, escrow revenue, anti-bypass moderation, safety reports, and cities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetToDemoData}
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Reset to fresh demo data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Seed Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-bold text-slate-400">
        {[
          { id: 'overview', label: 'Dashboard & Metrics', icon: LayoutDashboard },
          { id: 'verification', label: `Verification (${pendingVerification})`, icon: ShieldCheck, alert: pendingVerification > 0 },
          { id: 'users', label: `Users (${totalUsers})`, icon: Users },
          { id: 'companions', label: `Companions (${companionProfiles.length})`, icon: Sparkles },
          { id: 'bookings', label: `Bookings (${totalBookings})`, icon: Calendar },
          { id: 'transactions', label: `Transactions (${transactions.length})`, icon: CreditCard },
          { id: 'payouts', label: `Payouts (${payouts.length})`, icon: DollarSign },
          { id: 'anti_bypass', label: `Bypass Queue (${flaggedMessages.filter(f => f.status === 'pending_review').length})`, icon: AlertTriangle, alert: flaggedMessages.some(f => f.status === 'pending_review') },
          { id: 'reports', label: `Safety Reports (${reports.length})`, icon: ShieldAlert, alert: reports.some(r => r.status === 'Pending') },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { id: 'commissions', label: `Commission (${commissionSettings.defaultPercentage}%)`, icon: Percent },
          { id: 'cities', label: `Cities & Areas (${cities.length})`, icon: MapPin },
          { id: 'activities', label: `Activities (${activities.length})`, icon: Sparkles },
          { id: 'audit_logs', label: `Audit Trail (${auditLogs.length})`, icon: ClipboardList },
          { id: 'analytics', label: 'Analytics', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-emerald-400 font-extrabold shadow-sm'
                  : 'hover:bg-slate-900 text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Users</span>
              <div className="text-2xl font-black text-white">{totalUsers}</div>
              <span className="text-[11px] text-slate-400">18+ Legal Adults</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verified Companions</span>
              <div className="text-2xl font-black text-emerald-400">{verifiedCompanions}</div>
              <span className="text-[11px] text-amber-400 font-medium">{pendingVerification} pending audit</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Bookings</span>
              <div className="text-2xl font-black text-white">{totalBookings}</div>
              <span className="text-[11px] text-slate-400">{completedBookings} completed</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gross Booking Value</span>
              <div className="text-2xl font-black text-white">PKR {grossBookingValue.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">Across Pakistan</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Platform Revenue</span>
              <div className="text-2xl font-black text-emerald-400">PKR {platformRevenue.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">Commission Earned</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Bookings</span>
              <span className="text-lg font-bold text-white">{bookings.length} active</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Disputes</span>
              <span className="text-lg font-bold text-amber-400">{totalDisputes} under investigation</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Refunds</span>
              <span className="text-lg font-bold text-indigo-400">{totalRefunds} processed</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reported Profiles</span>
              <span className="text-lg font-bold text-red-400">{reportedProfiles} flagged</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. VERIFICATION WORKFLOW & SOCIAL LINKS AUDIT */}
      {activeTab === 'verification' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Administrative Verification Workflow (CNIC / Passport & Social Profiles)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Audit government documents and manual social profile submissions. Never mark profiles verified automatically.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {companionProfiles.map(comp => (
              <div key={comp.id} className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={comp.profilePhoto}
                    alt={comp.displayName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-700 mt-1"
                  />
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{comp.displayName}</span>
                      <span className="text-slate-400">({comp.age} yrs • {comp.gender})</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          comp.verificationStatus === 'Verified'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : comp.verificationStatus === 'Pending Verification'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {comp.verificationStatus}
                      </span>
                    </div>

                    <div className="text-slate-400">
                      Category: <strong className="text-white">{comp.professionalCategory}</strong> • Location: {comp.cityName} ({comp.area})
                    </div>

                    {/* Masked Govt Document */}
                    {comp.verificationDocsSubmitted ? (
                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                        <span className="font-bold text-white">Govt Document: {comp.verificationDocsSubmitted.idType}</span> • Masked Reference: {comp.verificationDocsSubmitted.documentNumberMasked}
                        <span className="block text-slate-400 mt-0.5">{comp.verificationDocsSubmitted.statusNote}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic block">No document upload submitted.</span>
                    )}

                    {/* Social Media Links to Verify */}
                    {comp.socialLinks && comp.socialLinks.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Submitted Social Media Links:
                        </span>
                        {comp.socialLinks.map((sLink, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-[11px]">
                            <span className="text-slate-300 font-semibold">{sLink.platform}:</span>
                            <a href={sLink.url} target="_blank" rel="noreferrer" className="text-emerald-400 underline">
                              {sLink.url}
                            </a>
                            <button
                              onClick={() => adminVerifySocialLink(comp.id, sLink.platform, !sLink.isVerifiedByAdmin)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                                sLink.isVerifiedByAdmin
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {sLink.isVerifiedByAdmin ? '✓ Verified Link' : 'Approve Link'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => adminVerifyCompanion(comp.id, 'Verified', 'Approved by Compliance Officer')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition cursor-pointer"
                  >
                    Approve (Verify)
                  </button>
                  <button
                    onClick={() => adminVerifyCompanion(comp.id, 'Rejected', 'Document invalid or unclear')}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => adminVerifyCompanion(comp.id, 'Suspended', 'Suspended pending investigation')}
                    className="px-3.5 py-1.5 rounded-xl border border-red-800 text-red-400 hover:bg-red-950 text-xs font-bold transition cursor-pointer"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ANTI-BYPASS MODERATION QUEUE (Section 11) */}
      {activeTab === 'anti_bypass' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Anti-Bypass Moderation Queue
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Messages and bios flagged automatically for phone numbers, WhatsApp, IBAN, or off-platform payment solicitations.
            </p>
          </div>

          {flaggedMessages.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No flagged bypass messages currently in the queue.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {flaggedMessages.map(flg => (
                <div key={flg.id} className="py-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{flg.senderName}</span>
                      <span className="text-slate-500">Booking: {flg.bookingId}</span>
                      <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">
                        {flg.detectedPattern}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                      Status: {flg.status}
                    </span>
                  </div>

                  <p className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px]">
                    "{flg.flaggedText}"
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => adminResolveFlaggedMessage(flg.id, 'cleared')}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Clear / False Alarm
                    </button>
                    <button
                      onClick={() => adminResolveFlaggedMessage(flg.id, 'warned')}
                      className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold"
                    >
                      Send In-App Warning
                    </button>
                    <button
                      onClick={() => {
                        adminSuspendUser(flg.senderId);
                        adminResolveFlaggedMessage(flg.id, 'suspended');
                      }}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                    >
                      Suspend User Account
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PAYMENTS & TRANSACTIONS LEDGER (Section 9) */}
      {activeTab === 'transactions' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Transaction Ledger</h2>
            <p className="text-xs text-slate-400">
              Immutable ledger of platform payments, provider fees, and companion net amounts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Gross</th>
                  <th className="p-3">Platform Fee</th>
                  <th className="p-3">Gateway Fee</th>
                  <th className="p-3">Net Companion</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map(t => (
                  <tr key={t.transaction_id}>
                    <td className="p-3 font-mono font-bold text-white">{t.transaction_id}</td>
                    <td className="p-3 font-mono text-emerald-400">{t.booking_id}</td>
                    <td className="p-3 font-bold text-white">PKR {t.gross_amount.toLocaleString()}</td>
                    <td className="p-3 text-emerald-400 font-semibold">PKR {t.platform_fee.toLocaleString()}</td>
                    <td className="p-3 text-slate-400">PKR {t.provider_fee.toLocaleString()}</td>
                    <td className="p-3 font-semibold text-slate-200">PKR {t.net_amount.toLocaleString()}</td>
                    <td className="p-3">{t.payment_method}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PAYOUT SYSTEM (Section 16) */}
      {activeTab === 'payouts' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Companion Payout Records</h2>
            <p className="text-xs text-slate-400">
              Manage companion disbursements. Statuses: Pending, Eligible, Processing, Paid, Failed, Held.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Payout ID</th>
                  <th className="p-3">Companion</th>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Net Disbursed</th>
                  <th className="p-3">Account Ref</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {payouts.map(p => (
                  <tr key={p.payout_id}>
                    <td className="p-3 font-mono font-bold text-white">{p.payout_id}</td>
                    <td className="p-3">{companionProfiles.find(c => c.id === p.companion_id)?.displayName || p.companion_id}</td>
                    <td className="p-3 font-mono text-emerald-400">{p.booking_id}</td>
                    <td className="p-3 font-bold text-white">PKR {p.net_amount.toLocaleString()}</td>
                    <td className="p-3 font-mono text-slate-400">{p.account_number_masked}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.payout_status === 'Paid'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {p.payout_status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {p.payout_status !== 'Paid' && (
                        <button
                          onClick={() => adminUpdatePayoutStatus(p.payout_id, 'Paid')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. COMMISSIONS CONFIGURATION */}
      {activeTab === 'commissions' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-400" />
              Configurable Platform Commission Model
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust platform commission percentage without changing code. Preset or custom percentage.
            </p>
          </div>

          {commissionSuccess && (
            <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Commission rate updated successfully to {commissionSettings.defaultPercentage}%!
            </div>
          )}

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-2.5">
              {[5, 8, 10, 15].map(pct => (
                <button
                  key={pct}
                  onClick={() => handleUpdateCommission(pct)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                    commissionSettings.defaultPercentage === pct
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {pct}% Platform Fee
                </button>
              ))}
            </div>
          </div>

          {/* Custom Percentage Input */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 max-w-md space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Set Custom Percentage (5% - 25%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="25"
                value={customCommission}
                onChange={e => setCustomCommission(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-sm font-bold text-white"
              />
              <span className="text-sm font-bold text-slate-400">%</span>
              <button
                onClick={() => handleUpdateCommission(customCommission)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                Apply Custom %
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. EXPANDABLE CITIES & PUBLIC AREAS (Section 18 & 19) */}
      {activeTab === 'cities' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Dynamic Cities & Searchable Public Areas
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Add new Pakistani cities and public areas (Gulberg, DHA, F-7, etc.) without exposing residential addresses.
            </p>
          </div>

          {/* Add City Form */}
          <form onSubmit={handleAddCity} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <span className="text-xs font-bold text-white uppercase block">Add Expansion City</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newCityName}
                onChange={e => setNewCityName(e.target.value)}
                placeholder="City Name (e.g. Quetta, Hyderabad)"
                className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs"
              />
              <select
                value={newCityProvince}
                onChange={e => setNewCityProvince(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs"
              >
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Federal Capital">Federal Capital</option>
              </select>
              <input
                type="text"
                value={newCityAreas}
                onChange={e => setNewCityAreas(e.target.value)}
                placeholder="Areas (e.g. Cantt, Jinnah Road)"
                className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Add City to Marketplace
            </button>
          </form>

          {/* Add Area to Existing City */}
          <form onSubmit={handleAddAreaToCity} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <span className="text-xs font-bold text-white uppercase block">Add Area to Existing City</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedCityForArea}
                onChange={e => setSelectedCityForArea(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium"
              >
                {cities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                value={newAreaName}
                onChange={e => setNewAreaName(e.target.value)}
                placeholder="e.g. Model Town, F-11, Clifton Block 9"
                className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              Add Area to City
            </button>
          </form>

          {/* Existing Cities List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cities.map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{c.name} ({c.province})</span>
                  <button
                    onClick={() => adminToggleCity(c.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.isActive
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  <strong>Areas:</strong> {c.popularAreas.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. AUDIT LOGS TRAIL (Section 30) */}
      {activeTab === 'audit_logs' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Immutable Administrative Audit Trail</h2>
            <p className="text-xs text-slate-400">
              Every sensitive admin action is logged with timestamp, admin ID, target, and justification.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {auditLogs.map(log => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 font-mono">{log.action}</span>
                    <span className="text-slate-500">• Target: {log.targetType} ({log.targetId})</span>
                  </div>
                  <p className="text-slate-300">{log.details}</p>
                </div>
                <div className="text-right shrink-0 text-slate-500 text-[11px]">
                  <span>{log.adminName}</span>
                  <span className="block">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. ANALYTICS (Section 24) */}
      {activeTab === 'analytics' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Platform Activity & Discovery Analytics</h2>
            <p className="text-xs text-slate-400">
              Real-time analytics events captured: profile views, searches, booking starts, payments, reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Recorded Events</span>
              <div className="text-2xl font-black text-white">{analyticsEvents.length}</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Searches Logged</span>
              <div className="text-2xl font-black text-emerald-400">
                {analyticsEvents.filter(e => e.eventName === 'search').length}
              </div>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Profile Views</span>
              <div className="text-2xl font-black text-white">
                {analyticsEvents.filter(e => e.eventName === 'profile_view').length}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Recent Events Stream
            </span>
            <div className="max-h-60 overflow-y-auto space-y-1.5 divide-y divide-slate-850">
              {analyticsEvents.slice(-20).reverse().map(e => (
                <div key={e.id} className="py-2 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono text-emerald-400 font-bold">{e.eventName}</span>
                  <span className="text-slate-500 text-[11px] truncate max-w-md">
                    {JSON.stringify(e.properties)}
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    {new Date(e.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
