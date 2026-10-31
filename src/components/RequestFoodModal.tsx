import React, { useState } from 'react';
import { FoodListing } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  HeartHandshake,
  Clock,
  MapPin,
  Thermometer,
  ShieldCheck,
  Truck,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface RequestFoodModalProps {
  listing: FoodListing | null;
  onClose: () => void;
}

export const RequestFoodModal: React.FC<RequestFoodModalProps> = ({ listing, onClose }) => {
  const { requestListing, currentUser } = useApp();

  if (!listing) return null;

  const [requestedQty, setRequestedQty] = useState<number>(listing.quantity);
  const [logisticsNotes, setLogisticsNotes] = useState(
    'Our outreach van is scheduled for pickup. We are bringing insulated thermal transport containers.'
  );
  const [confirmedCapacity, setConfirmedCapacity] = useState(true);
  const [confirmedColdChain, setConfirmedColdChain] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const estimatedFeeds = Math.round((requestedQty / listing.quantity) * listing.estimatedServings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedCapacity || !confirmedColdChain) {
      alert('Please confirm storage and transport capacity before reserving.');
      return;
    }

    setSubmitting(true);
    try {
      await requestListing(listing.id, requestedQty, logisticsNotes);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">Reserve Food Donation</h2>
              <p className="text-emerald-100 text-xs mt-0.5">
                Reserving for: <span className="font-semibold">{currentUser.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs sm:text-sm">
          
          {/* Food Summary Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex gap-4 items-center">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                {listing.category}
              </span>
              <h4 className="font-display font-bold text-slate-900 text-sm mt-1 truncate">
                {listing.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Provided by <strong>{listing.donorName}</strong>
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                  {listing.storageCondition}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Feeds ~{listing.estimatedServings}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-900">
                Quantity to Request (Available: {listing.quantity} {listing.unit})
              </label>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Feeds approx. {estimatedFeeds} individuals
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max={listing.quantity}
                value={requestedQty}
                onChange={e => setRequestedQty(Number(e.target.value))}
                className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="w-24 flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max={listing.quantity}
                  value={requestedQty}
                  onChange={e => setRequestedQty(Math.min(listing.quantity, Math.max(1, Number(e.target.value))))}
                  className="w-16 px-2 py-1 text-center font-bold text-slate-900 border border-slate-300 rounded-lg"
                />
                <span className="text-xs text-slate-500">{listing.unit}</span>
              </div>
            </div>
          </div>

          {/* Pickup Window Warning */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-amber-900">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-amber-950">Strict Pickup Window</p>
              <p className="text-xs text-amber-800 mt-0.5">
                Pickup deadline: <strong>{new Date(listing.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>. If not collected by this time, food safety protocols require cancellation.
              </p>
              <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {listing.pickupAddress}
              </p>
            </div>
          </div>

          {/* Logistics Note */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Logistics & Transportation Notes for Donor
            </label>
            <textarea
              rows={2}
              value={logisticsNotes}
              onChange={e => setLogisticsNotes(e.target.value)}
              placeholder="Driver arrival time, vehicle license or specific instructions..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Recipient Safety Confirmations */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedCapacity}
                onChange={e => setConfirmedCapacity(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs text-slate-700">
                <strong>Direct Charitable Distribution:</strong> Our organization will redistribute this food directly to food-insecure individuals at no charge.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedColdChain}
                onChange={e => setConfirmedColdChain(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs text-slate-700">
                <strong>Cold/Hot Holding Transport:</strong> We possess suitable food-grade transport cambros or cold-storage boxes to maintain food safety during transit.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !confirmedCapacity || !confirmedColdChain}
              className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center gap-2 ${
                confirmedCapacity && confirmedColdChain && !submitting
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Send Reservation Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

