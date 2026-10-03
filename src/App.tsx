import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SafetyNoticeBanner } from './components/SafetyNoticeBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TermsModal, CommunityGuidelinesModal, SafetyGuidelinesModal } from './components/LegalModals';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';

import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { BookingsView } from './views/BookingsView';
import { MessagesView } from './views/MessagesView';
import { CompanionProfileEditView } from './views/CompanionProfileEditView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { SafetyCenterView } from './views/SafetyCenterView';
import { AccountDashboardView } from './views/AccountDashboardView';
import { UserRole, CompanionProfile } from './types';
import { SearchFilterState } from './components/HeroSearch';

const MainApp: React.FC = () => {
  const { setSelectedCityId } = useApp();

  const [currentView, setCurrentView] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('customer');
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState(false);
  const [safetyGuideModalOpen, setSafetyGuideModalOpen] = useState(false);
  const [chatBookingId, setChatBookingId] = useState<string | null>(null);

  // Active filters passed from home or search
  const [searchFilters, setSearchFilters] = useState<SearchFilterState | null>(null);

  // Direct booking state
  const [directBookingCompanion, setDirectBookingCompanion] = useState<CompanionProfile | null>(null);

  const handleOpenAuth = (role?: UserRole) => {
    setAuthInitialRole(role || 'customer');
    setAuthModalOpen(true);
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCityId(cityId);
    setSearchFilters(prev => ({
      ...(prev || {
        activityId: 'all',
        area: '',
        gender: 'all',
        ageRange: 'all',
        availability: 'all',
        date: '',
        budgetTier: 'all',
        onlyVerified: true,
        minRating: 0
      }),
      cityId
    }));
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChatWithBooking = (bookingId: string) => {
    setChatBookingId(bookingId);
    setCurrentView('messages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingDirect = (companion: CompanionProfile) => {
    setDirectBookingCompanion(companion);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 18+ Non-Sexual Strict Safety Advisory Bar */}
      <SafetyNoticeBanner
        onOpenGuidelines={() => setGuidelinesModalOpen(true)}
        onOpenSafetyGuide={() => setSafetyGuideModalOpen(true)}
      />

      {/* Main Responsive Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={view => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={handleOpenAuth}
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenGuidelines={() => setGuidelinesModalOpen(true)}
        onOpenSafetyGuide={() => setSafetyGuideModalOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentView === 'home' && (
          <HomeView
            onNavigateToExplore={filters => {
              if (filters) setSearchFilters(filters);
              setCurrentView('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
            onOpenSafetyGuide={() => setSafetyGuideModalOpen(true)}
            onOpenGuidelines={() => setGuidelinesModalOpen(true)}
            onOpenSafetyCenter={() => {
              setCurrentView('safety_center');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCityFilter={handleCitySelect}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView
            initialFilters={searchFilters}
            onOpenBookingDirect={handleOpenBookingDirect}
          />
        )}

        {currentView === 'bookings' && (
          <BookingsView onOpenChatWithBooking={handleOpenChatWithBooking} />
        )}

        {currentView === 'messages' && (
          <MessagesView initialBookingId={chatBookingId} />
        )}

        {currentView === 'account' && (
          <AccountDashboardView
            onNavigateToBookings={() => {
              setCurrentView('bookings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToMessages={() => {
              setCurrentView('messages');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToSafetyCenter={() => {
              setCurrentView('safety_center');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToEditProfile={() => {
              setCurrentView('companion-profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBookingDirect={handleOpenBookingDirect}
          />
        )}

        {currentView === 'companion-profile' && <CompanionProfileEditView />}

        {currentView === 'safety_center' && (
          <SafetyCenterView
            onOpenGuidelines={() => setGuidelinesModalOpen(true)}
            onOpenTerms={() => setTermsModalOpen(true)}
          />
        )}

        {currentView === 'admin' && <AdminDashboardView />}
      </main>

      {/* Footer */}
      <Footer
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenGuidelines={() => setGuidelinesModalOpen(true)}
        onOpenSafetyGuide={() => setSafetyGuideModalOpen(true)}
        onOpenSafetyCenter={() => {
          setCurrentView('safety_center');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToAdmin={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCity={handleCitySelect}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        setCurrentView={view => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Direct Booking Modal if triggered */}
      {directBookingCompanion && (
        <BookingModal
          isOpen={true}
          onClose={() => setDirectBookingCompanion(null)}
          companion={directBookingCompanion}
        />
      )}

      {/* Legal & Safety Modals */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />

      <CommunityGuidelinesModal
        isOpen={guidelinesModalOpen}
        onClose={() => setGuidelinesModalOpen(false)}
      />

      <SafetyGuidelinesModal
        isOpen={safetyGuideModalOpen}
        onClose={() => setSafetyGuideModalOpen(false)}
      />

      {/* 18+ Registration & Fast Account Switcher Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authInitialRole}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
