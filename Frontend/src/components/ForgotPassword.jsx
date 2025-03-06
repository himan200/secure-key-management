"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Shield, Key, Lock, ArrowLeft, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      setSuccess(true)
    } catch (err) {
      console.error("Forgot password error:", err)
      setError(err.message || "An error occurred. Please try again.")
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
                  Forgot Password
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
                  <p className="text-muted-foreground mb-6">
                    We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
                  </p>
                  <Link to="/login" className="text-purple-600 hover:text-purple-700 flex items-center justify-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="abc@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-purple-100 focus:border-purple-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                  >
                    {loading ? "Processing..." : "Send Reset Link"}
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-purple-600 hover:text-purple-700 flex items-center justify-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

