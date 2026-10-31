import React, { useState } from 'react';
import { FoodListing } from '../types';
import { useApp } from '../context/AppContext';
import { CountdownBadge } from './CountdownBadge';
import {
  MapPin,
  Thermometer,
  Calendar,
  Users,
  ShieldCheck,
  Package,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Eye,
  KeyRound,
  CheckCircle2,
  Clock,
  Flag
} from 'lucide-react';

interface ListingCardProps {
  listing: FoodListing;
  onRequestClick: (listing: FoodListing) => void;
  onConfirmPickupClick?: (listing: FoodListing) => void;
  onReportClick?: (listing: FoodListing) => void;
  onViewReceiptClick?: (listing: FoodListing) => void;
  onAcceptClick?: (listing: FoodListing) => void;
  onRejectClick?: (listing: FoodListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onRequestClick,
  onConfirmPickupClick,
  onReportClick,
  onViewReceiptClick,
  onAcceptClick,
  onRejectClick
}) => {
  const { currentUser, setSelectedReceiptListing } = useApp();
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Status badge styling
  const statusBadges = {
    AVAILABLE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    REQUESTED: 'bg-amber-100 text-amber-800 border-amber-200',
    ACCEPTED: 'bg-blue-100 text-blue-800 border-blue-200',
    COMPLETED: 'bg-slate-100 text-slate-700 border-slate-300',
    REJECTED: 'bg-rose-100 text-rose-800 border-rose-200',
    CANCELLED: 'bg-slate-100 text-slate-500 border-slate-200',
    EXPIRED: 'bg-slate-100 text-slate-400 border-slate-200',
  };

  const isDonorOwner = currentUser.id === listing.donorId;
  const isReservedByMe = currentUser.id === listing.recipientId;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Top Image & Overlays */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm border border-slate-200/50">
            {listing.category}
          </span>
          {listing.flaggedForModeration && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1 shadow-sm">
              <AlertTriangle className="w-3 h-3" />
              Flagged
            </span>
          )}
        </div>

        {/* Status Pill */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${statusBadges[listing.status] || 'bg-slate-100'}`}>
            {listing.status === 'ACCEPTED' ? 'READY FOR PICKUP' : listing.status}
          </span>
        </div>

        {/* Storage Condition Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
          <span>{listing.storageCondition}</span>
        </div>

        {/* Countdown Badge overlay */}
        {listing.status === 'AVAILABLE' && (
          <div className="absolute bottom-3 right-3">
            <CountdownBadge endTime={listing.pickupWindowEnd} />
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Quantity & Feeds Metric */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {listing.quantity} {listing.unit}
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Feeds ~{listing.estimatedServings} people
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* Dietary & Allergen Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {listing.dietaryTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
              >
                {tag}
              </span>
            ))}
            {listing.allergens.length > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                {listing.allergens[0]}
              </span>
            )}
          </div>
        </div>

        {/* Location & Safety Info */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800 truncate max-w-[180px]">
              {listing.donorName}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Hygiene Attested
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{listing.pickupAddress}</span>
          </div>

          {/* Pickup Window Start - End */}
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Pickup: {new Date(listing.pickupWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(listing.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Active PIN display if Accepted and user is donor or recipient */}
          {listing.status === 'ACCEPTED' && listing.pickupVerificationCode && (isDonorOwner || isReservedByMe) && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-blue-900 mt-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold">Handover PIN:</span>
              </div>
              <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-700 tracking-wider">
                {listing.pickupVerificationCode}
              </span>
            </div>
          )}

          {/* Pending Request Banner */}
          {listing.status === 'REQUESTED' && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
              <span className="truncate">Requested by: <strong>{listing.recipientName}</strong></span>
              <span className="text-[10px] text-amber-700 font-medium">Awaiting Donor</span>
            </div>
          )}
        </div>

        {/* Action Button Row */}
        <div className="pt-2 flex items-center gap-2">
          {/* Case 1: Listing AVAILABLE -> Recipient can request/reserve */}
          {listing.status === 'AVAILABLE' && (
            <button
              onClick={() => onRequestClick(listing)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all"
            >
              <span>Reserve Donation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Case 2: Listing REQUESTED & current user is Donor -> Accept or Reject */}
          {listing.status === 'REQUESTED' && isDonorOwner && (
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={() => onAcceptClick && onAcceptClick(listing)}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all text-center"
              >
                Accept Request
              </button>
              <button
                onClick={() => onRejectClick && onRejectClick(listing)}
                className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs border border-rose-200 transition-all text-center"
              >
                Reject
              </button>
            </div>
          )}

          {/* Case 3: Listing ACCEPTED -> Confirm Handover / Pickup */}
          {listing.status === 'ACCEPTED' && (
            <button
              onClick={() => onConfirmPickupClick && onConfirmPickupClick(listing)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Handover (PIN)</span>
            </button>
          )}

          {/* Case 4: Listing COMPLETED -> View Receipt */}
          {listing.status === 'COMPLETED' && (
            <button
              onClick={() => setSelectedReceiptListing(listing)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all border border-slate-200"
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>View Handover Receipt</span>
            </button>
          )}

          {/* Flag / Report icon */}
          {onReportClick && (
            <button
              onClick={() => onReportClick(listing)}
              title="Report inappropriate or unsafe listing to moderator"
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 shrink-0"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

