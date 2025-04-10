"use client"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Copy, Check } from "lucide-react"

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState({
    score: 0,
    label: "Very Weak",
    color: "bg-red-500",
    checks: {
      length: false,
      uppercase: false,
      number: false,
      symbol: false
    }
  })

  const checkStrength = (value) => {
    setPassword(value)
    
    const checks = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value)
    }

    const score = Object.values(checks).filter(Boolean).length
    
    let label, color
    if (score <= 1) {
      label = "Very Weak"
      color = "bg-red-500"
    } else if (score <= 2) {
      label = "Weak"
      color = "bg-orange-500"
    } else if (score <= 3) {
      label = "Medium"
      color = "bg-yellow-500"
    } else {
      label = "Strong"
      color = "bg-green-500"
    }

    setStrength({
      score,
      label,
      color,
      checks
    })
  }

  const copyToClipboard = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">Password Strength Checker</h2>

      {/* Password Input */}
      <div className="relative mb-6">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => checkStrength(e.target.value)}
          placeholder="Enter password to check"
          className="w-full bg-slate-700 text-white px-4 py-3 pr-16 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-slate-400 hover:text-white rounded-full"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button
            onClick={copyToClipboard}
            className="p-2 text-slate-400 hover:text-white rounded-full"
            disabled={!password}
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Strength Meter */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-300 mb-1">
          <span>Strength: {strength.label}</span>
          <span>{strength.score}/4</span>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-3 mb-6">
        <div className={`flex items-center justify-between p-3 rounded-lg border ${strength.checks.length ? 'border-emerald-500 bg-emerald-900/30' : 'border-slate-600 bg-slate-700'}`}>
          <span className="text-slate-200">At least 8 characters</span>
          <div className={`w-5 h-5 rounded flex items-center justify-center ${strength.checks.length ? 'bg-emerald-500' : 'bg-slate-600 border border-slate-500'}`}>
            {strength.checks.length && <Check size={14} className="text-white" />}
          </div>
        </div>
        
        <div className={`flex items-center justify-between p-3 rounded-lg border ${strength.checks.uppercase ? 'border-emerald-500 bg-emerald-900/30' : 'border-slate-600 bg-slate-700'}`}>
          <span className="text-slate-200">Contains uppercase letters</span>
          <div className={`w-5 h-5 rounded flex items-center justify-center ${strength.checks.uppercase ? 'bg-emerald-500' : 'bg-slate-600 border border-slate-500'}`}>
            {strength.checks.uppercase && <Check size={14} className="text-white" />}
          </div>
        </div>
        
        <div className={`flex items-center justify-between p-3 rounded-lg border ${strength.checks.number ? 'border-emerald-500 bg-emerald-900/30' : 'border-slate-600 bg-slate-700'}`}>
          <span className="text-slate-200">Contains numbers</span>
          <div className={`w-5 h-5 rounded flex items-center justify-center ${strength.checks.number ? 'bg-emerald-500' : 'bg-slate-600 border border-slate-500'}`}>
            {strength.checks.number && <Check size={14} className="text-white" />}
          </div>
        </div>
        
        <div className={`flex items-center justify-between p-3 rounded-lg border ${strength.checks.symbol ? 'border-emerald-500 bg-emerald-900/30' : 'border-slate-600 bg-slate-700'}`}>
          <span className="text-slate-200">Contains special symbols</span>
          <div className={`w-5 h-5 rounded flex items-center justify-center ${strength.checks.symbol ? 'bg-emerald-500' : 'bg-slate-600 border border-slate-500'}`}>
            {strength.checks.symbol && <Check size={14} className="text-white" />}
          </div>
        </div>
      </div>

      {/* Time to Crack Estimation */}
      {password && (
        <div className="p-4 bg-slate-700/50 rounded-lg">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Time to Crack Estimation</h3>
          <div className="text-emerald-400 font-medium">
            {strength.score <= 1 ? "Instantly" :
             strength.score <= 2 ? "Minutes to hours" :
             strength.score <= 3 ? "Days to months" :
             "Years to centuries"}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Based on password complexity and length
          </p>
        </div>
      )}
    </div>
  )
}
