"use client"
import { useState, useEffect } from "react"
import { ShieldAlert, ShieldCheck, ExternalLink } from "lucide-react"

export function DarkWebMonitor() {
  const [scanResults, setScanResults] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [lastScanDate, setLastScanDate] = useState(null)

  const runScan = async () => {
    setIsScanning(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockResults = {
      compromised: Math.floor(Math.random() * 5),
      scannedItems: 142,
      newBreaches: 2,
      details: [
        { 
          credential: "user@example.com",
          breachSource: "Collection #1",
          date: "2023-10-15",
          severity: "high"
        },
        {
          credential: "oldPassword123",
          breachSource: "Recent Leak",
          date: "2023-11-01", 
          severity: "medium"
        }
      ]
    }
    
    setScanResults(mockResults)
    setLastScanDate(new Date())
    setIsScanning(false)
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Dark Web Monitoring
        </h2>
        <button
          onClick={runScan}
          disabled={isScanning}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Run Scan'}
        </button>
      </div>

      {scanResults ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-red-500/30">
              <div className="text-red-400 font-medium flex items-center gap-2">
                <ShieldAlert size={18} />
                {scanResults.compromised} Compromised
              </div>
              <p className="text-sm text-slate-400 mt-1">Credentials found</p>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <div className="text-white font-medium">
                {scanResults.scannedItems} Scanned
              </div>
              <p className="text-sm text-slate-400 mt-1">Total items checked</p>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-lg border border-amber-500/30">
              <div className="text-amber-400 font-medium">
                {scanResults.newBreaches} New
              </div>
              <p className="text-sm text-slate-400 mt-1">Recent breaches</p>
            </div>
          </div>

          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <div className="bg-slate-700/50 p-3 border-b border-slate-700">
              <h3 className="font-medium text-white">Compromised Items</h3>
            </div>
            <div className="divide-y divide-slate-700">
              {scanResults.details.map((item, index) => (
                <div key={index} className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white">{item.credential}</div>
                    <div className="text-sm text-slate-400">
                      {item.breachSource} • {item.date}
                    </div>
                  </div>
                  <a 
                    href="#" 
                    className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                  >
                    Details <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-700/50 rounded-lg p-8 text-center">
          <ShieldCheck size={32} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-white font-medium mb-1">No Scan Results</h3>
          <p className="text-slate-400 mb-4">
            Run a scan to check if any credentials have been exposed
          </p>
          <button
            onClick={runScan}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
          >
            Scan Dark Web
          </button>
        </div>
      )}

      {lastScanDate && (
        <div className="text-xs text-slate-400 mt-4">
          Last scanned: {lastScanDate.toLocaleString()}
        </div>
      )}
    </div>
  )
}
