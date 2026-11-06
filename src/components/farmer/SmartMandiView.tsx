import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  ExternalLink,
  Fuel,
  Info,
  MapPin,
  Navigation,
  Scale,
  Sparkles,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateMandiReturns, MandiFinderParams } from '../../services/mandiFinder';
import { convertPrice } from '../../services/predictionEngine';

export const SmartMandiView: React.FC = () => {
  const { selectedCommodity, priceUnit, setPriceUnit, language, t } = useApp();

  const [params, setParams] = useState<MandiFinderParams>({
    cropName: selectedCommodity.commodity,
    quantityQuintals: 20, // 2,000 kg / 2 tonnes
    vehicleType: 'Mini Truck (15-25 quintals)',
  });

  const [activeDispatchPass, setActiveDispatchPass] = useState<{
    passId: string;
    gateLane: string;
    entryDeadline: string;
    timestamp: string;
  } | null>(null);

  const isKg = priceUnit === 'kg';
  const mandis = calculateMandiReturns(params);
  const recommendedMandi = mandis.find((m) => m.isRecommended) || mandis[0];

  const handleGenerateGatePass = () => {
    setActiveDispatchPass({
      passId: `APMC-${recommendedMandi.mandiName.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      gateLane: 'Gate 3 / Lane B (Electronic Weighbridge)',
      entryDeadline: 'Tomorrow 06:30 AM',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const fmt = (priceQuintal: number) => {
    const val = convertPrice(priceQuintal, priceUnit);
    return isKg ? `₹${val.toFixed(2)}/kg` : `₹${val.toLocaleString('en-IN')}/qtl`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#176B3A] uppercase tracking-wider">
              <Scale className="w-4 h-4" />
              <span>Krishi Decision Pillar 3</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
              {t.q3Title} (Smart Mandi Comparison & Net Realized Return)
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Never choose a mandi solely based on its highest advertised price. We calculate your{' '}
              <strong className="text-gray-900 font-semibold">actual net pocket earnings</strong> after deducting
              diesel/freight transport costs, APMC mandi cess, loading hamali, and travel time.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPriceUnit(priceUnit === 'quintal' ? 'kg' : 'quintal')}
              className="px-3 py-1.5 bg-[#F3F8F3] hover:bg-[#E1ECE3] text-[#176B3A] border border-[#D5E5D8] rounded-xl text-xs font-bold transition-colors"
            >
              Toggle Unit: {priceUnit === 'quintal' ? 'Show ₹/Kg' : 'Show ₹/Quintal'}
            </button>
          </div>
        </div>
      </div>

      {/* Input Parameters: Consignment Size & Transport Vehicle */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Produce to Liquidate
            </label>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 flex items-center justify-between">
              <span>{language === 'kn' ? selectedCommodity.commodityKannada : selectedCommodity.commodity}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Selected
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Consignment Quantity
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={params.quantityQuintals}
                onChange={(e) => setParams({ ...params, quantityQuintals: parseInt(e.target.value) })}
                className="w-full accent-[#176B3A]"
              />
              <span className="w-24 text-center text-xs font-bold py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                {params.quantityQuintals} Quintals ({(params.quantityQuintals * 100).toLocaleString('en-IN')} kg)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Transport Vehicle Hired
            </label>
            <div className="relative">
              <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <select
                value={params.vehicleType}
                onChange={(e) => setParams({ ...params, vehicleType: e.target.value as any })}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-hidden"
              >
                <option value="Auto (5-8 quintals)">Small Auto / Ape (5 - 8 Qtl, ₹12/km)</option>
                <option value="Mini Truck (15-25 quintals)">Mini Truck / Tata Ace (15 - 25 Qtl, ₹18/km)</option>
                <option value="Large Canter (50+ quintals)">Heavy Canter / Eicher (50+ Qtl, ₹28/km)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Winner Mandi Highlight Card */}
      <div className="bg-gradient-to-br from-[#176B3A] to-[#12582E] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Recommended Mandi by Maximum Net Realized Profit</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {recommendedMandi.mandiName}
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1">
              Distance: <strong className="text-white">{recommendedMandi.distanceKm} km</strong> from farm •
              Gross Auction Price: <strong className="text-white">{fmt(recommendedMandi.modalPricePerQuintal)}</strong>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center sm:text-right shrink-0">
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
              Net In-Hand Earnings
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
              ₹{(recommendedMandi.netRealizedPricePerQuintal * params.quantityQuintals).toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-emerald-100 font-semibold block mt-1">
              (Net {fmt(recommendedMandi.netRealizedPricePerQuintal)} after all deductions)
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-2 text-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>
              Even with higher transport, this market nets you{' '}
              <strong className="text-white underline">
                ₹{((recommendedMandi.netRealizedPricePerQuintal - mandis[mandis.length - 1].netRealizedPricePerQuintal) * params.quantityQuintals).toLocaleString('en-IN')} MORE
              </strong>{' '}
              than the lowest net option!
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleGenerateGatePass}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-gray-900 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-gray-900" />
              <span>Generate APMC Entry Pass</span>
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${recommendedMandi.latitude},${recommendedMandi.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white text-[#176B3A] hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open GPS Route</span>
              <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
            </a>
          </div>
        </div>

        {activeDispatchPass && (
          <div className="mt-4 p-4 bg-white/15 backdrop-blur-md rounded-xl border border-white/25 text-white animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/20 gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono font-bold text-sm tracking-wider">{activeDispatchPass.passId}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-gray-950 uppercase">
                  Verified Gate Pass
                </span>
              </div>
              <span className="text-[11px] text-emerald-200">Generated: {activeDispatchPass.timestamp}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2.5 text-xs">
              <div>
                <span className="text-emerald-200 block text-[10px]">Destination Mandi</span>
                <span className="font-bold text-white">{recommendedMandi.mandiName}</span>
              </div>
              <div>
                <span className="text-emerald-200 block text-[10px]">Declared Weight</span>
                <span className="font-bold text-white">{params.quantityQuintals} Qtl ({(params.quantityQuintals * 100).toLocaleString('en-IN')} kg)</span>
              </div>
              <div>
                <span className="text-emerald-200 block text-[10px]">Priority Gate Lane</span>
                <span className="font-bold text-amber-300">{activeDispatchPass.gateLane}</span>
              </div>
              <div>
                <span className="text-emerald-200 block text-[10px]">Entry Cut-off</span>
                <span className="font-bold text-white">{activeDispatchPass.entryDeadline}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-2">
          Comprehensive Mandi Comparison: Gross Price vs Net Realized Return
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          All prices in Indian Rupees. Net realized price accounts for round-trip freight and state APMC market user charges.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAF8] border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-3">Mandi / APMC Yard</th>
                <th className="py-3 px-3">Distance</th>
                <th className="py-3 px-3">Gross Modal Price</th>
                <th className="py-3 px-3">Arrival Volume</th>
                <th className="py-3 px-3">Est. Transport Cost</th>
                <th className="py-3 px-3">Mandi Cess + Labor</th>
                <th className="py-3 px-3">Net Realized Price</th>
                <th className="py-3 px-3">Total Net Earnings</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mandis.map((m) => {
                const totalNetEarnings = m.netRealizedPricePerQuintal * params.quantityQuintals;
                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      m.isRecommended ? 'bg-[#F3F8F3] font-semibold' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-gray-900">
                        {language === 'kn' ? m.mandiNameKn : m.mandiName}
                      </div>
                      <div className="text-[10px] text-gray-500">{m.district} District</div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-700">{m.distanceKm} km</td>
                    <td className="py-3.5 px-3 font-extrabold text-gray-900 text-sm">
                      {fmt(m.modalPricePerQuintal)}
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">{m.arrivalTonnes} Tonnes</td>
                    <td className="py-3.5 px-3 text-red-600 font-medium">
                      -₹{m.transportCostPerQuintal}/qtl
                    </td>
                    <td className="py-3.5 px-3 text-red-600 font-medium">
                      -₹{m.loadingAndMandiFeePerQuintal}/qtl
                    </td>
                    <td className="py-3.5 px-3 font-black text-emerald-800 text-sm">
                      {fmt(m.netRealizedPricePerQuintal)}
                    </td>
                    <td className="py-3.5 px-3 font-black text-gray-900 text-sm">
                      ₹{totalNetEarnings.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {m.isRecommended ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#176B3A] text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
                          <Award className="w-3 h-3" /> BEST RETURN
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium">Standard</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
