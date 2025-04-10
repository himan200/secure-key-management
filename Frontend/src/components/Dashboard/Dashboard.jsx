"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { getUserData } from "../../api.js"
import { Sidebar } from "./Sidebar"
import { PasswordGenerator } from "./PasswordGenerator"
import { PasswordStorage } from "./PasswordStorage"
import { PasswordStrengthChecker } from "./PasswordStrengthChecker"
import { DarkWebMonitor } from "./DarkWebMonitor"
import { CryptoKeyManager } from "./CryptoKeyManager"
import { Bell, Search, User, Moon, Sun, Shield } from "lucide-react"

export function Dashboard() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("generator")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const userData = await getUserData()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        setError(error.message || 'Failed to load user data')
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    const path = location.pathname
    if (path.includes("/generator")) setActiveTab("generator")
    else if (path.includes("/storage")) setActiveTab("storage")
    else if (path.includes("/strength")) setActiveTab("strength")
    else if (path.includes("/darkweb")) setActiveTab("darkweb")
    else if (path.includes("/cryptokeys")) setActiveTab("cryptokeys")
  }, [location])

  const renderContent = () => {
    switch (activeTab) {
      case "generator": return <PasswordGenerator />
      case "storage": return <PasswordStorage />
      case "strength": return <PasswordStrengthChecker />
      case "darkweb": return <DarkWebMonitor />
      case "cryptokeys": return <CryptoKeyManager />
      default: return <PasswordGenerator />
    }
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "generator": return "Password Generator"
      case "storage": return "Password Storage"
      case "strength": return "Password Strength Checker"
      case "darkweb": return "Dark Web Monitor"
      case "cryptokeys": return "Crypto Key Manager"
      default: return "Dashboard"
    }
  }

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-slate-100"}`}>
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 z-40 flex items-center px-4 md:px-6">
        <div className={`flex-1 flex items-center transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-white" />
              <h1 className="text-xl font-semibold text-white">SecureKey</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative hidden md:flex items-center">
                <Search className="absolute left-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-9 w-64 rounded-full bg-slate-800 border border-slate-700 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400"
                />
              </div>

              <button
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white">
                <Bell size={20} />
              </button>

              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  {error ? (
                    <div className="text-xs text-red-400">{error}</div>
                  ) : loading ? (
                    <div className="animate-pulse space-y-1">
                      <div className="h-4 w-32 bg-slate-700 rounded"></div>
                      <div className="h-3 w-24 bg-slate-700 rounded"></div>
                    </div>
                  ) : user ? (
                    <>
                      <div className="text-sm font-medium text-white">
                        {user?.firstName || user?.lastName
                          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                          : user?.email?.split('@')[0] || 'User'}
                      </div>
                      {(!user?.firstName && !user?.lastName) && (
                        <div className="text-xs text-yellow-400 mt-1">
                          Names not available - using email
                        </div>
                      )}
                      <div className="text-xs text-slate-400">
                        {user.email}
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <User size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className={`flex-1 transition-all duration-300 p-6 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="container mx-auto max-w-6xl">
            <div className={`${isDarkMode ? "bg-slate-800" : "bg-white"} rounded-xl shadow-lg border ${isDarkMode ? "border-slate-700" : "border-slate-200"} p-6`}>
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}