"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { PasswordInput } from "./ui/password-input"
import { Card } from "./ui/card"
import { Label } from "./ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Shield, Key, Lock } from "lucide-react"
import api from "../api";

export function LoginPage({ onLogin, onOtpVerified }) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()
  const otpInputRefs = Array(6)
    .fill(0)
    .map(() => React.createRef())

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      otpInputRefs[index + 1].current.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (step === 1) {
        const response = await api.post("/auth/login", formData);
        console.log("Login Step 1 Success:", response.data);
        setUserId(response.data.userId);
        setStep(2);

        setTimeout(() => {
          if (otpInputRefs[0]?.current) {
            otpInputRefs[0].current.focus();
          }
        }, 100);
      } else {
        const otpCode = otp.join("");
        const response = await api.post("/auth/verify-login-otp", {
          userId: userId,
          otp: otpCode,
        });

        console.log("Full OTP Verification Response:", {
          status: response.status,
          data: response.data,
          headers: response.headers
        });

        if (response.data?.error === 'EmailNotVerified') {
          setError("Please verify your email first");
          setStep(1); // Return to login form
          return;
        }

        if (response.data?.token) {
          console.log("Token received - Storing in localStorage and updating state");
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log("LocalStorage authToken:", localStorage.getItem('authToken'));
          console.log("LocalStorage user:", localStorage.getItem('user'));
          onOtpVerified();
          console.log("Navigation to dashboard initiated");
          // Force full page reload to ensure all auth state is initialized
          window.location.href = "/dashboard";
        } else {
          console.error("No token in response", response.data);
          setError(response.data?.message || "OTP verification failed");
          // Reset OTP fields
          setOtp(["", "", "", "", "", ""]);
          if (otpInputRefs[0]?.current) {
            otpInputRefs[0].current.focus();
          }
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorResponse = err.response?.data;
      
      // Handle network errors or server down
      if (!errorResponse) {
        setError("Network error. Please check your connection.");
        return;
      }
      
      // Handle specific error cases from backend
      switch(errorResponse.error) {
        case 'EmailNotVerified':
          setError(errorResponse.message || 'Please verify your email first.');
          break;
        case 'InvalidCredentials':
          setError(errorResponse.message || 'Invalid email or password.');
          break;
        default:
          setError(errorResponse.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
      <div className="absolute inset-0 pointer-events-none">
        <Key className="absolute top-20 left-20 w-32 h-32 text-white/10 rotate-45" />
        <Lock className="absolute bottom-20 right-20 w-32 h-32 text-white/10 -rotate-12" />
        <Shield className="absolute top-1/2 left-1/3 w-40 h-40 text-white/10" />
      </div>

      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-6 backdrop-blur-sm bg-white/95 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-sm text-muted-foreground mt-2">Sign in to access your account</p>
              </div>

              {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="abc@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border-purple-100 focus:border-purple-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <PasswordInput
                          placeholder="Enter your password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border-purple-100 focus:border-purple-300"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2 text-sm">
                            <input type="checkbox" className="rounded border-purple-200" />
                            <span className="text-muted-foreground">Remember me</span>
                          </label>
                          <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                            Forgot password?
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <div className="flex justify-center">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              {[0, 1, 2].map((index) => (
                                <input
                                  key={index}
                                  ref={otpInputRefs[index]}
                                  type="text"
                                  maxLength={1}
                                  value={otp[index]}
                                  onChange={(e) => handleOtpChange(index, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                  className="h-10 w-10 text-center text-base font-medium shadow-sm border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50 text-gray-900"
                                />
                              ))}
                            </div>
                            <div className="flex items-center text-muted-foreground">-</div>
                            <div className="flex items-center gap-2">
                              {[3, 4, 5].map((index) => (
                                <input
                                  key={index}
                                  ref={otpInputRefs[index]}
                                  type="text"
                                  maxLength={1}
                                  value={otp[index]}
                                  onChange={(e) => handleOtpChange(index, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                  className="h-10 w-10 text-center text-base font-medium shadow-sm border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50 text-gray-900"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Didn't receive the code?{" "}
                        <button type="button" className="text-purple-600 hover:text-purple-700">
                          Resend
                        </button>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={loading || (step === 2 && otp.some((digit) => !digit))}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                >
                  {loading ? "Processing..." : step === 1 ? "Next" : "Sign In"}
                </Button>
              </form>

              {step === 1 && (
                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-purple-600 hover:text-purple-700">
                      Sign up
                    </Link>
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
