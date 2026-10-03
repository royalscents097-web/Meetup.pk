import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  ShieldAlert,
  Ban,
  MapPin,
  Calendar,
  Lock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReportModal } from '../components/ReportModal';

interface MessagesViewProps {
  initialBookingId?: string | null;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ initialBookingId }) => {
  const {
    currentUser,
    bookings,
    messages,
    sendMessage,
    blockUser,
    blockedUserIds
  } = useApp();

  const userBookings = bookings.filter(
    b => b.customerId === currentUser.id || b.companionId === currentUser.id
  );

  const [activeBookingId, setActiveBookingId] = useState<string>(
    initialBookingId || (userBookings[0]?.id || '')
  );
  const [inputText, setInputText] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [bypassFlaggedNotice, setBypassFlaggedNotice] = useState(false);

  const activeBooking = bookings.find(b => b.id === activeBookingId);
  const activeMessages = messages.filter(m => m.bookingId === activeBookingId);

  const otherPartyId = activeBooking
    ? (currentUser.id === activeBooking.customerId ? activeBooking.companionId : activeBooking.customerId)
    : '';

  const otherPartyName = activeBooking
    ? (currentUser.id === activeBooking.customerId ? activeBooking.companionName : activeBooking.customerName)
    : '';

  const isBlocked = blockedUserIds.includes(otherPartyId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeBookingId || isBlocked) return;

    const res = sendMessage(activeBookingId, inputText.trim());
    if (res.flagged) {
      setBypassFlaggedNotice(true);
      setTimeout(() => setBypassFlaggedNotice(false), 3500);
    }
    setInputText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Booking In-App Messages
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Secure, monitored messaging linked strictly to verified booking references.
        </p>
      </div>

      {userBookings.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-white">No Booking Conversations</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You can message companions once a booking request has been initiated.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
          {/* Left: Bookings List */}
          <div className="border-r border-slate-800 bg-slate-950/60 flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-950">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Bookings ({userBookings.length})
              </span>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-800/80">
              {userBookings.map(b => {
                const isSelected = b.id === activeBookingId;
                const otherName = currentUser.id === b.customerId ? b.companionName : b.customerName;

                return (
                  <div
                    key={b.id}
                    onClick={() => setActiveBookingId(b.id)}
                    className={`p-4 cursor-pointer transition text-left flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/70 border-l-4 border-emerald-500'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <img
                      src={b.companionPhoto}
                      alt={otherName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-700 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate">
                          {otherName}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                          {b.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {b.activityName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {b.id}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Message Thread */}
          {activeBooking ? (
            <div className="md:col-span-2 flex flex-col justify-between bg-slate-900">
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">
                        {otherPartyName}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900 text-emerald-400 font-mono text-[10px] font-bold rounded-lg border border-slate-800">
                        {activeBooking.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{activeBooking.publicMeetupVenue}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 text-xs flex items-center gap-1 transition"
                    title="Report safety concern"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span className="hidden sm:inline">Report</span>
                  </button>

                  <button
                    onClick={() => blockUser(otherPartyId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1 transition"
                    title="Block user"
                  >
                    <Ban className="w-4 h-4 text-slate-400" />
                    <span className="hidden sm:inline">{isBlocked ? 'Blocked' : 'Block'}</span>
                  </button>
                </div>
              </div>

              {/* Safety Warning Banner (Section 12 requirement) */}
              <div className="px-4 py-2.5 bg-emerald-950/80 border-b border-emerald-800/80 text-[11px] text-emerald-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Safety Notice:</strong> Keep payments and bookings on MeetUp.pk to maintain platform protection. Personal phone numbers and off-platform payments are strictly restricted.
                </span>
              </div>

              {bypassFlaggedNotice && (
                <div className="px-4 py-2 bg-amber-950 border-b border-amber-800 text-[11px] text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    Notice: External contact or off-platform payment terms were detected and submitted for safety review.
                  </span>
                </div>
              )}

              {/* Messages History */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[360px]">
                {activeMessages.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-500 space-y-1">
                    <p>No messages sent yet for this booking.</p>
                    <p className="text-[11px] text-slate-400">
                      Coordinate public meetup timings or ask questions below.
                    </p>
                  </div>
                ) : (
                  activeMessages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-tr-xs'
                              : 'bg-slate-800 text-slate-200 rounded-tl-xs border border-slate-700'
                          }`}
                        >
                          <span className="block font-bold text-[10px] mb-0.5 opacity-80">
                            {msg.senderName}
                          </span>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Form */}
              {isBlocked ? (
                <div className="p-4 bg-red-950 text-red-300 text-xs text-center border-t border-red-900">
                  This user has been blocked. Messaging is disabled.
                </div>
              ) : (
                <form
                  onSubmit={handleSend}
                  className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={`Message ${otherPartyName} about Booking ${activeBooking.id}...`}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-700 bg-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="md:col-span-2 flex items-center justify-center p-12 text-slate-500 text-xs">
              Select a booking to view messages
            </div>
          )}
        </div>
      )}

      {/* Safety Report Modal */}
      {activeBooking && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          reportedUserId={otherPartyId}
          reportedUserName={otherPartyName}
          bookingId={activeBooking.id}
        />
      )}
    </div>
  );
};
