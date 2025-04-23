"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "./Navbar"
import  api  from "../services/api"
import { Shield, Key, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react"

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const hasVerified = useRef(false);


  useEffect(() => {
    const token = searchParams.get("token")

    if (!token || hasVerified.current) return;

  hasVerified.current = true; // Prevents multiple verifications

    const verify = async () => {
      console.log("Verifying email with token:", token);
      if (!token) {
        setStatus("error")
        setMessage("Token is missing in the URL.")
        return
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        console.log("Verification response:", res);

        setStatus("success")
        setMessage(res.data.message || "Email verified successfully!")

        // Optional: Redirect after 3 seconds
        setTimeout(() => navigate("/login"), 3000)
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error")
        setMessage(err.response?.data?.message || "Verification failed. Token might be invalid or expired.")
      }
    }

    verify()
  }, [searchParams, navigate])

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
                  Email Verification
                </h1>
              </div>

              <div className="flex flex-col items-center justify-center py-8">
                {status === "loading" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <Loader2 className="h-16 w-16 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">Verifying your email address...</p>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="bg-green-100 p-3 rounded-full inline-flex mb-4">
                      <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Verification Successful!</h2>
                    <p className="text-muted-foreground mb-6">{message}</p>
                    <div className="relative pt-4">
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3 }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Redirecting to login page...</p>
                    </div>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
                      <XCircle className="h-16 w-16 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
                    <p className="text-muted-foreground mb-6">{message}</p>
                    <Button
                      onClick={() => navigate("/login")}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                    >
                      Back to Login
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail

