import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Coins,
  DollarSign,
  FileCheck2,
  FileText,
  MapPin,
  Plus,
  Receipt,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tractor,
  Truck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HotelRequirement } from '../../types';

export const HotelDashboard: React.FC = () => {
  const {
    currentUser,
    hotelRequirements,
    contracts,
    postHotelRequirement,
    confirmContractDelivery,
    updateContractStage,
    language,
    t,
  } = useApp();

  const [showNewReqModal, setShowNewReqModal] = useState(false);
  const [newCrop, setNewCrop] = useState('Tomato (Hybrid)');
  const [newVariety, setNewVariety] = useState('Grade A Fresh Firm');
  const [newQualitySpec, setNewQualitySpec] = useState('Clean, zero chemical residue, uniform grading');
  const [newWeeklyKg, setNewWeeklyKg] = useState(500);
  const [newOfferedPrice, setNewOfferedPrice] = useState(26.0);
  const [newAdvancePercent, setNewAdvancePercent] = useState(40);
  const [newFrequency, setNewFrequency] = useState<'Daily' | 'Alternate Days' | 'Twice a Week' | 'Weekly'>('Daily');

  // Filter contracts for this hotel or show relevant ones
  const hotelContracts = contracts.filter((c) => c.hotelName.includes('Rameshwaram') || c.hotelId === currentUser.id);

  const totalContractedSpent = hotelContracts.reduce((acc, c) => acc + c.totalContractValue, 0);
  const totalAdvancesPaid = hotelContracts.reduce((acc, c) => acc + (c.advancePaid ? c.advanceAmount : 0), 0);

  // Estimated savings compared to wholesale APMC intermediaries (typically 14%)
  const estimatedSavings = Math.round(totalContractedSpent * 0.14);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await postHotelRequirement({
        hotelName: currentUser.hotelName || 'The Rameshwaram Cafe',
        contactPerson: currentUser.name,
        mobile: currentUser.mobile,
        locationArea: currentUser.location,
        crop: newCrop,
        cropKannada: newCrop === 'Tomato (Hybrid)' ? 'ಟೊಮೆಟೊ (ಹೈಬ್ರಿಡ್)' : newCrop,
        variety: newVariety,
        qualitySpec: newQualitySpec,
        weeklyQuantityKg: newWeeklyKg,
        offeredPricePerKg: newOfferedPrice,
        advanceFundingOfferedPercent: newAdvancePercent,
        deliveryFrequency: newFrequency,
        startDate: '2026-11-10',
        endDate: '2026-12-31',
      });
      setShowNewReqModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <Store className="w-4 h-4 text-amber-300" />
              <span>Commercial HoReCa Procurement Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {currentUser.hotelName || 'The Rameshwaram Cafe'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{currentUser.location}</span>
              <span className="opacity-40">•</span>
              <span>Farm-to-Fork Direct Sourcing Program</span>
            </p>
          </div>

          <button
            onClick={() => setShowNewReqModal(true)}
            className="self-start md:self-auto px-4 py-2.5 bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-amber-700" />
            <span>Publish New Weekly Requirement</span>
          </button>
        </div>
      </div>

      {/* Procurement Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Active Crop Contracts</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{hotelContracts.length} Contracts</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
            With 4 Verified Local Growers
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Total Procurement Value</span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            ₹{totalContractedSpent.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">Guaranteed fixed prices</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Cultivation Advances Funded</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ₹{totalAdvancesPaid.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            Held in Escrow Payouts
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Intermediary Cost Savings</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            ₹{estimatedSavings.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
            Saved 14% vs APMC Middlemen
          </span>
        </div>
      </div>

      {/* Hotel's Published Requirements */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <span>Our Weekly Vegetable Procurement Schedule</span>
            </h2>
            <p className="text-xs text-gray-500">
              Published weekly volumes open for local Kolar / Bangalore Rural farmers to bid and fulfill
            </p>
          </div>
          <button
            onClick={() => setShowNewReqModal(true)}
            className="text-xs font-bold text-[#176B3A] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Crop</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAF8] border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-3">Crop Required</th>
                <th className="py-3 px-3">Weekly Target Qty</th>
                <th className="py-3 px-3">Offered Price</th>
                <th className="py-3 px-3">Advance Capital</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3">Fulfillment Status</th>
                <th className="py-3 px-3">Specification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hotelRequirements
                .filter((r) => r.hotelName.includes('Rameshwaram') || r.hotelId === currentUser.id)
                .map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="py-3.5 px-3 font-bold text-gray-900">{req.crop}</td>
                    <td className="py-3.5 px-3 font-semibold text-gray-800">{req.weeklyQuantityKg} kg/wk</td>
                    <td className="py-3.5 px-3 font-black text-emerald-800 text-sm">₹{req.offeredPricePerKg}/kg</td>
                    <td className="py-3.5 px-3 text-emerald-700 font-bold">{req.advanceFundingOfferedPercent}% upfront</td>
                    <td className="py-3.5 px-3 text-gray-600">{req.deliveryFrequency}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {req.fulfilledQuantityKg} / {req.weeklyQuantityKg} kg ({req.status})
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 text-[11px] max-w-xs truncate">{req.qualitySpec}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Farmers Growing For Our Hotel */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Tractor className="w-5 h-5 text-[#176B3A]" />
          <span>Farmers Cultivating Directly For Our Kitchens</span>
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Real-time crop stage tracking, estimated harvest dates, and milestone balance settlements
        </p>

        <div className="space-y-4">
          {hotelContracts.map((ctr) => (
            <div key={ctr.id} className="p-4 rounded-xl border border-gray-200 bg-[#FAFCFA]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                <div>
                  <span className="text-xs font-bold text-gray-900">{ctr.farmerName}</span>
                  <span className="text-xs text-gray-500 ml-2">({ctr.contractNumber})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {ctr.currentStage}
                  </span>
                  <span className="text-xs font-black text-gray-900">
                    ₹{ctr.totalContractValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Crop / Variety</span>
                  <span className="font-semibold text-gray-800">{ctr.crop}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Quantity</span>
                  <span className="font-semibold text-gray-800">{ctr.contractQuantityKg} kg</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Agreed Delivery Date</span>
                  <span className="font-semibold text-amber-700">{ctr.deliveryDueDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Quality Specification</span>
                  <span className="font-semibold text-gray-800">{ctr.qualityGrade}</span>
                </div>
              </div>

              {/* Delivery Verification Button */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  Advance Paid: <strong>₹{ctr.advanceAmount.toLocaleString('en-IN')}</strong> • Remaining: <strong>₹{ctr.remainingAmount.toLocaleString('en-IN')}</strong>
                </span>

                {ctr.status !== 'Completed' ? (
                  <button
                    onClick={() => confirmContractDelivery(ctr.id)}
                    className="px-3 py-1.5 bg-[#176B3A] hover:bg-[#12582f] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Delivery Inspection & Release Balance</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Final Payment Cleared
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: POST NEW WEEKLY REQUIREMENT */}
      {showNewReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-amber-800 p-5 text-white">
              <h3 className="text-lg font-bold">Publish HoReCa Crop Requirement</h3>
              <p className="text-xs text-amber-100 mt-0.5">
                Targeted for local farmers within 40 km of JP Nagar
              </p>
            </div>

            <form onSubmit={handleCreateRequirement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Vegetable / Crop</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 outline-hidden"
                >
                  <option value="Tomato (Hybrid)">Tomato (Hybrid)</option>
                  <option value="Onion (Medium)">Onion (Medium)</option>
                  <option value="French Beans">French Beans</option>
                  <option value="Green Chilli">Green Chilli</option>
                  <option value="Capsicum (Green)">Capsicum (Green)</option>
                  <option value="Carrot (Orange)">Carrot (Orange)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Weekly Quantity (kg)
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={newWeeklyKg}
                    onChange={(e) => setNewWeeklyKg(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Offered Target Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newOfferedPrice}
                    onChange={(e) => setNewOfferedPrice(parseFloat(e.target.value) || 20)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Advance Capital Offered
                  </label>
                  <select
                    value={newAdvancePercent}
                    onChange={(e) => setNewAdvancePercent(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option value={30}>30% Upfront Advance</option>
                    <option value={40}>40% Upfront Advance</option>
                    <option value={50}>50% Upfront Advance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Delivery Frequency
                  </label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Daily">Daily Morning</option>
                    <option value="Alternate Days">Alternate Days</option>
                    <option value="Twice a Week">Twice a Week</option>
                    <option value="Weekly">Weekly Once</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Quality Specifications
                </label>
                <input
                  type="text"
                  value={newQualitySpec}
                  onChange={(e) => setNewQualitySpec(e.target.value)}
                  placeholder="e.g. Firm texture, uniform size, no chemical spray under 7 days"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewReqModal(false)}
                  className="w-1/3 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-70"
                >
                  <span>{isSubmitting ? 'Publishing to Network...' : 'Publish Requirement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
