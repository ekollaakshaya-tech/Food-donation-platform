import React from 'react';
import { ShieldAlert, Info, ExternalLink, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SafetyBanner: React.FC = () => {
  const { setIsSafetyModalOpen } = useApp();

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-amber-50">
          <span className="p-1 rounded-full bg-white/20 shrink-0">
            <ShieldAlert className="w-4 h-4 text-white" />
          </span>
          <p className="leading-snug">
            <span className="font-semibold text-white">Food Safety & Prototype Notice:</span> NourishShare is a peer-to-peer surplus food redistribution prototype. It is <strong className="underline underline-offset-2">NOT</strong> a formal food-safety certification agency. Donors and recipients are solely responsible for compliance with local sanitary regulations, hot/cold chains, and the 2h/4h safety rule.
          </p>
        </div>
        <button
          onClick={() => setIsSafetyModalOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-medium rounded-lg text-xs transition-colors border border-white/25"
        >
          <span>Safety Guidelines & Limitations</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

