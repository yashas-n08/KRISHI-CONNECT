import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle,
  ChevronRight,
  Coins,
  Droplets,
  HelpCircle,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateCropProfitability, CropPlannerCriteria } from '../../services/profitabilityEngine';
import { convertPrice } from '../../services/predictionEngine';

export const CropRecommendationView: React.FC = () => {
  const { priceUnit, setActiveView, commodities, setSelectedCommodity, language, t } = useApp();

  const [criteria, setCriteria] = useState<CropPlannerCriteria>({
    location: 'Kolar & Chintamani Belt',
    landAcres: 2.5,
    irrigation: 'Drip',
    investmentBudget: 75000,
    experience: 'Intermediate (2-5 yrs)',
    season: 'Rabi / Winter',
  });

  const [selectedCropDetail, setSelectedCropDetail] = useState<string | null>(null);

  const recommendations = calculateCropProfitability(criteria);

  const isKg = priceUnit === 'kg';
  const fmtCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#176B3A] uppercase tracking-wider">
              <Sprout className="w-4 h-4" />
              <span>Krishi Decision Pillar 1</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
              {t.q1Title} (Crop Profitability Recommender)
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Unlike basic spot checkers, KRISHI CONNECT forecasts the expected market price at your{' '}
              <strong className="text-gray-900 font-semibold">actual harvest date</strong> (60 to 90 days ahead)
              accounting for cultivation inputs, perishability, and nearby institutional hotel demand.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
            <span className="font-bold block">Forward Price Grounding:</span>
            Never plant a crop solely because today's price is high. We model market supply at harvest time.
          </div>
        </div>
      </div>

      {/* Interactive Input Form: Land, Irrigation, Budget, Experience */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
          Your Farm & Resource Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Location / Agro-Zone</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <select
                value={criteria.location}
                onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#176B3A] outline-hidden"
              >
                <option value="Kolar & Chintamani Belt">Kolar & Chintamani Belt (Eastern Dry Zone)</option>
                <option value="Bengaluru Rural / Hoskote">Bengaluru Rural / Hoskote Belt</option>
                <option value="Ramanagara / Kanakapura">Ramanagara & Kanakapura Agro-Cluster</option>
                <option value="Chikkaballapur Vegetable Belt">Chikkaballapur Vegetable Corridor</option>
                <option value="Mandya Cauvery Basin">Mandya Cauvery Basin</option>
              </select>
            </div>
          </div>

          {/* Available Land */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Available Cultivated Land (Acres)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={criteria.landAcres}
                onChange={(e) => setCriteria({ ...criteria, landAcres: parseFloat(e.target.value) })}
                className="w-full accent-[#176B3A]"
              />
              <span className="w-16 text-center text-xs font-bold py-1.5 px-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                {criteria.landAcres} Ac
              </span>
            </div>
          </div>

          {/* Irrigation Availability */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Irrigation Source</label>
            <div className="relative">
              <Droplets className="w-4 h-4 text-blue-500 absolute left-3 top-2.5" />
              <select
                value={criteria.irrigation}
                onChange={(e) => setCriteria({ ...criteria, irrigation: e.target.value as any })}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#176B3A] outline-hidden"
              >
                <option value="Drip">Drip Irrigation (High efficiency +15% yield)</option>
                <option value="Borewell">Borewell Flood Irrigation</option>
                <option value="Canal">Canal / Tank Irrigation</option>
                <option value="Rainfed">Rainfed (Dependent on monsoon)</option>
              </select>
            </div>
          </div>

          {/* Investment Budget */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Available Investment Budget (₹)
            </label>
            <div className="relative">
              <Coins className="w-4 h-4 text-amber-500 absolute left-3 top-2.5" />
              <input
                type="number"
                step="5000"
                min="10000"
                max="500000"
                value={criteria.investmentBudget}
                onChange={(e) => setCriteria({ ...criteria, investmentBudget: parseInt(e.target.value) || 20000 })}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#176B3A] outline-hidden"
              />
            </div>
          </div>

          {/* Farming Experience */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Farming Experience</label>
            <select
              value={criteria.experience}
              onChange={(e) => setCriteria({ ...criteria, experience: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#176B3A] outline-hidden"
            >
              <option value="Beginner (<2 yrs)">Beginner (&lt; 2 years)</option>
              <option value="Intermediate (2-5 yrs)">Experienced (2 - 5 years)</option>
              <option value="Veteran (5+ yrs)">Veteran Farmer (5+ years)</option>
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Growing Season</label>
            <select
              value={criteria.season}
              onChange={(e) => setCriteria({ ...criteria, season: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#176B3A] outline-hidden"
            >
              <option value="Rabi / Winter">Rabi / Winter (Current Cycle)</option>
              <option value="Summer / Zaid">Summer / Zaid (Short duration crops)</option>
              <option value="Upcoming Kharif">Upcoming Kharif (Monsoon)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ranked Crop Profitability Recommendations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Ranked Crop Recommendations for Your Land ({criteria.landAcres} Acres)
          </h2>
          <span className="text-xs text-gray-500">
            Sorted by Projected Net Realized Profit
          </span>
        </div>

        {recommendations.map((crop, index) => {
          const totalCost = crop.estimatedCostPerAcre * criteria.landAcres;
          const isSelected = selectedCropDetail === crop.cropId;

          return (
            <div
              key={crop.cropId}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                index === 0
                  ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : 'border-[#E1ECE3] hover:border-gray-300'
              }`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        index === 0
                          ? 'bg-[#176B3A] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-extrabold text-gray-900">
                          {language === 'kn' ? crop.cropNameKannada : crop.cropName}
                        </h3>
                        {index === 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3" /> Highest Net Return
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Variety: <span className="font-medium text-gray-700">{crop.variety}</span> •
                        Maturity: <span className="font-semibold text-gray-700">{crop.durationDays} Days</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        crop.riskLevel === 'Low'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : crop.riskLevel === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {crop.riskLevel} Market Risk
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Hotel Demand: {crop.localHotelDemandScore}/100
                    </span>
                  </div>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Estimated Investment</span>
                    <span className="text-base font-black text-gray-900">
                      {fmtCurrency(totalCost)}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      (₹{crop.estimatedCostPerAcre.toLocaleString('en-IN')}/acre)
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[11px]">Expected Gross Revenue</span>
                    <span className="text-base font-black text-gray-900">
                      {fmtCurrency(crop.expectedGrossRevenue)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      @ ₹{(crop.expectedHarvestPrice / 100).toFixed(1)}/kg at harvest
                    </span>
                  </div>

                  <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-emerald-800 font-semibold block text-[11px]">
                      Expected Net Profit
                    </span>
                    <span className="text-lg font-black text-emerald-700">
                      {fmtCurrency(crop.expectedNetProfit)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      +{crop.profitMarginPercent}% Net Margin
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[11px]">Harvest Window</span>
                    <span className="font-bold text-gray-800 block text-xs mt-0.5">
                      {crop.harvestWindow}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      Yield: {(crop.estimatedYieldPerAcre * criteria.landAcres).toFixed(0)} Qtl
                    </span>
                  </div>
                </div>

                {/* Best-case, Expected-case, Worst-case Scenario Strip */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-wrap items-center justify-between text-xs gap-2">
                  <span className="font-bold text-gray-600 text-[11px] uppercase tracking-wider">
                    Profitability Scenarios:
                  </span>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-gray-400 text-[10px]">Worst-Case (Glut):</span>{' '}
                      <span className="font-bold text-gray-800">{fmtCurrency(crop.worstCaseProfit)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px]">Expected:</span>{' '}
                      <span className="font-bold text-emerald-700">{fmtCurrency(crop.expectedNetProfit)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px]">Best-Case (Spike):</span>{' '}
                      <span className="font-bold text-emerald-800">{fmtCurrency(crop.bestCaseProfit)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCropDetail(isSelected ? null : crop.cropId)}
                    className="text-xs font-bold text-[#176B3A] hover:underline flex items-center gap-0.5"
                  >
                    <span>{isSelected ? 'Hide Factors' : 'View AI Factors & Hotel Demand'}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90' : ''}`}
                    />
                  </button>
                </div>

                {/* Collapsible Factors and Hotel Linkage */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in duration-150">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Key Agronomic & Market Drivers:</h4>
                      <ul className="space-y-1.5 text-gray-700">
                        {crop.keyFactors.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#F3F8F3] p-3.5 rounded-xl border border-[#D5E5D8]">
                      <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#176B3A]" />
                        <span>Pre-Harvest Hotel Contracting Available</span>
                      </h4>
                      <p className="text-gray-600 text-[11px] leading-relaxed mb-3">
                        JP Nagar restaurants are currently looking for forward suppliers of {crop.cropName}.
                        Lock in guaranteed buyback price and receive 40% upfront cultivation advance.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => {
                            const match = commodities.find((c) => c.commodity.toLowerCase().includes(crop.cropName.toLowerCase()));
                            if (match) setSelectedCommodity(match);
                            setActiveView('community');
                          }}
                          className="flex-1 py-2 bg-[#176B3A] hover:bg-[#12582f] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                        >
                          <span>View Hotel Orders</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const match = commodities.find((c) => c.commodity.toLowerCase().includes(crop.cropName.toLowerCase()));
                            if (match) setSelectedCommodity(match);
                            setActiveView('prediction');
                          }}
                          className="flex-1 py-2 bg-white border border-[#176B3A] text-[#176B3A] hover:bg-[#F3F8F3] font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <span>Check 7-Day Price</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
