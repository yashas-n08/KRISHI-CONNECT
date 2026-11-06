import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Leaf,
  Phone,
  ShieldCheck,
  Store,
  Tractor,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { loginUser, language, t } = useApp();

  const [step, setStep] = useState<'details' | 'otp' | 'role'>('details');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [errorMessage, setErrorMessage] = useState('');

  const DEMO_OTP = '8492';

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMessage(language === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMessage('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== DEMO_OTP && otpCode.length !== 4) {
      setErrorMessage(language === 'kn' ? 'ತಪ್ಪಾದ OTP. ಡೆಮೊ OTP 8492 ಬಳಸಿ.' : 'Invalid OTP. Please enter demo OTP: 8492');
      return;
    }
    setErrorMessage('');
    setStep('role');
  };

  const handleCompleteRegistration = () => {
    loginUser(fullName || (selectedRole === 'farmer' ? 'Ramesh Gowda' : selectedRole === 'hotel' ? 'Chef Ananya Rao' : 'Dr. Suresh Patil'), mobileNumber, selectedRole);
  };

  const handleQuickDemoFill = (role: UserRole) => {
    if (role === 'farmer') {
      setFullName('Ramesh Gowda');
      setMobileNumber('9845012345');
      setSelectedRole('farmer');
    } else if (role === 'hotel') {
      setFullName('Chef Ananya Rao');
      setMobileNumber('9845098765');
      setSelectedRole('hotel');
    } else {
      setFullName('Dr. Suresh Patil');
      setMobileNumber('9448055667');
      setSelectedRole('admin');
    }
    loginUser(
      role === 'farmer' ? 'Ramesh Gowda' : role === 'hotel' ? 'Chef Ananya Rao' : 'Dr. Suresh Patil',
      role === 'farmer' ? '9845012345' : role === 'hotel' ? '9845098765' : '9448055667',
      role
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#176B3A] to-[#258548] p-6 text-white text-center relative">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">{t.appTitle}</h2>
          <p className="text-xs text-emerald-100 mt-1 font-medium">{t.tagline}</p>
        </div>

        <div className="p-6">
          {/* STEP 1: Phone & Name input */}
          {step === 'details' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.nameLabel} <span className="text-gray-400 font-normal">({language === 'kn' ? 'ಐಚ್ಛಿಕ' : 'optional'})</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A] outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.phoneLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-2.5 flex items-center space-x-1 text-sm font-semibold text-gray-600 border-r border-gray-200 pr-2">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9845012345"
                    className="w-full pl-22 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold tracking-wider focus:bg-white focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A] outline-hidden transition-all"
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  {language === 'kn'
                    ? 'ಯಾವುದೇ ಇಮೇಲ್ ಅಥವಾ ಸಂಕೀರ್ಣ ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ.'
                    : 'No email or complicated registration needed. Simple mobile OTP access.'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#176B3A] hover:bg-[#12582f] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.getOtp}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Fill Buttons */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">
                  Instant Demo Login (Single Click)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('farmer')}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center text-xs font-semibold text-emerald-800 transition-colors"
                  >
                    <Tractor className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    Farmer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('hotel')}
                    className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-center text-xs font-semibold text-amber-800 transition-colors"
                  >
                    <Store className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    Hotel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('admin')}
                    className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-center text-xs font-semibold text-blue-800 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    Admin
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: Mobile OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <p className="font-semibold">{t.demoNotice}</p>
                <p className="mt-0.5 text-[11px]">
                  {language === 'kn'
                    ? 'ಡೆಮೊ ಕೋಡ್: 8492 ಅನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ತ್ವರಿತ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.'
                    : 'Use standard demo OTP code: 8492 to verify instantly.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.enterOtp}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="8492"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold tracking-widest text-center focus:bg-white focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A] outline-hidden transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOtpCode(DEMO_OTP)}
                className="text-xs text-[#176B3A] font-semibold hover:underline block text-center w-full"
              >
                Autofill Demo OTP (8492)
              </button>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-1/3 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-[#176B3A] hover:bg-[#12582f] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>{t.verifyOtp}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Role Selection */}
          {step === 'role' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-900">{t.selectRole}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {language === 'kn'
                    ? 'ಪ್ರತಿಯೊಂದು ಪಾತ್ರಕ್ಕೂ ವಿಶೇಷವಾದ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲಭ್ಯವಿದೆ.'
                    : 'Each role provides a tailored dashboard and feature set.'}
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Farmer */}
                <div
                  onClick={() => setSelectedRole('farmer')}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-start space-x-3 ${
                    selectedRole === 'farmer'
                      ? 'border-[#176B3A] bg-[#F3F8F3] ring-1 ring-[#176B3A]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-0.5">
                    <Tractor className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900">{t.farmerRole}</span>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{t.farmerDesc}</p>
                  </div>
                </div>

                {/* Hotel */}
                <div
                  onClick={() => setSelectedRole('hotel')}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-start space-x-3 ${
                    selectedRole === 'hotel'
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900">{t.hotelRole}</span>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{t.hotelDesc}</p>
                  </div>
                </div>

                {/* Administrator */}
                <div
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-start space-x-3 ${
                    selectedRole === 'admin'
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="p-2 bg-blue-100 text-blue-800 rounded-lg shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900">{t.adminRole}</span>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{t.adminDesc}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompleteRegistration}
                className="w-full py-3 bg-[#176B3A] hover:bg-[#12582f] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
