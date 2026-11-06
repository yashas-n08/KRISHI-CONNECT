import { IndianVoiceLanguage } from '../types';

export interface VoiceLanguageMeta {
  code: IndianVoiceLanguage;
  name: string;
  nativeName: string;
  locale: string;
  flag: string;
  welcomeMessage: string;
  suggestedQuestions: { text: string; label: string }[];
}

export const SUPPORTED_VOICE_LANGUAGES: Record<IndianVoiceLanguage, VoiceLanguageMeta> = {
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    locale: 'kn-IN',
    flag: '🟡🔴',
    welcomeMessage: 'ನಮಸ್ಕಾರ! ನಾನು ಆಗ್ರೋವಾಯ್ಸ್ (AgroVoice). ನಿಮ್ಮ ಕೃಷಿ ಸಲಹೆಗಾರ. ಇವತ್ತು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
    suggestedQuestions: [
      { text: 'ನನ್ನ ಟೊಮೆಟೊ ಬೆಳೆ ಬೆಲೆ ಎಷ್ಟು ಇದೆ?', label: 'ಟೊಮೆಟೊ ಬೆಲೆ (Tomato Price)' },
      { text: 'ನನ್ನಲ್ಲಿ 20 ಕ್ವಿಂಟಾಲ್ ಟೊಮೆಟೊ ಇದೆ, ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬೇಕು?', label: 'ಎಲ್ಲಿ ಮಾರಬೇಕು? (Where to Sell)' },
      { text: 'ಯಾವ ಮಂಡಿಯಲ್ಲಿ ಅತ್ಯಧಿಕ ನಿವ್ವಳ ಲಾಭ ಸಿಗುತ್ತದೆ?', label: 'ಹೆಚ್ಚಿನ ಲಾಭದ ಮಂಡಿ (Best Mandi)' },
      { text: 'ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ಈರುಳ್ಳಿ ಬೆಲೆ ಹೇಗಿರುತ್ತದೆ?', label: '7-ದಿನಗಳ ಮುನ್ಸೂಚನೆ (Forecast)' },
      { text: 'ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆ ಬರುತ್ತದೆಯೇ?', label: 'ಹವಾಮಾನ ಮತ್ತು ಮಳೆ (Weather)' },
      { text: 'ಟೊಮೆಟೊ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ, ಏನು ಮಾಡಬೇಕು?', label: 'ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ (Pest Advisory)' },
      { text: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಮುಖಪುಟವನ್ನು ತೋರಿಸಿ', label: 'ಪುಟ ಬದಲಾವಣೆ (Open Forecast)' },
    ],
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    locale: 'hi-IN',
    flag: '🇮🇳',
    welcomeMessage: 'नमस्ते! मैं एग्रोवॉइस (AgroVoice) हूँ। आपका व्यक्तिगत कृषि सलाहकार। आज मैं आपकी क्या मदद कर सकता हूँ?',
    suggestedQuestions: [
      { text: 'आज टमाटर का मंडी भाव क्या है?', label: 'टमाटर का भाव (Tomato Price)' },
      { text: 'मेरे पास 20 क्विंटल टमाटर है, कहाँ बेचना चाहिए?', label: 'कहाँ बेचें (Where to Sell)' },
      { text: 'क्या अगले 7 दिनों में भाव बढ़ेंगे?', label: '7-दिनों का पूर्वानुमान (Forecast)' },
      { text: 'क्या कल बारिश होने की संभावना है?', label: 'मौसम की जानकारी (Weather)' },
      { text: 'टमाटर की पत्तियों में पीलापन क्यों आ रहा है?', label: 'कीट और खाद सलाह (Advisory)' },
      { text: 'मंडी तुलना स्क्रीन खोलें', label: 'नेविगेशन (Open Mandis)' },
    ],
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English (India)',
    locale: 'en-IN',
    flag: '🇮🇳',
    welcomeMessage: "Hello! I'm AgroVoice. Your personal farming assistant. How can I help you today?",
    suggestedQuestions: [
      { text: "What is today's tomato price in Kolar mandi?", label: 'Today Tomato Price' },
      { text: 'I have 20 quintals of tomatoes in Bengaluru Rural. Where should I sell them?', label: 'Best Selling Mandi' },
      { text: 'What is the 7-day price forecast for onions?', label: '7-Day Price Forecast' },
      { text: 'Should I sell my crop today or wait?', label: 'Sell or Hold Advice' },
      { text: 'Will it rain tomorrow in my area?', label: 'Weather & Rain Forecast' },
      { text: 'Why are my crop leaves turning yellow?', label: 'Pest & Fertilizer Advisory' },
      { text: 'Open my farmer dashboard', label: 'Voice Navigation' },
    ],
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    locale: 'te-IN',
    flag: '🇮🇳',
    welcomeMessage: 'నమస్కారం! నేను ఆగ్రోవాయిస్ (AgroVoice). మీ వ్యక్తిగత వ్యవసాయ సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?',
    suggestedQuestions: [
      { text: 'ఈరోజు టమోటా మార్కెట్ ధర ఎంత?', label: 'టమోటా ధర (Tomato Price)' },
      { text: 'నా పంటను ఏ మార్కెట్లో అమ్మితే ఎక్కువ లాభం వస్తుంది?', label: 'ఎక్కడ అమ్మాలి (Where to Sell)' },
      { text: 'రేపు వర్షం పడే అవకాశం ఉందా?', label: 'వాతావరణం (Weather)' },
      { text: 'మార్కెట్ ధరల స్క్రీన్‌ను తెరవండి', label: 'ఓపెన్ మార్కెట్ (Navigate)' },
    ],
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    locale: 'ta-IN',
    flag: '🇮🇳',
    welcomeMessage: 'வணக்கம்! நான் அக்ரோவாய்ஸ் (AgroVoice). உங்கள் தனிப்பட்ட விவசாய உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    suggestedQuestions: [
      { text: 'இன்றைய தக்காளி சந்தை விலை என்ன?', label: 'தக்காளி விலை (Tomato Price)' },
      { text: 'எனது பயிரை எங்கு விற்றால் அதிக லாபம் கிடைக்கும்?', label: 'எங்கு விற்பது (Where to Sell)' },
      { text: 'நாளை மழை பெய்யுமா?', label: 'வானிலை (Weather)' },
    ],
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    locale: 'ml-IN',
    flag: '🇮🇳',
    welcomeMessage: 'നമസ്കാരം! ഞാൻ അഗ്രോവോയ്സ് (AgroVoice). നിങ്ങളുടെ കാർഷിക സഹായി. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?',
    suggestedQuestions: [
      { text: 'ഇന്നത്തെ തക്കാളി വില എത്രയാണ്?', label: 'തക്കാളി വില (Tomato Price)' },
      { text: 'എവിടെ വിറ്റാലാണ് കൂടുതൽ ലാഭം ലഭിക്കുക?', label: 'എവിടെ വിൽക്കണം (Where to Sell)' },
      { text: 'നാളെ മഴ പെയ്യാൻ സാധ്യതയുണ്ടോ?', label: 'കാലാവസ്ഥ (Weather)' },
    ],
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    locale: 'mr-IN',
    flag: '🇮🇳',
    welcomeMessage: 'नमस्कार! मी ऍग्रोव्हॉइस (AgroVoice). आपला वैयक्तिक कृषी सहाय्यक. आज मी आपली काय मदत करू शकतो?',
    suggestedQuestions: [
      { text: 'आजचा टोमॅटोचा बाजारभाव काय आहे?', label: 'टोमॅटो भाव (Tomato Price)' },
      { text: 'मला माझा माल कुठे विकल्यावर जास्त नफा मिळेल?', label: 'कुठे विकावे (Where to Sell)' },
      { text: 'उद्या पाऊस पडणार आहे का?', label: 'हवामान अंदाज (Weather)' },
    ],
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    locale: 'pa-IN',
    flag: '🇮🇳',
    welcomeMessage: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਐਗਰੋਵਾਇਸ (AgroVoice) ਹਾਂ। ਤੁਹਾਡਾ ਨਿੱਜੀ ਖੇਤੀ ਸਲਾਹਕਾਰ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
    suggestedQuestions: [
      { text: 'ਅੱਜ ਟਮਾਟਰ ਦਾ ਮੰਡੀ ਭਾਅ ਕੀ ਹੈ?', label: 'ਟਮਾਟਰ ਭਾਅ (Tomato Price)' },
      { text: 'ਮੈਨੂੰ ਆਪਣੀ ਫਸਲ ਕਿੱਥੇ ਵੇਚਣੀ ਚਾਹੀਦੀ ਹੈ?', label: 'ਕਿੱਥੇ ਵੇਚੀਏ (Where to Sell)' },
      { text: 'ਕੀ ਕੱਲ੍ਹ ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ?', label: 'ਮੌਸਮ (Weather)' },
    ],
  },
};

