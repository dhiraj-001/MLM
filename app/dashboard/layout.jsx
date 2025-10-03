"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import {
  Home,
  Target,
  Wallet,
  Users,
  Star,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Calendar,
  UserPlus,
  Gift,
  RefreshCw,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  FileText,
  LifeBuoy,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/protected-route"
import { userService } from "@/services/api"

// UI Components
const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-border hover:bg-muted",
    ghost: "hover:bg-muted",
  }
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8 text-lg",
    icon: "h-10 w-10",
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function DashboardLayout({ children }) {
  const { theme, setTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isQuizAvailable, setIsQuizAvailable] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState('default')
  const notificationRef = useRef(null)
  const sidebarRef = useRef(null)
  const pathname = usePathname()

  const { user, logout, token } = useAuth();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (token) {
      fetchNotifications()
      checkQuizAvailability()
    }
    const intervalId = setInterval(() => {
      if (token) {
        fetchNotifications()
        checkQuizAvailability()
      }
    }, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [token])

  useEffect(() => {
    if ('Notification' in window) {
      console.log("Current notification permission:", Notification.permission)
      setPermissionStatus(Notification.permission)
      
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          requestNotificationPermission()
        }, 3000)
        return () => clearTimeout(timer)
      }
    } else {
      console.log("Notifications not supported in this browser")
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Notifications"]')
      ) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isNotificationOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobile, isSidebarOpen])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching notifications with token:", token ? "Present" : "Missing")
      const response = await userService.getNotifications(token)
      console.log("Notification response:", response)
      
      setNotifications(response.notifications || [])
      setUnreadCount(response.unreadCount || 0)
      
      if (response.unreadCount > 0) {
        console.log(`Found ${response.unreadCount} unread notifications`)
        const latestNotification = response.notifications[0]
        console.log("Latest notification:", latestNotification)
        
        if (permissionStatus === 'granted') {
          console.log("Attempting to send push notification for the latest unread notification")
          const notif = sendPushNotification(
            latestNotification.title, 
            latestNotification.message
          )
          
          if (notif) {
            console.log("Push notification sent successfully")
          } else {
            console.log("Failed to send push notification")
          }
        } else {
          console.log("Can't send push notification, permission status:", permissionStatus)
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationIconClick = async () => {
    setIsNotificationOpen(!isNotificationOpen)
    
    if (!isNotificationOpen) {
      setIsRefreshing(true)
      try {
        const response = await userService.getNotifications(token)
        setNotifications(response.notifications || [])
        setUnreadCount(response.unreadCount || 0)
      } catch (error) {
        console.error("Failed to refresh notifications:", error)
      } finally {
        setIsRefreshing(false)
      }
    }
  }
  
  const checkQuizAvailability = async () => {
    try {
      const response = await userService.checkQuizAvailability(token)
      setIsQuizAvailable(response.available)
      
      if (response.available && permissionStatus === 'granted') {
        sendPushNotification(
          "Daily Quiz Available", 
          "Complete today's quiz to earn rewards!"
        )
      }
    } catch (error) {
      console.error("Failed to check quiz availability:", error)
    }
  }
  
  const markAsRead = async (notificationIds = []) => {
    try {
      await userService.markNotificationsAsRead(notificationIds, token)
      setUnreadCount(0)
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif._id) || notificationIds.length === 0
            ? { ...notif, isRead: true }
            : notif
        )
      )
    } catch (error) {
      console.error("Failed to mark notifications as read:", error)
    }
  }
  
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notifications")
      return
    }
    
    try {
      if (Notification.permission === 'granted') {
        setPermissionStatus('granted')
        return true
      } else if (Notification.permission === 'denied') {
        setPermissionStatus('denied')
        console.log("Notifications were previously denied by the user")
        alert("Please enable notifications in your browser settings to receive updates")
        return false
      }
      
      console.log("Requesting notification permission...")
      const permission = await Notification.requestPermission()
      console.log("Permission response:", permission)
      setPermissionStatus(permission)
      
      if (permission === 'granted') {
      sendPushNotification(
        "Notifications Enabled", 
        "You will now receive important updates from UpTradeLevel"
      )
        return true
      } else {
        console.log("Notification permission denied")
        return false
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }
  
  const sendPushNotification = (title, body) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.log("Cannot send notification: permission not granted")
      return null
    }
    
    try {
      console.log("Sending notification:", title, body)
      const options = {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'uptradelevel-notification',
        renotify: true,
        requireInteraction: true
      }
      
      const notification = new Notification(title, options)
      
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
      
      return notification
    } catch (error) {
      console.error("Error sending push notification:", error)
      return null
    }
  }

  const sidebarVariants = {
    open: {
      width: isMobile ? "85%" : "280px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      width: isMobile ? "0" : "80px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const contentVariants = {
    expanded: {
      marginLeft: isMobile ? 0 : "280px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      marginLeft: isMobile ? 0 : "80px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const toggleSubmenu = (menu) => {
    if (activeSubmenu === menu) {
      setActiveSubmenu(null)
    } else {
      setActiveSubmenu(menu)
    }
  }

  const navItems = [
    { icon: Home, label: "Home Dashboard", path: "/dashboard" },
    { icon: Target, label: "Play Daily challange", path: "/dashboard/quiz" },
    {
      icon: Wallet,
      label: "Wallet",
      submenu: [
        { label: "Deposit Funds", path: "/dashboard/deposit" },
        { label: "Withdraw Funds", path: "/dashboard/withdrawal" },
        // { label: "Transfer Balance", path: "/dashboard/transfer" },
        { label: "Transaction History", path: "/dashboard/transactions" },
      ],
    },
    {
      icon: Users,
      label: "My Team",
      submenu: [
        { label: "Direct Referrals", path: "/dashboard/team/direct" },
        { label: "Team Structure", path: "/dashboard/team/structure" },
        { label: "Team Performance", path: "/dashboard/team/performance" },
      ],
    },
    { icon: Star, label: "Star Rank Status", path: "/dashboard/rank" },
    { 
      icon: FileText, 
      label: "Documents", 
      path: "/UPTRADELEVEL.pdf", 
      target: "_blank",
      rel: "noopener noreferrer" 
    },
    { 
      icon: LifeBuoy, 
      label: "Support", 
      path: "mailto:uptradelevel01@gmail.com" 
    },
    { icon: LogOut, label: "Logout", path: "#", onClick: logout },
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'referral':
        return <UserPlus className="h-5 w-5 text-green-500" />
      case 'quiz':
        return <Calendar className="h-5 w-5 text-blue-500" />
      case 'reward':
        return <Gift className="h-5 w-5 text-yellow-500" />
      case 'deposit':
        return <TrendingUp className="h-5 w-5 text-emerald-500" />
      case 'withdrawal':
        return <Wallet className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-primary" />
    }
  }
  
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    
    if (diffSec < 60) return 'just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHour < 24) return `${diffHour}h ago`
    if (diffDay < 7) return `${diffDay}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Mobile Header */}
        <header
          className={`lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg transition-all duration-300 ${
            isScrolled ? "shadow-md border-b border-border/20" : ""
          }`}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full bg-background border border-border/30 text-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <div className="absolute inset-0 bg-primary rounded-full opacity-20 blur-md animate-pulse"></div>
                    <Image src="/logo.png" alt="UpTradeLevel Logo" width={32} height={32} className="relative z-10" />
                  </div>
                  <span className="text-lg font-bold">
                 UpTrade<span className="text-primary">Level</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Notification Icon */}
              <div className="relative">
                <button
                  aria-label="Notifications"
                  onClick={handleNotificationIconClick}
                  className="p-2 rounded-full bg-background border border-border/30 text-foreground relative"
                >
                  {isRefreshing ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown for Mobile */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      ref={notificationRef}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 max-h-[80vh] overflow-auto rounded-lg border border-border/30 bg-background shadow-lg z-50"
                    >
                      <div className="p-3 border-b border-border/30 flex items-center justify-between">
                        <h3 className="font-medium">Notifications</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              setIsRefreshing(true)
                              try {
                                const response = await userService.getNotifications(token)
                                setNotifications(response.notifications || [])
                                setUnreadCount(response.unreadCount || 0)
                              } catch (error) {
                                console.error("Failed to refresh notifications:", error)
                              } finally {
                                setIsRefreshing(false)
                              }
                            }}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                            disabled={isRefreshing}
                          >
                            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                          </button>
                          <button
                            onClick={() => markAsRead()}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark all as read
                          </button>
                        </div>
                      </div>
                      
                      {isLoading ? (
                        <div className="p-4 flex justify-center items-center">
                          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        <div>
                          {notifications.map((notification) => (
                            <div 
                              key={notification._id}
                              className={`p-3 border-b border-border/10 hover:bg-muted/30 transition-colors ${
                                !notification.isRead ? 'bg-primary/5' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="mt-1">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-sm">{notification.title}</h4>
                                    <span className="text-xs text-muted-foreground">
                                      {getRelativeTime(notification.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Notification permission button */}
                      {permissionStatus !== 'granted' && (
                        <div className="p-3 border-t border-border/30">
                          <button
                            onClick={requestNotificationPermission}
                            className="w-full py-2 px-3 rounded-md bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                          >
                            Enable Push Notifications
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <motion.aside
          ref={sidebarRef}
          variants={sidebarVariants}
          initial={isMobile ? "closed" : "open"}
          animate={isSidebarOpen ? "open" : "closed"}
          className={`fixed top-0 left-0 z-50 h-full bg-background border-r border-border/20 shadow-xl overflow-hidden ${
            isMobile ? "shadow-2xl" : ""
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border/10">
            <AnimatePresence>
              {(isSidebarOpen || !isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="relative h-8 w-8">
                    <div className="absolute inset-0 bg-primary rounded-full opacity-20 blur-md animate-pulse"></div>
                    <Image src="/logo.png" alt="MLM Network Logo" width={32} height={32} className="dark:invert relative z-10" />
                  </div>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-lg font-bold whitespace-nowrap"
                    >
                      UpTrade<span className="text-primary">Level</span>
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {isSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronRight className="h-5 w-5 rotate-180" />}
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-border/10">
            <div className="flex items-center gap-3">
             
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <h3 className="font-medium text-sm">{user?.name || user?.email}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Rank:</span>
                      <div className="flex items-center">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${star <= (user?.rank || 1) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2 overflow-y-auto h-[calc(100vh-8rem)]">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          activeSubmenu === item.label ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${activeSubmenu === item.label ? "text-primary" : ""}`} />
                        <AnimatePresence>
                          {isSidebarOpen && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="flex items-center justify-between flex-1"
                            >
                              <span className="font-medium text-sm">{item.label}</span>
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  activeSubmenu === item.label ? "rotate-180" : ""
                                }`}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>

                      <AnimatePresence>
                        {isSidebarOpen && activeSubmenu === item.label && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 ml-4 pl-4 border-l border-border/30 space-y-1"
                          >
                            {item.submenu.map((subItem, subIndex) => (
                              <motion.li
                                key={subIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIndex * 0.05 }}
                              >
                                <Link
                                  href={subItem.path}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span>
                                  {subItem.label}
                                </Link>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={item.onClick}
                      target={item.target}
                      rel={item.rel}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        item.path === "/dashboard" && pathname === "/dashboard" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${item.path === "/dashboard" && pathname === "/dashboard" ? "text-primary" : ""} ${
                          item.label === "Logout" ? "text-red-500" : ""
                        }`}
                      />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`font-medium text-sm ${item.label === "Logout" ? "text-red-500" : ""}`}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/10 bg-background/80 backdrop-blur-sm">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-primary" />}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-medium"
                  >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            ></motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main
          variants={contentVariants}
          initial={isMobile ? "collapsed" : "expanded"}
          animate={isSidebarOpen && !isMobile ? "expanded" : "collapsed"}
          className={`flex-1 ${isMobile ? "mt-16" : ""}`}
        >
          {/* Desktop Header */}
          <header
            className={`hidden lg:flex items-center justify-between p-4 sticky top-0 z-30 bg-background/95 backdrop-blur-lg transition-all duration-300 ${
              isScrolled ? "shadow-md border-b border-border/20" : ""
            }`}
          >
            <div className="flex items-center gap-4 w-full max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-background border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Desktop Notification Icon */}
              <div className="relative">
                <button
                  aria-label="Notifications"
                  onClick={handleNotificationIconClick}
                  className="relative p-2 rounded-full bg-background border border-border/30 text-foreground hover:bg-muted transition-colors"
                >
                  {isRefreshing ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown Header */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      ref={notificationRef}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-96 max-h-[70vh] overflow-auto rounded-lg border border-border/30 bg-background shadow-lg z-50"
                    >
                      <div className="p-3 border-b border-border/30 flex items-center justify-between">
                        <h3 className="font-medium">Notifications</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              setIsRefreshing(true)
                              try {
                                const response = await userService.getNotifications(token)
                                setNotifications(response.notifications || [])
                                setUnreadCount(response.unreadCount || 0)
                              } catch (error) {
                                console.error("Failed to refresh notifications:", error)
                              } finally {
                                setIsRefreshing(false)
                              }
                            }}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                            disabled={isRefreshing}
                          >
                            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                          </button>
                          <button
                            onClick={() => markAsRead()}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark all as read
                          </button>
                        </div>
                      </div>
                      
                      {isLoading ? (
                        <div className="p-4 flex justify-center items-center">
                          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        <div>
                          {notifications.map((notification) => (
                            <div 
                              key={notification._id}
                              className={`p-3 border-b border-border/10 hover:bg-muted/30 transition-colors ${
                                !notification.isRead ? 'bg-primary/5' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="mt-1">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-sm">{notification.title}</h4>
                                    <span className="text-xs text-muted-foreground">
                                      {getRelativeTime(notification.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Notification permission button */}
                      {permissionStatus !== 'granted' && (
                        <div className="p-3 border-t border-border/30">
                          <button
                            onClick={requestNotificationPermission}
                            className="w-full py-2 px-3 rounded-md bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                          >
                            Enable Push Notifications
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quiz Availability Badge */}
              {isQuizAvailable && (
                <Link href="/dashboard/quiz">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium">Daily Quiz Available!</span>
                  </div>
                </Link>
              )}

              <div className="flex items-center gap-3 pl-2 border-l border-border/30">
                
                <div>
                  <h3 className="font-medium text-sm">{user?.name || user?.email}</h3>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 md:p-6 pb-20">
            {children}
          </div>
        </motion.main>

        <footer className="border-t border-border/40 py-4 mt-10">
          <div className="container px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UpTradeLevel. All rights reserved.
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
