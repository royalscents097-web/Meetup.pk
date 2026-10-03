import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  DollarSign,
  Globe2,
  Heart,
  Save,
  CheckCircle,
  FileText,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompanionProfile, Gender } from '../types';

export const CompanionProfileEditView: React.FC = () => {
  const {
    currentUser,
    companionProfiles,
    updateProfile,
    submitVerification,
    cities,
    activities
  } = useApp();

  const profile = companionProfiles.find(p => p.id === currentUser.id);

  const [displayName, setDisplayName] = useState(profile?.displayName || currentUser.name);
  const [gender, setGender] = useState<Gender>(profile?.gender || 'Female');
  const [cityId, setCityId] = useState(profile?.cityId || cities[0]?.id || 'city-lahore');
  const [area, setArea] = useState(profile?.area || 'Gulberg III');
  const [bio, setBio] = useState(profile?.bio || '');
  const [profilePhoto, setProfilePhoto] = useState(profile?.profilePhoto || currentUser.avatar);
  const [sessionRate, setSessionRate] = useState(profile?.sessionRate || 1500);
  const [languagesStr, setLanguagesStr] = useState(profile?.languages.join(', ') || 'Urdu, English');
  const [interestsStr, setInterestsStr] = useState(profile?.interests.join(', ') || 'Art, Coffee, Books');
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>(
    profile?.activityIds || ['act-coffee', 'act-study']
  );
  const [weekdays, setWeekdays] = useState(profile?.availability.weekdays ?? true);
  const [weekends, setWeekends] = useState(profile?.availability.weekends ?? true);
  const [timeSlotsStr, setTimeSlotsStr] = useState(
    profile?.availability.timeSlots.join(', ') || 'Afternoon (2PM-5PM), Evening (5PM-9PM)'
  );

  // Verification document submission state
  const [idType, setIdType] = useState<'CNIC' | 'Passport'>('CNIC');
  const [docNumber, setDocNumber] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const selectedCityObj = cities.find(c => c.id === cityId);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const langs = languagesStr.split(',').map(s => s.trim()).filter(Boolean);
    const interests = interestsStr.split(',').map(s => s.trim()).filter(Boolean);
    const slots = timeSlotsStr.split(',').map(s => s.trim()).filter(Boolean);

    updateProfile({
      displayName,
      gender,
      cityId,
      cityName: selectedCityObj ? selectedCityObj.name : 'Lahore',
      area,
      bio,
      profilePhoto,
      sessionRate,
      languages: langs.length > 0 ? langs : ['Urdu', 'English'],
      interests: interests.length > 0 ? interests : ['Coffee', 'Culture'],
      activityIds: selectedActivityIds,
      availability: {
        weekdays,
        weekends,
        timeSlots: slots.length > 0 ? slots : ['Evening (5PM-9PM)']
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) return;

    submitVerification(idType, docNumber.trim());
    setVerificationSuccess(true);
    setDocNumber('');
    setTimeout(() => setVerificationSuccess(false), 2500);
  };

  const toggleActivity = (id: string) => {
    if (selectedActivityIds.includes(id)) {
      if (selectedActivityIds.length > 1) {
        setSelectedActivityIds(prev => prev.filter(aId => aId !== id));
      }
    } else {
      setSelectedActivityIds(prev => [...prev, id]);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-500">
        No companion profile found for this account.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Companion Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your public companion profile, session rates, availability, and verification.
          </p>
        </div>

        {/* Verification Status Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              profile.verificationStatus === 'Verified'
                ? 'bg-emerald-100 text-emerald-800'
                : profile.verificationStatus === 'Pending Verification'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {profile.verificationStatus}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Profile updated successfully! Changes are live immediately.
        </div>
      )}

      {/* Main Edit Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Public Display Name *
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gender *
            </label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value as Gender)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* City & Approximate Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              City *
            </label>
            <select
              value={cityId}
              onChange={e => setCityId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {cities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.province})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Approximate Area *</span>
              <Lock className="w-3 h-3 text-emerald-600" />
            </label>
            <input
              type="text"
              required
              value={area}
              onChange={e => setArea(e.target.value)}
              placeholder="e.g. Gulberg III, DHA Phase 5, F-7 Jinnah Super"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              For safety, use approximate commercial zone. Never enter private residential address.
            </span>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            About You & Social Bio *
          </label>
          <textarea
            required
            rows={4}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Share your interests, favorite discussion topics, public cafes you enjoy, and your conversational style..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Session Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hourly Session Rate (PKR) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">
                Rs.
              </span>
              <input
                type="number"
                min="500"
                max="10000"
                step="100"
                value={sessionRate}
                onChange={e => setSessionRate(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Typical rate in Pakistan ranges between Rs. 1,200 to Rs. 2,500/hr.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Profile Photo URL
            </label>
            <input
              type="url"
              value={profilePhoto}
              onChange={e => setProfilePhoto(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Languages & Interests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Languages (Comma-separated)
            </label>
            <input
              type="text"
              value={languagesStr}
              onChange={e => setLanguagesStr(e.target.value)}
              placeholder="e.g. Urdu, English, Punjabi, Pashto"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Interests & Topics (Comma-separated)
            </label>
            <input
              type="text"
              value={interestsStr}
              onChange={e => setInterestsStr(e.target.value)}
              placeholder="e.g. Architecture, Tech, Poetry, Chess"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Activities Offered */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Activities Offered (Non-Sexual Public Social Activities)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {activities.map(act => {
              const isSelected = selectedActivityIds.includes(act.id);
              return (
                <div
                  key={act.id}
                  onClick={() => toggleActivity(act.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{act.name}</span>
                  {isSelected && <span className="text-emerald-600 font-bold ml-1">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Availability Schedule
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={weekdays}
                onChange={e => setWeekdays(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600"
              />
              Available on Weekdays
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={weekends}
                onChange={e => setWeekends(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600"
              />
              Available on Weekends
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Preferred Time Slots (Comma-separated)
            </label>
            <input
              type="text"
              value={timeSlotsStr}
              onChange={e => setTimeSlotsStr(e.target.value)}
              placeholder="e.g. Afternoon (2PM-5PM), Evening (5PM-9PM)"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Verification Submission Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Identity & 18+ Verification Workflow
              </h3>
              <p className="text-xs text-slate-500">
                Required for the "Verified Companion" badge. Reviewed confidentially by administrators.
              </p>
            </div>
          </div>
        </div>

        {profile.verificationDocsSubmitted && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-800 block">Submitted Documentation:</span>
            <p className="text-slate-600">
              Type: <strong>{profile.verificationDocsSubmitted.idType}</strong> • Masked Reference: {profile.verificationDocsSubmitted.documentNumberMasked}
            </p>
            <p className="text-emerald-800 font-semibold">
              Status Note: {profile.verificationDocsSubmitted.statusNote}
            </p>
          </div>
        )}

        {verificationSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Verification request queued for administrative review.
          </div>
        )}

        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Government Document Type
              </label>
              <select
                value={idType}
                onChange={e => setIdType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium focus:bg-white"
              >
                <option value="CNIC">Pakistani National Identity Card (Smart CNIC / NICOP)</option>
                <option value="Passport">Government-Issued Passport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Document Number *
              </label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={e => setDocNumber(e.target.value)}
                placeholder="e.g. 35201-1234567-1 or Passport Number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Never shared publicly. Only viewable by compliance officers in /admin review.
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
          >
            Submit for Admin Verification
          </button>
        </form>
      </div>
    </div>
  );
};
