"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { PasswordGenerator } from "./PasswordGenerator"
import { PasswordStorage } from "./PasswordStorage"
import { PasswordStrengthChecker } from "./PasswordStrengthChecker"
import { Navbar } from "../Navbar"

export function Dashboard() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("generator")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Set active tab based on URL path
  useEffect(() => {
    const path = location.pathname
    if (path.includes("/generator")) {
      setActiveTab("generator")
    } else if (path.includes("/storage")) {
      setActiveTab("storage")
    } else if (path.includes("/strength")) {
      setActiveTab("strength")
    }
  }, [location])

  const renderContent = () => {
    switch (activeTab) {
      case "generator":
        return <PasswordGenerator />
      case "storage":
        return <PasswordStorage />
      case "strength":
        return <PasswordStrengthChecker />
      default:
        return <PasswordGenerator />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} userEmail="test@example.com" />

      <div className="flex pt-16">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className={`flex-1 transition-all duration-300 p-6 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="container mx-auto max-w-6xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}

