"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Edit, Trash, Plus, Search, Copy, Check, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for demonstration
const mockPasswords = [
  {
    id: "1",
    title: "Gmail Account",
    username: "user@gmail.com",
    password: "StrongP@ssw0rd123",
    website: "https://gmail.com",
    notes: "Personal email account",
    category: "Email",
    lastUpdated: "2023-04-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Facebook",
    username: "user.name",
    password: "Fb@ccount2023!",
    website: "https://facebook.com",
    notes: "",
    category: "Social Media",
    lastUpdated: "2023-03-22T14:45:00Z",
  },
  {
    id: "3",
    title: "Amazon",
    username: "user@example.com",
    password: "Sh0pp!ng#Secure",
    website: "https://amazon.com",
    notes: "Prime account",
    category: "Shopping",
    lastUpdated: "2023-05-01T09:15:00Z",
  },
  {
    id: "4",
    title: "Bank Account",
    username: "user123",
    password: "B@nk!ng$ecure2023",
    website: "https://mybank.com",
    notes: "Checking account login",
    category: "Financial",
    lastUpdated: "2023-04-28T16:20:00Z",
  },
]

export function PasswordStorage() {
  const [passwords, setPasswords] = useState([])
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

  // Load mock data
  useEffect(() => {
    setPasswords(mockPasswords)
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

  const filteredPasswords = passwords.filter(
    (password) =>
      password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const handleAddPassword = () => {
    const newPassword = {
      id: Date.now().toString(),
      ...formData,
      lastUpdated: new Date().toISOString(),
    }

    setPasswords((prev) => [...prev, newPassword])
    setFormData({
      title: "",
      username: "",
      password: "",
      website: "",
      notes: "",
      category: "Other",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditPassword = () => {
    setPasswords((prev) =>
      prev.map((password) =>
        password.id === currentPassword.id
          ? { ...password, ...formData, lastUpdated: new Date().toISOString() }
          : password,
      ),
    )
    setIsEditDialogOpen(false)
  }

  const handleDeletePassword = (id) => {
    if (window.confirm("Are you sure you want to delete this password?")) {
      setPasswords((prev) => prev.filter((password) => password.id !== id))
    }
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

  const categories = ["All", "Email", "Social Media", "Financial", "Shopping", "Work", "Other"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Password Storage</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Password
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Password</DialogTitle>
              <DialogDescription>Store a new password in your secure vault</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., Gmail, Facebook"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Email">Email</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Financial">Financial</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Username or email"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="password"
                    name="password"
                    type={visiblePasswords.new ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                    placeholder="Enter password"
                    required
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {visiblePasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Additional information"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPassword}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input placeholder="Search passwords..." value={searchTerm} onChange={handleSearch} className="pl-10" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories.map((category) => (
              <DropdownMenuItem key={category} onClick={() => setSearchTerm(category === "All" ? "" : category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Password List */}
      {filteredPasswords.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-2">
              <p className="text-gray-500">No passwords found</p>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Add Your First Password
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPasswords.map((password) => (
            <Card key={password.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{password.title}</CardTitle>
                    <CardDescription>
                      {password.category} • Last updated {new Date(password.lastUpdated).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(password)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePassword(password.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 space-y-4">
                {/* Username */}
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Username</Label>
                  <div className="flex items-center">
                    <div className="flex-1 truncate">{password.username}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopy(password.username, `username-${password.id}`)}
                    >
                      {copiedField === `username-${password.id}` ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Password</Label>
                  <div className="flex items-center">
                    <div className="flex-1 truncate font-mono">
                      {visiblePasswords[password.id] ? password.password : "••••••••••••"}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => togglePasswordVisibility(password.id)}
                    >
                      {visiblePasswords[password.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopy(password.password, `password-${password.id}`)}
                    >
                      {copiedField === `password-${password.id}` ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Website */}
                {password.website && (
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Website</Label>
                    <div className="flex items-center">
                      <a
                        href={password.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 truncate text-blue-600 hover:underline"
                      >
                        {password.website}
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopy(password.website, `website-${password.id}`)}
                      >
                        {copiedField === `website-${password.id}` ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              {password.notes && (
                <CardFooter className="pt-0">
                  <div className="w-full">
                    <Label className="text-xs text-gray-500">Notes</Label>
                    <p className="text-sm mt-1">{password.notes}</p>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription>Update your stored password information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Email">Email</option>
                <option value="Social Media">Social Media</option>
                <option value="Financial">Financial</option>
                <option value="Shopping">Shopping</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right">
                Username
              </Label>
              <Input
                id="edit-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-password" className="text-right">
                Password
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="edit-password"
                  name="password"
                  type={visiblePasswords.edit ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pr-10"
                  required
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => togglePasswordVisibility("edit")}
                >
                  {visiblePasswords.edit ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-website" className="text-right">
                Website
              </Label>
              <Input
                id="edit-website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPassword}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

