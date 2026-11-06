import React from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  FileText,
  HandCoins,
  HelpCircle,
  Info,
  MapPin,
  Scale,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  Wallet,
  Mic,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { convertPrice } from '../../services/predictionEngine';

export const FarmerDashboard: React.FC = () => {
  const {
    currentUser,
    selectedCommodity,
    setSelectedCommodity,
    commodities,
    priceUnit,
    contracts,
    hotelRequirements,
    setActiveView,
    setIsVoiceModalOpen,
    liveWeather,
    triggerPriceTick,
    language,
    t,
  } = useApp();

  const isKg = priceUnit === 'kg';
  const unitSuffix = isKg ? '₹/kg' : '₹/quintal';

  // Format currency helper
  const fmt = (priceQuintal: number) => {
    const val = convertPrice(priceQuintal, priceUnit);
    return isKg ? `₹${val.toFixed(2)}` : `₹${val.toLocaleString('en-IN')}`;
  };

  // Farmer's active contracts & projected revenue
  const farmerContracts = contracts.filter((c) => c.farmerId === currentUser.id);
  const totalAgreedContractValue = farmerContracts.reduce((acc, c) => acc + c.totalContractValue, 0);
  const totalAdvanceCollected = farmerContracts.reduce((acc, c) => acc + (c.advancePaid ? c.advanceAmount : 0), 0);
  const remainingPendingPayout = totalAgreedContractValue - totalAdvanceCollected;

  return (
    <div className="space-y-6">
      {/* Top Banner: Farmer Info, Weather, Agro-Zone */}
      <div className="bg-gradient-to-br from-[#176B3A] via-[#1B7742] to-[#0E4F28] rounded-2xl p-6 text-white shadow-lg shadow-emerald-950/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold tracking-wide uppercase mb-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>AGMARKNET Live Verified Mandi Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.welcomeBack}, {currentUser.name}
            </h1>
            <p className="text-sm text-emerald-100/90 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t.farmerLocation}</span>
              <span className="opacity-40">•</span>
              <Calendar className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t.seasonKharif}</span>
            </p>
          </div>

          {/* Micro Weather & Agro Advisory Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 shrink-0">
                <Sun className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">{liveWeather.temperature}°C</span>
                  <span className="text-xs bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full font-medium">
                    {liveWeather.condition}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 leading-tight mt-0.5">
                  Humidity {liveWeather.humidity}% • {liveWeather.advisory}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AGROVOICE AI INTERACTIVE BANNER */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-[#F0F8F2] rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#176B3A] to-[#2E9B58] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/20">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-gray-900 tracking-tight">AgroVoice AI Assistant</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#176B3A] text-white rounded-full">
                8 Indian Languages
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              {language === 'kn'
                ? 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ: "ನನ್ನ ಟೊಮೆಟೊ ಬೆಲೆ ಎಷ್ಟು?", "ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬೇಕು?", ಅಥವಾ "ಮುಂದಿನ ವಾರದ ಮುನ್ಸೂಚನೆ ತಿಳಿಸಿ".'
                : 'Speak naturally: "What is today\'s tomato price?", "Where should I sell 20 quintals?", or "Will it rain tomorrow?".'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#176B3A] hover:bg-[#12582f] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0 group active:scale-95"
        >
          <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Tap to Speak (ಮಾತನಾಡಿ)</span>
        </button>
      </div>

      {/* KRISHI 4-PILLAR DECISION CARDS (Answers the 4 Core Farmer Questions) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E1ECE3] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#176B3A]" />
              <span>{t.coreQuestionsTitle}</span>
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'kn'
                ? 'ಕೃಷಿ ನಿರ್ಧಾರಗಳಲ್ಲಿ ಅನಿಶ್ಚಿತತೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಮತ್ತು ನಿವ್ವಳ ಲಾಭ ಹೆಚ್ಚಿಸಲು AI ಮಾರ್ಗದರ್ಶನ'
                : 'Direct answers to maximize net income and eliminate agricultural marketing risk'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Q1: What Should I Grow? */}
          <div
            onClick={() => setActiveView('recommendation')}
            className="group p-4 bg-[#F8FAF8] hover:bg-[#F0F7F2] border border-[#D5E5D8] hover:border-[#176B3A] rounded-xl cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B3A] bg-[#DFF1E3] px-2 py-0.5 rounded-md">
                  Pillar 1
                </span>
                <Compass className="w-4 h-4 text-[#176B3A] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{t.q1Title}</h3>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{t.q1Desc}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#176B3A]">
              <span>{t.startCropPlan}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Q2: When Should I Sell? */}
          <div
            onClick={() => setActiveView('selling-advisor')}
            className="group p-4 bg-[#F8FAF8] hover:bg-[#F0F7F2] border border-[#D5E5D8] hover:border-[#176B3A] rounded-xl cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B3A] bg-[#DFF1E3] px-2 py-0.5 rounded-md">
                  Pillar 2
                </span>
                <Clock className="w-4 h-4 text-[#176B3A] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{t.q2Title}</h3>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{t.q2Desc}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#176B3A]">
              <span>{t.getSellAdvice}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Q3: Where Should I Sell? */}
          <div
            onClick={() => setActiveView('mandi')}
            className="group p-4 bg-[#F8FAF8] hover:bg-[#F0F7F2] border border-[#D5E5D8] hover:border-[#176B3A] rounded-xl cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B3A] bg-[#DFF1E3] px-2 py-0.5 rounded-md">
                  Pillar 3
                </span>
                <Scale className="w-4 h-4 text-[#176B3A] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{t.q3Title}</h3>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{t.q3Desc}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#176B3A]">
              <span>{t.findBestMandi}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Q4: Who Will Buy My Crops? */}
          <div
            onClick={() => setActiveView('community')}
            className="group p-4 bg-[#F8FAF8] hover:bg-[#F0F7F2] border border-[#D5E5D8] hover:border-[#176B3A] rounded-xl cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B3A] bg-[#DFF1E3] px-2 py-0.5 rounded-md">
                  Pillar 4
                </span>
                <Building2 className="w-4 h-4 text-[#176B3A] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{t.q4Title}</h3>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{t.q4Desc}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#176B3A]">
              <span>{t.exploreContracts}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Quick Switcher Strip */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Select Commodity for Live Mandi Intelligence
        </h2>
        <span className="text-xs text-gray-500 hidden sm:inline">
          {commodities.length} Monitored Commodities
        </span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {commodities.map((item) => {
          const isSelected = selectedCommodity.id === item.id;
          const isPositive = item.changePercent >= 0;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedCommodity(item)}
              className={`shrink-0 px-4 py-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-white border-[#176B3A] ring-2 ring-[#176B3A]/20 shadow-md'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xs font-bold text-gray-900">
                {language === 'kn' ? item.commodityKannada : item.commodity}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-extrabold text-[#176B3A]">{fmt(item.modalPrice)}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm flex items-center ${
                    isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {item.changePercent}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SECTION 3 REQUIREMENT: CURRENT MARKET STATISTICS (PROMINENT LARGE NUMERICAL STATISTICS) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-md">
                Official Government Agmarknet Benchmarks
              </span>
              <span className="text-xs text-gray-500">• {selectedCommodity.mandi}</span>
            </div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mt-1">
              {t.currentMarketStats}: {language === 'kn' ? selectedCommodity.commodityKannada : selectedCommodity.commodity}
            </h2>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {t.lastUpdated}
            </span>
            <a
              href={selectedCommodity.dataSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#176B3A] font-semibold hover:underline flex items-center gap-1"
            >
              Verify Source (agmarknet.gov.in)
            </a>
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-5">
          {/* Modal Market Price */}
          <div className="bg-[#F8FAF8] p-4 rounded-xl border border-[#E1ECE3]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t.avgModalPrice}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#176B3A] tracking-tight mt-1">
              {fmt(selectedCommodity.modalPrice)}
            </div>
            <div className="flex items-center mt-2 text-xs font-semibold">
              {selectedCommodity.changePercent >= 0 ? (
                <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{selectedCommodity.changePercent}% vs Prev Day
                </span>
              ) : (
                <span className="text-red-700 bg-red-100 px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {selectedCommodity.changePercent}% vs Prev Day
                </span>
              )}
            </div>
          </div>

          {/* Min & Max Price Band */}
          <div className="bg-[#F8FAF8] p-4 rounded-xl border border-[#E1ECE3]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Mandi Auction Band (Min - Max)
            </span>
            <div className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight mt-1">
              {fmt(selectedCommodity.minPrice)} – {fmt(selectedCommodity.maxPrice)}
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Previous Day: <span className="font-semibold text-gray-700">{fmt(selectedCommodity.prevPrice)}</span>
            </p>
          </div>

          {/* Market Arrivals */}
          <div className="bg-[#F8FAF8] p-4 rounded-xl border border-[#E1ECE3]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t.marketArrivals}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              {selectedCommodity.arrivalsTonnes} <span className="text-sm font-semibold text-gray-500">Tonnes</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Equivalent to {(selectedCommodity.arrivalsTonnes * 10).toLocaleString('en-IN')} Quintals
            </p>
          </div>

          {/* Reporting Markets */}
          <div className="bg-[#F8FAF8] p-4 rounded-xl border border-[#E1ECE3]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t.reportingMarkets}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              {selectedCommodity.reportingMarketsCount} <span className="text-sm font-semibold text-gray-500">Mandis</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              100% Real-time Data Synced
            </p>
          </div>
        </div>

        {/* Quick forecast teaser */}
        <div className="mt-5 p-4 bg-[#F3F8F3] rounded-xl border border-[#D5E5D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#176B3A] text-white rounded-lg shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                7-Day AI Price Forecast Snapshot
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Our SARIMA + XGBoost model predicts prices will rise to{' '}
                <span className="font-bold text-[#176B3A]">
                  {fmt(Math.round(selectedCommodity.modalPrice * 1.13))}
                </span>{' '}
                over the next 7 days in Kolar/Bangalore markets.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('prediction')}
            className="shrink-0 px-4 py-2 bg-[#176B3A] hover:bg-[#12582f] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{t.viewFullForecast}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Farmer's Active Contracts & Revenue Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Contracts Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#176B3A]" />
                <span>My Active Farming Contracts ({farmerContracts.length})</span>
              </h3>
              <p className="text-xs text-gray-500">
                Direct buyback agreements with verified Bengaluru restaurants
              </p>
            </div>
            <button
              onClick={() => setActiveView('community')}
              className="text-xs font-semibold text-[#176B3A] hover:underline"
            >
              Browse Hotel Orders
            </button>
          </div>

          <div className="space-y-3">
            {farmerContracts.map((contract) => (
              <div
                key={contract.id}
                className="p-4 rounded-xl border border-gray-100 hover:border-[#176B3A]/40 bg-[#FAFCFA] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-gray-900">{contract.hotelName}</span>
                    <span className="text-[11px] text-gray-500 ml-2">({contract.contractNumber})</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                    {contract.currentStage}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Produce</span>
                    <span className="font-semibold text-gray-800">{contract.crop}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Committed Qty</span>
                    <span className="font-semibold text-gray-800">{contract.contractQuantityKg} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Agreed Price</span>
                    <span className="font-semibold text-emerald-700">₹{contract.agreedPricePerKg}/kg</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Advance Received</span>
                    <span className="font-semibold text-gray-900">
                      ₹{contract.advanceAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Cultivation Progress</span>
                    <span className="font-semibold text-gray-700">{contract.stageProgressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#176B3A] rounded-full transition-all duration-500"
                      style={{ width: `${contract.stageProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Revenue & Advance Payouts Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#176B3A] mb-2">
              <Wallet className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Revenue & Advance Funds</h3>
            </div>
            <p className="text-xs text-gray-500 mb-5">
              Zero-interest cultivation advances disbursed directly into your account
            </p>

            <div className="space-y-4">
              <div className="p-3.5 bg-[#F8FAF8] rounded-xl border border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Total Contracted Value</span>
                <div className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                  ₹{totalAgreedContractValue.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-gray-400">Guaranteed buyback floor price</span>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-800 font-medium">Advance Disbursed (Escrow Released)</span>
                <div className="text-2xl font-black text-emerald-700 tracking-tight mt-0.5">
                  ₹{totalAdvanceCollected.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Used for seeds & organic inputs</span>
              </div>

              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
                <span className="text-xs text-amber-800 font-medium">Pending Final Payment on Delivery</span>
                <div className="text-xl font-bold text-amber-700 tracking-tight mt-0.5">
                  ₹{remainingPendingPayout.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-amber-600 font-medium">Released within 24h of QC sign-off</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={() => setActiveView('community')}
              className="w-full py-2.5 bg-[#F3F8F3] hover:bg-[#E1ECE3] text-[#176B3A] font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <span>Explore JP Nagar Community Network</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
