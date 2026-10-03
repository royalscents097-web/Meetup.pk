import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Calendar, Clock, DollarSign, Filter, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface SearchFilterState {
  cityId: string;
  activityId: string;
  area: string;
  gender: string;
  ageRange: string;
  availability: string;
  date: string;
  budgetTier: string;
  onlyVerified: boolean;
  minRating: number;
}

interface HeroSearchProps {
  onSearch: (filters: SearchFilterState) => void;
  compact?: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, compact = false }) => {
  const { cities, activities } = useApp();

  const [cityId, setCityId] = useState<string>('all');
  const [activityId, setActivityId] = useState<string>('all');
  const [area, setArea] = useState<string>('');
  const [gender, setGender] = useState<string>('all');
  const [ageRange, setAgeRange] = useState<string>('all');
  const [availability, setAvailability] = useState<string>('all');
  const [date, setDate] = useState<string>('');
  const [budgetTier, setBudgetTier] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(true);
  const [minRating, setMinRating] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const activeCities = cities.filter(c => c.isActive);
  const activeActivities = activities.filter(a => a.isActive);

  // Get areas for selected city
  const selectedCityObj = cities.find(c => c.id === cityId);
  const availableAreas = selectedCityObj ? selectedCityObj.popularAreas : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      cityId,
      activityId,
      area,
      gender,
      ageRange,
      availability,
      date,
      budgetTier,
      onlyVerified,
      minRating
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-4 sm:p-6 lg:p-7 text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Grid: City, Activity, Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* City Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Launch City
            </label>
            <select
              value={cityId}
              onChange={e => {
                setCityId(e.target.value);
                setArea('');
              }}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-700 bg-slate-800 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Launch Cities (Lahore, Karachi, etc.)</option>
              {activeCities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.province})
                </option>
              ))}
            </select>
          </div>

          {/* Activity Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Social Activity (Non-Sexual)
            </label>
            <select
              value={activityId}
              onChange={e => setActivityId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-700 bg-slate-800 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Any Approved Activity</option>
              {activeActivities.map(act => (
                <option key={act.id} value={act.id}>
                  {act.name}
                </option>
              ))}
            </select>
          </div>

          {/* General Area Selector / Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              General Public Area
            </label>
            {availableAreas.length > 0 ? (
              <select
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-700 bg-slate-800 text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Any Area in {selectedCityObj?.name}</option>
                {availableAreas.map(a => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. Gulberg, DHA, F-7, Clifton"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-700 bg-slate-800 text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            )}
          </div>
        </div>

        {/* Secondary Grid: Gender, Budget Tier, Availability & CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end pt-1">
          {/* Companion Gender Preference */}
          <div className="lg:col-span-3 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Preference
            </label>
            <div className="flex items-center gap-1">
              {['all', 'Female', 'Male'].map(g => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                    gender === g
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {g === 'all' ? 'Any' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Tier */}
          <div className="lg:col-span-3 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Budget Tier
            </label>
            <select
              value={budgetTier}
              onChange={e => setBudgetTier(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Any Budget</option>
              <option value="under-1000">Under PKR 1,000</option>
              <option value="1000-2000">PKR 1,000 – 2,000</option>
              <option value="2000-3000">PKR 2,000 – 3,000</option>
              <option value="above-3000">PKR 3,000+</option>
            </select>
          </div>

          {/* Availability */}
          <div className="lg:col-span-3 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Availability
            </label>
            <select
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Anytime</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="weekends">Weekends Only</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-950 transition-all flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              Find Companions
            </button>
          </div>
        </div>

        {/* Toggle Advanced Filters Button */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-slate-400 hover:text-emerald-400 font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Filter className="w-3 h-3" />
            {showAdvanced ? 'Hide Detailed Filters' : 'Show Age, Rating & Verification Filters'}
          </button>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={e => setOnlyVerified(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700"
            />
            <span>✓ Verified Only</span>
          </label>
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvanced && (
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Age Range
              </label>
              <select
                value={ageRange}
                onChange={e => setAgeRange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-xs"
              >
                <option value="all">All Adult Ages (18+)</option>
                <option value="18-24">18 – 24 years</option>
                <option value="25-34">25 – 34 years</option>
                <option value="35-44">35 – 44 years</option>
                <option value="45+">45+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-xs"
              >
                <option value="0">Any Rating</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Specific Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-xs"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
