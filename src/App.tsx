import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { AuthModal } from './components/auth/AuthModal';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { PricePredictionView } from './components/farmer/PricePredictionView';
import { CropRecommendationView } from './components/farmer/CropRecommendationView';
import { SmartMandiView } from './components/farmer/SmartMandiView';
import { SellingAdvisorView } from './components/farmer/SellingAdvisorView';
import { CommunityFarmingView } from './components/community/CommunityFarmingView';
import { HotelDashboard } from './components/hotel/HotelDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AgroVoiceModal } from './components/voice/AgroVoiceModal';
import { AgroVoiceFloatingWidget } from './components/voice/AgroVoiceFloatingWidget';
import { CheckCircle2, Heart, Leaf, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, currentRole, isLoggedIn, language, setIsVoiceModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8]">
      <Header />

      {!isLoggedIn && <AuthModal />}

      {/* AgroVoice AI Voice Assistant Modal & Floating Widget */}
      <AgroVoiceModal />
      <AgroVoiceFloatingWidget />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'overview' && <FarmerDashboard />}
        {activeView === 'prediction' && <PricePredictionView />}
        {activeView === 'recommendation' && <CropRecommendationView />}
        {activeView === 'mandi' && <SmartMandiView />}
        {activeView === 'selling-advisor' && <SellingAdvisorView />}
        {(activeView === 'community' || activeView === 'fund-farmer') && <CommunityFarmingView />}
        {activeView === 'hotel-portal' && <HotelDashboard />}
        {activeView === 'admin-portal' && <AdminDashboard />}
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-[#E1ECE3] py-8 text-xs text-[#526458]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#176B3A] flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-sm">KRISHI CONNECT</span>
                <span className="text-[11px] text-gray-500 block">
                  Grow Smart. Sell Better. Earn More.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-center sm:text-left text-[11px]">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> AGMARKNET & data.gov.in Synced
              </span>
              <span>•</span>
              <span>Directorate of Economics & Statistics</span>
              <span>•</span>
              <span>Unified Portal for Agricultural Statistics (UPAg)</span>
              <span>•</span>
              <span>JP Nagar HoReCa Aggregation</span>
            </div>

            <div className="text-[11px] text-gray-400">
              © {new Date().getFullYear()} KRISHI CONNECT. Made for Indian Agriculture.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
