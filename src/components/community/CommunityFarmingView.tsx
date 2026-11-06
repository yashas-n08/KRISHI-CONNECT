import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  FileCheck2,
  FileText,
  HandCoins,
  MapPin,
  Phone,
  Plus,
  Scale,
  ShieldCheck,
  Sparkles,
  Tractor,
  Truck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmingContract, HotelRequirement } from '../../types';

export const CommunityFarmingView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    hotelRequirements,
    contracts,
    applyForContract,
    updateContractStage,
    confirmContractDelivery,
    language,
    t,
  } = useApp();

  const [selectedReqForContract, setSelectedReqForContract] = useState<HotelRequirement | null>(null);
  const [pledgedKg, setPledgedKg] = useState<number>(500);
  const [contractSuccessModal, setContractSuccessModal] = useState<string | null>(null);

  // Group weekly demand by crop
  const demandByCrop: Record<string, { totalWeeklyKg: number; openWeeklyKg: number; hotelsCount: number }> = {};
  hotelRequirements.forEach((r) => {
    if (!demandByCrop[r.crop]) {
      demandByCrop[r.crop] = { totalWeeklyKg: 0, openWeeklyKg: 0, hotelsCount: 0 };
    }
    demandByCrop[r.crop].totalWeeklyKg += r.weeklyQuantityKg;
    demandByCrop[r.crop].openWeeklyKg += Math.max(0, r.weeklyQuantityKg - r.fulfilledQuantityKg);
    demandByCrop[r.crop].hotelsCount += 1;
  });

  const handleOpenContractModal = (req: HotelRequirement) => {
    setSelectedReqForContract(req);
    setPledgedKg(Math.min(500, req.weeklyQuantityKg - req.fulfilledQuantityKg || 250));
  };

  const handleConfirmContract = async () => {
    if (!selectedReqForContract) return;
    const res = await applyForContract(selectedReqForContract, pledgedKg);
    if (res.success) {
      setContractSuccessModal(res.contractId);
      setSelectedReqForContract(null);
    }
  };

  const STAGES: FarmingContract['currentStage'][] = [
    'Seedling / Sowing',
    'Vegetative Growth',
    'Flowering & Fruiting',
    'Harvesting Ready',
    'Dispatched / In Transit',
    'Delivered & Inspected',
  ];

  return (
    <div className="space-y-6">
      {/* Network Header Banner */}
      <div className="bg-gradient-to-r from-[#176B3A] via-[#1B7742] to-[#12582E] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Direct Farm-to-Table Hyperlocal Aggregation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t.jpNagarTitle}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              {t.jpNagarDesc} Connecting prominent Bangalore restaurants (The Rameshwaram Cafe, Maiyas, Nagarjuna)
              directly with local farmers for zero-commission, advance-funded farming contracts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center">
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                Weekly HoReCa Demand
              </span>
              <span className="text-xl font-black text-white mt-0.5 block">1,650 kg/wk</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center">
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                Advance Capital Pool
              </span>
              <span className="text-xl font-black text-amber-300 mt-0.5 block">₹8.45 Lakhs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregated Demand Dashboard (Section 8 requirement) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#176B3A]" />
              <span>Aggregated Weekly Restaurant Demand in JP Nagar Hub</span>
            </h2>
            <p className="text-xs text-gray-500">
              Hotels pool their weekly procurement to guarantee large bulk volumes for local growers
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg">
            34 Participating Commercial Kitchens
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-4">
          {Object.entries(demandByCrop).map(([cropName, data]) => (
            <div key={cropName} className="p-3.5 bg-[#F8FAF8] rounded-xl border border-gray-100">
              <span className="text-xs font-bold text-gray-900 block truncate">{cropName}</span>
              <div className="text-xl font-black text-[#176B3A] mt-1">
                {data.totalWeeklyKg} <span className="text-xs font-semibold text-gray-500">kg/wk</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                <span>{data.hotelsCount} restaurants</span>
                <span className="text-amber-700 font-bold">{data.openWeeklyKg} kg open</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Hotel Purchase Requirements (Section 8 & 9 requirement) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#176B3A]" />
              <span>Available Hotel Purchase Requirements & Advance Funding</span>
            </h2>
            <p className="text-xs text-gray-500">
              Each requirement includes committed pricing above APMC modal and guaranteed advance funding
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotelRequirements.map((req) => {
            const isFulfilled = req.status === 'Fulfilled';
            const remainingKg = Math.max(0, req.weeklyQuantityKg - req.fulfilledQuantityKg);

            return (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isFulfilled
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-[#E1ECE3] hover:border-[#176B3A] hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{req.hotelName}</span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {req.locationArea}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFulfilled ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="my-3 p-3 bg-[#F3F8F3] rounded-xl border border-[#D5E5D8]">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                      <span>{language === 'kn' ? req.cropKannada : req.crop}</span>
                      <span className="text-sm font-black text-[#176B3A]">₹{req.offeredPricePerKg}/kg</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1">{req.variety}</p>
                    <p className="text-[10px] text-gray-500 italic mt-0.5">{req.qualitySpec}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-1">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Weekly Volume</span>
                      <span className="font-bold text-gray-800">{req.weeklyQuantityKg} kg/wk</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block">Advance Capital</span>
                      <span className="font-bold text-emerald-700">
                        {req.advanceFundingOfferedPercent}% Upfront
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block">Frequency</span>
                      <span className="font-semibold text-gray-700">{req.deliveryFrequency}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block">Uncontracted Gap</span>
                      <span className="font-bold text-amber-700">{remainingKg} kg</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  {isFulfilled ? (
                    <div className="text-center text-xs text-gray-400 font-semibold py-1.5">
                      Fully Contracted
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenContractModal(req)}
                      className="w-full py-2.5 bg-[#176B3A] hover:bg-[#12582f] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <HandCoins className="w-4 h-4" />
                      <span>Apply & Claim Advance Fund</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 9: "FUND A FARMER" CONTRACT LIFECYCLE & STAGE PROGRESS */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#176B3A]" />
              <span>Fund a Farmer: Active Direct Contracts & Delivery Milestones</span>
            </h2>
            <p className="text-xs text-gray-500">
              Digital contract acceptance with milestone payouts, crop stage tracking, and QC delivery sign-offs
            </p>
          </div>
          <span className="text-xs text-gray-500">
            {contracts.length} Total Platform Contracts
          </span>
        </div>

        <div className="space-y-4 pt-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="p-5 rounded-2xl border border-gray-200 bg-[#FAFCFA] hover:border-[#176B3A]/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200/70 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-gray-900">{contract.contractNumber}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                      {contract.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    <strong>Buyer:</strong> {contract.hotelName} • <strong>Farmer:</strong> {contract.farmerName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900 block">
                    Total Value: ₹{contract.totalContractValue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Advance Released: ₹{contract.advanceAmount.toLocaleString('en-IN')} (Ref: {contract.advanceTransactionRef?.slice(0, 15)}...)
                  </span>
                </div>
              </div>

              {/* Progress Milestones Tracker */}
              <div className="py-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-gray-800">
                    Growth Milestone: <span className="text-[#176B3A]">{contract.currentStage}</span>
                  </span>
                  <span className="font-bold text-gray-700">{contract.stageProgressPercent}% Finished</span>
                </div>

                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#176B3A] rounded-full transition-all duration-500"
                    style={{ width: `${contract.stageProgressPercent}%` }}
                  />
                </div>

                {/* Milestone Step Buttons (Functional Interaction) */}
                <div className="flex flex-wrap gap-2 mt-3 pt-1">
                  {STAGES.map((stg, i) => {
                    const percent = Math.min(100, Math.round(((i + 1) / STAGES.length) * 100));
                    const isCurrent = contract.currentStage === stg;
                    return (
                      <button
                        key={stg}
                        onClick={() => updateContractStage(contract.id, stg, percent)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isCurrent
                            ? 'bg-[#176B3A] text-white shadow-xs'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50'
                        }`}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contract Footer & Actions */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs gap-3">
                <div className="text-gray-500 text-[11px]">
                  <span>Due by: <strong>{contract.deliveryDueDate}</strong></span> •
                  <span className="ml-2">Produce: <strong>{contract.contractQuantityKg} kg {contract.crop}</strong> @ ₹{contract.agreedPricePerKg}/kg</span>
                </div>

                <div className="flex items-center space-x-2">
                  {contract.status !== 'Completed' && (
                    <button
                      onClick={() => confirmContractDelivery(contract.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify Delivery & Settle ₹{contract.remainingAmount.toLocaleString('en-IN')}</span>
                    </button>
                  )}
                  {contract.status === 'Completed' && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fully Settled & Disbursed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: APPLY FOR CONTRACT & CLAIM ADVANCE */}
      {selectedReqForContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-[#176B3A] p-5 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                Digital Farming Agreement
              </span>
              <h3 className="text-lg font-bold mt-0.5">
                Apply for {selectedReqForContract.hotelName} Contract
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                Produce: {selectedReqForContract.crop} ({selectedReqForContract.variety})
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  How many kilograms can you supply?
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="100"
                    max={selectedReqForContract.weeklyQuantityKg}
                    step="50"
                    value={pledgedKg}
                    onChange={(e) => setPledgedKg(parseInt(e.target.value))}
                    className="w-full accent-[#176B3A]"
                  />
                  <span className="w-24 text-center text-xs font-bold py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                    {pledgedKg} kg
                  </span>
                </div>
              </div>

              {/* Payout Calculation Table */}
              <div className="p-4 bg-[#F8FAF8] rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Agreed Price per Kg:</span>
                  <span className="font-bold text-gray-900">₹{selectedReqForContract.offeredPricePerKg}/kg</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Contract Value:</span>
                  <span className="font-bold text-gray-900">
                    ₹{(pledgedKg * selectedReqForContract.offeredPricePerKg).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold pt-2 border-t border-gray-200">
                  <span>Instant Advance Capital ({selectedReqForContract.advanceFundingOfferedPercent}%):</span>
                  <span>
                    ₹{Math.round((pledgedKg * selectedReqForContract.offeredPricePerKg * selectedReqForContract.advanceFundingOfferedPercent) / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Balance Payable on Delivery:</span>
                  <span>
                    ₹{Math.round((pledgedKg * selectedReqForContract.offeredPricePerKg * (100 - selectedReqForContract.advanceFundingOfferedPercent)) / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                <strong>Simulated Escrow Contract:</strong> By accepting, a digital purchase order is generated.
                The hotel's advance deposit is immediately reflected in your wallet.
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReqForContract(null)}
                  className="w-1/3 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmContract}
                  className="w-2/3 py-2.5 bg-[#176B3A] hover:bg-[#12582f] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <HandCoins className="w-4 h-4" />
                  <span>Accept & Claim Advance</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {contractSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 bg-emerald-100 text-[#176B3A] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-900">Contract Activated!</h3>
            <p className="text-xs text-gray-600 mt-1">
              Your binding farming contract has been executed. The advance cultivation fund has been credited to your active pipeline.
            </p>
            <button
              onClick={() => setContractSuccessModal(null)}
              className="mt-5 w-full py-2.5 bg-[#176B3A] hover:bg-[#12582f] text-white font-bold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
