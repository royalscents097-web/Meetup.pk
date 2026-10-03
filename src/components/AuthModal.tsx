import React, { useState } from 'react';
import { X, ShieldAlert, AlertOctagon, CheckCircle, UserCheck, Sparkles, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'customer'
}) => {
  const { registerUser, switchUser, users } = useApp();

  const [mode, setMode] = useState<'register' | 'switch'>('register');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrivate, setPhonePrivate] = useState('+92 3');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Max date allowed for 18+ is 18 years ago from today
  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const maxDobDate = eighteenYearsAgo.toISOString().split('T')[0];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!termsAccepted) {
      setErrorMsg('You must agree to the Terms of Service & Non-Sexual Platform Guidelines.');
      return;
    }

    if (!isAgeConfirmed) {
      setErrorMsg('You must explicitly confirm you are at least 18 years old.');
      return;
    }

    if (!dateOfBirth) {
      setErrorMsg('Please specify your legal date of birth.');
      return;
    }

    const birthDate = new Date(dateOfBirth);
    if (birthDate > eighteenYearsAgo) {
      setErrorMsg('Registration Blocked: MeetUp Pakistan is strictly restricted to adults aged 18 and older. Minors are barred by law.');
      return;
    }

    const res = registerUser({
      name,
      email,
      role,
      dateOfBirth,
      phonePrivate,
      isAgeConfirmed,
      policyAccepted: termsAccepted
    });

    if (res.success) {
      setSuccessMsg('Account registered successfully! Welcome to MeetUp Pakistan.');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } else {
      setErrorMsg(res.error || 'Failed to register account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">
              18+
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'register' ? 'Join MeetUp Pakistan' : 'Switch Test Account'}
              </h3>
              <p className="text-xs text-slate-400">Adult Social Activities & Companionship Marketplace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              mode === 'register'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Register New Profile (18+)
          </button>
          <button
            type="button"
            onClick={() => setMode('switch')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              mode === 'switch'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Quick Test Switcher
          </button>
        </div>

        {/* Body */}
        {mode === 'switch' ? (
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly toggle between verified seed profiles to evaluate customer booking flows, companion request approvals, or administrative governance:
            </p>

            <div className="space-y-2.5">
              {users.map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                        {u.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {u.role.toUpperCase()} • Age {u.age}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                    Switch To
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="p-6 space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 font-medium flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Role Picker */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registering As *
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    role === 'customer'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('companion')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    role === 'companion'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Companion
                </button>
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Daniyal Qureshi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="daniyal@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Date of Birth & Private Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Date of Birth (Must be 18+) *
                </label>
                <input
                  type="date"
                  required
                  max={maxDobDate}
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Must be born on or before {maxDobDate}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Mobile Phone (Private) *</span>
                  <Lock className="w-3 h-3 text-slate-400" />
                </label>
                <input
                  type="text"
                  required
                  value={phonePrivate}
                  onChange={e => setPhonePrivate(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Never displayed on public profile
                </span>
              </div>
            </div>

            {/* 18+ Mandatory Confirmations */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-start gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  required
                  checked={isAgeConfirmed}
                  onChange={e => setIsAgeConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 mt-0.5"
                />
                <span className="font-semibold text-slate-900">
                  "I confirm that I am 18 years old or older."
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 mt-0.5"
                />
                <span>
                  I agree that MeetUp Pakistan is strictly non-sexual, adhere to public meetup rules, and accept the Terms & Community Guidelines.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isAgeConfirmed || !termsAccepted}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm shadow-md transition"
              >
                Create 18+ Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
