"use client"

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { generateOtp, verifyOtpAndLogin, clearAuthError } from '@/app/store/features/auth/authSlice';
import { X, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  
  const dispatch = useAppDispatch();
  const { status, error, user } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      toast.success('Logged in successfully!');
      onClose();
    }
  }, [user, onClose]);

  const handleGenerateOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    const result = await dispatch(generateOtp({ mobileNumber, role: 'customer' }));
    if (generateOtp.fulfilled.match(result)) {
      setStep(2);
      toast.success(`OTP sent to ${mobileNumber}`);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error('Please enter the 4-digit OTP.');
      return;
    }
    await dispatch(verifyOtpAndLogin({ mobileNumber, otp }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMobileNumber(value);
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setOtp(value);
  }

  const goBack = () => {
    setStep(1);
    setOtp('');
    dispatch(clearAuthError());
  }

  const isLoading = status === 'loading';

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col
                   animate-in fade-in-0 zoom-in-95 duration-300"
      >
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8">
          {step === 1 && (
            <form onSubmit={handleGenerateOtp} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Login or Signup</h2>
                <p className="mt-2 text-neutral-500">Enter your mobile number to get an OTP.</p>
              </div>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="10-digit mobile number"
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  maxLength={10}
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              {error && <p className="flex items-center justify-center gap-2 text-red-500 text-sm"><AlertCircle size={16} /> {error}</p>}
              
              <button
                  type="submit"
                  className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold flex items-center justify-center h-12 hover:bg-red-600 transition-colors disabled:bg-red-300"
                  disabled={isLoading || mobileNumber.length !== 10}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
               <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
                <p className="mt-2 text-neutral-500">
                  Enter the OTP sent to <span className="font-semibold text-gray-700">{mobileNumber}</span>.
                </p>
              </div>
              
              <div className="relative">
                  <input
                    type="tel" 
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder=" "
                    className="w-full p-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-red-500"
                    maxLength={4}
                    required
                    disabled={isLoading}
                    autoFocus
                  />
              </div>

              {error && <p className="flex items-center justify-center gap-2 text-red-500 text-sm"><AlertCircle size={16} /> {error}</p>}

              <button
                  type="submit"
                  className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold flex items-center justify-center h-12 hover:bg-red-600 transition-colors disabled:bg-red-300"
                  disabled={isLoading || otp.length !== 4}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
              </button>
              <button type="button" onClick={goBack} className="w-full text-center text-sm text-gray-500 hover:underline" disabled={isLoading}>
                  Change Number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}