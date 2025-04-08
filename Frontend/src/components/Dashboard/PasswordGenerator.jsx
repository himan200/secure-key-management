"use client"

import { useState, useEffect } from "react"
import { Copy, RefreshCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    generatePassword()
  }, [])

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  useEffect(() => {
    calculatePasswordStrength()
  }, [password])

  const generatePassword = () => {
    let charset = ""
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") {
      setIncludeLowercase(true)
      charset = "abcdefghijklmnopqrstuvwxyz"
    }

    let newPassword = ""
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }

    setPassword(newPassword)
  }

  const calculatePasswordStrength = () => {
    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1
    if (password.length >= 16) strength += 1

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 4) return "Moderate"
    if (passwordStrength <= 6) return "Strong"
    return "Very Strong"
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 4) return "bg-yellow-500"
    if (passwordStrength <= 6) return "bg-green-500"
    return "bg-purple-500"
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Password Generator</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generate a Secure Password</CardTitle>
          <CardDescription>Create strong, unique passwords to keep your accounts safe</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Password Output */}
          <div className="relative">
            <Input value={password} readOnly className="pr-24 font-mono text-lg h-14" />
            <div className="absolute right-2 top-2 flex space-x-1">
              <Button variant="ghost" size="icon" onClick={generatePassword} className="h-10 w-10">
                <RefreshCw size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-10 w-10">
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </Button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Password Strength</span>
              <span className="text-sm font-medium">{getStrengthLabel()}</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                style={{ width: `${(passwordStrength / 7) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Password Length */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password-length">Password Length</Label>
              <span className="text-sm font-medium">{passwordLength} characters</span>
            </div>
            <Slider
              id="password-length"
              min={8}
              max={32}
              step={1}
              value={[passwordLength]}
              onValueChange={(value) => setPasswordLength(value[0])}
            />
          </div>

          {/* Character Types */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Character Types</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="uppercase" className="flex-1">
                  Uppercase Letters (A-Z)
                </Label>
                <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="lowercase" className="flex-1">
                  Lowercase Letters (a-z)
                </Label>
                <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="numbers" className="flex-1">
                  Numbers (0-9)
                </Label>
                <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="symbols" className="flex-1">
                  Special Characters (!@#$%)
                </Label>
                <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={generatePassword} className="w-full">
            <RefreshCw size={16} className="mr-2" />
            Generate New Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

