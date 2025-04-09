"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LandingPage } from "./components/LandingPage"
import { LoginPage } from "./components/LoginPage"
import { RegisterPage } from "./components/RegisterPage"
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"
import { Dashboard } from "./components/Dashboard/Dashboard" // Updated import path
import  VerifyEmail  from "./components/VerifyEmail"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('authToken');
    console.log("Initial auth check - Token exists:", !!token);
    return !!token;
  })
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  // Add authentication handlers
  const handleLogin = (email) => {
    setIsAuthenticated(true)
    setUserEmail(email)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUserEmail("");
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} onOtpVerified={() => setIsOtpVerified(true)} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated && isOtpVerified ? (
              <Dashboard isAuthenticated={isAuthenticated} userEmail={userEmail} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App

