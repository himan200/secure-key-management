"use client"

import { useState } from "react"
import { Eye, EyeOff, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const analyzePassword = (pwd) => {
    if (!pwd) return { score: 0, feedback: [] }

    let score = 0
    const feedback = []

    // Length check
    if (pwd.length < 8) {
      feedback.push({ type: "error", message: "Password is too short (minimum 8 characters)" })
    } else if (pwd.length < 12) {
      feedback.push({ type: "warning", message: "Consider using a longer password (12+ characters)" })
      score += 1
    } else {
      feedback.push({ type: "success", message: "Good password length" })
      score += 2
    }

    // Check for uppercase letters
    if (!/[A-Z]/.test(pwd)) {
      feedback.push({ type: "error", message: "Add uppercase letters (A-Z)" })
    } else {
      feedback.push({ type: "success", message: "Contains uppercase letters" })
      score += 1
    }

    // Check for lowercase letters
    if (!/[a-z]/.test(pwd)) {
      feedback.push({ type: "error", message: "Add lowercase letters (a-z)" })
    } else {
      feedback.push({ type: "success", message: "Contains lowercase letters" })
      score += 1
    }

    // Check for numbers
    if (!/[0-9]/.test(pwd)) {
      feedback.push({ type: "error", message: "Add numbers (0-9)" })
    } else {
      feedback.push({ type: "success", message: "Contains numbers" })
      score += 1
    }

    // Check for special characters
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      feedback.push({ type: "error", message: "Add special characters (!@#$%^&*)" })
    } else {
      feedback.push({ type: "success", message: "Contains special characters" })
      score += 1
    }

    // Check for repeating characters
    if (/(.)\1{2,}/.test(pwd)) {
      feedback.push({ type: "warning", message: "Avoid repeating characters (e.g., 'aaa')" })
      score -= 1
    }

    // Check for sequential characters
    if (
      /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(
        pwd,
      )
    ) {
      feedback.push({ type: "warning", message: "Avoid sequential characters (e.g., 'abc', '123')" })
      score -= 1
    }

    // Ensure score is within bounds
    score = Math.max(0, Math.min(score, 5))

    return { score, feedback }
  }

  const { score, feedback } = analyzePassword(password)

  const getScoreLabel = () => {
    if (score === 0) return "Not Rated"
    if (score === 1) return "Very Weak"
    if (score === 2) return "Weak"
    if (score === 3) return "Moderate"
    if (score === 4) return "Strong"
    return "Very Strong"
  }

  const getScoreColor = () => {
    if (score === 0) return "bg-gray-300"
    if (score === 1) return "bg-red-500"
    if (score === 2) return "bg-orange-500"
    if (score === 3) return "bg-yellow-500"
    if (score === 4) return "bg-green-500"
    return "bg-purple-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Password Strength Checker</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Check Your Password Strength</CardTitle>
          <CardDescription>Analyze how strong your password is and get tips to improve it</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Password Input */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password to check"
              className="pr-12"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>

          {/* Strength Meter */}
          {password && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Password Strength</span>
                  <span className="text-sm font-medium">{getScoreLabel()}</span>
                </div>
                <Progress value={(score / 5) * 100} className={`h-2 ${getScoreColor()}`} />
              </div>

              {/* Feedback */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Analysis</h3>
                <div className="space-y-2">
                  {feedback.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      {item.type === "error" && (
                        <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      {item.type === "warning" && <Info size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />}
                      {item.type === "success" && (
                        <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm">{item.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {score < 4 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for a Stronger Password</h3>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li>Use a mix of uppercase and lowercase letters, numbers, and symbols</li>
                    <li>Make it at least 12 characters long</li>
                    <li>Avoid using personal information or common words</li>
                    <li>Don't use the same password for multiple accounts</li>
                    <li>Consider using a password manager to generate and store complex passwords</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

