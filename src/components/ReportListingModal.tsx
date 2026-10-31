import React, { useState } from 'react';
import { FoodListing } from '../types';
import { useApp } from '../context/AppContext';
import { X, AlertTriangle, ShieldAlert, Flag } from 'lucide-react';

interface ReportListingModalProps {
  listing: FoodListing | null;
  onClose: () => void;
}

export const ReportListingModal: React.FC<ReportListingModalProps> = ({ listing, onClose }) => {
  const { flagListing, currentUser } = useApp();

  if (!listing) return null;

  const [reason, setReason] = useState('Safety Rule Violation');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await flagListing(listing.id, `${reason}: ${details}`);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">Report Food Listing</h2>
              <p className="text-rose-100 text-xs mt-0.5">
                Listing #{listing.id} • Sent to Platform Moderator
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Listing</span>
            <h4 className="font-semibold text-slate-800 text-sm mt-0.5">{listing.title}</h4>
            <p className="text-xs text-slate-500">Donor: {listing.donorName}</p>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Reason for Report *
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white"
            >
              <option value="Safety Rule Violation">Food Safety Rule Violation (e.g. Danger zone holding time)</option>
              <option value="Spoiled or Unsafe Food">Spoiled, Expired or Contaminated Food</option>
              <option value="Misleading Quantity or Category">Misleading Quantity or Incorrect Labeling</option>
              <option value="Did Not Show Up / Locked Bay">Did Not Show Up / Inaccessible Location</option>
              <option value="Inappropriate Content">Inappropriate Content or Abuse</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Details & Observation *
            </label>
            <textarea
              required
              rows={3}
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Please explain the safety risk, violation or discrepancy..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>
              Reports are audited directly by the Platform Food Safety Officer and can lead to immediate listing suspension or donor account review.
            </p>
          </div>

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
              disabled={submitting || !details.trim()}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

