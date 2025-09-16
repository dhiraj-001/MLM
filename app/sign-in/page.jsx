"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Lock, Phone, Shield, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function SignIn() {
  const [credentials, setCredentials] = useState({
    phone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { theme, setTheme } = useTheme()
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      await login(credentials)
      router.push("/dashboard")
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    router.push("/forgot-password")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/30 shadow-sm hover:shadow-md transition-all duration-300"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-primary" />}
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
            <motion.div variants={itemVariants} className="mb-8">
              <Link href="/" className="inline-block">
                <div className="flex items-center gap-2 mb-6 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
                    <Image
                      src="/logo.png"
                      alt="MLM Trading Network Logo"
                      width={40}
                      height={40}
                      className="dark:invert relative z-10"
                    />
                  </div>
                  <span className="text-xl font-bold">
                   Level<span className="text-primary">Uptrade</span>                  </span>
                </div>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-background/70 backdrop-blur-xl rounded-2xl border border-border/30 shadow-xl p-8"
            >
              <div className="space-y-2 mb-6">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">Enter your credentials to access your trading account</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center text-red-600"
                >
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={credentials.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium">
                      Password
                    </label>
                    <button 
                      onClick={handleForgotPassword} 
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={credentials.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm">
                    Remember me
                  </label>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </motion.button>
              </form>

              <motion.div variants={itemVariants} className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/sign-up" className="text-primary font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Are you an admin?{" "}
                  <Link href="/admin/sign-in" className="text-primary font-medium hover:underline">
                    Admin Portal
                  </Link>
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right side - Image and trust indicators */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/0"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
            <div className="max-w-md text-center space-y-8">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
                className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-6"
              >
                <Shield className="h-10 w-10" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-3xl font-bold"
              >
                Secure Trading Platform
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-muted-foreground text-lg"
              >
                Join thousands of traders who trust our platform for secure, reliable multi-level trading opportunities.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="pt-8 grid grid-cols-2 gap-6"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-background/50 backdrop-blur-lg p-6 rounded-xl border border-border/30 shadow-lg"
                >
                  <h3 className="font-bold text-2xl">10,000+</h3>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-background/50 backdrop-blur-lg p-6 rounded-xl border border-border/30 shadow-lg"
                >
                  <h3 className="font-bold text-2xl">$14M+</h3>
                  <p className="text-sm text-muted-foreground">Trading Volume</p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="pt-8"
              >
                <div className="flex justify-center space-x-6">
                  {[Shield, Lock, Phone].map((Icon, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5, scale: 1.1 }}
                      className="bg-background/50 backdrop-blur-lg p-3 rounded-full border border-border/30 shadow-lg"
                    >
                      <Icon className="h-6 w-6 text-primary" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