// Auto-detect language from spoken or typed text
export function detectLanguageFromText(text: string): IndianVoiceLanguage {
  const t = text.trim();
  // Kannada script range: \u0C80-\u0CFF
  if (/[\u0C80-\u0CFF]/.test(t)) return 'kn';
  // Devanagari script (Hindi & Marathi): \u0900-\u097F
  if (/[\u0900-\u097F]/.test(t)) {
    if (t.includes('आहे') || t.includes('नाही') || t.includes('कुठे') || t.includes('भाव')) return 'mr';
    return 'hi';
  }
  // Telugu script: \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(t)) return 'te';
  // Tamil script: \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(t)) return 'ta';
  // Malayalam script: \u0D00-\u0D7F
  if (/[\u0D00-\u0D7F]/.test(t)) return 'ml';
  // Gurmukhi (Punjabi): \u0A00-\u0A7F
  if (/[\u0A00-\u0A7F]/.test(t)) return 'pa';

  return 'en';
}

// Speech Synthesis Manager
class TextToSpeechManager {
  private synth: SpeechSynthesis | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public speak(
    text: string,
    lang: IndianVoiceLanguage,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (this.isMuted || !this.synth) {
      onEnd?.();
      return;
    }

    try {
      this.synth.cancel(); // cancel any active speech

      const locale = SUPPORTED_VOICE_LANGUAGES[lang]?.locale || 'en-IN';
      const cleanText = text.replace(/\[\[NAVIGATE:[^\]]+\]\]/g, '').trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = locale;
      utterance.rate = 0.95; // comfortable cadence for rural farmers
      utterance.pitch = 1.0;

      // Find best available voice
      const voices = this.synth.getVoices();
      const matchingVoice =
        voices.find((v) => v.lang.toLowerCase() === locale.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase())) ||
        voices.find((v) => v.lang.includes('IN')) ||
        voices[0];

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        onError?.(e);
        onEnd?.();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      onEnd?.();
    }
  }
}

export const ttsManager = new TextToSpeechManager();
