import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { SAMPLE_LISTINGS, SAMPLE_USERS, SAMPLE_REPORTS, INITIAL_STATS } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend build if dist exists
app.use(express.static(path.join(__dirname, '../dist')));

// In-memory state initialized with rich seed data
let listings = JSON.parse(JSON.stringify(SAMPLE_LISTINGS));
let users = JSON.parse(JSON.stringify(SAMPLE_USERS));
let reports = JSON.parse(JSON.stringify(SAMPLE_REPORTS));
let stats = JSON.parse(JSON.stringify(INITIAL_STATS));

// Helper: recalculate dynamic stats
const recalculateStats = () => {
  const completed = listings.filter(l => l.status === 'COMPLETED');
  const totalMeals = completed.reduce((acc, curr) => acc + (curr.estimatedServings || curr.quantity || 0), 0) + 4800;
  const totalKg = completed.reduce((acc, curr) => acc + (curr.unit === 'kg' ? curr.quantity : (curr.quantity * 0.4)), 0) + 2100;
  
  stats = {
    ...stats,
    totalListingsCreated: listings.length + 136,
    totalDonationsCompleted: completed.length + 128,
    totalMealsServed: Math.round(totalMeals),
    totalKgRescued: Math.round(totalKg),
    co2SavedKg: Math.round(totalKg * 2.5),
    activeRecipients: users.filter(u => u.role === 'recipient').length + 14,
    activeDonors: users.filter(u => u.role === 'donor').length + 30,
    safetyComplianceRate: Number((((listings.filter(l => !l.flaggedForModeration).length) / listings.length) * 100).toFixed(1))
  };
};

// --- LISTINGS ENDPOINTS ---

// GET all listings (with optional query filters)
app.get('/api/listings', (req, res) => {
  const { category, status, donorId, recipientId, search } = req.query;
  let result = [...listings];

  if (category) {
    result = result.filter(l => l.category.toLowerCase() === category.toLowerCase());
  }
  if (status) {
    result = result.filter(l => l.status.toLowerCase() === status.toLowerCase());
  }
  if (donorId) {
    result = result.filter(l => l.donorId === donorId);
  }
  if (recipientId) {
    result = result.filter(l => l.recipientId === recipientId);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(l => 
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.dietaryTags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET single listing
app.get('/api/listings/:id', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, data: listing });
});

// POST create listing (Donors)
app.post('/api/listings', (req, res) => {
  const {
    title,
    donorId,
    donorName,
    donorType,
    donorPhone,
    category,
    description,
    quantity,
    unit,
    estimatedServings,
    dietaryTags,
    allergens,
    storageCondition,
    packagingCondition,
    preparationTime,
    useByTime,
    pickupWindowStart,
    pickupWindowEnd,
    pickupAddress,
    pickupInstructions,
    landmark,
    foodSafetyConfirmed,
    temperatureAtListing,
    imageUrl
  } = req.body;

  if (!title || !donorId || !quantity || !foodSafetyConfirmed) {
    return res.status(400).json({
      success: false,
      message: 'Missing required listing information or food safety confirmation.'
    });
  }

  const newListing = {
    id: `listing-${Date.now()}`,
    title,
    donorId,
    donorName: donorName || 'Verified Donor',
    donorType: donorType || 'Restaurant',
    donorPhone: donorPhone || '+1 (555) 019-0000',
    category: category || 'Cooked Meals',
    description,
    quantity: Number(quantity),
    unit: unit || 'servings',
    estimatedServings: Number(estimatedServings) || Number(quantity),
    dietaryTags: dietaryTags || [],
    allergens: allergens || [],
    storageCondition: storageCondition || 'Ambient / Room Temp',
    packagingCondition: packagingCondition || 'Sealed Food Containers',
    preparationTime: preparationTime || new Date().toISOString(),
    useByTime: useByTime || new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    pickupWindowStart: pickupWindowStart || new Date().toISOString(),
    pickupWindowEnd: pickupWindowEnd || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    pickupAddress: pickupAddress || '123 Market St, Suite 4 (Demo Address)',
    pickupInstructions: pickupInstructions || 'Call upon arrival.',
    landmark: landmark || 'Near Main Gate',
    foodSafetyConfirmed: Boolean(foodSafetyConfirmed),
    temperatureAtListing: temperatureAtListing || 'Standard Safe Holding',
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
  };

  listings.unshift(newListing);
  recalculateStats();
  res.status(201).json({ success: true, data: newListing, message: 'Food listing published successfully!' });
});

// POST request / reserve listing (Recipient)
app.post('/api/listings/:id/request', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
  
  if (listing.status !== 'AVAILABLE') {
    return res.status(400).json({ success: false, message: `Listing is currently ${listing.status} and cannot be requested.` });
  }

  const { recipientId, recipientName, requestedQuantity, requestNotes } = req.body;
  if (!recipientId || !recipientName) {
    return res.status(400).json({ success: false, message: 'Recipient identity is required.' });
  }

  listing.status = 'REQUESTED';
  listing.recipientId = recipientId;
  listing.recipientName = recipientName;
  listing.requestedQuantity = Number(requestedQuantity) || listing.quantity;
  listing.requestNotes = requestNotes || '';
  listing.requestedAt = new Date().toISOString();

  recalculateStats();
  res.json({ success: true, data: listing, message: 'Reservation request sent to donor for review.' });
});

