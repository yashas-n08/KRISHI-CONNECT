import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Globe,
  Leaf,
  LogOut,
  MapPin,
  Mic,
  ShieldCheck,
  Sparkles,
  Store,
  Tractor,
  User,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    language,
    priceUnit,
    setLanguage,
    setPriceUnit,
    switchUserRole,
    activeView,
    setActiveView,
    notifications,
    markNotificationRead,
    logoutUser,
    setIsVoiceModalOpen,
    isRealtimeConnected,
    triggerPriceTick,
    t,
  } = useApp();

  const [isTickLoading, setIsTickLoading] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    farmer: {
      label: language === 'kn' ? 'ರೈತ (Farmer)' : 'Farmer Portal',
      icon: <Tractor className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    hotel: {
      label: language === 'kn' ? 'ಹೋಟೆಲ್ (Hotel)' : 'Hotel Portal',
      icon: <Store className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    admin: {
      label: language === 'kn' ? 'ನಿರ್ವಾಹಕ (Admin)' : 'Admin Control',
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E1ECE3] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView(currentRole === 'farmer' ? 'overview' : currentRole === 'hotel' ? 'hotel-portal' : 'admin-portal')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#176B3A] to-[#2D8A4E] flex items-center justify-center text-white shadow-md shadow-emerald-900/15">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-[#176B3A]">KRISHI CONNECT</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-[#DFF1E3] text-[#176B3A] rounded-full uppercase tracking-wider">
                  Govt. Agmarknet AI
                </span>
                <div
                  className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                  title="Real-Time Data Stream via Server-Sent Events"
                >
                  <span className={`w-2 h-2 rounded-full ${isRealtimeConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                  <span>{isRealtimeConnected ? 'Live' : 'Connecting'}</span>
                </div>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setIsTickLoading(true);
                    await triggerPriceTick();
                    setTimeout(() => setIsTickLoading(false), 600);
                  }}
                  className="hidden sm:inline-flex p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="Simulate Real-Time APMC Price Tick"
                >
                  <RefreshCw className={`w-3 h-3 ${isTickLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-[#526458] font-medium hidden md:block">
                {language === 'kn'
                  ? 'ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಬೆಳೆಯಿರಿ • ಉತ್ತಮ ಬೆಲೆಗೆ ಮಾರಿ • ಹೆಚ್ಚು ಗಳಿಸಿ'
                  : 'Grow Smart • Sell Better • Earn More'}
              </p>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <div className="hidden lg:flex items-center space-x-1 bg-[#F3F8F3] p-1 rounded-xl border border-[#D8E6DB]">
            {currentRole === 'farmer' && (
              <>
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'overview'
                      ? 'bg-white text-[#176B3A] shadow-xs'
                      : 'text-[#445548] hover:text-[#176B3A]'
                  }`}
                >
                  {t.navOverview}
                </button>
                <button
                  onClick={() => setActiveView('prediction')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'prediction'
                      ? 'bg-white text-[#176B3A] shadow-xs'
                      : 'text-[#445548] hover:text-[#176B3A]'
                  }`}
                >
                  {t.navPredict}
                </button>
                <button
                  onClick={() => setActiveView('recommendation')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'recommendation'
                      ? 'bg-white text-[#176B3A] shadow-xs'
                      : 'text-[#445548] hover:text-[#176B3A]'
                  }`}
                >
                  {t.navRecommend}
                </button>
                <button
                  onClick={() => setActiveView('mandi')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'mandi'
                      ? 'bg-white text-[#176B3A] shadow-xs'
                      : 'text-[#445548] hover:text-[#176B3A]'
                  }`}
                >
                  {t.navMandi}
                </button>
                <button
                  onClick={() => setActiveView('selling-advisor')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'selling-advisor'
                      ? 'bg-white text-[#176B3A] shadow-xs'
                      : 'text-[#445548] hover:text-[#176B3A]'
                  }`}
                >
                  {t.navSellAdvisor}
                </button>
                <button
                  onClick={() => setActiveView('community')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'community' || activeView === 'fund-farmer'
                      ? 'bg-white text-[#176B3A] shadow-xs'
                      : 'text-[#445548] hover:text-[#176B3A]'
                  }`}
                >
                  {t.navCommunity}
                </button>
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-[#176B3A] text-white shadow-xs flex items-center gap-1.5 hover:from-emerald-500 hover:to-[#13582f] transition-all"
                >
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  <span>AgroVoice AI</span>
                </button>
              </>
            )}

            {currentRole === 'hotel' && (
              <>
                <button
                  onClick={() => setActiveView('hotel-portal')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'hotel-portal'
                      ? 'bg-white text-[#176B3A] shadow-xs'
                      : 'text-[#445548] hover:text-[#176B3A]'
                  }`}
                >
                  {t.navHotelProcure}
                </button>
                <button
                  onClick={() => setActiveView('community')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'community'
                      ? 'bg-white text-[#176B3A] shadow-xs'
                      : 'text-[#445548] hover:text-[#176B3A]'
                  }`}
                >
                  JP Nagar Farmers Pool
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveView('admin-portal')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'admin-portal'
                      ? 'bg-white text-[#176B3A] shadow-xs'
                      : 'text-[#445548] hover:text-[#176B3A]'
                  }`}
                >
                  {t.navAdmin}
                </button>
                <button
                  onClick={() => setActiveView('prediction')}
                  className="px-3 py-1.5 text-xs font-semibold text-[#445548] hover:text-[#176B3A]"
                >
                  Model Analytics
                </button>
              </>
            )}
          </div>

          {/* Right Controls: Role Switcher, Unit Toggle, Language, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Price Unit Selector (₹/quintal vs ₹/kg) */}
            <div className="flex items-center bg-[#F3F8F3] p-0.5 rounded-lg border border-[#D5E5D8]">
              <button
                onClick={() => setPriceUnit('quintal')}
                title="1 Quintal = 100 Kg"
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  priceUnit === 'quintal'
                    ? 'bg-[#176B3A] text-white shadow-xs font-semibold'
                    : 'text-[#445548] hover:text-[#176B3A]'
                }`}
              >
                ₹/Qtl
              </button>
              <button
                onClick={() => setPriceUnit('kg')}
                title="Price per Kilogram"
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  priceUnit === 'kg'
                    ? 'bg-[#176B3A] text-white shadow-xs font-semibold'
                    : 'text-[#445548] hover:text-[#176B3A]'
                }`}
              >
                ₹/Kg
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-[#26332A] bg-white border border-[#D5E5D8] rounded-lg hover:bg-[#F3F8F3] transition-colors"
              title="Switch Language: English / ಕನ್ನಡ"
            >
              <Globe className="w-3.5 h-3.5 text-[#176B3A]" />
              <span className="font-semibold">{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* AgroVoice AI Header Button */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-[#176B3A] to-[#12582E] hover:from-emerald-500 hover:to-[#0e4b26] rounded-xl shadow-xs transition-all animate-pulse"
              title="Open AgroVoice Multilingual AI Assistant"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AgroVoice</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium shadow-xs transition-all ${roleLabels[currentRole].color}`}
              >
                {roleLabels[currentRole].icon}
                <span className="font-semibold">{roleLabels[currentRole].label}</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => {
                      switchUserRole('farmer');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2.5 hover:bg-emerald-50 ${
                      currentRole === 'farmer' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <Tractor className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">Farmer (ರೈತ)</div>
                      <div className="text-[10px] text-gray-500">Ramesh Gowda • Kolar</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('hotel');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2.5 hover:bg-amber-50 ${
                      currentRole === 'hotel' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <Store className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-semibold">Hotel / Restaurant</div>
                      <div className="text-[10px] text-gray-500">The Rameshwaram Cafe • JP Nagar</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('admin');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2.5 hover:bg-blue-50 ${
                      currentRole === 'admin' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-semibold">Administrator</div>
                      <div className="text-[10px] text-gray-500">Dr. Suresh Patil • Agri Board</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-[#176B3A] hover:bg-[#F3F8F3] rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      Live Market & Contract Alerts
                    </span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} Unread
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationRead(item.id)}
                        className={`p-3 text-xs hover:bg-gray-50 cursor-pointer transition-colors ${
                          !item.read ? 'bg-[#F9FCFA]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-semibold text-gray-900">{item.title}</span>
                          <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                        </div>
                        <p className="text-gray-600 mt-1 text-[11px] leading-relaxed">{item.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={logoutUser}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout / Switch Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex lg:hidden overflow-x-auto space-x-2 py-2 border-t border-gray-100 no-scrollbar">
          {currentRole === 'farmer' && (
            <>
              <button
                onClick={() => setActiveView('overview')}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium ${
                  activeView === 'overview' ? 'bg-[#176B3A] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.navOverview}
              </button>
              <button
                onClick={() => setActiveView('prediction')}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium ${
                  activeView === 'prediction' ? 'bg-[#176B3A] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.navPredict}
              </button>
              <button
                onClick={() => setActiveView('recommendation')}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium ${
                  activeView === 'recommendation' ? 'bg-[#176B3A] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.navRecommend}
              </button>
              <button
                onClick={() => setActiveView('mandi')}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium ${
                  activeView === 'mandi' ? 'bg-[#176B3A] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.navMandi}
              </button>
              <button
                onClick={() => setActiveView('selling-advisor')}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium ${
                  activeView === 'selling-advisor' ? 'bg-[#176B3A] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.navSellAdvisor}
              </button>
              <button
                onClick={() => setActiveView('community')}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium ${
                  activeView === 'community' ? 'bg-[#176B3A] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.navCommunity}
              </button>
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="px-3 py-1 text-xs whitespace-nowrap rounded-md font-bold bg-[#176B3A] text-white flex items-center gap-1 shadow-xs"
              >
                <Mic className="w-3 h-3" />
                <span>AgroVoice AI</span>
              </button>
            </>
          )}

          {currentRole === 'hotel' && (
            <>
              <button
                onClick={() => setActiveView('hotel-portal')}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium ${
                  activeView === 'hotel-portal' ? 'bg-[#176B3A] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.navHotelProcure}
              </button>
              <button
                onClick={() => setActiveView('community')}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium ${
                  activeView === 'community' ? 'bg-[#176B3A] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Farmer Network
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => setActiveView('admin-portal')}
              className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium ${
                activeView === 'admin-portal' ? 'bg-[#176B3A] text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {t.navAdmin}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
