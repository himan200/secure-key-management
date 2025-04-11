"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Edit, Trash, Plus, Search, Copy, Check, Clock, Lock } from "lucide-react"

import { getPasswords, createPassword, updatePassword, deletePassword } from '../../api'
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal'

export function PasswordStorage() {
  const [passwords, setPasswords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visiblePasswords, setVisiblePasswords] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    website: "",
    notes: "",
    category: "Other",
  })
  const [copiedField, setCopiedField] = useState(null)
  const [activeCategory, setActiveCategory] = useState("All")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [passwordToDelete, setPasswordToDelete] = useState(null)

  // Load passwords from API
  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        setIsLoading(true)
        const response = await getPasswords()
        // Access the decrypted data from the response
        const passwordsData = Array.isArray(response.data?.data) ? response.data.data : []
        console.log('Fetched passwords:', passwordsData) // Debug log
        setPasswords(passwordsData)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch passwords:', {
          error: err,
          response: err.response?.data
        })
        setError(err.response?.data?.error || 'Failed to load passwords. Please try again.')
        setPasswords([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchPasswords()
  }, [])

  // Reset copied status
  useEffect(() => {
    if (copiedField) {
      const timeout = setTimeout(() => setCopiedField(null), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copiedField])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredPasswords = Array.isArray(passwords) ? passwords.filter((password) => {
    const matchesSearch =
      (password.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (password.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (password.website?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (password.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    const matchesCategory = activeCategory === "All" || password.category === activeCategory

    return matchesSearch && matchesCategory
  }).map(p => ({
    ...p,
    _id: p._id || p.id // Handle both _id and id cases
  })) : []

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddPassword = async () => {
    try {
      setIsLoading(true)
      const response = await createPassword(formData)
      // Get the full list of passwords again to ensure we have the latest data
      const updatedResponse = await getPasswords()
      const updatedPasswords = Array.isArray(updatedResponse.data?.data) ? updatedResponse.data.data : []
      setPasswords(updatedPasswords)
      setFormData({
        title: "",
        username: "",
        password: "",
        website: "",
        notes: "",
        category: "Other",
      })
      setIsAddDialogOpen(false)
    } catch (err) {
      console.error('Failed to add password:', err)
      setError('Failed to add password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPassword = async () => {
    try {
      setIsLoading(true)
      const response = await updatePassword(currentPassword._id, formData)
      
      // Force a complete refresh of passwords data
      const updatedResponse = await getPasswords()
      const updatedPasswords = Array.isArray(updatedResponse.data?.data) ? updatedResponse.data.data : []
      setPasswords(updatedPasswords)
      
      setIsEditDialogOpen(false)
    } catch (err) {
      console.error('Failed to update password:', err)
      setError('Failed to update password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePassword = async () => {
    try {
      setIsLoading(true)
      await deletePassword(passwordToDelete)
      setPasswords((prev) => prev.filter((password) => password._id !== passwordToDelete))
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error('Failed to delete password:', err)
      setError('Failed to delete password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteDialog = (id) => {
    setPasswordToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const openEditDialog = (password) => {
    setCurrentPassword(password)
    setFormData({
      title: password.title,
      username: password.username,
      password: password.password,
      website: password.website,
      notes: password.notes,
      category: password.category,
    })
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-300">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 px-3 py-1 bg-red-800/50 rounded hover:bg-red-800/70"
        >
          Retry
        </button>
      </div>
    )
  }

  const categories = ["All", "Email", "Social Media", "Financial", "Shopping", "Work", "Other"]

  const getCategoryColor = (category) => {
    switch (category) {
      case "Email":
        return "bg-blue-900/30 text-blue-300 border border-blue-800"
      case "Social Media":
        return "bg-purple-900/30 text-purple-300 border border-purple-800"
      case "Financial":
        return "bg-green-900/30 text-green-300 border border-green-800"
      case "Shopping":
        return "bg-amber-900/30 text-amber-300 border border-amber-800"
      case "Work":
        return "bg-red-900/30 text-red-300 border border-red-800"
      default:
        return "bg-slate-800 text-slate-300 border border-slate-700"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6 text-white">
      <DeleteConfirmationModal 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeletePassword}
      />
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Your Passwords</h2>
          <p className="text-slate-400 text-sm mt-1">Securely store and manage all your passwords</p>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          <Plus size={18} className="mr-2" />
          Add Password
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? "bg-emerald-900/30 text-emerald-300 border border-emerald-800"
                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Password List */}
      {filteredPasswords.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
              <Lock size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white">No passwords found</h3>
            <p className="text-slate-400 max-w-md">
              {searchTerm || activeCategory !== "All"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Add your first password to get started with secure password management."}
            </p>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-2 inline-flex items-center justify-center rounded-lg px=4 py-2 font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add Your First Password
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPasswords.map((password) => (
            <div
              key={password._id || password.id}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{password.title}</h3>
                    <div className="flex items-center gap=2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(password.category)}`}>
                        {password.category}
                      </span>
                      <span className="flex items-center text-xs text-slate-400">
                        <Clock size={12} className="mr-1" />
                        {formatDate(password.lastUpdated)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                      onClick={() => openEditDialog(password)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-700"
                      onClick={() => openDeleteDialog(password._id)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Username */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-400">Username</div>
                    <div className="flex items-center">
                      <div className="flex-1 truncate text-slate-200">
                        {visiblePasswords[`username-${password._id}`] ? password.username : "••••••••••••"}
                      </div>
                      <button
                        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                        onClick={() => setVisiblePasswords(prev => ({
                          ...prev,
                          [`username-${password._id}`]: !prev[`username-${password._id}`]
                        }))}
                      >
                        {visiblePasswords[`username-${password._id}`] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                        onClick={() => handleCopy(password.username, `username-${password._id}`)}
                      >
                        {copiedField === `username-${password._id}` ? (
                          <Check size={16} className="text-emerald-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-400">Password</div>
                    <div className="flex items-center">
                      <div className="flex-1 truncate font-mono text-slate-200">
                        {visiblePasswords[`password-${password._id}`] ? password.password : "••••••••••••"}
                      </div>
                      <button
                        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                        onClick={() => setVisiblePasswords(prev => ({
                          ...prev,
                          [`password-${password._id}`]: !prev[`password-${password._id}`]
                        }))}
                      >
                        {visiblePasswords[`password-${password._id}`] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                        onClick={() => handleCopy(password.password, `password-${password._id}`)}
                      >
                        {copiedField === `password-${password._id}` ? (
                          <Check size={16} className="text-emerald-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Website */}
                  {password.website && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-slate-400">Website</div>
                      <div className="flex items-center">
                        <a
                          href={password.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 truncate text-emerald-400 hover:underline"
                        >
                          {password.website}
                        </a>
                        <button
                          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                          onClick={() => handleCopy(password.website, `website-${password._id}`)}
                        >
                          {copiedField === `website-${password._id}` ? (
                            <Check size={16} className="text-emerald-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {password.notes && (
                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <div className="text-xs font-medium text-slate-400 mb-1">Notes</div>
                    <p className="text-sm text-slate-300">{password.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6">
              <div className="mb-5">
                <h3 className="text-xl font-semibold text-white">Add New Password</h3>
                <p className="text-slate-400 text-sm mt-1">Store a new password in your secure vault</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Gmail, Facebook"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Email">Email</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Financial">Financial</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Username or email"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={visiblePasswords.new ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 pr-10 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right=2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {visiblePasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Website</label>
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full h-24 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Additional information"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPassword}
                  className="px-4 py=2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 font-medium"
                >
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6">
              <div className="mb-5">
                <h3 className="text-xl font-semibold text-white">Edit Password</h3>
                <p className="text-slate-400 text-sm mt-1">Update your stored password information</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Email">Email</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Financial">Financial</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y=1">
                  <label className="text-sm font-medium text-slate-300">Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={visiblePasswords.edit ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 pr-10 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      onClick={() => togglePasswordVisibility("edit")}
                    >
                      {visiblePasswords.edit ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Website</label>
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full h-24 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditPassword}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
