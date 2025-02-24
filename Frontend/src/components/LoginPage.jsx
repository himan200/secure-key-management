import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Shield, Key, Lock } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

export function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (step === 1) {
        setStep(2) // Move to OTP step
      } else {
        console.log("Login successful", { ...formData, otp })
        navigate("/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
      {/* Decorative Elements */}
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
                          <Input
                            id="password"
                            name="password"
                            type="password"
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
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={setOtp}
                          render={({ slots }) => (
                            <InputOTPGroup>
                              {slots && (
                                <>
                                  <InputOTPGroup>
                                    {slots.slice(0, 3).map((slot, index) => (
                                      <InputOTPSlot key={index} {...slot} />
                                    ))}
                                  </InputOTPGroup>
                                  <InputOTPSeparator />
                                  <InputOTPGroup>
                                    {slots.slice(3).map((slot, index) => (
                                      <InputOTPSlot key={index + 3} {...slot} />
                                    ))}
                                  </InputOTPGroup>
                                </>
                              )}
                            </InputOTPGroup>
                          )}
                        />
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
                  disabled={loading}
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
