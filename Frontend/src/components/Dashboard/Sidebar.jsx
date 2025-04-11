"use client"

import {
  Key,
  Shield,
  Lock,
  Globe,
  Fingerprint,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  CreditCard,
  HelpCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const navigate = useNavigate()

  const menuItems = [
    {
      id: "storage",
      label: "Password Storage",
      icon: <Lock size={20} />,
      path: "/dashboard/storage",
    },
    {
      id: "generator",
      label: "Password Generator",
      icon: <Key size={20} />,
      path: "/dashboard/generator",
    },
    {
      id: "strength",
      label: "Strength Checker",
      icon: <Shield size={20} />,
      path: "/dashboard/strength",
    },
    {
      id: "darkweb",
      label: "Dark Web Monitor",
      icon: <Globe size={20} />,
      path: "/dashboard/darkweb",
    },
    {
      id: "cryptokeys",
      label: "Crypto Key Manager",
      icon: <Fingerprint size={20} />,
      path: "/dashboard/cryptokeys",
    },
  ]

  const bottomMenuItems = [
    {
      id: "account",
      label: "Account",
      icon: <User size={20} />,
      onClick: () => navigate("/account"),
    },
    {
      id: "billing",
      label: "Billing",
      icon: <CreditCard size={20} />,
      onClick: () => navigate("/billing"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      onClick: () => navigate("/settings"),
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle size={20} />,
      onClick: () => navigate("/help"),
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut size={20} />,
      onClick: () => {
        // Implement logout logic
        navigate("/login")
      },
    },
  ]

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ${
          isOpen ? "opacity-100 md:opacity-0" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl transition-all duration-300 ease-in-out pt-16 
          ${isOpen ? "w-64" : "w-20"} 
          ${isOpen ? "translate-x-0" : "-translate-x-0"} md:translate-x-0`}
      >
        <div className="h-full flex flex-col justify-between">
          {/* App logo/name */}
          <div className={`px-4 py-3 flex items-center ${!isOpen && "justify-center"}`}>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Shield size={isOpen ? 20 : 24} className="text-white" />
              </div>
              {isOpen && (
                <div className="text-white font-semibold text-lg">SecureKey</div>
              )}
            </div>
          </div>

          {/* Toggle button */}
          <div className="absolute top-20 -right-4 hidden md:block" style={{ zIndex: 40 }}>
            <button
              className="bg-slate-700 rounded-full p-1 text-white hover:bg-slate-600 transition-all duration-300 shadow-lg border-2 border-slate-600 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              style={{
                width: '36px',
                height: '36px'
              }}
            >
              {isOpen ? (
                <ChevronLeft size={20} className="transform transition-transform duration-300" />
              ) : (
                <ChevronRight size={20} className="transform transition-transform duration-300" />
              )}
            </button>
          </div>

          {/* Main menu */}
          <div className="px-3 py-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            {isOpen && (
              <div className="mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main</div>
            )}
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center w-full p-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  } ${!isOpen && "justify-center"}`}
                  onClick={() => {
                    setActiveTab(item.id)
                    navigate(item.path)
                  }}
                >
                  <span className={`flex-shrink-0 ${activeTab === item.id ? "text-emerald-500" : ""}`}>
                    {item.icon}
                  </span>
                  {isOpen && <span className="ml-3 whitespace-nowrap font-medium">{item.label}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom menu */}
          <div className="px-3 py-6 border-t border-slate-700/50">
            {isOpen && (
              <div className="mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Settings</div>
            )}
            <div className="space-y-1">
              {bottomMenuItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center w-full p-3 rounded-lg transition-all
                    text-slate-300 hover:bg-slate-700/50 hover:text-white ${!isOpen && "justify-center"}`}
                  onClick={item.onClick}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isOpen && <span className="ml-3 whitespace-nowrap font-medium">{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
