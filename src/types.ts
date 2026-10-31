export type UserRole = 'donor' | 'recipient' | 'admin';

export type FoodCategory =
  | 'Cooked Meals'
  | 'Bakery & Pastries'
  | 'Fresh Produce'
  | 'Dairy & Chilled'
  | 'Packaged & Canned'
  | 'Beverages';

export type StorageCondition =
  | 'Ambient / Room Temp'
  | 'Refrigerated (< 4°C)'
  | 'Frozen (< -18°C)'
  | 'Hot Held (> 60°C)';

export type PackagingCondition =
  | 'Sealed Food Containers'
  | 'Insulated Catering Boxes'
  | 'Original Commercial Packaging'
  | 'Individually Wrapped Portion Boxes';

export type ListingStatus =
  | 'AVAILABLE'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  organizationType: string;
  address: string;
  city: string;
  zipCode: string;
  verified: boolean;
  avatar: string;
  description?: string;
  foodSafetyCertNumber?: string;
  charityRegistrationNumber?: string;
  capacityServingsPerDay?: number;
  dietaryPreferences?: string[];
  refrigeratedStorageAvailable?: boolean;
  operatingHours?: string;
}

export interface FoodListing {
  id: string;
  title: string;
  donorId: string;
  donorName: string;
  donorType: string;
  donorPhone: string;
  category: FoodCategory;
  description: string;
  quantity: number;
  unit: string;
  estimatedServings: number;
  dietaryTags: string[];
  allergens: string[];
  storageCondition: StorageCondition;
  packagingCondition: PackagingCondition;
  
  // Timing & Expiry Guidance
  preparationTime: string; // ISO string
  useByTime: string; // ISO string
  pickupWindowStart: string; // ISO string
  pickupWindowEnd: string; // ISO string
  
  // Pickup Details
  pickupAddress: string;
  pickupInstructions: string;
  landmark: string;
  
  // Safety confirmation
  foodSafetyConfirmed: boolean;
  temperatureAtListing?: string;
  
  // Workflow state
  status: ListingStatus;
  
  // Reservation info
  recipientId?: string;
  recipientName?: string;
  requestedQuantity?: number;
  requestNotes?: string;
  requestedAt?: string;
  acceptedAt?: string;
  rejectedReason?: string;
  cancelledReason?: string;
  cancelledBy?: UserRole;
  
  // Pickup confirmation & Handover
  pickupVerificationCode?: string; // 6-digit PIN e.g. "492-108"
  completedAt?: string;
  handoverNotes?: string;
  handoverTempChecked?: boolean;
  recipientFeedbackRating?: number;
  
  // Moderation
  flaggedForModeration?: boolean;
  flagReason?: string;
  flaggedAt?: string;
  
  createdAt: string;
  imageUrl: string;
}

export interface UserReport {
  id: string;
  listingId?: string;
  listingTitle?: string;
  reportedEntityName: string;
  reportedEntityType: 'listing' | 'donor' | 'recipient';
  reporterName: string;
  reporterRole: UserRole;
  reason: string;
  details: string;
  status: 'PENDING_REVIEW' | 'RESOLVED_REMOVED' | 'RESOLVED_DISMISSED' | 'WARNING_ISSUED';
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ImpactStats {
  totalListingsCreated: number;
  totalDonationsCompleted: number;
  totalMealsServed: number;
  totalKgRescued: number;
  co2SavedKg: number;
  activeRecipients: number;
  activeDonors: number;
  safetyComplianceRate: number; // percentage, e.g. 99.4%
}

