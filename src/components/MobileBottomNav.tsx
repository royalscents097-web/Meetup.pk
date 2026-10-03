import React from 'react';
import { Home, Compass, Calendar, MessageSquare, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileBottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  setCurrentView
}) => {
  const { currentUser, bookings, messages } = useApp();

  const userBookings = bookings.filter(
    b => b.customerId === currentUser.id || b.companionId === currentUser.id
  );
  const pendingCount = userBookings.filter(
    b => b.status === 'Pending Payment' || b.status === 'Paid'
  ).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Discover', icon: Compass },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'account', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 text-white safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition relative cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
