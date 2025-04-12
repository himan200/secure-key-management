"use client"

import { useState } from "react"
import { Heart, Lock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

export function SupportPage() {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")

  const handleDonate = (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage("Please enter a valid amount")
      return
    }
    // Process donation here
    setMessage(`Thank you for your donation of ₹${amount}!`)
    setAmount("")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 bg-emerald-500/10 rounded-full mb-4">
              <Heart className="text-emerald-500 h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Support Our Work</h1>
            <p className="text-slate-400 text-lg mb-6">
              Your generous donation helps us continue providing secure key management services
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Donation form */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>
          
          <form onSubmit={handleDonate}>
            <div className="mb-4">
              <label className="block mb-2">Donation Amount (₹)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
            </div>

            <Button type="submit" className="w-full">
              Donate Now
            </Button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-emerald-100 text-emerald-700 rounded-md">
              {message}
            </div>
          )}
        </div>

        {/* Why Donate section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h2 className="text-2xl font-bold mb-6">How Your Donation Helps</h2>
          <p className="text-slate-400">
            Your support helps us maintain and improve our security services.
            Every contribution makes a difference!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} SecureKey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
