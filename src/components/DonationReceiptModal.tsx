import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Utensils,
  Building2,
  HeartHandshake,
  Calendar,
  KeyRound
} from 'lucide-react';

export const DonationReceiptModal: React.FC = () => {
  const { selectedReceiptListing, setSelectedReceiptListing } = useApp();

  if (!selectedReceiptListing) return null;

  const listing = selectedReceiptListing;
  const kgEstimated = listing.unit === 'kg' ? listing.quantity : Math.round(listing.quantity * 0.4);
  const co2Estimated = Math.round(kgEstimated * 2.5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-base sm:text-lg">Digital Donation Handover Record</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setSelectedReceiptListing(null)}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 bg-white" id="printable-receipt">
          
          {/* Header & Logo */}
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Utensils className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold font-display text-slate-900">NourishShare Network</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">Official Food Redistribution & Impact Certificate</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs uppercase tracking-wider">
                Status: Completed
              </span>
              <p className="font-mono text-xs text-slate-500 mt-1">ID: #{listing.id}</p>
            </div>
          </div>

          {/* Transfer Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Food Donor Organization
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{listing.donorName}</h4>
              <p className="text-xs text-slate-600">{listing.donorType}</p>
              <p className="text-xs text-slate-500 mt-1">{listing.pickupAddress}</p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">Verified Donor Certified</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Recipient Charitable Entity
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{listing.recipientName || 'Charitable Partner'}</h4>
              <p className="text-xs text-slate-600">Registered Charitable Recipient</p>
              <p className="text-xs text-slate-500 mt-1">Direct Free Community Distribution</p>
              <p className="text-[11px] text-blue-700 font-medium mt-1">Non-Profit Tax Exemption</p>
            </div>
          </div>

          {/* Food Details Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-[11px] uppercase text-slate-600 font-bold">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Est. Servings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">{listing.title}</td>
                  <td className="p-3 text-slate-600">{listing.category}</td>
                  <td className="p-3 font-medium text-emerald-700">{listing.quantity} {listing.unit}</td>
                  <td className="p-3 font-medium text-blue-700">~{listing.estimatedServings} meals</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Impact Highlights */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="block text-lg font-bold text-emerald-700">{listing.estimatedServings}</span>
              <span className="text-[11px] text-emerald-800 font-medium">Meals Served</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="block text-lg font-bold text-blue-700">{kgEstimated} kg</span>
              <span className="text-[11px] text-blue-800 font-medium">Food Rescued</span>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
              <span className="block text-lg font-bold text-teal-700">{co2Estimated} kg</span>
              <span className="text-[11px] text-teal-800 font-medium">CO₂ Emissions Avoided</span>
            </div>
          </div>

          {/* Chain of Custody & PIN Verification */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between font-semibold text-slate-900">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                Handover Verification PIN:
              </span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800 font-bold">
                {listing.pickupVerificationCode || 'PIN-VERIFIED'}
              </span>
            </div>
            <p><strong>Handover Timestamp:</strong> {listing.completedAt ? new Date(listing.completedAt).toLocaleString() : new Date().toLocaleString()}</p>
            <p><strong>Temperature at Handover:</strong> {listing.temperatureAtListing || 'Verified in compliant safety holding'}</p>
            <p><strong>Log Notes:</strong> {listing.handoverNotes || 'Inspected on site, temperature logged and packaged securely.'}</p>
          </div>

          {/* Legal / Good Samaritan Disclaimer */}
          <div className="text-[11px] text-slate-500 border-t pt-3 leading-relaxed">
            <p>
              <strong>Good Samaritan Food Donation Act Protection:</strong> This surplus food transfer was conducted under applicable Good Samaritan food donation legislation protecting certified donors and non-profit recipients from liability when donating apparently wholesome food in good faith.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedReceiptListing(null)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

