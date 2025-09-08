import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OAuthButton from './OAuthButton';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const { signup, verifiedEmail } = useAuth();
  const navigate = useNavigate();

  // Pre-fill email if verified
  React.useEffect(() => {
    if (verifiedEmail) {
      setFormData(prev => ({ ...prev, email: verifiedEmail }));
    }
  }, [verifiedEmail]);

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new Error('Please enter your full name');
    }
    
    if (!formData.email.trim()) {
      throw new Error('Please enter your email address');
    }
    
    if (!formData.password) {
      throw new Error('Please enter a password');
    }
    
    if (formData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      validateForm();
      setIsLoading(true);
      setMessage({ text: '', type: '' });
      
      await signup(formData.name, formData.email, formData.password);
      
      showMessage('Account created successfully! Welcome!', 'success');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      showMessage(error.message);
      
      // If signup failed due to email not being verified, suggest verification
      if (error.message.includes('verify') || error.message.includes('email')) {
        setTimeout(() => {
          showMessage(error.message + ' Please verify your email first.', 'error');
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const isPasswordMismatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Fill in your details to complete registration
          </p>
        </div>

        {/* Main Card */}
        <div className="card animate-slide-up">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                  {verifiedEmail && (
                    <span className="text-green-600 text-sm ml-2 font-normal">
                      ✓ Verified
                    </span>
                  )}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`form-input ${verifiedEmail ? 'bg-green-50 border-green-300' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!!verifiedEmail}
                />
                {!verifiedEmail && (
                  <p className="mt-2 text-sm text-orange-600">
                    ⚠️ Email not verified.{' '}
                    <Link to="/verify-email" className="text-blue-600 hover:underline font-medium">
                      Verify now
                    </Link>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="form-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Password should be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`form-input ${
                    isPasswordMatch ? 'border-green-300 bg-green-50' : 
                    isPasswordMismatch ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {isPasswordMismatch && (
                  <p className="mt-1 text-sm text-red-600">
                    Passwords do not match
                  </p>
                )}
                {isPasswordMatch && (
                  <p className="mt-1 text-sm text-green-600">
                    ✓ Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || isPasswordMismatch}
                className="w-full btn-primary"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

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

export default Signup;
