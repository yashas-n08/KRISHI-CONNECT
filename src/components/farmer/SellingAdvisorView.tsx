import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  IndianRupee,
  Layers,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Warehouse,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { evaluateSellingDecision } from '../../services/sellingAdvisor';
import { SellingAdvisorInput } from '../../types';

export const SellingAdvisorView: React.FC = () => {
  const { selectedCommodity, setActiveView, language, t } = useApp();

  const [input, setInput] = useState<SellingAdvisorInput>({
    crop: selectedCommodity.commodity,
    quantityQuintals: 15, // 1,500 kg
    qualityGrade: 'Grade A (Export/Premium)',
    harvestDate: '2026-11-05',
    storageAvailable: false,
    coldStorageAvailable: false,
  });

  const [holdingAlertSet, setHoldingAlertSet] = useState(false);

  const result = evaluateSellingDecision(input);

  const getBadgeStyle = (decision: string) => {
    switch (decision) {
      case 'SELL TO A REGISTERED HOTEL':
        return 'bg-amber-500 text-white border-amber-600 shadow-md';
      case 'HOLD FOR 2 DAYS':
      case 'HOLD FOR 5 DAYS':
        return 'bg-blue-600 text-white border-blue-700 shadow-md';
      case 'SELL AT ANOTHER MANDI':
        return 'bg-emerald-600 text-white border-emerald-700 shadow-md';
      case 'SELL NOW':
      default:
        return 'bg-[#176B3A] text-white border-[#176B3A] shadow-md';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#176B3A] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Krishi Decision Pillar 2</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
              {t.navSellAdvisor} (Sell or Hold Decision Support)
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Should you sell today or wait for expected price gains? The AI Selling Advisor rigorously balances
              projected price surges against daily perishable weight loss, storage fees, and direct restaurant buybacks.
            </p>
          </div>

          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 max-w-xs">
            <span className="font-bold block flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              Perishability Safeguard:
            </span>
            Never holds fresh vegetables blindly. We model physical weight shrinkage and moisture decay.
          </div>
        </div>
      </div>

      {/* Input Form: Crop, Quantity, Grade, Storage */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
          Current Harvest & Inventory Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Commodity */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Harvested Commodity</label>
            <select
              value={input.crop}
              onChange={(e) => setInput({ ...input, crop: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 outline-hidden"
            >
              <option value="Tomato (Hybrid)">Tomato (Hybrid) — High Perishability</option>
              <option value="Onion (Medium)">Onion (Medium) — High Storability</option>
              <option value="Potato (Jyoti)">Potato (Jyoti) — Storable</option>
              <option value="French Beans">French Beans — High Perishability</option>
              <option value="Capsicum (Green)">Capsicum (Green) — Moderate</option>
              <option value="Green Chilli">Green Chilli — Moderate</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Available Quantity (Quintals)
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={input.quantityQuintals}
              onChange={(e) => setInput({ ...input, quantityQuintals: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 outline-hidden"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              = {(input.quantityQuintals * 100).toLocaleString('en-IN')} Kilograms
            </span>
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Produce Quality / Grade</label>
            <select
              value={input.qualityGrade}
              onChange={(e) => setInput({ ...input, qualityGrade: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-hidden"
            >
              <option value="Grade A (Export/Premium)">Grade A (Premium / Hotel Standard)</option>
              <option value="Grade B (Standard)">Grade B (Standard APMC Auction)</option>
              <option value="Grade C (Fair)">Grade C (Fair Average Quality)</option>
            </select>
          </div>

          {/* Storage Facilities */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Storage Access</label>
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.coldStorageAvailable}
                  onChange={(e) => setInput({ ...input, coldStorageAvailable: e.target.checked })}
                  className="rounded text-[#176B3A] focus:ring-[#176B3A]"
                />
                <span>Cold Storage Available (2-4°C)</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.storageAvailable}
                  onChange={(e) => setInput({ ...input, storageAvailable: e.target.checked })}
                  className="rounded text-[#176B3A] focus:ring-[#176B3A]"
                />
                <span>Dry Ventilated Shed Available</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* DEFINITIVE AI RECOMMENDATION CARD */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              AI Algorithmic Verdict
            </span>
            <div className="flex items-center space-x-3 mt-1">
              <span
                className={`px-4 py-1.5 rounded-xl text-sm font-black tracking-wide uppercase ${getBadgeStyle(
                  result.decision
                )}`}
              >
                {result.decision}
              </span>
              <span className="text-xs font-bold text-gray-600 hidden sm:inline">
                ({result.decisionKannada})
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span
              className={`px-3 py-1 rounded-full font-bold ${
                result.riskAssessment === 'Low Risk'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {result.riskAssessment}
            </span>
            <span className="text-gray-500 font-medium">Target: {result.targetVenue}</span>
          </div>
        </div>

        {/* Financial Assessment Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-gray-100 text-xs">
          <div className="bg-[#F8FAF8] p-3.5 rounded-xl border border-gray-100">
            <span className="text-gray-400 block text-[11px]">Current Spot Value</span>
            <div className="text-xl font-black text-gray-900 mt-1">
              ₹{result.currentSellingValue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-gray-500">If liquidated today at nearest yard</span>
          </div>

          <div className="bg-[#F8FAF8] p-3.5 rounded-xl border border-gray-100">
            <span className="text-gray-400 block text-[11px]">Recommended Payout Value</span>
            <div className="text-xl font-black text-[#176B3A] mt-1">
              ₹{result.expectedFutureSellingValue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">
              Gross realization under advice
            </span>
          </div>

          <div className="bg-[#F8FAF8] p-3.5 rounded-xl border border-gray-100">
            <span className="text-gray-400 block text-[11px]">Holding & Decay Cost</span>
            <div className="text-xl font-bold text-red-600 mt-1">
              ₹{result.storageAndSpoilageCost.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-red-700">
              {result.spoilagePercentageExpected}% weight loss + storage
            </span>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 font-bold block text-[11px]">Net Financial Gain</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              +₹{result.netFinancialImpact.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Extra in-pocket profit vs spot sale
            </span>
          </div>
        </div>

        {/* Deep Reasoning & Logic Breakdown */}
        <div className="pt-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
            Key Economic Rationale & Causal Justification:
          </h3>
          <ul className="space-y-2 text-xs text-gray-700">
            {result.reasoning.map((r, i) => (
              <li key={i} className="flex items-start gap-2 bg-[#F9FCFA] p-2.5 rounded-xl border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-[#176B3A] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic Action Pathways Based on Algorithmic Decision */}
        {result.decision === 'SELL TO A REGISTERED HOTEL' && (
          <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase">
                Lock Direct Hotel Agreement
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                This advice links directly to an active HoReCa procurement contract with zero commission and advance funding.
              </p>
            </div>
            <button
              onClick={() => setActiveView('community')}
              className="shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <span>Accept Hotel Contract</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {(result.decision === 'HOLD FOR 2 DAYS' || result.decision === 'HOLD FOR 5 DAYS') && (
          <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div>
              <h4 className="text-xs font-bold text-blue-900 uppercase">
                Holding Strategy & Storage Safeguards
              </h4>
              <p className="text-xs text-blue-800 mt-0.5">
                {holdingAlertSet
                  ? 'Active Watch Activated: Real-time price threshold alert scheduled for Day 2 peak.'
                  : 'Expected price gains outweigh daily shrinkage. Store in ventilated crates elevated 6 inches from floor.'}
              </p>
            </div>
            <button
              onClick={() => setHoldingAlertSet(!holdingAlertSet)}
              className={`shrink-0 px-4 py-2 text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs ${
                holdingAlertSet ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{holdingAlertSet ? 'Holding Alert Active' : 'Set Peak Price Calendar Reminder'}</span>
            </button>
          </div>
        )}

        {(result.decision === 'SELL NOW' || result.decision === 'SELL AT ANOTHER MANDI') && (
          <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase">
                Immediate Liquidation Advised
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Avoid upcoming arrival glut. Route your consignment to the mandi offering the highest net pocket realization today.
              </p>
            </div>
            <button
              onClick={() => setActiveView('mandi')}
              className="shrink-0 px-4 py-2 bg-[#176B3A] hover:bg-[#12582f] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <span>Compare Mandis for Max Net Return</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
