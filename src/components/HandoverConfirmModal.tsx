import React, { useState } from 'react';
import { FoodListing } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  KeyRound,
  Thermometer,
  ShieldCheck,
  Star,
  PackageCheck,
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface HandoverConfirmModalProps {
  listing: FoodListing | null;
  onClose: () => void;
}

export const HandoverConfirmModal: React.FC<HandoverConfirmModalProps> = ({ listing, onClose }) => {
  const { confirmPickup, currentUser } = useApp();

  if (!listing) return null;

  const [enteredPin, setEnteredPin] = useState(listing.pickupVerificationCode || '');
  const [handoverTempChecked, setHandoverTempChecked] = useState(true);
  const [packagingIntact, setPackagingIntact] = useState(true);
  const [handoverNotes, setHandoverNotes] = useState(
    'Handover inspected and verified on-site. Temperature logged in compliant safety zone.'
  );
  const [rating, setRating] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPin.trim()) {
      alert('Please enter or verify the pickup PIN.');
      return;
    }
    if (!handoverTempChecked || !packagingIntact) {
      alert('Please verify temperature and packaging integrity before completing handover.');
      return;
    }

    setSubmitting(true);
    try {
      await confirmPickup(listing.id, enteredPin, handoverNotes, handoverTempChecked, rating);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">Confirm Food Handover & Pickup</h2>
              <p className="text-blue-100 text-xs mt-0.5">
                Listing #{listing.id} • Verified Transfer
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
          
          {/* Handover Details Summary */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-sm truncate">{listing.title}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                {listing.quantity} {listing.unit}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Donor:</span>
                <span className="font-medium text-slate-800">{listing.donorName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Recipient:</span>
                <span className="font-medium text-slate-800">{listing.recipientName || currentUser.name}</span>
              </div>
            </div>
          </div>

          {/* Verification Code Box */}
          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-blue-950 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-600" />
                Pickup Verification PIN
              </label>
              {listing.pickupVerificationCode && (
                <button
                  type="button"
                  onClick={() => setEnteredPin(listing.pickupVerificationCode || '')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
                >
                  Autofill ({listing.pickupVerificationCode})
                </button>
              )}
            </div>
            <p className="text-xs text-blue-800 leading-snug">
              The recipient must provide their 6-digit PIN code upon collection to verify physical identity and chain of custody.
            </p>
            <input
              type="text"
              required
              value={enteredPin}
              onChange={e => setEnteredPin(e.target.value)}
              placeholder="e.g. 739-204"
              className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl border border-blue-300 bg-white text-blue-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* On-Site Handover Safety Checklist */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              On-Site Handover Safety Check
            </h4>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={handoverTempChecked}
                onChange={e => setHandoverTempChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs text-slate-700">
                <strong>Temperature Verified:</strong> Food is within safe parameters (Cold &lt; 4°C or Hot &gt; 60°C).
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={packagingIntact}
                onChange={e => setPackagingIntact(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs text-slate-700">
                <strong>Packaging Intact:</strong> Containers are sealed with no signs of leakage, spoilage, or contamination.
              </span>
            </label>
          </div>

          {/* Feedback Rating */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Handover Quality Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                </button>
              ))}
              <span className="text-xs text-slate-500 ml-2 font-medium">{rating} / 5 Stars</span>
            </div>
          </div>

          {/* Handover Log Notes */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Digital Handover Log Note
            </label>
            <input
              type="text"
              value={handoverNotes}
              onChange={e => setHandoverNotes(e.target.value)}
              placeholder="Driver name, vehicle temperature, container condition..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
            />
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
              disabled={submitting || !handoverTempChecked || !packagingIntact}
              className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center gap-2 ${
                handoverTempChecked && packagingIntact && !submitting
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Confirming...' : 'Complete & Generate Receipt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

