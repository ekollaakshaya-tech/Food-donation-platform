import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodListing, UserProfile, UserReport, ImpactStats, UserRole } from '../types';
import { api } from '../services/api';
import { SAMPLE_USERS, INITIAL_STATS } from '../mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  users: UserProfile[];
  listings: FoodListing[];
  reports: UserReport[];
  stats: ImpactStats;
  loading: boolean;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Food Listing Actions
  refreshData: () => Promise<void>;
  createListing: (data: Partial<FoodListing>) => Promise<FoodListing>;
  requestListing: (listingId: string, requestedQuantity: number, notes: string) => Promise<FoodListing>;
  acceptRequest: (listingId: string) => Promise<FoodListing>;
  rejectRequest: (listingId: string, reason: string) => Promise<FoodListing>;
  cancelListing: (listingId: string, reason: string) => Promise<FoodListing>;
  confirmPickup: (listingId: string, pin: string, notes?: string, tempChecked?: boolean, rating?: number) => Promise<FoodListing>;
  flagListing: (listingId: string, reason: string) => Promise<FoodListing>;
  deleteListing: (listingId: string) => Promise<boolean>;
  
  // Moderation & Profile
  updateReportStatus: (reportId: string, status: string, notes?: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  resetToSeedData: () => Promise<void>;

  // Global modals
  isSafetyModalOpen: boolean;
  setIsSafetyModalOpen: (open: boolean) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  selectedReceiptListing: FoodListing | null;
  setSelectedReceiptListing: (listing: FoodListing | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(SAMPLE_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(SAMPLE_USERS[0]); // default to Donor-1
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [stats, setStats] = useState<ImpactStats>(INITIAL_STATS);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedReceiptListing, setSelectedReceiptListing] = useState<FoodListing | null>(null);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [fetchedListings, fetchedUsers, fetchedReports, fetchedStats] = await Promise.all([
        api.getListings(),
        api.getUsers(),
        api.getReports(),
        api.getStats(),
      ]);
      setListings(fetchedListings);
      setUsers(fetchedUsers);
      setReports(fetchedReports);
      setStats(fetchedStats);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const switchRole = (role: UserRole) => {
    const candidate = users.find(u => u.role === role);
    if (candidate) {
      setCurrentUser(candidate);
      addToast('info', 'Switched Persona', `Now operating as ${candidate.name} (${role.toUpperCase()})`);
    }
  };

  // Listings Workflow
  const createListing = async (data: Partial<FoodListing>) => {
    try {
      const newListing = await api.createListing({
        ...data,
        donorId: currentUser.id,
        donorName: currentUser.name,
        donorType: currentUser.organizationType,
        donorPhone: currentUser.phone,
      });
      await refreshData();
      addToast('success', 'Listing Created!', `"${newListing.title}" is now published and available to recipient organizations.`);
      return newListing;
    } catch (e: any) {
      addToast('error', 'Creation Failed', e.message || 'Could not publish listing.');
      throw e;
    }
  };

  const requestListing = async (listingId: string, requestedQuantity: number, notes: string) => {
    try {
      const updated = await api.requestListing(
        listingId,
        currentUser.id,
        currentUser.name,
        requestedQuantity,
        notes
      );
      await refreshData();
      addToast('success', 'Reservation Requested', 'Request dispatched to donor. You will receive a pickup verification PIN once accepted.');
      return updated;
    } catch (e: any) {
      addToast('error', 'Request Failed', e.message || 'Could not request listing.');
      throw e;
    }
  };

  const acceptRequest = async (listingId: string) => {
    try {
      const updated = await api.acceptRequest(listingId);
      await refreshData();
      addToast('success', 'Request Accepted!', `Reservation confirmed. Verification PIN generated: ${updated.pickupVerificationCode}`);
      return updated;
    } catch (e: any) {
      addToast('error', 'Accept Failed', e.message);
      throw e;
    }
  };

  const rejectRequest = async (listingId: string, reason: string) => {
    try {
      const updated = await api.rejectRequest(listingId, reason);
      await refreshData();
      addToast('warning', 'Request Rejected', 'The reservation request was rejected and recipient notified.');
      return updated;
    } catch (e: any) {
      addToast('error', 'Reject Failed', e.message);
      throw e;
    }
  };

  const cancelListing = async (listingId: string, reason: string) => {
    try {
      const updated = await api.cancelListing(listingId, reason, currentUser.role);
      await refreshData();
      addToast('info', 'Donation Cancelled', 'The donation status has been updated to Cancelled.');
      return updated;
    } catch (e: any) {
      addToast('error', 'Cancellation Failed', e.message);
      throw e;
    }
  };

  const confirmPickup = async (
    listingId: string,
    pin: string,
    notes?: string,
    tempChecked?: boolean,
    rating?: number
  ) => {
    try {
      const updated = await api.confirmPickup(listingId, pin, notes, tempChecked, rating);
      await refreshData();
      addToast('success', 'Pickup Confirmed! 🎉', `Food handover completed successfully! ${updated.estimatedServings} meals redistributed to the community.`);
      return updated;
    } catch (e: any) {
      addToast('error', 'Verification Failed', e.message || 'Invalid verification PIN or confirmation error.');
      throw e;
    }
  };

  const flagListing = async (listingId: string, reason: string) => {
    try {
      const updated = await api.flagListing(listingId, reason, currentUser.name, currentUser.role);
      await refreshData();
      addToast('warning', 'Listing Reported', 'Thank you. Our Food Safety Admin has been alerted to review this listing.');
      return updated;
    } catch (e: any) {
      addToast('error', 'Report Failed', e.message);
      throw e;
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      await api.deleteListing(listingId);
      await refreshData();
      addToast('info', 'Listing Removed', 'The food listing has been permanently deleted.');
      return true;
    } catch (e: any) {
      addToast('error', 'Delete Failed', e.message);
      throw e;
    }
  };

  const updateReportStatus = async (reportId: string, status: string, notes?: string) => {
    try {
      await api.updateReport(reportId, status, notes);
      await refreshData();
      addToast('success', 'Report Updated', `Report action set to: ${status}`);
    } catch (e: any) {
      addToast('error', 'Report Update Failed', e.message);
      throw e;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const updated = await api.updateUser(currentUser.id, data);
      setCurrentUser(updated);
      await refreshData();
      addToast('success', 'Profile Updated', 'Organization details saved.');
    } catch (e: any) {
      addToast('error', 'Profile Update Failed', e.message);
      throw e;
    }
  };

  const resetToSeedData = async () => {
    try {
      await api.resetData();
      await refreshData();
      setCurrentUser(SAMPLE_USERS[0]);
      addToast('info', 'Reset Complete', 'Prototype data restored to initial realistic seed state.');
    } catch (e: any) {
      addToast('error', 'Reset Failed', e.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        listings,
        reports,
        stats,
        loading,
        toasts,
        addToast,
        removeToast,
        refreshData,
        createListing,
        requestListing,
        acceptRequest,
        rejectRequest,
        cancelListing,
        confirmPickup,
        flagListing,
        deleteListing,
        updateReportStatus,
        updateProfile,
        resetToSeedData,
        isSafetyModalOpen,
        setIsSafetyModalOpen,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        selectedReceiptListing,
        setSelectedReceiptListing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

