import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, AlertTriangle, Thermometer, Clock, PackageCheck, FileText, X, CheckCircle } from 'lucide-react';

export const SafetyModal: React.FC = () => {
  const { isSafetyModalOpen, setIsSafetyModalOpen } = useApp();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">Food Safety, Compliance & Operational Limitations</h2>
              <p className="text-amber-100 text-xs mt-0.5">Problem ID: HACK-P197 • Food Donation Redistribution Protocol</p>
            </div>
          </div>
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-sm text-slate-600">
          {/* Critical Disclaimer Box */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-950">Crucial Platform Disclaimer</h4>
              <p className="mt-1 text-xs leading-relaxed text-amber-800">
                NourishShare is an intermediary digital technology platform facilitating peer-to-peer redistribution between surplus food donors and non-profit charitable recipients. <strong>This platform is NOT a regulatory, government, or third-party food-safety certification entity.</strong> It does not inspect physical kitchens, food batches, or transport vehicles.
              </p>
            </div>
          </div>

          {/* Section 1: Temperature & The 2-Hour / 4-Hour Rule */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
              <Thermometer className="w-5 h-5 text-rose-500" />
              <h3>1. Temperature Control & The Danger Zone</h3>
            </div>
            <p className="text-xs leading-relaxed">
              Pathogenic bacteria multiply most rapidly between <strong>4°C and 60°C (40°F – 140°F)</strong>, known as the Temperature Danger Zone.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                <span className="font-semibold text-blue-900 block mb-1">Cold Holding & Refrigeration:</span>
                Must maintain <strong className="text-blue-800">below 4°C (40°F)</strong>. Perishables like dairy, meats, prepared salads, and sliced produce must be transported in insulated cool-boxes with ice packs or refrigerated vans.
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs">
                <span className="font-semibold text-red-900 block mb-1">Hot Holding:</span>
                Must maintain <strong className="text-red-800">above 60°C (140°F)</strong>. Cooked meal batches must remain in commercial steam cambros or insulated thermal containers until pickup.
              </div>
            </div>
          </div>

          {/* Section 2: 2-Hour / 4-Hour Perishable Holding Rule */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3>2. The 2-Hour / 4-Hour Rule for Prepared Food</h3>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-xs pl-2">
              <li><strong>Under 2 Hours:</strong> Food held in the danger zone for under 2 hours may be served immediately, chilled to under 4°C, or reheated to 74°C.</li>
              <li><strong>2 to 4 Hours:</strong> Food held in the danger zone between 2 and 4 hours must be consumed immediately and CANNOT be re-chilled or saved for later.</li>
              <li><strong>Over 4 Hours:</strong> Perishable food held in the danger zone for more than 4 hours has a high risk of foodborne bacteria and <strong>MUST BE DISCARDED</strong>. It cannot be listed or donated.</li>
            </ul>
          </div>

          {/* Section 3: Packaging & Allergen Integrity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
              <PackageCheck className="w-5 h-5 text-emerald-600" />
              <h3>3. Safe Packaging & Allergen Disclosures</h3>
            </div>
            <p className="text-xs leading-relaxed">
              Donors must use clean, food-grade, tamper-evident containers. Pre-packaged items must clearly state common allergens (Nuts, Dairy, Gluten, Soy, Eggs, Shellfish). Unlabelled mystery foods or food previously placed on open self-service guest buffets are strictly prohibited.
            </p>
          </div>

          {/* Section 4: Operational Limitations & Privacy Protection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3>4. Privacy, Scheduling & Good Samaritan Protection</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li><strong>Demo Addresses & Privacy:</strong> To safeguard donor and community privacy, all street addresses, telephone contacts, and volunteer identities on this hackathon prototype are simulated mock data.</li>
              <li><strong>Anti-Double Booking:</strong> When a recipient requests or reserves a listing, the quantity is locked to prevent duplicate assignments or missed pickups.</li>
              <li><strong>Good Samaritan Legislation:</strong> In many jurisdictions (e.g. Bill Emerson Good Samaritan Food Donation Act), donors providing surplus food in good faith to non-profit recipient organizations are protected against civil and criminal liability, barring gross negligence.</li>
            </ul>
          </div>

          {/* Donor Attestation Requirement */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Mandatory Donor Attestation Checklist
            </h4>
            <p className="text-slate-600">
              Before submitting any donation, donors must confirm four compliance checks: hygienic preparation in a licensed kitchen, temperature maintenance, packaging integrity, and allergen accuracy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

