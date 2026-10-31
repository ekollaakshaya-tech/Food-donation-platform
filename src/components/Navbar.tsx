import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Utensils,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  User,
  ChevronDown,
  Building2,
  HeartHandshake,
  CheckCircle2,
  LayoutDashboard,
  Search,
  SlidersHorizontal,
  LogOut,
  AlertOctagon
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'browse' | 'donor-dash' | 'recip-dash' | 'admin';
  setActiveTab: (tab: 'browse' | 'donor-dash' | 'recip-dash' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    switchRole,
    setIsCreateModalOpen,
    setIsProfileModalOpen,
    setIsSafetyModalOpen,
    resetToSeedData,
    reports,
    listings
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  // Pending counts
  const pendingRequestsCount = listings.filter(l => l.status === 'REQUESTED').length;
  const pendingReportsCount = reports.filter(r => r.status === 'PENDING_REVIEW').length;
  const flaggedListingsCount = listings.filter(l => l.flaggedForModeration).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('browse')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg text-slate-900 tracking-tight">NourishShare</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Prototype
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 -mt-0.5">Surplus Food Redistribution Network</p>
              </div>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'browse'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Browse Food</span>
            </button>

            <button
              onClick={() => {
                switchRole('donor');
                setActiveTab('donor-dash');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === 'donor-dash'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Donor Hub</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                switchRole('recipient');
                setActiveTab('recip-dash');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'recip-dash'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Recipient Hub</span>
            </button>

            <button
              onClick={() => {
                switchRole('admin');
                setActiveTab('admin');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === 'admin'
                  ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Moderation</span>
              {(pendingReportsCount > 0 || flaggedListingsCount > 0) && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {pendingReportsCount + flaggedListingsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Quick Create Listing Button for Donors */}
            <button
              onClick={() => {
                if (currentUser.role !== 'donor') {
                  switchRole('donor');
                }
                setIsCreateModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Donate Food</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo listings, reports, and reservations back to the initial realistic seed state?')) {
                  resetToSeedData();
                }
              }}
              title="Reset Prototype to Seed State"
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                />
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    {currentUser.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-700 block">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Switcher Dropdown Menu */}
              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2.5 mb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Switch Test Persona</p>
                      <p className="text-[11px] text-slate-500">Simulate different stakeholder perspectives</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsPersonaMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      Edit Profile
                    </button>
                  </div>

                  {/* Role Selector Pills */}
                  <div className="grid grid-cols-3 gap-1 mb-3 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => {
                        switchRole('donor');
                        setActiveTab('donor-dash');
                      }}
                      className={`text-[11px] py-1.5 rounded-lg font-semibold capitalize transition-all ${
                        currentUser.role === 'donor'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Donor
                    </button>
                    <button
                      onClick={() => {
                        switchRole('recipient');
                        setActiveTab('recip-dash');
                      }}
                      className={`text-[11px] py-1.5 rounded-lg font-semibold capitalize transition-all ${
                        currentUser.role === 'recipient'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Recipient
                    </button>
                    <button
                      onClick={() => {
                        switchRole('admin');
                        setActiveTab('admin');
                      }}
                      className={`text-[11px] py-1.5 rounded-lg font-semibold capitalize transition-all ${
                        currentUser.role === 'admin'
                          ? 'bg-white text-purple-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Admin
                    </button>
                  </div>

                  {/* List of Registered Accounts */}
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Available Organizations
                    </p>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setIsPersonaMenuOpen(false);
                          if (u.role === 'donor') setActiveTab('donor-dash');
                          else if (u.role === 'recipient') setActiveTab('recip-dash');
                          else if (u.role === 'admin') setActiveTab('admin');
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                          currentUser.id === u.id
                            ? 'bg-emerald-50/80 border border-emerald-200'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {u.organizationType} • <span className="capitalize">{u.role}</span>
                          </p>
                        </div>
                        {currentUser.id === u.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <button
                      onClick={() => {
                        setIsPersonaMenuOpen(false);
                        setIsSafetyModalOpen(true);
                      }}
                      className="hover:text-emerald-700 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Safety Rules</span>
                    </button>
                    <span className="text-[10px] text-slate-400">Demo User Mode</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium ${
              activeTab === 'browse' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse</span>
          </button>
          <button
            onClick={() => {
              switchRole('donor');
              setActiveTab('donor-dash');
            }}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium ${
              activeTab === 'donor-dash' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Donor</span>
          </button>
          <button
            onClick={() => {
              switchRole('recipient');
              setActiveTab('recip-dash');
            }}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium ${
              activeTab === 'recip-dash' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Recipient</span>
          </button>
          <button
            onClick={() => {
              switchRole('admin');
              setActiveTab('admin');
            }}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium ${
              activeTab === 'admin' ? 'text-purple-700 bg-purple-50' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

