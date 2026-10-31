import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodListing } from '../types';
import { HandoverConfirmModal } from '../components/HandoverConfirmModal';
import { CountdownBadge } from '../components/CountdownBadge';
import {
  HeartHandshake,
  Clock,
  MapPin,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Thermometer,
  ShieldCheck,
  Copy,
  Users,
  Building2,
  Calendar,
  XCircle,
  Truck
} from 'lucide-react';

export const RecipientDashboardView: React.FC = () => {
  const {
    currentUser,
    listings,
    confirmPickup,
    cancelListing,
    setIsProfileModalOpen,
    setSelectedReceiptListing,
    addToast
  } = useApp();

  const [confirmingListing, setConfirmingListing] = useState<FoodListing | null>(null);

  // Filter listings associated with this recipient
  const myReservedListings = listings.filter(l => l.recipientId === currentUser.id);

  // Groupings
  const readyForPickup = myReservedListings.filter(l => l.status === 'ACCEPTED');
  const pendingApproval = myReservedListings.filter(l => l.status === 'REQUESTED');
  const pastCompleted = myReservedListings.filter(l => l.status === 'COMPLETED');

  // Stats
  const totalMealsReceived = pastCompleted.reduce((acc, curr) => acc + (curr.estimatedServings || curr.quantity), 0);
  const totalKgReceived = pastCompleted.reduce((acc, curr) => acc + (curr.unit === 'kg' ? curr.quantity : (curr.quantity * 0.4)), 0);

  const handleCopyPIN = (pin?: string) => {
    if (!pin) return;
    navigator.clipboard.writeText(pin);
    addToast('info', 'PIN Copied', `Pickup verification PIN ${pin} copied to clipboard.`);
  };

  const handleCancelReservation = async (listingId: string) => {
    const reason = window.prompt('Please enter reason for cancelling reservation (e.g. transport delay, sufficient food on hand):');
    if (reason) {
      await cancelListing(listingId, reason);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Recipient Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/30 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                {currentUser.name}
              </h1>
              {currentUser.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Recipient
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser.organizationType} • Serving ~{currentUser.capacityServingsPerDay || 150} meals daily
            </p>
            <p className="text-[11px] text-blue-700 font-medium mt-0.5">
              501(c)(3) Registration: <strong>{currentUser.charityRegistrationNumber || '501C3-9932-HOPE'}</strong>
              {currentUser.refrigeratedStorageAvailable && ' • Cold Storage Equipped'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors self-stretch md:self-auto"
        >
          Manage Charity Profile
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Ready for Pickup</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-blue-600">{readyForPickup.length}</span>
            <span className="text-xs text-blue-700 font-semibold">Active PINs</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Pending Requests</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-amber-600">{pendingApproval.length}</span>
            <span className="text-xs text-slate-500 font-medium">Awaiting Donor</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Total Meals Received</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-emerald-600">{totalMealsReceived}</span>
            <span className="text-xs text-emerald-700 font-semibold">Meals Distributed</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Rescued Weight</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-slate-900">{Math.round(totalKgReceived)} kg</span>
            <span className="text-xs text-slate-500 font-medium">Surplus Diverted</span>
          </div>
        </div>
      </div>

      {/* READY FOR PICKUP: ACTIVE RESERVATIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-lg font-bold font-display text-slate-900">
              Ready for Pickup • Active Reservations ({readyForPickup.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Present verification PIN upon arrival</span>
        </div>

        {readyForPickup.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {readyForPickup.map(listing => (
              <div
                key={listing.id}
                className="bg-white rounded-3xl border-2 border-blue-400 p-6 shadow-md space-y-4 relative overflow-hidden"
              >
                {/* Top header & countdown */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                      Confirmed & Ready
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 mt-1">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Provided by <strong>{listing.donorName}</strong>
                    </p>
                  </div>
                  <CountdownBadge endTime={listing.pickupWindowEnd} />
                </div>

                {/* Handover Verification PIN Highlight Box */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                      Handover Verification PIN
                    </span>
                    <span className="font-mono text-2xl font-black text-blue-900 tracking-widest block mt-0.5">
                      {listing.pickupVerificationCode || '739-204'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyPIN(listing.pickupVerificationCode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-100/60 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 shadow-sm transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy PIN</span>
                  </button>
                </div>

                {/* Pickup logistics info */}
                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">{listing.pickupAddress}</p>
                      <p className="text-slate-500 text-[11px]">{listing.landmark}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200 text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      Window: {new Date(listing.pickupWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(listing.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {listing.pickupInstructions && (
                    <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200">
                      <strong>Instructions:</strong> {listing.pickupInstructions}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setConfirmingListing(listing)}
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Handover On-Site</span>
                  </button>

                  <button
                    onClick={() => handleCancelReservation(listing.id)}
                    className="py-3 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold rounded-2xl text-xs border border-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <Truck className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Pickups Scheduled Right Now</h4>
            <p className="text-xs text-slate-500">
              Browse available food listings to reserve meals for your community distribution today!
            </p>
          </div>
        )}
      </div>

      {/* PENDING APPROVAL REQUESTS */}
      {pendingApproval.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-lg font-bold font-display text-slate-900">
            Pending Approval by Donors ({pendingApproval.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApproval.map(listing => (
              <div key={listing.id} className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-sm truncate">{listing.title}</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Awaiting Donor
                  </span>
                </div>
                <p className="text-slate-600">Donor: <strong>{listing.donorName}</strong></p>
                <p className="text-slate-500 text-[11px]">Requested Quantity: {listing.requestedQuantity} {listing.unit}</p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleCancelReservation(listing.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    Withdraw Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPLETED PICKUPS HISTORY */}
      <div className="space-y-3 pt-6 border-t border-slate-200">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900">
            Fulfilled Donations Archive
          </h2>
          <p className="text-xs text-slate-500">
            Official records and digital certificates of community meals distributed
          </p>
        </div>

        {pastCompleted.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Food Description</th>
                    <th className="p-3.5">Donor Facility</th>
                    <th className="p-3.5">Meals Served</th>
                    <th className="p-3.5">Verified PIN</th>
                    <th className="p-3.5">Collection Date</th>
                    <th className="p-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pastCompleted.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-semibold text-slate-900">{item.title}</td>
                      <td className="p-3.5 text-slate-800">{item.donorName}</td>
                      <td className="p-3.5 font-bold text-emerald-700">~{item.estimatedServings} meals</td>
                      <td className="p-3.5 font-mono text-blue-700">{item.pickupVerificationCode || 'VERIFIED'}</td>
                      <td className="p-3.5 text-slate-500">
                        {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'Recent'}
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
            No completed pickups recorded yet.
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <HandoverConfirmModal
        listing={confirmingListing}
        onClose={() => setConfirmingListing(null)}
      />
    </div>
  );
};

