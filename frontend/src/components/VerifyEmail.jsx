import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import OAuthButton from "./OAuthButton";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // 'email', 'otp', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [resendTimer, setResendTimer] = useState(0);

  const { requestOTP, verifyOTP, verifiedEmail } = useAuth();
  const navigate = useNavigate();

  // Check for existing verification on component mount
  useEffect(() => {
    if (verifiedEmail) {
      setEmail(verifiedEmail);
      setStep("success");
      showMessage("Email already verified!", "success");
    }
  }, [verifiedEmail]);

  // Timer effect for resend countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const startResendTimer = () => {
    setResendTimer(60); // 60 seconds countdown
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await requestOTP(email);
      setStep("otp");
      startResendTimer(); // Start the 60-second timer
      showMessage("Verification code sent to your email!", "success");
    } catch (error) {
      showMessage(error.message);
      // If user already exists, suggest login
      if (error.message.includes("already exists")) {
        setTimeout(() => {
          setMessage({
            text: error.message,
            type: "error",
          });
        }, 8000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      showMessage("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await verifyOTP(email, otp);
      setStep("success");
      showMessage("Email verified successfully!", "success");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return; // Prevent resend if timer is active

    setIsLoading(true);
    try {
      await requestOTP(email);
      startResendTimer(); // Start timer again
      showMessage("Verification code sent again!", "success");
      setOtp("");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setOtp(value);
      // Auto-submit when 6 digits are entered
      if (value.length === 6) {
        setTimeout(() => {
          document
            .getElementById("verify-form")
            .dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
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
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
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
            {step === "email" && (
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
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="font-semibold text-gray-900">{email}</p>
                </div>

                <form
                  id="verify-form"
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  <div>
                    <label
                      htmlFor="otp"
                      className="form-label text-center block"
                    >
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

                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full btn-primary"
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </button>
                </form>

                {/* Professional Resend Section */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {resendTimer > 0 ? (
                        <span className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-blue-500 animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Resend in {resendTimer}s</span>
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          Didn't receive the code?
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading || resendTimer > 0}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        resendTimer > 0 || isLoading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="w-4 h-4 mr-2 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Resend Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Step */}
            {step === "success" && (
              <div className="text-center space-y-6">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce-subtle">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
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
                  onClick={() => navigate("/signup")}
                  className="w-full btn-primary"
                >
                  Continue to Signup
                </button>
              </div>
            )}

            {/* Error/Success Messages */}
            {message.text && (
              <div
                className={`mt-4 ${
                  message.type === "error" ? "alert-error" : "alert-success"
                }`}
              >
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
