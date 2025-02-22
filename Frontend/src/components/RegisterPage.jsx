"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
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
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
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
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
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

  // Update your form state to include validation errors
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Update your nextStep function to include validation
  const nextStep = () => {
    try {
      const currentValidation = stepValidation[currentStep]
      if (currentValidation) {
        const validData = currentValidation.parse(formData)
        setCurrentStep((prev) => Math.min(prev + 1, steps.length))
        setErrors({})
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.formErrors.fieldErrors)
      }
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (currentStep < steps.length - 1) {
      nextStep()
    } else {
      console.log("Form submitted:", formData)
      // Implement registration logic here
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
          <Card className="p-6 backdrop-blur-sm bg-white/95 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Create Your Account
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Step {currentStep} of {steps.length}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="h-2 bg-muted rounded-full">
                <motion.div
                  className="absolute h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      step.id <= currentStep ? "text-purple-600" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        step.id <= currentStep
                          ? "bg-purple-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.id}
                    </div>
                    <span className="text-xs mt-1">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Steps */}
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
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email[0]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <PhoneInput
                          country={'us'}
                          value={formData.phone}
                          onChange={(phone) => setFormData({ ...formData, phone })}
                          containerClass="w-full"
                          inputClass={`w-full p-2 border rounded-md ${
                            errors.phone ? "border-red-500" : "border-input"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone[0]}</p>
                        )}
                      </div>
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 4 && (
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
                      >
                        <Shield className="w-8 h-8 text-green-600" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">Almost Done!</h3>
                      <p className="text-muted-foreground">
                        Please review your information before submitting.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="hover:bg-purple-50"
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  type={currentStep === steps.length ? "submit" : "button"}
                  onClick={currentStep === steps.length ? undefined : nextStep}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                >
                  {currentStep === steps.length ? "Submit" : "Next"}
                </Button>
              </div>
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