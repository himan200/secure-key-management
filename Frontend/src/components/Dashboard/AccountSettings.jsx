"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { User, Lock, Eye, EyeOff, Edit, Save, X, Shield, CheckCircle } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { toast } from "sonner"
import api from "../../services/api"
import { Loader2 } from "lucide-react"

export function AccountSettings() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          setProfileData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || ""
          })
          setIsLoading(false)
        } else {
          const token = localStorage.getItem('authToken')
          if (token) {
            const response = await api.get('/auth/me')
            setProfileData({
              firstName: response.data.firstName || "",
              lastName: response.data.lastName || "",
              email: response.data.email || ""
            })
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))

    if (name === "newPassword") {
      // Password strength calculation
      let strength = 0
      if (value.length >= 8) strength += 1
      if (/[A-Z]/.test(value)) strength += 1
      if (/[0-9]/.test(value)) strength += 1
      if (/[^A-Za-z0-9]/.test(value)) strength += 1
      setPasswordStrength(strength)

      // Set feedback based on strength
      if (strength === 0) setPasswordFeedback("Password is too weak")
      else if (strength === 1) setPasswordFeedback("Password is weak")
      else if (strength === 2) setPasswordFeedback("Password is moderate")
      else if (strength === 3) setPasswordFeedback("Password is strong")
      else setPasswordFeedback("Password is very strong")
    }

    // Check password match
    if (name === "confirmPassword" || name === "newPassword") {
      if (name === "confirmPassword" && passwordData.newPassword !== value) {
        setPasswordMatch(false)
      } else if (name === "newPassword" && passwordData.confirmPassword !== value) {
        setPasswordMatch(passwordData.confirmPassword === "")
      } else {
        setPasswordMatch(true)
      }
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      await api.patch('/auth/update-profile', profileData)
      toast.success("Profile updated successfully")
      setEditMode(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!passwordMatch) {
      toast.error("Passwords do not match")
      return
    }
    
    setIsUpdating(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success("Password updated successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "bg-red-500"
      case 1: return "bg-orange-500"
      case 2: return "bg-yellow-500"
      case 3: return "bg-blue-500"
      case 4: return "bg-emerald-500"
      default: return "bg-slate-500"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-slate-400">Manage your profile information and security settings</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mb-4">
                  <User size={40} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold">
                  {profileData.firstName || profileData.lastName
                    ? `${profileData.firstName} ${profileData.lastName}`
                    : "Your Profile"}
                </h2>
                <p className="text-slate-400 text-sm">{profileData.email || "No email available"}</p>
              </div>

              <div className="space-y-2">
                <button className="w-full py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-left flex items-center">
                  <User size={18} className="mr-3 text-emerald-500" />
                  <span>Profile Information</span>
                </button>
                <button className="w-full py-2 px-4 rounded-lg bg-emerald-500/10 text-emerald-500 text-left flex items-center">
                  <Lock size={18} className="mr-3" />
                  <span>Security</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold flex items-center">
                  <User size={20} className="mr-2 text-emerald-500" />
                  Profile Information
                </h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center text-sm px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    <Edit size={16} className="mr-1.5" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center text-sm px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    <X size={16} className="mr-1.5" />
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="p-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">First Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter your first name"
                        />
                      ) : (
                        <div className="h-10 px-3 flex items-center rounded-lg border border-slate-700 bg-slate-800/50">
                          {profileData.firstName || "Not available"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Last Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter your last name"
                        />
                      ) : (
                        <div className="h-10 px-3 flex items-center rounded-lg border border-slate-700 bg-slate-800/50">
                          {profileData.lastName || "Not available"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your email address"
                      />
                    ) : (
                      <div className="h-10 px-3 flex items-center rounded-lg border border-slate-700 bg-slate-800/50">
                        {profileData.email || "Not available"}
                      </div>
                    )}
                  </div>
                </div>

                {editMode && (
                  <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 size={18} className="mr-2 animate-spin" />
                      ) : (
                        <Save size={18} className="mr-2" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold flex items-center">
                  <Lock size={20} className="mr-2 text-emerald-500" />
                  Change Password
                </h2>
                <p className="text-slate-400 text-sm mt-1">Ensure your account is using a strong, secure password</p>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full pr-10"
                        placeholder="Enter your current password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full pr-10"
                        placeholder="Enter your new password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{passwordFeedback}</span>
                          <span className="text-xs text-slate-400">{passwordStrength}/4</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                          Password should be at least 8 characters and include uppercase letters, numbers, and special characters.
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full pr-10 ${
                          !passwordMatch && passwordData.confirmPassword
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        placeholder="Confirm your new password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {!passwordMatch && passwordData.confirmPassword && (
                      <div className="mt-1 text-xs text-red-500 flex items-center">
                        Passwords do not match
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-800 border-t border-slate-700">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!passwordMatch || passwordData.newPassword === "" || isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 size={18} className="mr-2 animate-spin" />
                    ) : (
                      <Lock size={18} className="mr-2" />
                    )}
                    Update Password
                  </Button>
                </div>
              </form>
            </div>

            {/* Security Tips */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Shield size={18} className="mr-2 text-emerald-500" />
                Security Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">
                    Use a unique password that you don't use for other websites or apps.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">
                    Create a password that's at least 12 characters long with a mix of letters, numbers, and symbols.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">
                    Consider enabling two-factor authentication for additional security.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mr-2 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">
                    Regularly update your password every 3-6 months for optimal security.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
