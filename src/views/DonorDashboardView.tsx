import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodListing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { HandoverConfirmModal } from '../components/HandoverConfirmModal';
import {
  Building2,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  KeyRound,
  FileCheck2,
  Thermometer,
  ShieldCheck,
  Users,
  ChevronRight,
  TrendingUp,
  PackageCheck,
  Ban
} from 'lucide-react';

export const DonorDashboardView: React.FC = () => {
  const {
    currentUser,
    listings,
    acceptRequest,
    rejectRequest,
    cancelListing,
    setIsCreateModalOpen,
    setIsProfileModalOpen,
    setSelectedReceiptListing
  } = useApp();

  const [confirmingListing, setConfirmingListing] = useState<FoodListing | null>(null);
  const [rejectingListingId, setRejectingListingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Outside scheduled loading bay hours');

  // Listings owned by this donor
  const donorListings = listings.filter(l => l.donorId === currentUser.id);

  // Grouped subsets
  const pendingRequests = donorListings.filter(l => l.status === 'REQUESTED');
  const activeListings = donorListings.filter(l => l.status === 'AVAILABLE' || l.status === 'ACCEPTED');
  const completedHistory = donorListings.filter(l => l.status === 'COMPLETED');

  // Metrics
  const totalMealsDonated = completedHistory.reduce((acc, curr) => acc + curr.estimatedServings, 0);
  const totalKgDonated = completedHistory.reduce((acc, curr) => acc + (curr.unit === 'kg' ? curr.quantity : (curr.quantity * 0.4)), 0);

  const handleAccept = async (listingId: string) => {
    await acceptRequest(listingId);
  };

  const handleReject = async (listingId: string) => {
    await rejectRequest(listingId, rejectReason);
    setRejectingListingId(null);
  };

  const handleCancel = async (listingId: string) => {
    const reason = window.prompt('Enter cancellation reason (e.g. kitchen emergency, spoilage before pickup):');
    if (reason) {
      await cancelListing(listingId, reason);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Donor Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                {currentUser.name}
              </h1>
              {currentUser.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Donor
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser.organizationType} • {currentUser.address}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Food Safety Permit: <strong>{currentUser.foodSafetyCertNumber || 'FS-98421-METRO'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            Manage Facility Profile
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Surplus Food</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Active Listings</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-slate-900">{activeListings.length}</span>
            <span className="text-xs text-emerald-600 font-semibold">Available for pickup</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="text-slate-400 text-xs font-medium block">Pending Requests</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-display ${pendingRequests.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingRequests.length}
            </span>
            <span className="text-xs text-amber-600 font-semibold">Awaiting acceptance</span>
          </div>
          {pendingRequests.length > 0 && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          )}
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Completed Pickups</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-slate-900">{completedHistory.length}</span>
            <span className="text-xs text-blue-600 font-semibold">Verified transfers</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Total Meals Provided</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-emerald-600">{totalMealsDonated}</span>
            <span className="text-xs text-slate-500 font-medium">({Math.round(totalKgDonated)} kg)</span>
          </div>
        </div>
      </div>

      {/* ACTION REQUIRED: Pending Incoming Requests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <h2 className="text-lg font-bold font-display text-slate-900">
              Incoming Reservation Requests ({pendingRequests.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Requires donor review & acceptance</span>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map(listing => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Action Required
                    </span>
                    <h3 className="font-display font-bold text-base text-slate-900 mt-1">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Quantity requested: <strong className="text-emerald-700">{listing.requestedQuantity} {listing.unit}</strong> (Feeds ~{listing.estimatedServings} people)
                    </p>
                  </div>
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                </div>

                {/* Recipient details */}
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-amber-950 font-semibold">
                    <span>Requested by: {listing.recipientName}</span>
                    <span className="text-[11px] text-amber-700">
                      {listing.requestedAt ? new Date(listing.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                    </span>
                  </div>
                  {listing.requestNotes && (
                    <p className="text-slate-600 italic">
                      "{listing.requestNotes}"
                    </p>
                  )}
                  <div className="text-[11px] text-amber-800 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pickup Window: {new Date(listing.pickupWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(listing.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Accept / Reject controls */}
                {rejectingListingId === listing.id ? (
                  <div className="space-y-2 p-3 bg-rose-50 rounded-xl border border-rose-200">
                    <label className="block text-xs font-semibold text-rose-900">
                      Reason for Rejection:
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-300 text-slate-900"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setRejectingListingId(null)}
                        className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReject(listing.id)}
                        className="px-3 py-1 text-xs bg-rose-600 text-white rounded-lg font-bold"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAccept(listing.id)}
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Request & Generate PIN</span>
                    </button>
                    <button
                      onClick={() => setRejectingListingId(listing.id)}
                      className="py-2.5 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs border border-rose-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
            No pending incoming requests right now. When recipient organizations reserve your surplus food, they will appear here for 1-click review.
          </div>
        )}
      </div>

      {/* ACTIVE & READY FOR PICKUP LISTINGS */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-slate-900">
            Active Donations & Scheduled Pickups ({activeListings.length})
          </h2>
          <span className="text-xs text-slate-500">Real-time status updates</span>
        </div>

        {activeListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeListings.map(listing => (
              <div key={listing.id} className="relative">
                <ListingCard
                  listing={listing}
                  onRequestClick={() => {}}
                  onConfirmPickupClick={item => setConfirmingListing(item)}
                />
                {/* Donor quick cancel action */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleCancel(listing.id)}
                    title="Cancel this listing"
                    className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-600 shadow-sm border border-slate-200 transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <PackageCheck className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Active Listings Currently</h4>
            <p className="text-xs text-slate-500">Have leftover buffet items or prepared meals? Create a listing!</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all inline-block"
            >
              Post Food Listing
            </button>
          </div>
        )}
      </div>

      {/* COMPLETED DONATIONS HISTORY */}
      <div className="space-y-3 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-900">
              Completed Donations History
            </h2>
            <p className="text-xs text-slate-500">
              Official chain-of-custody archive and Good Samaritan compliance records
            </p>
          </div>
        </div>

        {completedHistory.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Food Title</th>
                    <th className="p-3.5">Recipient Charity</th>
                    <th className="p-3.5">Quantity / Feeds</th>
                    <th className="p-3.5">Handover PIN</th>
                    <th className="p-3.5">Completion Date</th>
                    <th className="p-3.5 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {completedHistory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-semibold text-slate-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">
                        {item.recipientName || 'Charitable Pantry'}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-emerald-700">{item.quantity} {item.unit}</span>
                        <span className="text-slate-400 ml-1">(~{item.estimatedServings} feeds)</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-blue-700">
                        {item.pickupVerificationCode || 'PIN-739-204'}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'Yesterday'}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedReceiptListing(item)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs border border-slate-200 transition-colors inline-flex items-center gap-1"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
            No completed donations in history yet. As food handovers are verified, they will be archived here.
          </div>
        )}
      </div>

      {/* Handover Modal */}
      <HandoverConfirmModal
        listing={confirmingListing}
        onClose={() => setConfirmingListing(null)}
      />
    </div>
  );
};

