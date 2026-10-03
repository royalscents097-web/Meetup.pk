import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  DollarSign,
  Globe2,
  X,
  SlidersHorizontal,
  RotateCcw,
  Star,
  ShieldCheck,
  Calendar,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompanionCard } from '../components/CompanionCard';
import { SearchFilterState } from '../components/HeroSearch';
import { AnalyticsService } from '../services/analytics';
import { CompanionProfile } from '../types';

interface ExploreViewProps {
  initialFilters?: SearchFilterState | null;
  onOpenBookingDirect?: (companion: CompanionProfile) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ initialFilters, onOpenBookingDirect }) => {
  const { companionProfiles, cities, activities, selectedCityId, setSelectedCityId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>(
    initialFilters?.activityId || 'all'
  );
  const [selectedArea, setSelectedArea] = useState<string>(initialFilters?.area || '');
  const [selectedGender, setSelectedGender] = useState<string>(
    initialFilters?.gender || 'all'
  );
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>(
    initialFilters?.ageRange || 'all'
  );
  const [selectedAvailability, setSelectedAvailability] = useState<string>(
    initialFilters?.availability || 'all'
  );
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<string>(
    initialFilters?.budgetTier || 'all'
  );
  const [onlyVerified, setOnlyVerified] = useState<boolean>(
    initialFilters?.onlyVerified ?? true
  );
  const [minRating, setMinRating] = useState<number>(initialFilters?.minRating || 0);
  const [sortBy, setSortBy] = useState<'rating' | 'rate-low' | 'rate-high' | 'bookings'>('rating');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.cityId && initialFilters.cityId !== 'all') {
        setSelectedCityId(initialFilters.cityId);
      }
      if (initialFilters.activityId) setSelectedActivity(initialFilters.activityId);
      if (initialFilters.area) setSelectedArea(initialFilters.area);
      if (initialFilters.gender) setSelectedGender(initialFilters.gender);
      if (initialFilters.budgetTier) setSelectedBudgetTier(initialFilters.budgetTier);
      if (initialFilters.availability) setSelectedAvailability(initialFilters.availability);
      if (initialFilters.ageRange) setSelectedAgeRange(initialFilters.ageRange);
      if (initialFilters.minRating) setMinRating(initialFilters.minRating);
    }
  }, [initialFilters]);

  // Selected city object for areas
  const currentCityObj = cities.find(c => c.id === selectedCityId);
  const cityAreas = currentCityObj ? currentCityObj.popularAreas : [];

  // Filtered companions computation
  const filteredCompanions = useMemo(() => {
    return companionProfiles
      .filter(comp => {
        // City filter
        if (selectedCityId !== 'all' && comp.cityId !== selectedCityId) {
          return false;
        }

        // Area filter
        if (selectedArea && !comp.area.toLowerCase().includes(selectedArea.toLowerCase())) {
          return false;
        }

        // Activity filter
        if (selectedActivity !== 'all' && !comp.activityIds.includes(selectedActivity)) {
          return false;
        }

        // Gender filter
        if (selectedGender !== 'all' && comp.gender !== selectedGender) {
          return false;
        }

        // Age Range filter
        if (selectedAgeRange === '18-24' && (comp.age < 18 || comp.age > 24)) return false;
        if (selectedAgeRange === '25-34' && (comp.age < 25 || comp.age > 34)) return false;
        if (selectedAgeRange === '35-44' && (comp.age < 35 || comp.age > 44)) return false;
        if (selectedAgeRange === '45+' && comp.age < 45) return false;

        // Availability filter
        if (selectedAvailability === 'weekends' && !comp.availability.weekends) return false;
        if (selectedAvailability === 'weekdays' && !comp.availability.weekdays) return false;

        // Budget tier filter
        if (selectedBudgetTier === 'under-1000' && comp.sessionRate >= 1000) return false;
        if (
          selectedBudgetTier === '1000-2000' &&
          (comp.sessionRate < 1000 || comp.sessionRate > 2000)
        )
          return false;
        if (
          selectedBudgetTier === '2000-3000' &&
          (comp.sessionRate < 2000 || comp.sessionRate > 3000)
        )
          return false;
        if (selectedBudgetTier === 'above-3000' && comp.sessionRate <= 3000) return false;

        // Verification filter
        if (onlyVerified && comp.verificationStatus !== 'Verified') {
          return false;
        }

        // Minimum Rating filter
        if (minRating > 0 && comp.rating < minRating) {
          return false;
        }

        // Search query (name, area, interests, bio)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = comp.displayName.toLowerCase().includes(query);
          const matchesArea = comp.area.toLowerCase().includes(query);
          const matchesBio = comp.bio.toLowerCase().includes(query);
          const matchesInterests = comp.interests.some(i => i.toLowerCase().includes(query));
          if (!matchesName && !matchesArea && !matchesBio && !matchesInterests) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'rate-low') return a.sessionRate - b.sessionRate;
        if (sortBy === 'rate-high') return b.sessionRate - a.sessionRate;
        if (sortBy === 'bookings') return (b.completedActivitiesCount || b.totalBookings) - (a.completedActivitiesCount || a.totalBookings);
        return 0;
      });
  }, [
    companionProfiles,
    selectedCityId,
    selectedArea,
    selectedActivity,
    selectedGender,
    selectedAgeRange,
    selectedAvailability,
    selectedBudgetTier,
    onlyVerified,
    minRating,
    searchQuery,
    sortBy
  ]);

  const resetFilters = () => {
    setSelectedCityId('all');
    setSelectedActivity('all');
    setSelectedArea('');
    setSelectedGender('all');
    setSelectedAgeRange('all');
    setSelectedAvailability('all');
    setSelectedBudgetTier('all');
    setOnlyVerified(true);
    setMinRating(0);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Discover Verified Companions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified 18+ adults for legitimate, public non-sexual social activities in Pakistan.
          </p>
        </div>

        {/* Search Query Input & Mobile Filter Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search interests, areas, topics..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-700 bg-slate-900 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden p-2.5 rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <div
          className={`lg:block ${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto'
              : 'hidden'
          }`}
        >
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-5 shadow-xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-400" />
                Refine Search
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                {mobileFilterOpen && (
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="lg:hidden p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* City Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                City
              </label>
              <select
                value={selectedCityId}
                onChange={e => {
                  setSelectedCityId(e.target.value);
                  setSelectedArea('');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Launch Cities</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isActive ? '' : '(Upcoming)'}
                  </option>
                ))}
              </select>
            </div>

            {/* General Public Area Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                General Area (No private addresses)
              </label>
              {cityAreas.length > 0 ? (
                <select
                  value={selectedArea}
                  onChange={e => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Any Area in {currentCityObj?.name}</option>
                  {cityAreas.map(a => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedArea}
                  onChange={e => setSelectedArea(e.target.value)}
                  placeholder="e.g. Gulberg, DHA, F-7, Clifton"
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>

            {/* Activity Category Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Activity (Non-Sexual)
              </label>
              <select
                value={selectedActivity}
                onChange={e => setSelectedActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Any Approved Activity</option>
                {activities.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Companion Preference
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['all', 'Female', 'Male'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGender(g)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      selectedGender === g
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {g === 'all' ? 'Any' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Age Range (Strictly 18+)
              </label>
              <select
                value={selectedAgeRange}
                onChange={e => setSelectedAgeRange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Any Adult Age</option>
                <option value="18-24">18 – 24 years</option>
                <option value="25-34">25 – 34 years</option>
                <option value="35-44">35 – 44 years</option>
                <option value="45+">45+ years</option>
              </select>
            </div>

            {/* Budget Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Budget Tier
              </label>
              <select
                value={selectedBudgetTier}
                onChange={e => setSelectedBudgetTier(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Any Rate</option>
                <option value="under-1000">Under PKR 1,000</option>
                <option value="1000-2000">PKR 1,000 – 2,000</option>
                <option value="2000-3000">PKR 2,000 – 3,000</option>
                <option value="above-3000">PKR 3,000+</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Rating
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[0, 4.0, 4.5].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(r)}
                    className={`py-1.5 rounded-lg border font-semibold transition ${
                      minRating === r
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Only Check */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white font-semibold">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={e => setOnlyVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700"
                />
                <span>✓ Verified Only</span>
              </label>
            </div>

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
              >
                Show {filteredCompanions.length} Results
              </button>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Results Bar & Sort Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-300 font-medium">
              Showing <strong className="text-white">{filteredCompanions.length}</strong> available companion{filteredCompanions.length !== 1 ? 's' : ''}
              {selectedCityId !== 'all' && (
                <span> in <span className="text-emerald-400 font-bold">{cities.find(c => c.id === selectedCityId)?.name}</span></span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-bold focus:outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="rate-low">Price: Low to High</option>
                <option value="rate-high">Price: High to Low</option>
                <option value="bookings">Completed Activities</option>
              </select>
            </div>
          </div>

          {/* Companions Grid */}
          {filteredCompanions.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Companions Match Your Exact Criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try loosening your budget tier, unchecking "Verified Only", or selecting "All Launch Cities".
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCompanions.map(comp => (
                <CompanionCard
                  key={comp.id}
                  companion={comp}
                  onOpenBookingDirect={onOpenBookingDirect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
