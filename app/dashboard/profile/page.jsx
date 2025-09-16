"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"
import { Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const { user, token, logout } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [activeTab, setActiveTab] = useState("email")

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        phone: user.phone || "",
      }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validateForm = () => {
    setMessage({ type: "", text: "" })

    if (activeTab === "email" && !formData.email) {
      setMessage({ type: "error", text: "Email is required" })
      return false
    }

    if (activeTab === "phone" && !formData.phone) {
      setMessage({ type: "error", text: "Phone number is required" })
      return false
    }

    if (activeTab === "password") {
      if (!formData.currentPassword) {
        setMessage({ type: "error", text: "Current password is required" })
        return false
      }

      if (!formData.newPassword) {
        setMessage({ type: "error", text: "New password is required" })
        return false
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: "error", text: "New passwords don't match" })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      // Create update data based on active tab
      const updateData = {}
      
      if (activeTab === "email") {
        updateData.email = formData.email
      } else if (activeTab === "phone") {
        updateData.phone = formData.phone
      } else if (activeTab === "password") {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }
      
      const response = await userService.updateProfile(updateData, token)
      
      setMessage({ 
        type: "success", 
        text: response.message || "Profile updated successfully. You will be logged out in a few seconds." 
      })
      
      // Clear password fields after successful update
      if (activeTab === "password") {
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }))
      }
      
      // Logout user after any profile update
      setTimeout(() => {
        logout()
        window.location.href = "/sign-in"
      }, 3000)
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.message || "Failed to update profile" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Update Your Profile</h1>
      
      <div className="bg-background rounded-lg border border-border shadow-sm p-6 mb-8">
        <div className="flex border-b border-border mb-6">
          <button 
            className={`pb-2 px-4 font-medium ${activeTab === "email" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("email")}
          >
            Email
          </button>
          <button 
            className={`pb-2 px-4 font-medium ${activeTab === "phone" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("phone")}
          >
            Phone Number
          </button>
          <button 
            className={`pb-2 px-4 font-medium ${activeTab === "password" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>
        </div>
        
        {message.text && (
          <div className={`p-4 mb-6 rounded-md ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {activeTab === "email" && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your email"
              />
            </div>
          )}
          
          {activeTab === "phone" && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your phone number"
              />
            </div>
          )}
          
          {activeTab === "password" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="currentPassword">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter your current password"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter new password"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Confirm new password"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : `Update ${activeTab === "email" ? "Email" : activeTab === "phone" ? "Phone Number" : "Password"}`}
          </button>
        </form>
      </div>
    </div>
  )
}
