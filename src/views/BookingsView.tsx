import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  MessageSquare,
  ShieldAlert,
  CreditCard,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking, BookingStatus, PaymentStatus } from '../types';
import { ReviewModal } from '../components/ReviewModal';
import { ReportModal } from '../components/ReportModal';

interface BookingsViewProps {
  onOpenChatWithBooking?: (bookingId: string) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ onOpenChatWithBooking }) => {
  const {
    currentUser,
    bookings,
    updateBookingStatus,
    completeBookingPayment
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [selectedBookingForReport, setSelectedBookingForReport] = useState<Booking | null>(null);
  const [suggestTimeModalBooking, setSuggestTimeModalBooking] = useState<Booking | null>(null);
  const [suggestedTimeInput, setSuggestedTimeInput] = useState('18:00');
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);

  const userBookings = bookings.filter(
    b => b.customerId === currentUser.id || b.companionId === currentUser.id
  );

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return b.status === 'Pending Payment' || b.status === 'Paid';
    if (activeTab === 'confirmed') return b.status === 'Confirmed';
    if (activeTab === 'completed') return b.status === 'Completed';
    if (activeTab === 'cancelled') return b.status === 'Cancelled' || b.status === 'Declined' || b.status === 'Refunded';
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">Confirmed</span>;
      case 'Pending Payment':
        return <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-bold">Pending Payment</span>;
      case 'Paid':
        return <span className="px-2.5 py-1 rounded-full bg-teal-950 text-teal-400 border border-teal-800 text-xs font-bold">Paid / Awaiting Companion</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-xs font-bold">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">Cancelled</span>;
      case 'Declined':
        return <span className="px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 text-xs font-bold">Declined</span>;
      case 'Disputed':
        return <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-400 border border-purple-800 text-xs font-bold">Disputed</span>;
      case 'Refunded':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold">Refunded</span>;
    }
  };

  const handlePayNow = async (booking: Booking) => {
    setIsProcessingPayment(booking.id);
    await completeBookingPayment({
      bookingId: booking.id,
      paymentMethod: 'EasyPaisa'
    });
    setIsProcessingPayment(null);
  };

  const handleSuggestTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestTimeModalBooking) return;
    updateBookingStatus(suggestTimeModalBooking.id, 'Confirmed', suggestedTimeInput);
    setSuggestTimeModalBooking(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Booking Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tracking verified bookings as <strong className="text-white uppercase">{currentUser.role}</strong> ({currentUser.name}).
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-400">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-slate-800 text-emerald-400 font-extrabold shadow-sm'
                  : 'hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no bookings matching this tab filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(b => {
            const isCustomer = currentUser.id === b.customerId;
            const otherPartyName = isCustomer ? b.companionName : b.customerName;
            const hasUserReviewed = isCustomer ? b.hasCustomerReviewed : b.hasCompanionReviewed;

            return (
              <div
                key={b.id}
                className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-md hover:border-slate-700 transition space-y-4 text-slate-200"
              >
                {/* Top Row: Booking ID, Activity & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs font-bold border border-slate-800">
                      {b.id}
                    </span>
                    <span className="font-bold text-sm text-white">
                      {b.activityName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-400">
                      Payment: <span className="text-white">{b.paymentStatus}</span>
                    </span>
                    {getStatusBadge(b.status)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Companion / Customer Info */}
                  <div className="flex items-center gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-850">
                    <img
                      src={b.companionPhoto}
                      alt={otherPartyName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-800 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        {isCustomer ? 'Companion' : 'Customer'}
                      </span>
                      <span className="font-extrabold text-sm text-white">{otherPartyName}</span>
                      <span className="text-[11px] text-emerald-400 block">{b.cityName}</span>
                    </div>
                  </div>

                  {/* Date, Time & Public Location */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-850 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-white font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{b.date} at {b.startTime} ({b.durationHours} hrs)</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{b.publicMeetupVenue}</span>
                    </div>
                    {b.suggestedTime && (
                      <div className="text-amber-400 font-bold text-[11px]">
                        Suggested alternate time: {b.suggestedTime}
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Gross Booking Value:</span>
                      <span className="font-bold text-white">PKR {b.grossAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Platform Fee ({b.commissionPercentage}%):</span>
                      <span>PKR {b.platformCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-emerald-400">
                      <span>{isCustomer ? 'Total Paid:' : 'Companion Net:'}</span>
                      <span>PKR {(isCustomer ? b.grossAmount : b.companionAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {b.specialNotes && (
                  <p className="text-xs text-slate-300 italic bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <strong>Note:</strong> {b.specialNotes}
                  </p>
                )}

                {/* Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    {/* Chat button for confirmed/active bookings */}
                    {(b.status === 'Confirmed' || b.status === 'Completed' || b.status === 'Pending Payment' || b.status === 'Paid') && (
                      <button
                        onClick={() => onOpenChatWithBooking && onOpenChatWithBooking(b.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        In-App Messages
                      </button>
                    )}

                    {/* Report Issue button */}
                    <button
                      onClick={() => setSelectedBookingForReport(b)}
                      className="px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Report Issue
                    </button>
                  </div>

                  {/* Status Change Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Customer: Pending Payment Pay Now */}
                    {isCustomer && b.status === 'Pending Payment' && (
                      <button
                        onClick={() => handlePayNow(b)}
                        disabled={isProcessingPayment === b.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        {isProcessingPayment === b.id ? 'Processing...' : `Pay PKR ${b.grossAmount.toLocaleString()}`}
                      </button>
                    )}

                    {/* Companion Controls when Pending or Paid */}
                    {!isCustomer && (b.status === 'Paid' || b.status === 'Pending Payment') && (
                      <>
                        <button
                          onClick={() => setSuggestTimeModalBooking(b)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold hover:bg-slate-750 transition border border-slate-700"
                        >
                          Suggest Time
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'Declined')}
                          className="px-3 py-1.5 rounded-xl border border-red-800 text-red-400 text-xs font-bold hover:bg-red-950 transition"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition"
                        >
                          Confirm Meetup
                        </button>
                      </>
                    )}

                    {/* Confirmed Controls: Mark Completed or Cancel */}
                    {b.status === 'Confirmed' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                          className="px-3 py-1.5 rounded-xl border border-red-800 text-red-400 text-xs font-bold hover:bg-red-950 transition"
                        >
                          Cancel Booking
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'Completed')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mark Outing Completed
                        </button>
                      </>
                    )}

                    {/* Completed: Rate & Review */}
                    {b.status === 'Completed' && (
                      <div>
                        {hasUserReviewed ? (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            Reviewed
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedBookingForReview(b)}
                            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow transition flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                            Write Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggest Time Modal */}
      {suggestTimeModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-800 text-white">
            <h3 className="font-bold text-sm text-white">Suggest Alternate Schedule</h3>
            <p className="text-xs text-slate-400">
              Propose an updated start time for Booking {suggestTimeModalBooking.id}.
            </p>
            <form onSubmit={handleSuggestTimeSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Proposed Start Time
                </label>
                <input
                  type="time"
                  required
                  value={suggestedTimeInput}
                  onChange={e => setSuggestedTimeInput(e.target.value)}
                  className="w-full p-2.5 border border-slate-700 bg-slate-800 text-white rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSuggestTimeModalBooking(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                >
                  Send Suggestion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          isOpen={true}
          onClose={() => setSelectedBookingForReview(null)}
          booking={selectedBookingForReview}
        />
      )}

      {/* Report Modal */}
      {selectedBookingForReport && (
        <ReportModal
          isOpen={true}
          onClose={() => setSelectedBookingForReport(null)}
          reportedUserId={
            currentUser.id === selectedBookingForReport.customerId
              ? selectedBookingForReport.companionId
              : selectedBookingForReport.customerId
          }
          reportedUserName={
            currentUser.id === selectedBookingForReport.customerId
              ? selectedBookingForReport.companionName
              : selectedBookingForReport.customerName
          }
          bookingId={selectedBookingForReport.id}
        />
      )}
    </div>
  );
};
