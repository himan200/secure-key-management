"use client"
import { useState, useEffect } from "react"
import { Key, Trash2, Eye, EyeOff, Copy, Download } from "lucide-react"
import { useAuth } from "../../context/AuthContext.jsx"
import api from "../../services/api"

export function CryptoKeyManager() {
  const { user } = useAuth()
  const [keys, setKeys] = useState([
    {
      id: "1",
      name: "Default SSH Key",
      type: "SSH",
      fingerprint: "SHA256:AbCdEfGhIjKlMnOpQrStUvWxYz",
      created: new Date().toISOString().split('T')[0],
      expires: "2025-12-31",
      visible: false
    },
    {
      id: "2",
      name: "Default GPG Key",
      type: "GPG",
      fingerprint: "ABCD 1234 EF56 7890",
      created: new Date().toISOString().split('T')[0],
      expires: "2025-12-31",
      visible: false
    }
  ])
  const [loading, setLoading] = useState(true)
  const [newKey, setNewKey] = useState({
    name: "",
    type: "SSH",
    expires: ""
  })

  const toggleVisibility = (id) => {
    setKeys(keys.map(key => 
      key.id === id ? {...key, visible: !key.visible} : key
    ))
  }

  const deleteKey = async (id) => {
    if (confirm("Are you sure you want to delete this cryptographic key?")) {
      try {
        await api.delete(`/keys/${id}`)
        setKeys(keys.filter(key => key._id !== id))
      } catch (err) {
        console.error('Failed to delete key:', err)
      }
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      setLoading(true)
      const response = await api.get('/keys')
      setKeys(response.data.map(key => ({
        ...key,
        visible: false
      })))
    } catch (err) {
      console.error('Failed to fetch keys:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateKey = () => {
    const newKeyObj = {
      id: Date.now().toString(),
      name: newKey.name || `New ${newKey.type} Key`,
      type: newKey.type,
      fingerprint: `NEW-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      created: new Date().toISOString().split('T')[0],
      expires: newKey.expires || "2025-12-31",
      visible: false
    }
    setKeys([...keys, newKeyObj])
    setNewKey({name: "", type: "SSH", expires: ""})
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">
        Cryptographic Key Manager
      </h2>

      {/* Key Generation Form */}
      <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
        <h3 className="text-white font-medium mb-3">Generate New Key</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Key Name</label>
            <input
              type="text"
              value={newKey.name}
              onChange={(e) => setNewKey({...newKey, name: e.target.value})}
              className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600"
              placeholder="My Production Key"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Key Type</label>
            <select
              value={newKey.type}
              onChange={(e) => setNewKey({...newKey, type: e.target.value})}
              className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600"
            >
              <option value="SSH">SSH Key</option>
              <option value="GPG">GPG Key</option>
              <option value="API">API Key</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Expiration</label>
            <input
              type="date"
              value={newKey.expires}
              onChange={(e) => setNewKey({...newKey, expires: e.target.value})}
              className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-slate-600"
            />
          </div>
        </div>
        <button
          onClick={generateKey}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
        >
          Generate Key Pair
        </button>
      </div>

      {/* Keys List */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <div className="bg-slate-700/50 p-3 border-b border-slate-700 grid grid-cols-12 gap-4">
          <div className="col-span-4 text-sm font-medium text-white">Key Name</div>
          <div className="col-span-2 text-sm font-medium text-white">Type</div>
          <div className="col-span-4 text-sm font-medium text-white">Fingerprint</div>
          <div className="col-span-2 text-sm font-medium text-white">Actions</div>
        </div>
        <div className="divide-y divide-slate-700">
          {keys.map((key) => (
            <div key={key.id} className="p-3 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4 flex items-center gap-2">
                <Key size={16} className="text-slate-400" />
                <span className="text-white">{key.name}</span>
              </div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  key.type === 'SSH' ? 'bg-blue-900/30 text-blue-300' :
                  key.type === 'GPG' ? 'bg-purple-900/30 text-purple-300' :
                  'bg-amber-900/30 text-amber-300'
                }`}>
                  {key.type}
                </span>
              </div>
              <div className="col-span-4 font-mono text-sm text-slate-300">
                {key.visible ? key.fingerprint : '••••••••••••••••••'}
                <button 
                  onClick={() => toggleVisibility(key.id)}
                  className="ml-2 text-slate-400 hover:text-white"
                >
                  {key.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="col-span-2 flex gap-2">
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">
                  <Copy size={14} />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">
                  <Download size={14} />
                </button>
                <button 
                  onClick={() => deleteKey(key.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
