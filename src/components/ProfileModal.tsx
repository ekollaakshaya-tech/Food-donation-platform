import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Save,
  Clock,
  ThermometerSnowflake
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, currentUser, updateProfile } = useApp();

  if (!isProfileModalOpen) return null;

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [city, setCity] = useState(currentUser.city);
  const [organizationType, setOrganizationType] = useState(currentUser.organizationType);
  const [description, setDescription] = useState(currentUser.description || '');
  const [operatingHours, setOperatingHours] = useState(currentUser.operatingHours || 'Mon-Fri 08:00 AM - 06:00 PM');
  const [foodSafetyCert, setFoodSafetyCert] = useState(currentUser.foodSafetyCertNumber || 'FS-89210-METRO');
  const [charityReg, setCharityReg] = useState(currentUser.charityRegistrationNumber || '501C3-9932-DEMO');
  const [capacity, setCapacity] = useState(currentUser.capacityServingsPerDay || 150);
  const [refrigeratedStorage, setRefrigeratedStorage] = useState(currentUser.refrigeratedStorageAvailable ?? true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile({
        name,
        email,
        phone,
        address,
        city,
        organizationType,
        description,
        operatingHours,
        foodSafetyCertNumber: foodSafetyCert,
        charityRegistrationNumber: charityReg,
        capacityServingsPerDay: Number(capacity),
        refrigeratedStorageAvailable: refrigeratedStorage,
      });
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display">{currentUser.name}</h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">{currentUser.organizationType}</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Organization Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Organization Category *</label>
              <input
                type="text"
                required
                value={organizationType}
                onChange={e => setOrganizationType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Contact Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone Number (Demo Mock) *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Facility Address (Demo Tagged) *</label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={operatingHours}
                onChange={e => setOperatingHours(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Mission / Community Profile</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
            />
          </div>

          {/* Role specific certifications */}
          {currentUser.role === 'donor' && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <label className="block font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Food Safety Inspection Certificate Number
              </label>
              <input
                type="text"
                value={foodSafetyCert}
                onChange={e => setFoodSafetyCert(e.target.value)}
                placeholder="e.g. FS-98421-METRO"
                className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 text-slate-900 bg-white"
              />
              <p className="text-[11px] text-emerald-700 mt-1">
                Used to verify compliant handling in commercial or institutional kitchens.
              </p>
            </div>
          )}

          {currentUser.role === 'recipient' && (
            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 space-y-3">
              <div>
                <label className="block font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Non-Profit Charity Registration Number (501c3)
                </label>
                <input
                  type="text"
                  value={charityReg}
                  onChange={e => setCharityReg(e.target.value)}
                  placeholder="e.g. 501C3-9932-HOPE"
                  className="w-full px-3.5 py-2 rounded-xl border border-blue-300 text-slate-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Serving Capacity (meals/day)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="refrig-check"
                    checked={refrigeratedStorage}
                    onChange={e => setRefrigeratedStorage(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="refrig-check" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Equipped with Cold Storage
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

