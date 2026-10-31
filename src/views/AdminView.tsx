import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodListing, UserReport } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Eye,
  RotateCcw,
  Clock,
  User,
  Building2,
  FileText,
  AlertOctagon,
  Scale
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    listings,
    reports,
    stats,
    updateReportStatus,
    deleteListing,
    flagListing,
    resetToSeedData,
    addToast
  } = useApp();

  const [adminNoteInput, setAdminNoteInput] = useState<{ [key: string]: string }>({});

  const flaggedListings = listings.filter(l => l.flaggedForModeration);
  const pendingReports = reports.filter(r => r.status === 'PENDING_REVIEW');
  const resolvedReports = reports.filter(r => r.status !== 'PENDING_REVIEW');

  const handleRemoveListing = async (listingId: string, reportId?: string) => {
    if (window.confirm('Are you sure you want to permanently remove this food listing from the platform?')) {
      await deleteListing(listingId);
      if (reportId) {
        await updateReportStatus(reportId, 'RESOLVED_REMOVED', adminNoteInput[reportId] || 'Listing removed due to safety non-compliance.');
      }
    }
  };

  const handleDismissFlag = async (listing: FoodListing) => {
    listing.flaggedForModeration = false;
    listing.flagReason = undefined;
    addToast('info', 'Flag Cleared', `Listing "${listing.title}" flag has been dismissed.`);
  };

  const handleResolveReport = async (reportId: string, status: string) => {
    const note = adminNoteInput[reportId] || 'Reviewed and actioned by Platform Safety Administrator.';
    await updateReportStatus(reportId, status, note);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-purple-300 border border-white/15 shrink-0">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display">
                Admin Content & Food Safety Moderation
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white">
                Supervisor
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-1 max-w-xl">
              Inspect reported items, enforce 2h/4h temperature holding limits, moderate user incident reports, and maintain platform integrity.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset prototype listings and reports to default seed data?')) {
              resetToSeedData();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Sample Seed Data</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Flagged Listings</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-display ${flaggedListings.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {flaggedListings.length}
            </span>
            <span className="text-xs text-rose-600 font-semibold">Immediate Review</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Open Incident Reports</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-display ${pendingReports.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingReports.length}
            </span>
            <span className="text-xs text-amber-600 font-semibold">Pending Audit</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Safety Compliance Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-emerald-600">
              {stats.safetyComplianceRate}%
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Standard Maintained</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block">Total Managed Entities</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-slate-900">
              {stats.activeDonors + stats.activeRecipients}
            </span>
            <span className="text-xs text-slate-500 font-medium">Donors & Charities</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: FLAGGED LISTINGS QUEUE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold font-display text-slate-900">
              Listing Moderation Queue ({flaggedListings.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Listings flagged by community or automated safety checks</span>
        </div>

        {flaggedListings.length > 0 ? (
          <div className="space-y-3">
            {flaggedListings.map(listing => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border-2 border-rose-300 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                        Flagged
                      </span>
                      <span className="text-xs text-slate-500 font-mono">#{listing.id}</span>
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900 mt-1">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Donor: <strong>{listing.donorName}</strong> • {listing.quantity} {listing.unit}
                    </p>
                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 mt-2 text-xs text-rose-900">
                      <strong>Flag Reason:</strong> {listing.flagReason || 'Potential safety non-compliance'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
                  <button
                    onClick={() => handleDismissFlag(listing)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Dismiss Flag
                  </button>
                  <button
                    onClick={() => handleRemoveListing(listing.id)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Listing</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
            No flagged listings requiring action right now. All active food listings comply with platform standards.
          </div>
        )}
      </div>

      {/* SECTION 2: USER INCIDENT REPORTS */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold font-display text-slate-900">
              User Incident & Food Safety Reports ({reports.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Filed by charitable recipients and volunteer drivers</span>
        </div>

        <div className="space-y-3">
          {reports.map(rep => {
            const isPending = rep.status === 'PENDING_REVIEW';
            return (
              <div
                key={rep.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm space-y-3 ${
                  isPending ? 'border-amber-300' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isPending ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {rep.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {rep.reason}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">#{rep.id}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                      Report against: <span className="text-indigo-900">{rep.reportedEntityName}</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {rep.details}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Reported by: <strong>{rep.reporterName}</strong> ({rep.reporterRole}) • {new Date(rep.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Admin Audit Notes & Controls */}
                {isPending ? (
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Add supervisor audit note..."
                      value={adminNoteInput[rep.id] || ''}
                      onChange={e => setAdminNoteInput({ ...adminNoteInput, [rep.id]: e.target.value })}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 flex-1"
                    />

                    <div className="flex items-center gap-2">
                      {rep.listingId && (
                        <button
                          onClick={() => handleRemoveListing(rep.listingId!, rep.id)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Remove Listing & Resolve
                        </button>
                      )}
                      <button
                        onClick={() => handleResolveReport(rep.id, 'WARNING_ISSUED')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Issue Warning
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'RESOLVED_DISMISSED')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200">
                    <p>
                      <strong>Resolution Note:</strong> {rep.adminNotes || 'Report addressed and logged.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: FOOD SAFETY AUDIT STREAM */}
      <div className="space-y-3 pt-6 border-t border-slate-200">
        <h2 className="text-lg font-bold font-display text-slate-900">
          Food Safety Compliance Audit Stream
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Grand Hyatt Banquet confirmed hot holding at 68°C for Listing #listing-101
            </span>
            <span className="text-slate-400">2h ago</span>
          </div>
          <div className="py-2.5 flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Green Valley Organic Market verified cold chain at 3.8°C for Listing #listing-103
            </span>
            <span className="text-slate-400">6h ago</span>
          </div>
          <div className="py-2.5 flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Hope Haven Shelter verified pickup handover PIN 852-319 for Listing #listing-112
            </span>
            <span className="text-slate-400">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
};

