import React, { useState } from 'react';
import { X, Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  const { currentUser, addReview } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [communication, setCommunication] = useState<number>(5);
  const [reliability, setReliability] = useState<number>(5);
  const [activityExp, setActivityExp] = useState<number>(5);
  const [safetyRating, setSafetyRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const isCustomerReviewing = currentUser.id === booking.customerId;
  const targetId = isCustomerReviewing ? booking.companionId : booking.customerId;
  const targetName = isCustomerReviewing ? booking.companionName : booking.customerName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage('Please share a written review describing the experience.');
      return;
    }

    const result = addReview({
      bookingId: booking.id,
      targetId,
      rating,
      communicationRating: communication,
      reliabilityRating: reliability,
      activityRating: activityExp,
      safetyRating,
      comment,
      activityName: booking.activityName
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to submit review');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  const renderStarSelector = (value: number, onChange: (v: number) => void, label: string) => (
    <div className="flex items-center justify-between py-1 text-xs">
      <span className="text-slate-300 font-medium">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-0.5 hover:scale-110 transition"
          >
            <Star
              className={`w-4 h-4 ${
                value >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Rate & Review Public Experience</h3>
              <p className="text-xs text-emerald-400">
                Booking ID: {booking.id} • {booking.activityName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white">Review Verified & Published!</h4>
            <p className="text-xs text-slate-400">
              Your feedback contributes to safe and accountable social companionship on MeetUp.pk.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Reviewing <strong>{targetName}</strong> for a completed session at {booking.publicMeetupVenue}.
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-200">
                {errorMessage}
              </div>
            )}

            {/* Criteria Breakdown */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              {renderStarSelector(rating, setRating, 'Overall Rating *')}
              {renderStarSelector(communication, setCommunication, 'Communication')}
              {renderStarSelector(reliability, setReliability, 'Reliability & Punctuality')}
              {renderStarSelector(activityExp, setActivityExp, 'Activity Experience')}
              {renderStarSelector(safetyRating, setSafetyRating, 'Public Safety & Comfort')}
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Written Review & Feedback *
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your authentic feedback regarding communication, public place adherence, punctuality, and conversation..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition cursor-pointer"
              >
                Submit Verified Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