// POST accept request (Donor)
app.post('/api/listings/:id/accept', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

  if (listing.status !== 'REQUESTED') {
    return res.status(400).json({ success: false, message: 'Only requested listings can be accepted.' });
  }

  // Generate secure 6-digit pickup verification code
  const pin = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;

  listing.status = 'ACCEPTED';
  listing.acceptedAt = new Date().toISOString();
  listing.pickupVerificationCode = pin;

  recalculateStats();
  res.json({
    success: true,
    data: listing,
    message: `Request accepted! Pickup PIN ${pin} generated for recipient handover.`
  });
});

// POST reject request (Donor)
app.post('/api/listings/:id/reject', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

  const { reason } = req.body;
  listing.status = 'REJECTED';
  listing.rejectedReason = reason || 'Donor is unable to accommodate request at this time.';
  listing.rejectedAt = new Date().toISOString();

  recalculateStats();
  res.json({ success: true, data: listing, message: 'Request was rejected.' });
});

// POST cancel request or listing (Donor or Recipient)
app.post('/api/listings/:id/cancel', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

  const { reason, cancelledBy } = req.body;
  listing.status = 'CANCELLED';
  listing.cancelledReason = reason || 'Reservation was cancelled prior to pickup.';
  listing.cancelledBy = cancelledBy || 'recipient';
  listing.cancelledAt = new Date().toISOString();

  recalculateStats();
  res.json({ success: true, data: listing, message: 'Donation has been cancelled.' });
});

// POST confirm pickup & handover (Completion with Verification PIN)
app.post('/api/listings/:id/confirm-pickup', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

  if (listing.status !== 'ACCEPTED') {
    return res.status(400).json({ success: false, message: 'Only accepted donations can be confirmed for pickup.' });
  }

  const { enteredPin, handoverNotes, handoverTempChecked, recipientFeedbackRating } = req.body;

  // Optional PIN check (allow matching or master override for prototype demo)
  if (enteredPin && listing.pickupVerificationCode) {
    const cleanEntered = enteredPin.replace(/[^0-9]/g, '');
    const cleanActual = listing.pickupVerificationCode.replace(/[^0-9]/g, '');
    if (cleanEntered !== cleanActual && enteredPin !== '123456') {
      return res.status(400).json({
        success: false,
        message: 'Invalid pickup verification PIN. Please verify code with recipient or donor.'
      });
    }
  }

  listing.status = 'COMPLETED';
  listing.completedAt = new Date().toISOString();
  listing.handoverNotes = handoverNotes || 'Handover verified and food transferred safely.';
  listing.handoverTempChecked = Boolean(handoverTempChecked ?? true);
  if (recipientFeedbackRating) {
    listing.recipientFeedbackRating = Number(recipientFeedbackRating);
  }

  recalculateStats();
  res.json({
    success: true,
    data: listing,
    message: 'Pickup confirmed! Food donation successfully completed and added to history.'
  });
});

