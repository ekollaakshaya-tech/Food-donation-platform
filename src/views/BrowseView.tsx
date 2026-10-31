import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FoodListing, FoodCategory, StorageCondition } from '../types';
import { ListingCard } from '../components/ListingCard';
import { RequestFoodModal } from '../components/RequestFoodModal';
import { HandoverConfirmModal } from '../components/HandoverConfirmModal';
import { ReportListingModal } from '../components/ReportListingModal';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Utensils,
  Leaf,
  ShieldCheck,
  Clock,
  Sparkles,
  Heart,
  TrendingUp,
  RotateCcw,
  Plus
} from 'lucide-react';

export const BrowseView: React.FC = () => {
  const { listings, stats, currentUser, switchRole, setIsCreateModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStorage, setSelectedStorage] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'REQUESTED' | 'ACCEPTED'>('ALL');
  const [sortBy, setSortBy] = useState<'deadline' | 'newest' | 'quantity'>('deadline');

  // Modals
  const [requestingListing, setRequestingListing] = useState<FoodListing | null>(null);
  const [confirmingListing, setConfirmingListing] = useState<FoodListing | null>(null);
  const [reportingListing, setReportingListing] = useState<FoodListing | null>(null);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchDonor = item.donorName.toLowerCase().includes(q);
        const matchTag = item.dietaryTags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchDonor && !matchTag) return false;
      }

      // Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Storage
      if (selectedStorage !== 'All' && item.storageCondition !== selectedStorage) {
        return false;
      }

      // Dietary
      if (selectedDietary !== 'All' && !item.dietaryTags.includes(selectedDietary)) {
        return false;
      }

      // Status
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // Urgent deadline (< 3 hours remaining)
      if (filterUrgent) {
        const diff = new Date(item.pickupWindowEnd).getTime() - new Date().getTime();
        const hours = diff / (1000 * 3600);
        if (hours <= 0 || hours > 3) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.pickupWindowEnd).getTime() - new Date(b.pickupWindowEnd).getTime();
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'quantity') {
        return b.quantity - a.quantity;
      }
      return 0;
    });
  }, [listings, searchQuery, selectedCategory, selectedStorage, selectedDietary, filterUrgent, statusFilter, sortBy]);

  const categories = ['All', 'Cooked Meals', 'Bakery & Pastries', 'Fresh Produce', 'Dairy & Chilled', 'Packaged & Canned', 'Beverages'];
  const dietaryOptions = ['All', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Nut-Free'];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Hero Impact & Quick Mission Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-10 shadow-lg overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Connecting Surplus Commercial Kitchens with Charitable Pantries</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display leading-tight">
            Rescue Good Food. Feed Local Communities.
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Browse inspected surplus donations from certified banquet centers, artisan bakeries, and organic markets. Real-time pickup tracking, temperature logging, and verification codes.
          </p>

          {/* Impact Counters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <span className="block text-xl sm:text-2xl font-bold font-display text-white">
                {stats.totalMealsServed.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-200">Meals Served</span>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <span className="block text-xl sm:text-2xl font-bold font-display text-white">
                {stats.totalKgRescued.toLocaleString()} kg
              </span>
              <span className="text-[11px] text-emerald-200">Food Rescued</span>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <span className="block text-xl sm:text-2xl font-bold font-display text-white">
                {stats.co2SavedKg.toLocaleString()} kg
              </span>
              <span className="text-[11px] text-emerald-200">CO₂ Avoided</span>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <span className="block text-xl sm:text-2xl font-bold font-display text-emerald-300">
                {stats.safetyComplianceRate}%
              </span>
              <span className="text-[11px] text-emerald-200">Safety Index</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
        
        {/* Top Search Input & Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by food name, donor, ingredients, or dietary tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Urgent Closing Soon Toggle */}
            <button
              onClick={() => setFilterUrgent(!filterUrgent)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filterUrgent
                  ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${filterUrgent ? 'text-rose-600' : 'text-slate-400'}`} />
              <span>Urgent (&lt; 3h)</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="deadline">Soonest Deadline</option>
              <option value="newest">Newly Listed</option>
              <option value="quantity">Highest Quantity</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dietary & Storage Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700">Dietary:</span>
            {dietaryOptions.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedDietary(tag)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  selectedDietary === tag
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available Now</option>
              <option value="REQUESTED">Requested</option>
              <option value="ACCEPTED">Accepted / Ready</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900">
            Available Surplus Food Listings
          </h2>
          <p className="text-xs text-slate-500">
            Showing {filteredListings.length} matching donations in Metro City
          </p>
        </div>

        {currentUser.role === 'donor' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Food Listing</span>
          </button>
        )}
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onRequestClick={item => setRequestingListing(item)}
              onConfirmPickupClick={item => setConfirmingListing(item)}
              onReportClick={item => setReportingListing(item)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Food Listings Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, clearing dietary filters, or viewing all categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDietary('All');
              setSelectedStorage('All');
              setFilterUrgent(false);
              setStatusFilter('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Active Modals */}
      <RequestFoodModal
        listing={requestingListing}
        onClose={() => setRequestingListing(null)}
      />

      <HandoverConfirmModal
        listing={confirmingListing}
        onClose={() => setConfirmingListing(null)}
      />

      <ReportListingModal
        listing={reportingListing}
        onClose={() => setReportingListing(null)}
      />
    </div>
  );
};

