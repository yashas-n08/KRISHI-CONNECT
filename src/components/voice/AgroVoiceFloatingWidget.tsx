import React from 'react';
import { Mic, Sparkles, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_VOICE_LANGUAGES } from '../../services/voiceService';

export const AgroVoiceFloatingWidget: React.FC = () => {
  const { voiceLanguage, isVoiceModalOpen, setIsVoiceModalOpen } = useApp();

  if (isVoiceModalOpen) return null;

  const currentLangMeta = SUPPORTED_VOICE_LANGUAGES[voiceLanguage] || SUPPORTED_VOICE_LANGUAGES.kn;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3">
      {/* Tooltip prompt bubble */}
      <div
        onClick={() => setIsVoiceModalOpen(true)}
        className="hidden sm:flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-100 cursor-pointer hover:bg-emerald-50/50 transition-all group"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-xs font-bold text-gray-800">
          AgroVoice: <span className="text-[#176B3A] font-extrabold">{currentLangMeta.nativeName}</span> ದಲ್ಲಿ ಮಾತನಾಡಿ
        </span>
        <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
      </div>

      {/* Floating Animated Mic Button */}
      <div className="relative">
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none" />
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="relative w-15 h-15 rounded-full bg-gradient-to-tr from-[#176B3A] via-[#1E7C44] to-[#2E9B58] text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-950/25 hover:scale-105 active:scale-95 transition-all group border-2 border-white"
          title="Open AgroVoice AI Voice Assistant"
        >
          <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter mt-0.5">Voice</span>
        </button>
      </div>
    </div>
  );
};
