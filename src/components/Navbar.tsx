import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  MessageSquare,
  UserCheck,
  ShieldAlert,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  Users,
  ChevronDown,
  User,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: (role?: 'customer' | 'companion') => void;
  onOpenTerms: () => void;
  onOpenGuidelines: () => void;
  onOpenSafetyGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuth,
  onOpenTerms,
  onOpenGuidelines,
  onOpenSafetyGuide
}) => {
  const { currentUser, switchUser, users, bookings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userBookings = bookings.filter(
    b => b.customerId === currentUser.id || b.companionId === currentUser.id
  );
  const pendingBookingsCount = userBookings.filter(
    b => b.status === 'Pending Payment' || b.status === 'Paid'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition">
              <span className="font-extrabold text-lg sm:text-xl tracking-tighter">MP</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  MeetUp<span className="text-emerald-400">.pk</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  18+
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Meet. Connect. Experience.
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setCurrentView('explore')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'explore'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              Discover
            </button>

            <button
              onClick={() => setCurrentView('bookings')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition flex items-center gap-1.5 relative cursor-pointer ${
                currentView === 'bookings'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              Bookings
              {pendingBookingsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setCurrentView('messages')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'messages'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Messages
            </button>

            <button
              onClick={() => setCurrentView('safety_center')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'safety_center'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Safety Center
            </button>

            <button
              onClick={() => setCurrentView('account')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'account'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-400" />
              My Account
            </button>

            {/* Admin Console Route */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Portal
            </button>
          </nav>

          {/* Right Action: User Switcher / Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 pr-2 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-emerald-500/60 transition cursor-pointer"
              >
                <div className="text-right">
                  <span className="text-xs font-bold text-white block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-950 text-purple-400 border border-purple-800'
                      : currentUser.role === 'companion'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-2 z-50 text-xs text-slate-200">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <span className="font-bold text-white block">Fast Switcher (QA & Testing)</span>
                    <span className="text-[11px] text-slate-400">Switch Customer / Companion / Admin</span>
                  </div>

                  <div className="py-1 space-y-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-left cursor-pointer ${
                          u.id === currentUser.id
                            ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div>
                            <span className="block text-xs text-white">{u.name}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
                          </div>
                        </div>
                        {u.id === currentUser.id && (
                          <span className="text-[10px] text-emerald-400 font-bold">Active</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 border-t border-slate-800 space-y-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setCurrentView('account');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      View Full Account Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenAuth('companion');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-emerald-400 font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Register New 18+ Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Profile Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setCurrentView('account')}
              className="p-1.5 rounded-xl border border-slate-800 text-xs font-bold"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <span className="text-xs font-bold text-white block">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 uppercase">{currentUser.role} Mode</span>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white"
            >
              Switch Role
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setCurrentView('explore');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm text-slate-200 hover:bg-slate-900 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              Discover Companions
            </button>

            <button
              onClick={() => {
                setCurrentView('bookings');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm text-slate-200 hover:bg-slate-900 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Bookings
              </div>
              {pendingBookingsCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentView('messages');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm text-slate-200 hover:bg-slate-900 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Messages
            </button>

            <button
              onClick={() => {
                setCurrentView('safety_center');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm text-slate-200 hover:bg-slate-900 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Safety Center
            </button>

            <button
              onClick={() => {
                setCurrentView('account');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm text-slate-200 hover:bg-slate-900 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-emerald-400" />
              My Account Dashboard
            </button>

            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-emerald-400 flex items-center gap-2 mt-2 border border-slate-800"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Admin Portal (/admin)
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button onClick={onOpenTerms} className="hover:underline">
              Terms (18+)
            </button>
            <button onClick={onOpenGuidelines} className="hover:underline">
              Guidelines
            </button>
            <button onClick={onOpenSafetyGuide} className="hover:underline">
              Helplines
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
