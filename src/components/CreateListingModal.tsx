import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCategory, StorageCondition, PackagingCondition } from '../types';
import {
  X,
  PlusCircle,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Thermometer,
  MapPin,
  Package,
  Sparkles,
  Info
} from 'lucide-react';

export const CreateListingModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, createListing, currentUser } = useApp();

  const now = new Date();
  const formatForInput = (d: Date) => d.toISOString().slice(0, 16);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(20);
  const [unit, setUnit] = useState<string>('servings');
  const [estimatedServings, setEstimatedServings] = useState<number>(20);
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('Hot Held (> 60°C)');
  const [packagingCondition, setPackagingCondition] = useState<PackagingCondition>('Individually Wrapped Portion Boxes');
  const [temperatureAtListing, setTemperatureAtListing] = useState('65°C hot holding confirmed');
  
  // Timing
  const [preparationTime, setPreparationTime] = useState(formatForInput(now));
  const [useByTime, setUseByTime] = useState(formatForInput(new Date(now.getTime() + 5 * 3600 * 1000)));
  const [pickupStart, setPickupStart] = useState(formatForInput(new Date(now.getTime() + 30 * 60 * 1000)));
  const [pickupEnd, setPickupEnd] = useState(formatForInput(new Date(now.getTime() + 4 * 3600 * 1000)));

  // Location
  const [pickupAddress, setPickupAddress] = useState(currentUser.address || '400 Grand Ballroom Way, Rear Dock 3 (Demo Address)');
  const [landmark, setLandmark] = useState('Next to West Parking Garage Gate');
  const [pickupInstructions, setPickupInstructions] = useState('Ring buzzer at loading bay door 3, ask for duty chef.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');

  // Dietary tags & allergens
  const [dietaryTags, setDietaryTags] = useState<string[]>(['Vegetarian']);
  const [allergens, setAllergens] = useState<string[]>(['Nut-Free Kitchen']);

  // Mandatory Safety Compliance Attestations
  const [attestations, setAttestations] = useState({
    hygiene: false,
    temperature: false,
    allergens: false,
    packaging: false,
  });

  const [submitting, setSubmitting] = useState(false);

  if (!isCreateModalOpen) return null;

  const allAttested = attestations.hygiene && attestations.temperature && attestations.allergens && attestations.packaging;

  const handleDietaryToggle = (tag: string) => {
    setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleAllergenToggle = (allergen: string) => {
    setAllergens(prev => prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAttested) {
      alert('You must accept all mandatory food safety attestations to publish this surplus food listing.');
      return;
    }

    if (new Date(pickupEnd) <= new Date(pickupStart)) {
      alert('Pickup Window End time must be later than Start time.');
      return;
    }

    setSubmitting(true);
    try {
      await createListing({
        title,
        category,
        description,
        quantity: Number(quantity),
        unit,
        estimatedServings: Number(estimatedServings),
        storageCondition,
        packagingCondition,
        temperatureAtListing,
        preparationTime: new Date(preparationTime).toISOString(),
        useByTime: new Date(useByTime).toISOString(),
        pickupWindowStart: new Date(pickupStart).toISOString(),
        pickupWindowEnd: new Date(pickupEnd).toISOString(),
        pickupAddress,
        landmark,
        pickupInstructions,
        imageUrl,
        dietaryTags,
        allergens,
        foodSafetyConfirmed: true,
      });
      setIsCreateModalOpen(false);
      // reset form
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">Create Food Donation Listing</h2>
              <p className="text-emerald-100 text-xs mt-0.5">
                Posting as: <span className="font-semibold">{currentUser.name}</span> ({currentUser.organizationType})
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Section 1: Food Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
              <Package className="w-4 h-4 text-emerald-600" />
              1. Surplus Food Details
            </h3>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 30 Boxed Lunches: Roasted Mediterranean Vegetable Rice Bowls"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Food Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white"
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Bakery & Pastries">Bakery & Pastries</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Dairy & Chilled">Dairy & Chilled</option>
                  <option value="Packaged & Canned">Packaged & Canned</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Storage Condition *
                </label>
                <select
                  value={storageCondition}
                  onChange={e => setStorageCondition(e.target.value as StorageCondition)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white"
                >
                  <option value="Hot Held (> 60°C)">Hot Held (&gt; 60°C)</option>
                  <option value="Refrigerated (< 4°C)">Refrigerated (&lt; 4°C)</option>
                  <option value="Ambient / Room Temp">Ambient / Room Temp</option>
                  <option value="Frozen (< -18°C)">Frozen (&lt; -18°C)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setQuantity(val);
                    setEstimatedServings(val);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Unit *</label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="servings">servings</option>
                  <option value="boxes">boxes</option>
                  <option value="trays">trays</option>
                  <option value="kg">kg</option>
                  <option value="loaves">loaves</option>
                  <option value="liters">liters</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Est. Feeds</label>
                <input
                  type="number"
                  min="1"
                  value={estimatedServings}
                  onChange={e => setEstimatedServings(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Description & Ingredients
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe preparation, ingredients, batch state, packaging..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Dietary Tags Checkboxes */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Dietary Labels</label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Nut-Free', 'Dairy-Free'].map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleDietaryToggle(tag)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      dietaryTags.includes(tag)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Timing, Expiry & Safety Temperatures */}
          <div className="space-y-4 pt-2">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
              <Thermometer className="w-4 h-4 text-amber-600" />
              2. Safety Timings & Holding Temperature
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Preparation / Cooked Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={preparationTime}
                  onChange={e => setPreparationTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Use-By / Expiry Guidance *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={useByTime}
                  onChange={e => setUseByTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pickup Window Start *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={pickupStart}
                  onChange={e => setPickupStart(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pickup Window End (Hard Deadline) *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={pickupEnd}
                  onChange={e => setPickupEnd(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Current Temperature Log / Verification *
              </label>
              <input
                type="text"
                required
                value={temperatureAtListing}
                onChange={e => setTemperatureAtListing(e.target.value)}
                placeholder="e.g. 68°C Hot Holding Verified or 3.4°C Chilled"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          {/* Section 3: Pickup Location (Demo Mock Privacy) */}
          <div className="space-y-4 pt-2">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              3. Pickup Logistics (Demo Address)
            </h3>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Pickup Address (Demo / Mock Tagged) *
              </label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={e => setPickupAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  placeholder="e.g. Adjacent to West Parking Gate"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pickup Instructions</label>
                <input
                  type="text"
                  value={pickupInstructions}
                  onChange={e => setPickupInstructions(e.target.value)}
                  placeholder="e.g. Buzzer 3, ask for Chef Marcus"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 4: MANDATORY Food Safety Compliance Attestation */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h4>Mandatory Food Safety Attestation Checklist</h4>
            </div>
            <p className="text-xs text-amber-800">
              In compliance with local food safety statutes and the Bill Emerson Good Samaritan Act, you must confirm each item before this listing can be published:
            </p>

            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attestations.hygiene}
                  onChange={e => setAttestations({ ...attestations, hygiene: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="text-xs text-slate-700 font-medium">
                  <strong>Hygienic Commercial Preparation:</strong> I certify this food was prepared in a licensed, inspected kitchen following sanitary protocols.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attestations.temperature}
                  onChange={e => setAttestations({ ...attestations, temperature: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="text-xs text-slate-700 font-medium">
                  <strong>Temperature Danger Zone Control:</strong> I verify that hot foods have been held above 60°C (140°F) or cold foods below 4°C (40°F) in compliance with the 2-Hour rule.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attestations.allergens}
                  onChange={e => setAttestations({ ...attestations, allergens: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="text-xs text-slate-700 font-medium">
                  <strong>Accurate Labeling & Expiry:</strong> All preparation timestamps, allergens, and use-by safety guidance are true and accurate to the best of our knowledge.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attestations.packaging}
                  onChange={e => setAttestations({ ...attestations, packaging: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="text-xs text-slate-700 font-medium">
                  <strong>Tamper-Evident Packaging:</strong> Food is packaged in clean, food-grade containers and has not been served on an open public self-service buffet.
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!allAttested || submitting}
              className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center gap-2 ${
                allAttested && !submitting
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish Food Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

