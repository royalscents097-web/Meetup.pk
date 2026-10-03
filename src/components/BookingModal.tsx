import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertOctagon,
  CheckCircle,
  Sparkles,
  Info,
  CreditCard,
  Wallet,
  ArrowRight,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompanionProfile } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: CompanionProfile;
  onSuccess?: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  companion,
  onSuccess
}) => {
  const { activities, commissionSettings, createBooking, completeBookingPayment } = useApp();

  const companionActivities = activities.filter(
    a => companion.activityIds.includes(a.id) && a.isActive
  );

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');

  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    companionActivities[0]?.id || companion.activityIds[0] || 'act-coffee'
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState<string>(defaultDateStr);
  const [startTime, setStartTime] = useState<string>('16:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [publicVenue, setPublicVenue] = useState<string>(
    `Gloria Jean's / Public Cafe in ${companion.area}`
  );
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [confirmedAge18, setConfirmedAge18] = useState<boolean>(false);
  const [confirmedPublicPlace, setConfirmedPublicPlace] = useState<boolean>(false);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'EasyPaisa' | 'JazzCash' | 'Card' | 'Bank Transfer'>('EasyPaisa');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [activeTxnId, setActiveTxnId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const grossAmount = companion.sessionRate * durationHours;
  const platformFee = Math.round((grossAmount * commissionSettings.defaultPercentage) / 100);
  const providerFee = Math.round(grossAmount * 0.02);
  const companionEarnings = grossAmount - platformFee;
  const totalCharge = grossAmount;

  // Step 1: Validate details and create Pending Payment booking
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!confirmedAge18 || !confirmedPublicPlace) {
      setErrorMsg('You must explicitly confirm both the 18+ requirement and the public venue agreement.');
      return;
    }

    if (!publicVenue.trim()) {
      setErrorMsg('Please specify a valid public venue (e.g. cafe, library, mall).');
      return;
    }

    // Overnight booking prevention: start time + duration cannot exceed 23:00
    const [startH] = startTime.split(':').map(Number);
    if (startH + durationHours > 23 || startH < 8) {
      setErrorMsg('Sessions must conclude by 11:00 PM in public venues. Overnight bookings are strictly barred.');
      return;
    }

    const result = createBooking({
      companionId: companion.id,
      activityId: selectedActivityId,
      cityId: companion.cityId,
      date,
      startTime,
      durationHours,
      publicMeetupVenue: publicVenue,
      specialNotes
    });

    if (result.success && result.bookingId) {
      setActiveBookingId(result.bookingId);
      setStep('payment');
    } else {
      setErrorMsg(result.error || 'Failed to submit booking request');
    }
  };

  // Step 2: Process payment through abstraction layer
  const handleConfirmPayment = async () => {
    if (!activeBookingId) return;
    setIsProcessingPayment(true);
    setErrorMsg(null);

    try {
      const res = await completeBookingPayment({
        bookingId: activeBookingId,
        paymentMethod
      });

      if (res.success && res.transactionId) {
        setActiveTxnId(res.transactionId);
        setStep('confirmed');
        if (onSuccess) onSuccess(activeBookingId);
      } else {
        setErrorMsg(res.error || 'Payment gateway returned an error. Please try again.');
      }
    } catch {
      setErrorMsg('Network error processing payment. Please retry.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={companion.profilePhoto}
              alt={companion.displayName}
              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
            />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                Social Activity Booking with {companion.displayName}
              </h3>
              <p className="text-xs text-emerald-400">
                {companion.cityName} • {companion.area} • PKR {companion.sessionRate.toLocaleString()}/hr
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-5 text-xs">
            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-200 font-medium flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Strict Notice */}
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="block text-white font-bold mb-0.5">Strict Public Venue Policy</strong>
                MeetUp.pk is solely for legitimate, non-sexual activities. All meetups must happen strictly at public commercial establishments (licensed cafes, restaurants, parks, malls). Overnight and private home bookings are barred.
              </div>
            </div>

            {/* Select Activity */}
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Approved Activity *
              </label>
              <select
                value={selectedActivityId}
                onChange={e => setSelectedActivityId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {companionActivities.map(act => (
                  <option key={act.id} value={act.id}>
                    {act.name} (Public Only)
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  Session Duration: <span className="text-emerald-400 font-bold">{durationHours} hour{durationHours > 1 ? 's' : ''}</span>
                </label>
                <span className="text-slate-400">Rate: PKR {companion.sessionRate.toLocaleString()}/hr</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(hours => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setDurationHours(hours)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      durationHours === hours
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>

            {/* Public Venue */}
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Public Meetup Venue *
              </label>
              <input
                type="text"
                required
                value={publicVenue}
                onChange={e => setPublicVenue(e.target.value)}
                placeholder="e.g. Espresso Cafe Phase 5, Coffee Bean & Tea Leaf, Centaurus Mall"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Must be an open public venue. Private rooms or hotel bookings are barred.
              </span>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Discussion Topic / Activity Details (Optional)
              </label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={e => setSpecialNotes(e.target.value)}
                placeholder="e.g. Planning to work on UI design pitch or explore old Lahore landmarks..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Price Preview */}
            <div className="p-4 bg-slate-950 rounded-2xl space-y-1.5 border border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Session Fee ({durationHours} hrs × PKR {companion.sessionRate.toLocaleString()}):</span>
                <span className="font-semibold text-white">PKR {grossAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Commission ({commissionSettings.defaultPercentage}%):</span>
                <span>PKR {platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5 text-sm">
                <span>Total Amount to Pay:</span>
                <span>PKR {totalCharge.toLocaleString()}</span>
              </div>
            </div>

            {/* 18+ & Policy Checks */}
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={confirmedAge18}
                  onChange={e => setConfirmedAge18(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 mt-0.5"
                />
                <span>
                  <strong className="text-white">18+ Confirmation:</strong> I confirm that I am at least 18 years old and legally competent.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={confirmedPublicPlace}
                  onChange={e => setConfirmedPublicPlace(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 mt-0.5"
                />
                <span>
                  <strong className="text-white">Non-Sexual Public Outing Pledge:</strong> I confirm this booking is strictly for wholesome social companionship in an open public venue.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!confirmedAge18 || !confirmedPublicPlace}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                Proceed to Payment <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Secure Payment */}
        {step === 'payment' && (
          <div className="p-6 space-y-5 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Booking ID: {activeBookingId}
              </span>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                Complete Payment via Secure Gateway
              </h4>
              <p className="text-slate-400 text-xs mt-1">
                Your payment will be held securely in platform escrow until session completion.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-200 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-300 uppercase tracking-wider">
                Select Pakistani Payment Method *
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'EasyPaisa', label: 'EasyPaisa Mobile Wallet', icon: Wallet },
                  { id: 'JazzCash', label: 'JazzCash Mobile Account', icon: Wallet },
                  { id: 'Card', label: 'Debit / Credit Card', icon: CreditCard },
                  { id: 'Bank Transfer', label: '1Link Bank Transfer', icon: Lock }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-emerald-950/70 border-emerald-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-xs">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Escrow & Anti-Bypass Reminder */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Booking Total:</span>
                <span className="font-bold text-white">PKR {totalCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Gateway Processing Fee:</span>
                <span>PKR {providerFee.toLocaleString()} (Included)</span>
              </div>
              <p className="text-[11px] text-emerald-400 pt-1">
                "Keep payments and bookings on MeetUp.pk to maintain platform protection."
              </p>
            </div>

            {/* Payment Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
              >
                Back to Details
              </button>
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleConfirmPayment}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <span>Verifying Transaction...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Pay PKR {totalCharge.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmed */}
        {step === 'confirmed' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 bg-slate-950 text-emerald-400 rounded-full font-mono font-bold text-xs border border-slate-800">
                Booking ID: {activeBookingId}
              </span>
              <h4 className="text-xl font-bold text-white mt-2">Booking Confirmed & Paid!</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Your payment of PKR {totalCharge.toLocaleString()} has been verified on the transaction ledger (Txn Ref: {activeTxnId}). {companion.displayName} has been notified.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-left space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Public Venue:</span>
                <span className="font-semibold text-white">{publicVenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold text-white">{date} at {startTime} ({durationHours} hrs)</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5">
                <span className="text-slate-500">Escrow Status:</span>
                <span className="font-bold text-emerald-400">Confirmed (Escrow Protected)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer"
            >
              Done / Return to Platform
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