// POST flag listing for moderation (Admin or User)
app.post('/api/listings/:id/flag', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

  const { reason, reporterName, reporterRole } = req.body;
  listing.flaggedForModeration = true;
  listing.flagReason = reason || 'Reported for review';
  listing.flaggedAt = new Date().toISOString();

  // Also create a report in the reports queue
  const newReport = {
    id: `rep-${Date.now()}`,
    listingId: listing.id,
    listingTitle: listing.title,
    reportedEntityName: listing.donorName,
    reportedEntityType: 'listing',
    reporterName: reporterName || 'Community Member',
    reporterRole: reporterRole || 'recipient',
    reason: reason || 'Safety or Compliance Concern',
    details: `Listing "${listing.title}" was flagged for moderation review.`,
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString()
  };
  reports.unshift(newReport);

  recalculateStats();
  res.json({ success: true, data: listing, message: 'Listing flagged for admin review.' });
});

// DELETE listing (Admin or Donor)
app.delete('/api/listings/:id', (req, res) => {
  const index = listings.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Listing not found' });

  listings.splice(index, 1);
  recalculateStats();
  res.json({ success: true, message: 'Listing removed from platform.' });
});

// --- USER & ORGANIZATION PROFILES ---

app.get('/api/users', (req, res) => {
  const { role } = req.query;
  let result = [...users];
  if (role) result = result.filter(u => u.role === role);
  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  Object.assign(user, req.body);
  res.json({ success: true, data: user, message: 'Profile updated successfully.' });
});

app.post('/api/users', (req, res) => {
  const { name, role, email, organizationType, phone, address, city } = req.body;
  if (!name || !role || !email) {
    return res.status(400).json({ success: false, message: 'Name, role, and email are required.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    role,
    email,
    phone: phone || '+1 (555) 019-9988',
    organizationType: organizationType || (role === 'donor' ? 'Restaurant' : 'Shelter'),
    address: address || '100 Main St (Demo Address)',
    city: city || 'Metro City',
    zipCode: '90210',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: req.body.description || 'Dedicated organization community partner.',
    ...req.body
  };

  users.push(newUser);
  recalculateStats();
  res.status(201).json({ success: true, data: newUser, message: 'Organization profile registered!' });
});

// --- ADMIN & MODERATION REPORTS ---

app.get('/api/reports', (req, res) => {
  res.json({ success: true, count: reports.length, data: reports });
});

app.post('/api/reports', (req, res) => {
  const { listingId, listingTitle, reportedEntityName, reportedEntityType, reporterName, reporterRole, reason, details } = req.body;
  const newReport = {
    id: `rep-${Date.now()}`,
    listingId,
    listingTitle,
    reportedEntityName: reportedEntityName || 'Entity',
    reportedEntityType: reportedEntityType || 'listing',
    reporterName: reporterName || 'Anonymous User',
    reporterRole: reporterRole || 'recipient',
    reason: reason || 'Safety or Compliance Concern',
    details: details || '',
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString()
  };

  reports.unshift(newReport);
  res.status(201).json({ success: true, data: newReport, message: 'Report submitted for review.' });
});

app.put('/api/reports/:id', (req, res) => {
  const report = reports.find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

  const { status, adminNotes } = req.body;
  if (status) report.status = status;
  if (adminNotes) report.adminNotes = adminNotes;
  report.resolvedAt = new Date().toISOString();

  // If report resolved by removing listing, unlist or remove it
  if (status === 'RESOLVED_REMOVED' && report.listingId) {
    const listing = listings.find(l => l.id === report.listingId);
    if (listing) {
      listing.status = 'CANCELLED';
      listing.cancelledReason = `Removed by Admin Moderator: ${report.reason}`;
    }
  }

  res.json({ success: true, data: report, message: 'Report status updated.' });
});

// --- STATS & RESET ---

app.get('/api/stats', (req, res) => {
  recalculateStats();
  res.json({ success: true, data: stats });
});

app.post('/api/reset', (req, res) => {
  listings = JSON.parse(JSON.stringify(SAMPLE_LISTINGS));
  users = JSON.parse(JSON.stringify(SAMPLE_USERS));
  reports = JSON.parse(JSON.stringify(SAMPLE_REPORTS));
  stats = JSON.parse(JSON.stringify(INITIAL_STATS));
  recalculateStats();
  res.json({ success: true, message: 'Prototype data successfully reset to initial seed state.' });
});

// Wildcard fallback to serve index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Food Donation Platform running on http://localhost:${PORT}`);
});
