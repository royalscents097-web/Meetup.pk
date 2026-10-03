import React from 'react';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  MapPin,
  Coffee,
  Calendar,
  Languages,
  BookOpen,
  Briefcase,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Landmark,
  ShoppingBag,
  Camera,
  Activity,
  Lock,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroSearch, SearchFilterState } from '../components/HeroSearch';
import { AnalyticsService } from '../services/analytics';

interface HomeViewProps {
  onNavigateToExplore: (initialFilters?: SearchFilterState) => void;
  onOpenAuth: (role?: 'customer' | 'companion') => void;
  onOpenSafetyGuide: () => void;
  onOpenGuidelines: () => void;
  onOpenSafetyCenter: () => void;
  onSelectCityFilter: (cityId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToExplore,
  onOpenAuth,
  onOpenSafetyGuide,
  onOpenGuidelines,
  onOpenSafetyCenter,
  onSelectCityFilter
}) => {
  const { cities, activities, setSelectedCityId } = useApp();

  const initialCities = cities.filter(c =>
    ['city-lahore', 'city-karachi', 'city-islamabad', 'city-rawalpindi'].includes(c.id)
  );

  const featuredActivityCategories = [
    {
      id: 'act-coffee',
      name: 'Coffee & Cafe Meetup',
      desc: 'Relaxed conversations at reputable cafes (Second Cup, Gloria Jeans, Espresso)',
      icon: Coffee,
      count: '150+ public sessions'
    },
    {
      id: 'act-restaurant',
      name: 'Restaurant & Dining',
      desc: 'Exploring culinary hubs, food streets, and public dining spots together',
      icon: Users,
      count: '120+ sessions'
    },
    {
      id: 'act-city-tour',
      name: 'City Heritage Walks',
      desc: 'Discovering Walled City havelis, museums, and historical landmarks with a local',
      icon: Landmark,
      count: '85+ walks'
    },
    {
      id: 'act-event',
      name: 'Public Events & Festivals',
      desc: 'Literature festivals, art expos, public concerts, or business symposiums',
      icon: Calendar,
      count: '70+ events'
    },
    {
      id: 'act-study',
      name: 'Study Partner / Co-Working',
      desc: 'Productive sessions at public libraries, campus cafes, and co-working hubs',
      icon: BookOpen,
      count: '110+ sessions'
    },
    {
      id: 'act-language',
      name: 'Language Practice',
      desc: 'Spoken English, Urdu, Punjabi, or regional dialects conversation partner',
      icon: Languages,
      count: '95+ sessions'
    }
  ];

  const handleHeroSearch = (filters: SearchFilterState) => {
    AnalyticsService.track('search', { cityId: filters.cityId, activityId: filters.activityId });
    if (filters.cityId !== 'all') {
      setSelectedCityId(filters.cityId);
    }
    onNavigateToExplore(filters);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION WITH SUBTLE ANIMATED PREMIUM ATMOSPHERE */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950 text-white min-h-[620px] flex flex-col justify-center">
        {/* Ambient Blurred Urban City Atmosphere (Lahore, Karachi, Islamabad aesthetic) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-emerald-900/40 rounded-full blur-3xl" />
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* 18+ Non-Sexual Social Marketplace Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>18+ Non-Sexual Social Companionship Marketplace • Pakistan</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Meet people. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              Share experiences.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Discover verified adults for coffee, events, city experiences, language practice and other approved social activities in public spaces.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigateToExplore()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950 transition flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Compass className="w-5 h-5" />
              Find a Companion
            </button>

            <button
              onClick={() => onOpenAuth('companion')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-extrabold text-sm sm:text-base border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Become a Companion
            </button>
          </div>

          {/* Launch City Quick Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Launch Cities:</span>
            {initialCities.map(city => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCityId(city.id);
                  onNavigateToExplore({
                    cityId: city.id,
                    activityId: 'all',
                    area: '',
                    gender: 'all',
                    ageRange: 'all',
                    availability: 'all',
                    date: '',
                    budgetTier: 'all',
                    onlyVerified: true,
                    minRating: 0
                  });
                }}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-300 transition flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. SEARCH / DISCOVERY PANEL (NO PROFILES SHOWN IMMEDIATELY) */}
        <div className="mt-12 relative z-20">
          <HeroSearch onSearch={handleHeroSearch} />
        </div>
      </section>

      {/* 3. ACTIVITY CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">
              Wholesome Public Outings
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Approved Social Activities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Every approved activity takes place solely in public spaces. Prostitution or sexual services are strictly prohibited.
            </p>
          </div>
          <button
            onClick={() => onNavigateToExplore()}
            className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            Browse all categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredActivityCategories.map(act => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => {
                  onNavigateToExplore({
                    cityId: 'all',
                    activityId: act.id,
                    area: '',
                    gender: 'all',
                    ageRange: 'all',
                    availability: 'all',
                    date: '',
                    budgetTier: 'all',
                    onlyVerified: true,
                    minRating: 0
                  });
                }}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg hover:shadow-2xl hover:border-emerald-500/50 transition cursor-pointer flex items-start gap-4 group"
              >
                <div className="p-3.5 rounded-2xl bg-emerald-950 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition shrink-0 border border-emerald-900">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                    {act.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-snug">{act.desc}</p>
                  <span className="text-[11px] font-semibold text-emerald-400 block pt-1">
                    {act.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LAUNCH CITIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">
            Pakistan Urban Network
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Available in Major Pakistani Metros
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Meeting adults in recognized public areas: Gulberg, DHA, F-7, Clifton, Bahria Town, and Saddar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {initialCities.map(city => (
            <div
              key={city.id}
              onClick={() => {
                setSelectedCityId(city.id);
                onNavigateToExplore({
                  cityId: city.id,
                  activityId: 'all',
                  area: '',
                  gender: 'all',
                  ageRange: 'all',
                  availability: 'all',
                  date: '',
                  budgetTier: 'all',
                  onlyVerified: true,
                  minRating: 0
                });
              }}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-lg text-white group-hover:text-emerald-300 transition">
                  {city.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                  {city.province}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                Popular Areas: {city.popularAreas.slice(0, 4).join(', ')}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>Explore City</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">
            Accountable & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How MeetUp.pk Works
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            A simple 4-step framework designed for adult safety, public visibility, and genuine companionship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: '1. Select Approved Activity',
              desc: 'Choose from coffee, cultural tours, dining, study sessions, or language practice.',
              icon: Coffee
            },
            {
              step: '02',
              title: '2. Discover Verified Companions',
              desc: 'Filter verified 18+ adult profiles by city, general public area, languages, and hourly budget.',
              icon: Users
            },
            {
              step: '03',
              title: '3. Request & Escrow Booking',
              desc: 'Select date, time, and specify an open public venue. Generates your unique MUP Booking ID.',
              icon: Calendar
            },
            {
              step: '04',
              title: '4. Meet in a Public Place',
              desc: 'Enjoy wholesome companionship in a licensed public cafe. Review your companion post-session.',
              icon: MapPin
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold border border-emerald-900">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-700 group-hover:text-emerald-500 transition">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-base text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SAFETY, VERIFICATION & ANTI-SEXUAL SERVICES MANDATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 border border-slate-800 text-white relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 text-red-300 font-bold border border-red-700 text-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                Zero-Tolerance Platform Policy
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Strict Non-Sexual Activity Policy & Public Safety Protection
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                MeetUp.pk is not an escort service. Prostitution, sexual solicitation, adult escorting, overnight bookings, and private residence/hotel meetings are strictly prohibited. Every profile is verified via government CNIC/Passport review and all transactions are audited.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Public Venues Exclusively</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>18+ Age Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Private Phone & Address Never Public</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onOpenSafetyCenter}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition text-center cursor-pointer"
              >
                Open Safety Center
              </button>
              <button
                onClick={onOpenGuidelines}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition text-center cursor-pointer border border-slate-700"
              >
                Community Guidelines (18+)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BECOME A COMPANION CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
            Join Verified Companions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Monetize Your Time with Safe, Public Outings
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Set your own session fees, choose public activities you enjoy (coffee, gallery visits, language practice), and connect with respectful adults across Pakistan.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenAuth('companion')}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950 transition cursor-pointer"
            >
              Apply as a Companion (18+)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
