import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SafetyBanner } from './components/SafetyBanner';
import { SafetyModal } from './components/SafetyModal';
import { CreateListingModal } from './components/CreateListingModal';
import { ProfileModal } from './components/ProfileModal';
import { DonationReceiptModal } from './components/DonationReceiptModal';
import { ToastContainer } from './components/ToastContainer';
import { BrowseView } from './views/BrowseView';
import { DonorDashboardView } from './views/DonorDashboardView';
import { RecipientDashboardView } from './views/RecipientDashboardView';
import { AdminView } from './views/AdminView';
import { ShieldCheck, Utensils, HeartHandshake, ExternalLink, HelpCircle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'donor-dash' | 'recip-dash' | 'admin'>('browse');
  const { setIsSafetyModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Food Safety & Limitations Banner */}
      <SafetyBanner />

      {/* Main Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'browse' && <BrowseView />}
        {activeTab === 'donor-dash' && <DonorDashboardView />}
        {activeTab === 'recip-dash' && <RecipientDashboardView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Global Modals */}
      <SafetyModal />
      <CreateListingModal />
      <ProfileModal />
      <DonationReceiptModal />
      <ToastContainer />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Utensils className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 font-display">NourishShare Platform</span>
            <span>• Problem ID: HACK-P197 • Food &amp; Restaurant Prototype</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Food Safety Limitations &amp; Good Samaritan Act</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">Demo Mock Addresses Applied</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;

