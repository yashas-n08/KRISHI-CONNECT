import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Globe,
  HelpCircle,
  Languages,
  Mic,
  MicOff,
  Navigation,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  detectLanguageFromText,
  SUPPORTED_VOICE_LANGUAGES,
  ttsManager,
} from '../../services/voiceService';
import { AgroVoiceMessage, IndianVoiceLanguage, VoiceAssistantStatus } from '../../types';

export const AgroVoiceModal: React.FC = () => {
  const {
    currentUser,
    voiceLanguage,
    setVoiceLanguage,
    voiceMessages,
    addVoiceMessage,
    clearVoiceHistory,
    isVoiceMuted,
    setIsVoiceMuted,
    setActiveView,
    isVoiceModalOpen,
    setIsVoiceModalOpen,
  } = useApp();

  const [status, setStatus] = useState<VoiceAssistantStatus>('idle');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(true);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [voiceMessages, interimTranscript, status]);

  // Sync mute state with TTS manager
  useEffect(() => {
    ttsManager.setMuted(isVoiceMuted);
  }, [isVoiceMuted]);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechRecognitionSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = SUPPORTED_VOICE_LANGUAGES[voiceLanguage]?.locale || 'kn-IN';

      recognition.onstart = () => {
        setStatus('listening');
        setMicPermissionError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interim || final);

        if (final) {
          handleUserQuery(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicPermissionError('Microphone permission was denied. Please allow microphone access or type your query below.');
        } else if (event.error === 'no-speech') {
          // If no speech detected, return to ready
          setStatus('ready');
        } else {
          setStatus('idle');
        }
      };

      recognition.onend = () => {
        if (status === 'listening') {
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition initialization error:', err);
      setIsSpeechRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      ttsManager.stop();
    };
  }, [voiceLanguage]);

  // Toggle voice listening
  const handleToggleListening = () => {
    if (status === 'listening') {
      recognitionRef.current?.stop();
      setStatus('idle');
      return;
    }

    ttsManager.stop();
    setMicPermissionError(null);
    setInterimTranscript('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = SUPPORTED_VOICE_LANGUAGES[voiceLanguage]?.locale || 'kn-IN';
        recognitionRef.current.start();
        setStatus('listening');
      } catch (e: any) {
        // Recognition might already be active
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setStatus('listening');
          }, 150);
        } catch (err) {
          console.warn('Recognition start error:', err);
        }
      }
    } else {
      setMicPermissionError('Speech recognition is not supported in this browser. Please use text input or click the suggestions below.');
      setInputMode('text');
    }
  };

  // Process farmer's question (from speech or text)
  const handleUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    // Detect language if possible
    const detectedLang = detectLanguageFromText(queryText);
    const targetLang = detectedLang !== 'en' ? detectedLang : voiceLanguage;
    if (detectedLang !== 'en' && detectedLang !== voiceLanguage) {
      setVoiceLanguage(detectedLang);
    }

    // Add user message to state
    addVoiceMessage({
      sender: 'farmer',
      text: queryText,
      language: targetLang,
      category: 'general',
    });

    setInterimTranscript('');
    setStatus('understanding');

    try {
      // Step 2: "Finding agricultural information..."
      setTimeout(() => setStatus('searching'), 350);

      const response = await fetch('/api/agrovoice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: targetLang,
          farmerProfile: {
            name: currentUser.name,
            location: currentUser.location,
            landSizeAcres: currentUser.landSizeAcres || 3.5,
          },
        }),
      });

      const data = await response.json();
      const reply = data.reply || 'I found the agricultural details for you.';
      const navView = data.targetView;

      // Add AgroVoice response to chat
      addVoiceMessage({
        sender: 'agrovoice',
        text: reply,
        language: targetLang,
        targetView: navView,
        category: navView ? 'navigation' : 'advisory',
      });

      // Voice response with natural TTS
      setStatus('speaking');
      ttsManager.speak(
        reply,
        targetLang,
        () => setStatus('speaking'),
        () => setStatus('ready'),
        () => setStatus('ready')
      );

      // If navigation requested, switch view smoothly
      if (navView) {
        setTimeout(() => {
          setActiveView(navView as any);
        }, 1200);
      }
    } catch (err) {
      console.error('Error fetching AgroVoice response:', err);
      const fallbackReply =
        targetLang === 'kn'
          ? 'ಕೋಲಾರ ಮಂಡಿಯಲ್ಲಿ ಇಂದಿನ ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹2,150 ಆಗಿದೆ. ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ಬೆಲೆ ಏರಿಕೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ.'
          : "Today's tomato modal price at Kolar APMC is ₹2,150/quintal. Prices are forecasted to rise over the next 7 days.";

      addVoiceMessage({
        sender: 'agrovoice',
        text: fallbackReply,
        language: targetLang,
      });

      setStatus('speaking');
      ttsManager.speak(
        fallbackReply,
        targetLang,
        () => setStatus('speaking'),
        () => setStatus('ready')
      );
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const text = manualInput;
    setManualInput('');
    handleUserQuery(text);
  };

  const handleSpeakExistingMessage = (text: string, lang: IndianVoiceLanguage) => {
    ttsManager.stop();
    setStatus('speaking');
    ttsManager.speak(
      text,
      lang,
      () => setStatus('speaking'),
      () => setStatus('ready')
    );
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return 'Listening to your question... (ನೀವು ಮಾತನಾಡಬಹುದು)';
      case 'understanding':
        return 'Understanding your request...';
      case 'searching':
        return 'Finding agricultural information from Agmarknet & AI Engine...';
      case 'speaking':
        return 'AgroVoice is responding...';
      case 'ready':
        return 'You can speak now. (ಮತ್ತೆ ಮಾತನಾಡಲು ಮೈಕ್ರೋಫೋನ್ ಒತ್ತಿರಿ)';
      case 'idle':
      default:
        return 'Tap the microphone to speak.';
    }
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[92vh] max-h-[820px] bg-white rounded-3xl shadow-2xl border border-emerald-900/20 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#176B3A] via-[#1E7C44] to-[#12582E] px-5 py-3.5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <BrainCircuit className="w-5 h-5 text-emerald-200" />
              </div>
              {status === 'listening' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">AgroVoice</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-400/25 text-emerald-100 rounded-full border border-emerald-300/30">
                  Multilingual AI Assistant
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 font-medium hidden sm:block">
                Natural 2-Way Voice Support for Indian Farmers
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-200" />
                <span>{SUPPORTED_VOICE_LANGUAGES[voiceLanguage]?.nativeName}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Voice Language
                  </div>
                  {Object.values(SUPPORTED_VOICE_LANGUAGES).map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setVoiceLanguage(l.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        voiceLanguage === l.code
                          ? 'bg-emerald-50 text-[#176B3A] font-bold'
                          : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mute/Unmute toggle */}
            <button
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className={`p-2 rounded-xl border transition-colors ${
                isVoiceMuted
                  ? 'bg-red-500/30 border-red-300 text-red-200'
                  : 'bg-white/15 border-white/20 text-white hover:bg-white/25'
              }`}
              title={isVoiceMuted ? 'Voice Muted (Click to Unmute)' : 'Voice Audio Active (Click to Mute)'}
            >
              {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Clear History */}
            <button
              onClick={clearVoiceHistory}
              className="p-2 bg-white/15 border border-white/20 hover:bg-white/25 rounded-xl text-white transition-colors"
              title="Clear Conversation History"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              onClick={() => {
                ttsManager.stop();
                if (status === 'listening') recognitionRef.current?.stop();
                setIsVoiceModalOpen(false);
              }}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
              title="Close Voice Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Left Conversation History & Right Voice Control Center */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#F8FAF8]">
          {/* Transcript / Conversation History (Scrollable) */}
          <div className="flex-1 flex flex-col overflow-hidden border-b md:border-b-0 md:border-r border-[#E1ECE3]">
            <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#176B3A]" />
                Live Conversation Transcript
              </span>
              <span className="text-[11px] text-gray-400">
                {voiceMessages.length} messages
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {voiceMessages.map((msg) => {
                const isFarmer = msg.sender === 'farmer';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isFarmer ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs transition-all ${
                        isFarmer
                          ? 'bg-[#176B3A] text-white rounded-br-xs'
                          : 'bg-white border border-[#D5E5D8] text-gray-800 rounded-bl-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75">
                        <span className="font-bold">
                          {isFarmer ? `${currentUser.name} (ರೈತ)` : 'AgroVoice AI'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {msg.targetView && (
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-[#176B3A]">
                          <span className="flex items-center gap-1">
                            <Navigation className="w-3 h-3" /> Navigated to: {msg.targetView}
                          </span>
                          <button
                            onClick={() => {
                              setActiveView(msg.targetView as any);
                              setIsVoiceModalOpen(false);
                            }}
                            className="underline text-[10px] hover:text-[#12582f]"
                          >
                            Open Screen
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Audio repeat button for AI responses */}
                    {!isFarmer && (
                      <button
                        onClick={() => handleSpeakExistingMessage(msg.text, msg.language)}
                        className="mt-1 flex items-center space-x-1 text-[10px] font-semibold text-gray-500 hover:text-[#176B3A] px-2 py-0.5 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen Again</span>
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Interim Live Speech Transcript (while user is actively speaking) */}
              {interimTranscript && (
                <div className="flex flex-col items-end animate-pulse">
                  <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-emerald-700/80 text-white text-xs italic">
                    <span className="text-[10px] block font-bold text-emerald-200">Listening live...</span>
                    "{interimTranscript}"
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Agricultural Voice Command Suggestions Strip */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Quick Farmer Voice Queries (Click or Speak aloud):
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {SUPPORTED_VOICE_LANGUAGES[voiceLanguage]?.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUserQuery(q.text)}
                    className="px-3 py-1.5 rounded-xl bg-[#F3F8F3] hover:bg-[#E1ECE3] border border-[#D5E5D8] text-[11px] font-semibold text-[#176B3A] whitespace-nowrap transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input Alternate Bar */}
            <form onSubmit={handleManualSubmit} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder={
                  voiceLanguage === 'kn'
                    ? 'ಇಲ್ಲಿ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ ಅಥವಾ ಮೈಕ್ರೋಫೋನ್ ಬಳಸಿ ಮಾತನಾಡಿ...'
                    : 'Type agricultural query or tap the microphone to speak...'
                }
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A] outline-hidden transition-all"
              />
              <button
                type="submit"
                disabled={!manualInput.trim()}
                className="p-2 bg-[#176B3A] hover:bg-[#12582f] text-white rounded-xl disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Voice Center: Microphone, Sound Waves, Status */}
          <div className="w-full md:w-88 p-6 flex flex-col items-center justify-between bg-gradient-to-b from-white to-[#F3F8F3] shrink-0">
            {/* Top Status & Language Tag */}
            <div className="w-full text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DFF1E3] text-[#176B3A] border border-[#BCDDC4]">
                <Globe className="w-3.5 h-3.5" />
                <span>Language: {SUPPORTED_VOICE_LANGUAGES[voiceLanguage]?.name} ({SUPPORTED_VOICE_LANGUAGES[voiceLanguage]?.nativeName})</span>
              </div>
              <h3 className="text-sm font-black text-gray-900 mt-3 leading-snug">
                {getStatusText()}
              </h3>
            </div>

            {/* Animated Microphone & Sound Waves Circle */}
            <div className="relative my-6 flex items-center justify-center">
              {/* Outer Pulsing Wave Rings */}
              {status === 'listening' && (
                <>
                  <div className="absolute w-44 h-44 rounded-full bg-red-400/20 animate-ping" />
                  <div className="absolute w-36 h-36 rounded-full bg-red-500/25 animate-pulse" />
                </>
              )}

              {status === 'speaking' && (
                <>
                  <div className="absolute w-44 h-44 rounded-full bg-emerald-400/20 animate-ping" />
                  <div className="absolute w-36 h-36 rounded-full bg-emerald-500/25 animate-pulse" />
                </>
              )}

              {/* Large Circular Microphone Button */}
              <button
                onClick={handleToggleListening}
                className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 ${
                  status === 'listening'
                    ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/50 scale-105'
                    : status === 'speaking'
                    ? 'bg-gradient-to-br from-teal-500 to-[#176B3A] shadow-emerald-500/50'
                    : 'bg-gradient-to-br from-[#176B3A] to-[#258548] hover:from-[#135A31] hover:to-[#1B7742] shadow-emerald-900/30'
                }`}
                title="Click to Start / Stop Speaking"
              >
                {status === 'listening' ? (
                  <>
                    <MicOff className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Tap to Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Tap to Speak</span>
                  </>
                )}
              </button>
            </div>

            {/* Animated Sound Waveform Bars */}
            <div className="w-full bg-white p-3.5 rounded-2xl border border-[#D5E5D8] text-center shadow-xs">
              <div className="flex items-center justify-center space-x-1.5 h-9 mb-1.5">
                {[40, 75, 55, 90, 60, 85, 45, 100, 70, 50, 80, 65, 95, 40].map((h, i) => {
                  const isActive = status === 'listening' || status === 'speaking';
                  const dynamicHeight = isActive ? `${Math.max(15, (h * (status === 'listening' ? 1 : 0.85)))}%` : '20%';
                  return (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-200 ${
                        status === 'listening'
                          ? 'bg-red-500 animate-pulse'
                          : status === 'speaking'
                          ? 'bg-[#176B3A] animate-pulse'
                          : 'bg-gray-200'
                      }`}
                      style={{ height: dynamicHeight }}
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {status === 'listening'
                  ? 'Listening to spoken voice...'
                  : status === 'speaking'
                  ? 'Voice Synthesizer Active'
                  : 'Speak naturally in Kannada, Hindi, or English'}
              </p>
            </div>

            {/* Error or Help Alert */}
            {micPermissionError && (
              <div className="w-full mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-left text-[11px] text-amber-900 flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{micPermissionError}</span>
              </div>
            )}

            {/* Privacy & Security Note */}
            <div className="mt-4 text-center">
              <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Privacy Protected: Audio is never recorded in the background.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
