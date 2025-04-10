"use client"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Copy, Check, RefreshCw, ChevronDown } from "lucide-react"

export function PasswordGenerator() {
  // Core state
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(12)
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeChars, setExcludeChars] = useState("")
  const [advancedOpen, setAdvancedOpen] = useState(false)

  // Enhancement states
  const [strength, setStrength] = useState({
    score: 0,
    label: "Weak",
    color: "bg-red-500"
  })
  const [history, setHistory] = useState([])
  const [expiry, setExpiry] = useState(null)

  // Password presets
  const PRESETS = [
    { name: "Basic", length: 12, uppercase: true, numbers: true, symbols: false },
    { name: "Strong", length: 16, uppercase: true, numbers: true, symbols: true },
    { name: "PIN", length: 6, uppercase: false, numbers: true, symbols: false }
  ]

  const generatePassword = () => {
    let chars = "abcdefghijklmnopqrstuvwxyz"
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbers) chars += "0123456789"
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if (excludeChars) {
      chars = chars.split('').filter(c => !excludeChars.includes(c)).join('')
    }

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    setPassword(result)
    calculateStrength(result)
    setHistory(prev => [result, ...prev].slice(0, 5))
    setExpiry(Date.now() + 300000) // 5 minutes expiry
  }

  const calculateStrength = (pass) => {
    let score = 0
    if (pass.length >= 12) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++
    
    let label, color
    if (score <= 1) {
      label = "Weak"
      color = "bg-red-500"
    } else if (score <= 3) {
      label = "Medium" 
      color = "bg-yellow-500"
    } else {
      label = "Strong"
      color = "bg-green-500"
    }
    
    setStrength({ score, label, color })
  }

  const copyToClipboard = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeNumbers, includeSymbols, excludeChars])

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Password Generator</h2>
        <button
          onClick={generatePassword}
          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Regenerate"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Password Display */}
      <div className="relative mb-6">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          readOnly
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
      <div className="mb-4">
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

      {/* Preset Buttons */}
      <div className="flex gap-2 mb-4">
        {PRESETS.map((preset, i) => (
          <button
            key={i}
            onClick={() => {
              setLength(preset.length)
              setIncludeUppercase(preset.uppercase)
              setIncludeNumbers(preset.numbers)
              setIncludeSymbols(preset.symbols)
            }}
            className="text-xs px-3 py-1 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Length Slider */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-slate-300">Length: {length}</label>
          <span className="text-emerald-400 font-medium">{length} characters</span>
        </div>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
        />
      </div>

      {/* Character Options */}
      <div className="space-y-3 mb-6">
        <div 
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${includeUppercase ? 'bg-emerald-900/30 border-emerald-500' : 'bg-slate-700 border-slate-600'} border`}
          onClick={() => setIncludeUppercase(!includeUppercase)}
        >
          <span className="text-slate-200">Uppercase Letters</span>
          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${includeUppercase ? 'bg-emerald-500' : 'bg-slate-600 border border-slate-500'}`}>
            {includeUppercase && <Check size={14} className="text-white" />}
          </div>
        </div>
        
        <div 
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${includeNumbers ? 'bg-emerald-900/30 border-emerald-500' : 'bg-slate-700 border-slate-600'} border`}
          onClick={() => setIncludeNumbers(!includeNumbers)}
        >
          <span className="text-slate-200">Numbers</span>
          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${includeNumbers ? 'bg-emerald-500' : 'bg-slate-600 border border-slate-500'}`}>
            {includeNumbers && <Check size={14} className="text-white" />}
          </div>
        </div>
        
        <div 
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${includeSymbols ? 'bg-emerald-900/30 border-emerald-500' : 'bg-slate-700 border-slate-600'} border`}
          onClick={() => setIncludeSymbols(!includeSymbols)}
        >
          <span className="text-slate-200">Special Symbols</span>
          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${includeSymbols ? 'bg-emerald-500' : 'bg-slate-600 border border-slate-500'}`}>
            {includeSymbols && <Check size={14} className="text-white" />}
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <button 
        onClick={() => setAdvancedOpen(!advancedOpen)}
        className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-3"
      >
        {advancedOpen ? 'Hide' : 'Show'} Advanced Options
        <ChevronDown size={16} className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`}/>
      </button>

      {advancedOpen && (
        <div className="mb-6 p-3 bg-slate-700/50 rounded-lg">
          <label className="block text-sm text-slate-300 mb-1">Exclude Characters</label>
          <input
            value={excludeChars}
            onChange={(e) => setExcludeChars(e.target.value)}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600"
            placeholder="!@#$%"
            maxLength={10}
          />
          <p className="text-xs text-slate-400 mt-1">Enter characters to exclude (max 10)</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mb-4"
      >
        <RefreshCw size={16} />
        Generate New Password
      </button>

      {/* Expiry Timer */}
      {expiry && (
        <div className="text-sm text-slate-400 text-center">
          Password expires in: {Math.max(0, Math.ceil((expiry - Date.now())/60000))} minutes
        </div>
      )}

      {/* Password History */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Recent Passwords</h3>
          <div className="space-y-2">
            {history.map((pass, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                <span className="font-mono text-sm">{pass}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(pass)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <Copy size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
