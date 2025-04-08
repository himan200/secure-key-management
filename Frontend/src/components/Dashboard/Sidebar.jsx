"use client"
import {
  Key,
  Shield,
  Lock,
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
      id: "generator",
      label: "Password Generator",
      icon: <Key size={20} />,
      path: "/dashboard/generator",
    },
    {
      id: "storage",
      label: "Password Storage",
      icon: <Lock size={20} />,
      path: "/dashboard/storage",
    },
    {
      id: "strength",
      label: "Strength Checker",
      icon: <Shield size={20} />,
      path: "/dashboard/strength",
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
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full bg-white shadow-lg transition-all duration-300 ease-in-out pt-16 
          ${isOpen ? "w-64" : "w-20"} 
          ${isOpen ? "translate-x-0" : "-translate-x-0"} md:translate-x-0`}
      >
        <div className="h-full flex flex-col justify-between">
          {/* Toggle button */}
          <button
            className="absolute right-0 top-20 bg-white rounded-r-md p-1.5 shadow-md hidden md:flex"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>

          {/* Main menu */}
          <div className="px-4 py-6">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === item.id ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
                  } ${!isOpen && "justify-center"}`}
                  onClick={() => {
                    setActiveTab(item.id)
                    navigate(item.path)
                  }}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isOpen && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom menu */}
          <div className="px-4 py-6 border-t">
            <div className="space-y-1">
              {bottomMenuItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors
                    text-gray-600 hover:bg-gray-100 ${!isOpen && "justify-center"}`}
                  onClick={item.onClick}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isOpen && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

