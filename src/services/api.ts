import { FoodListing, UserProfile, UserReport, ImpactStats } from '../types';
import { SAMPLE_LISTINGS, SAMPLE_USERS, SAMPLE_REPORTS, INITIAL_STATS } from '../mockData';

// API client that interacts with Express API if available, falling back to LocalStorage
const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api` 
  : '/api';

const isLocalStorageAvailable = () => typeof window !== 'undefined' && window.localStorage;

const getLocalData = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) return defaultValue;
  try {
    const item = localStorage.getItem(`nourish_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, value: T): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(`nourish_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
};

export const api = {
  async getListings(): Promise<FoodListing[]> {
    try {
      const res = await fetch(`${API_BASE}/listings`);
      if (res.ok) {
        const json = await res.json();
        setLocalData('listings', json.data);
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    return getLocalData('listings', SAMPLE_LISTINGS);
  },

  async createListing(listingData: Partial<FoodListing>): Promise<FoodListing> {
    try {
      const res = await fetch(`${API_BASE}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    const current = getLocalData('listings', SAMPLE_LISTINGS);
    const newListing: FoodListing = {
      ...(listingData as FoodListing),
      id: `listing-${Date.now()}`,
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
    };
    const updated = [newListing, ...current];
    setLocalData('listings', updated);
    return newListing;
  },

  async requestListing(listingId: string, recipientId: string, recipientName: string, requestedQuantity: number, requestNotes: string): Promise<FoodListing> {
    try {
      const res = await fetch(`${API_BASE}/listings/${listingId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId, recipientName, requestedQuantity, requestNotes }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    const current = getLocalData('listings', SAMPLE_LISTINGS);
    const listing = current.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');
    listing.status = 'REQUESTED';
    listing.recipientId = recipientId;
    listing.recipientName = recipientName;
    listing.requestedQuantity = requestedQuantity;
    listing.requestNotes = requestNotes;
    listing.requestedAt = new Date().toISOString();
    setLocalData('listings', [...current]);
    return listing;
  },

  async acceptRequest(listingId: string): Promise<FoodListing> {
    try {
      const res = await fetch(`${API_BASE}/listings/${listingId}/accept`, {
        method: 'POST',
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    const current = getLocalData('listings', SAMPLE_LISTINGS);
    const listing = current.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');
    const pin = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    listing.status = 'ACCEPTED';
    listing.acceptedAt = new Date().toISOString();
    listing.pickupVerificationCode = pin;
    setLocalData('listings', [...current]);
    return listing;
  },

  async rejectRequest(listingId: string, reason: string): Promise<FoodListing> {
    try {
      const res = await fetch(`${API_BASE}/listings/${listingId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    const current = getLocalData('listings', SAMPLE_LISTINGS);
    const listing = current.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');
    listing.status = 'REJECTED';
    listing.rejectedReason = reason;
    setLocalData('listings', [...current]);
    return listing;
  },

  async cancelListing(listingId: string, reason: string, cancelledBy: string): Promise<FoodListing> {
    try {
      const res = await fetch(`${API_BASE}/listings/${listingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, cancelledBy }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    const current = getLocalData('listings', SAMPLE_LISTINGS);
    const listing = current.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');
    listing.status = 'CANCELLED';
    listing.cancelledReason = reason;
    listing.cancelledBy = cancelledBy as any;
    setLocalData('listings', [...current]);
    return listing;
  },

  async confirmPickup(listingId: string, enteredPin: string, handoverNotes?: string, handoverTempChecked?: boolean, rating?: number): Promise<FoodListing> {
    try {
      const res = await fetch(`${API_BASE}/listings/${listingId}/confirm-pickup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enteredPin, handoverNotes, handoverTempChecked, recipientFeedbackRating: rating }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    const current = getLocalData('listings', SAMPLE_LISTINGS);
    const listing = current.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');
    listing.status = 'COMPLETED';
    listing.completedAt = new Date().toISOString();
    listing.handoverNotes = handoverNotes || 'Handover verified and food transferred safely.';
    listing.handoverTempChecked = handoverTempChecked ?? true;
    if (rating) listing.recipientFeedbackRating = rating;
    setLocalData('listings', [...current]);
    return listing;
  },

  async flagListing(listingId: string, reason: string, reporterName: string, reporterRole: string): Promise<FoodListing> {
    try {
      const res = await fetch(`${API_BASE}/listings/${listingId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, reporterName, reporterRole }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    const current = getLocalData('listings', SAMPLE_LISTINGS);
    const listing = current.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');
    listing.flaggedForModeration = true;
    listing.flagReason = reason;
    listing.flaggedAt = new Date().toISOString();
    setLocalData('listings', [...current]);
    return listing;
  },

  async deleteListing(listingId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/listings/${listingId}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      // fallback
    }
    const current = getLocalData('listings', SAMPLE_LISTINGS);
    setLocalData('listings', current.filter(l => l.id !== listingId));
    return true;
  },

  async getUsers(): Promise<UserProfile[]> {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const json = await res.json();
        setLocalData('users', json.data);
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    return getLocalData('users', SAMPLE_USERS);
  },

  async updateUser(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    const current = getLocalData('users', SAMPLE_USERS);
    const user = current.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    Object.assign(user, data);
    setLocalData('users', [...current]);
    return user;
  },

  async getReports(): Promise<UserReport[]> {
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (res.ok) {
        const json = await res.json();
        setLocalData('reports', json.data);
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    return getLocalData('reports', SAMPLE_REPORTS);
  },

  async updateReport(reportId: string, status: string, adminNotes?: string): Promise<UserReport> {
    try {
      const res = await fetch(`${API_BASE}/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    const current = getLocalData('reports', SAMPLE_REPORTS);
    const rep = current.find(r => r.id === reportId);
    if (!rep) throw new Error('Report not found');
    rep.status = status as any;
    if (adminNotes) rep.adminNotes = adminNotes;
    rep.resolvedAt = new Date().toISOString();
    setLocalData('reports', [...current]);
    return rep;
  },

  async getStats(): Promise<ImpactStats> {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_STATS;
  },

  async resetData(): Promise<void> {
    try {
      await fetch(`${API_BASE}/reset`, { method: 'POST' });
    } catch (e) {
      // fallback
    }
    if (isLocalStorageAvailable()) {
      localStorage.removeItem('nourish_listings');
      localStorage.removeItem('nourish_users');
      localStorage.removeItem('nourish_reports');
    }
  }
};

