import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OAuthButton from './OAuthButton';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'otp', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const { requestOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await requestOTP(email);
      setStep('otp');
      showMessage('Verification code sent to your email!', 'success');
    } catch (error) {
      showMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      showMessage('Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await verifyOTP(email, otp);
      setStep('success');
      showMessage('Email verified successfully!', 'success');
    } catch (error) {
      showMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await requestOTP(email);
      showMessage('Verification code sent again!', 'success');
      setOtp('');
    } catch (error) {
      showMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) {
      setOtp(value);
      // Auto-submit when 6 digits are entered
      if (value.length === 6) {
        setTimeout(() => {
          document.getElementById('verify-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }, 100);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600">
            Please verify your email address to continue with signup
          </p>
        </div>

        {/* Main Card */}
        <div className="card animate-slide-up">
          <div className="card-body">
            {/* Email Step */}
            {step === 'email' && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {/* OTP Step */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="font-semibold text-gray-900">{email}</p>
                </div>
                
                <form id="verify-form" onSubmit={handleVerifyOTP} className="space-y-6">
                  <div>
                    <label htmlFor="otp" className="form-label text-center block">
                      Verification Code
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      maxLength="6"
                      required
                      className="form-input text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      value={otp}
                      onChange={handleOtpChange}
                      autoComplete="one-time-code"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="w-full btn-primary"
                    >
                      {isLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="w-full btn-secondary"
                    >
                      {isLoading ? 'Sending...' : 'Resend Code'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="text-center space-y-6">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce-subtle">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Email Verified Successfully!
                  </h3>
                  <p className="text-gray-600">
                    You can now proceed to create your account.
                  </p>
                </div>
                
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full btn-primary"
                >
                  Continue to Signup
                </button>
              </div>
            )}

            {/* Error/Success Messages */}
            {message.text && (
              <div className={`mt-4 ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* OAuth Section */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          
          <OAuthButton 
            provider="Google" 
            text="Sign up with Google" 
            disabled={true}
          />
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
