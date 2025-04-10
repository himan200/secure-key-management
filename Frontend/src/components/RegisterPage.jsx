"use client"

import { useState } from "react"
import { toast } from 'react-hot-toast'
import api from '../api'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { PasswordInput } from "./ui/password-input"
import { Card } from "./ui/card"
import { Label } from "./ui/label"
import { Link } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Shield, Key, Lock } from 'lucide-react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { z } from "zod"

const steps = [
  {
    id: 1,
    name: "Personal Info",
    fields: ["firstName", "lastName", "dateOfBirth"],
  },
  {
    id: 2,
    name: "Contact Info",
    fields: ["email", "phone"],
  },
  {
    id: 3,
    name: "Security",
    fields: ["password", "confirmPassword"],
  },
  {
    id: 4,
    name: "Complete",
    fields: [],
  },
]

// Validation schemas for each step
const stepValidation = {
  1: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(3, "Last name must be at least 3 characters"),
    dateOfBirth: z.string().refine((date) => {
      const age = (new Date().getFullYear() - new Date(date).getFullYear())
      return age >= 18
    }, "You must be at least 18 years old"),
  }),
  2: z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Invalid phone number"),
  }),
  3: z.object({
    password: z.string()
      .min(8, "Password must be at least 8 characters including:")
      .regex(/[A-Z]/, "• 1 uppercase letter")
      .regex(/[a-z]/, "• 1 lowercase letter")
      .regex(/[0-9]/, "• 1 number")
      .regex(/[^A-Za-z0-9]/, "• 1 special character"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
}

export function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState([])

  const validatePassword = (pwd) => {
    const passwordSchema = z.string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "1 uppercase letter")
      .regex(/[a-z]/, "1 lowercase letter")
      .regex(/[0-9]/, "1 number")
      .regex(/[^A-Za-z0-9]/, "1 special character")
    
    try {
      passwordSchema.parse(pwd)
      setPasswordErrors([])
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordErrors(error.errors.map(err => err.message))
      }
      return false
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateCurrentStep = () => {
    try {
      const currentValidation = stepValidation[currentStep]
      if (currentValidation) {
        currentValidation.parse(formData)
        return true
      }
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = {}
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = [err.message]
        })
        setErrors(formattedErrors)
        return false
      }
      return false
    }
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
      setErrors({})
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateCurrentStep()) {
      return
    }

    if (currentStep < steps.length - 1) {
      nextStep()
    } else {
      setIsSubmitting(true)
      try {
        const registrationData = {
          fullname: {
            firstname: formData.firstName,
            lastname: formData.lastName
          },
          date_of_birth: formData.dateOfBirth,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }

        const response = await api.post('/register', registrationData)
        setCurrentStep(steps.length)
      } catch (error) {
        const errorMsg = error.response?.data?.errors?.[0]?.msg || 
                       error.response?.data?.message || 
                       "Registration failed. Please try again."
        toast.error(errorMsg)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

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
          <Card className="p-6 backdrop-blur-sm bg-white/95 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Create Your Account
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Step {currentStep} of {steps.length}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Step 2: Contact Info */}
                  {currentStep === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <PhoneInput
                          country={'us'}
                          value={formData.phone}
                          onChange={(phone) => setFormData({ ...formData, phone })}
                        />
                      </div>
                    </>
                  )}

                  {/* Step 3: Security */}
                  {currentStep === 3 && (
                    <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => {
                        handleChange(e)
                        validatePassword(e.target.value)
                      }}
                      required
                    />
                    {passwordErrors.length > 0 && (
                      <div className="mt-2 text-sm text-red-500">
                        <p>Password must contain:</p>
                        <ul className="list-disc pl-5">
                          {passwordErrors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Step 4: Complete */}
                  {currentStep === 4 && (
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
                      >
                        <Shield className="w-8 h-8 text-green-600" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">Registration Complete!</h3>
                      <p className="text-muted-foreground mb-4">
                        Please check your email to verify your account.
                      </p>
                      <div className="mt-6">
                        <Link 
                          to="/login" 
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Go to Login
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {currentStep < steps.length && (
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    type={currentStep === steps.length - 1 ? "submit" : "button"}
                    onClick={currentStep === steps.length - 1 ? undefined : nextStep}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                  >
                    {isSubmitting ? "Processing..." : 
                     currentStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                </div>
              )}
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-purple-600 hover:text-purple-700">
                  Login
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
