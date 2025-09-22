"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  TrendingUp,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  UserPlus,
  Activity,
  HelpCircle,
  RefreshCw,
  CreditCard,
  User,
  Wallet,
  ArrowRightLeft,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"

// Dashboard UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-background rounded-lg border border-border/50 shadow-sm ${className}`}>
    {children}
  </div>
)

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

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-primary text-white",
    outline: "bg-transparent border border-border",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

const Avatar = ({ children, className = "" }) => (
  <div className={`relative overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
)

const Progress = ({ value, className = "" }) => (
  <div className={`w-full bg-muted rounded-full overflow-hidden ${className}`}>
    <div
      className="bg-primary h-full transition-all duration-300 ease-in-out"
      style={{ width: `${value}%` }}
    ></div>
  </div>
)

export default function Dashboard() {
  const [progress, setProgress] = useState(67)

  // Auth context
  const { user, token } = useAuth()

  const [referralLink, setReferralLink] = useState("")
  const [userData, setUserData] = useState(null)
  const [loadingData, setLoadingData] = useState(false)
  const [referralStats, setReferralStats] = useState(null)
  const [dailyReward, setDailyReward] = useState(null)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)
  const [transferAmount, setTransferAmount] = useState("")
  const [transferError, setTransferError] = useState("")

  // Set referral link
  useEffect(() => {
    if (user?.referralCode) {
      setReferralLink(`${window.location.origin}/sign-up?ref=${user.referralCode}`)
    }
  }, [user])

  // Fetch user data and stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return

      setLoadingData(true)
      try {
        // Fetch user profile
        const profileData = await userService.getProfile(token)
        console.log("Profile Data:", profileData)
        setUserData(profileData.user)

        // Fetch referral stats
        const referralData = await userService.getReferralCommission(user.id, token)
        console.log("Referral Data:", referralData)
        setReferralStats(referralData)

        // Fetch daily reward
        const rewardData = await userService.getDailyReward(user.id, token)
        setDailyReward(rewardData)
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      } finally {
        setLoadingData(false)
      }
    }

    fetchUserData()
  }, [user, token])

  // Set error message when modal opens and earning balance is 0
  useEffect(() => {
    if (showTransferModal && userData?.earningBalance <= 0) {
      setTransferError("Your earning balance is $0.00. You cannot transfer funds when earning balance is zero.")
    } else if (showTransferModal && userData?.earningBalance > 0) {
      setTransferError("") // Clear error if balance becomes positive
    }
  }, [showTransferModal, userData?.earningBalance])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        alert("Referral link copied to clipboard!")
      })
      .catch(err => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleTransfer = async () => {
    // Clear previous errors
    setTransferError("");

    const amount = parseFloat(transferAmount);

    // Check if earning balance is 0
    if (userData?.earningBalance <= 0) {
      setTransferError("Your earning balance is $0.00. You cannot transfer funds when earning balance is zero.");
      return;
    }

    if (!token || !amount || amount <= 0 || amount > (userData?.earningBalance || 0)) {
      setTransferError("Invalid transfer amount. Please enter a valid amount within your earning balance.");
      return;
    }

    setTransferLoading(true);
    try {
      await userService.transferBalance(amount, token);

      // Re-fetch user profile to get updated balances
      const profileData = await userService.getProfile(token);
      setUserData(profileData.user);

      alert("Transfer successful!");
      setShowTransferModal(false);
      setTransferAmount("");
      setTransferError("");
    } catch (err) {
      console.error("Transfer failed:", err);
      setTransferError(`Transfer failed: ${err.message}`);
    } finally {
      setTransferLoading(false);
    }
  };



  // Recent transactions data
  const recentTransactions = [
    {
      id: 1,
      type: "deposit",
      amount: userData?.depositBalance || 0,
      currency: "USD",
      date: "Today",
      status: "completed",
    },
    {
      id: 2,
      type: "commission",
      amount: referralStats?.totalCommission || 0,
      currency: "USD",
      date: "This month",
      status: "completed",
    },
  ]

  // Team activity based on referral stats
  const teamActivity = referralStats?.recentReferrals?.slice(0, 4).map((ref, idx) => ({
    id: idx + 1,
    name: ref.name || ref.email || "New Member",
    action: "joined your team",
    time: "Recently",
    avatar: "/placeholder.svg?height=40&width=40",
    level: "A",
  })) || [];

  return (
    <>
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name || "Friend"}!</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your network today.</p>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={copyToClipboard}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite Members
            </Button>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="rounded-full">
                <Activity className="mr-2 h-4 w-4" /> Update Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            {
              title: "Total Balance",
              value: `${userData?.balance?.toFixed(2) || "0.00"}`,
              change: "",
              isPositive: true,
              icon: DollarSign,
              color: "primary",
            },
            {
              title: "Deposit Balance",
              value: `${userData?.depositBalance?.toFixed(2) || "0.00"}`,
              change: "",
              isPositive: true,
              icon: Wallet,
              color: "blue",
            },
            {
              title: "Earning Balance",
              value: `${userData?.earningBalance?.toFixed(2) || "0.00"}`,
              change: "",
              isPositive: true,
              icon: TrendingUp,
              color: "green",
            },
            {
              title: "Direct Referrals",
              value: referralStats?.directReferrals || "0",
              change: "",
              isPositive: true,
              icon: Users,
              color: "indigo",
            },
            {
              title: "Commission Earnings",
              value: `${referralStats?.totalCommission?.toFixed(2) || "0.00"}`,
              change: "",
              isPositive: true,
              icon: TrendingUp,
              color: "green",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <Card className="relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <stat.icon
                    className={`h-16 w-16 ${
                      stat.color === "primary"
                        ? "text-primary"
                        : stat.color === "indigo"
                          ? "text-indigo-500"
                          : stat.color === "green"
                            ? "text-green-500"
                          : stat.color === "blue"
                              ? "text-blue-500"
                              : "text-amber-500"
                    }`}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</h3>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    {stat.change && stat.isPositive !== null && (
                      <span
                        className={`text-xs font-medium flex items-center ${
                          stat.isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stat.isPositive ? (
                          <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-0.5" />
                        )}
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <div className="p-6 border-b border-border/10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Your Referral Link</h2>
              </div>
              <p className="text-sm text-muted-foreground">Share this link and earn commissions when new members join</p>
            </div>
            <div className="p-6">
              <div className="bg-muted/30 p-3 rounded-md text-sm break-all mb-4">
                {referralLink || "Loading referral link..."}
              </div>

              <Button
                onClick={copyToClipboard}
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Copy to Clipboard
              </Button>

              {/* Progress Visualization */}
              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Network Growth</h3>
                    <Badge variant="outline" className="rounded-full">Monthly</Badge>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="relative h-[150px] w-full bg-muted/30 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Network Visualization</p>
                    </div>
                    {/* This would be replaced with an actual chart component */}
                    <div className="absolute bottom-0 left-0 right-0 h-[60%]">
                      <svg viewBox="0 0 100 30" className="w-full h-full">
                        <path
                          d="M0,30 L1,28 L2,29 L3,26 L4,25 L5,24 L6,25 L7,24 L8,22 L9,20 L10,18 L11,17 L12,16 L13,17 L14,16 L15,15 L16,14 L17,13 L18,14 L19,13 L20,12 L21,13 L22,12 L23,11 L24,12 L25,11 L26,10 L27,9 L28,10 L29,9 L30,8 L31,9 L32,8 L33,7 L34,8 L35,7 L36,6 L37,7 L38,6 L39,5 L40,6 L41,5 L42,4 L43,5 L44,4 L45,3 L46,4 L47,3 L48,2 L49,3 L50,2 L51,1 L52,2 L53,3 L54,4 L55,5 L56,6 L57,5 L58,6 L59,7 L60,6 L61,7 L62,8 L63,7 L64,8 L65,9 L66,8 L67,9 L68,10 L69,9 L70,10 L71,11 L72,10 L73,11 L74,12 L75,11 L76,12 L77,13 L78,12 L79,13 L80,14 L81,13 L82,14 L83,15 L84,14 L85,15 L86,16 L87,15 L88,16 L89,17 L90,16 L91,17 L92,18 L93,17 L94,18 L95,19 L96,18 L97,19 L98,20 L99,19 L100,20"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="0.5"
                          className="drop-shadow-[0_2px_2px_rgba(var(--primary),0.3)]"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Team Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <div className="p-6 border-b border-border/10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Team Activity</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full">
                    Recent
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Latest actions from your team members</p>
            </div>
            <div className="p-6">
              {loadingData ? (
                <div className="flex items-center justify-center p-6">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : teamActivity.length > 0 ? (
                <div className="space-y-4">
                  {teamActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.action} - {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  No recent team activity
                </div>
              )}
            </div>
          </Card>
        </motion.section>

        {/* Quick Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <div className="p-6 border-b border-border/10">
              <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
              <p className="text-sm text-muted-foreground">Common tasks and operations</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/dashboard/deposit">
                  <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3 cursor-pointer">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Deposit Funds</h3>
                      <p className="text-xs text-muted-foreground">Add money to your account</p>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard/withdrawal">
                  <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3 cursor-pointer">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Withdraw</h3>
                      <p className="text-xs text-muted-foreground">Cash out your earnings</p>
                    </div>
                  </div>
                </Link>

                <div onClick={() => setShowTransferModal(true)} className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3 cursor-pointer">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <ArrowRightLeft className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Transfer Balance</h3>
                      <p className="text-xs text-muted-foreground">Move funds between balances</p>
                    </div>
                </div>

                <Link href="/dashboard/profile">
                  <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3 cursor-pointer">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Profile</h3>
                      <p className="text-xs text-muted-foreground">Update your information</p>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard/support">
                  <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3 cursor-pointer">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Support</h3>
                      <p className="text-xs text-muted-foreground">Get help with issues</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Recent Transactions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <div className="p-6 border-b border-border/10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Account Summary</h2>
              </div>
              <p className="text-sm text-muted-foreground">Your financial overview</p>
            </div>
            <div className="p-6 space-y-4">
              {loadingData ? (
                <div className="flex items-center justify-center p-6">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : recentTransactions.length > 0 ? (
                <>
                  {recentTransactions.map((transaction, idx) => (
                    <div key={transaction.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded-full ${
                            transaction.status === "completed" ? "bg-green-500" : "bg-amber-500"
                          }`}
                        ></span>
                        <p className="text-sm font-medium">
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {transaction.amount.toFixed(2)} {transaction.currency}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 mt-4 border-t border-border/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Daily Reward:</span>
                      <span className="text-sm font-medium text-green-500">
                        ${dailyReward?.dailyEarning?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  No transactions found
                </div>
              )}

              <Link href="/dashboard/transactions">
                <Button variant="outline" className="w-full mt-4">
                  View All Transactions
                </Button>
              </Link>
            </div>
          </Card>
        </motion.section>
      </div>

      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4">Transfer Balance</h2>

            <p className="text-sm text-muted-foreground mb-2">
              Move funds from your earning balance into your deposit balance.
            </p>

            <div className="mb-4">
              <p className="text-sm font-medium">Earning Balance:</p>
              <p className={`text-lg font-bold ${userData?.earningBalance <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${userData?.earningBalance?.toFixed(2) || "0.00"}
              </p>

              {/* Error Message - Below Balance */}
              {(transferError || (showTransferModal && userData?.earningBalance <= 0)) && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    {transferError || "Your earning balance is $0.00. You cannot transfer funds when earning balance is zero."}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="amount" className="text-sm font-medium">Amount to Transfer:</label>
              <input
                id="amount"
                type="number"
                value={transferAmount}
                onChange={(e) => {
                  setTransferAmount(e.target.value);
                  setTransferError(""); // Clear error when user starts typing
                }}
                placeholder="Enter amount"
                className="w-full mt-1 p-2 border rounded-md bg-muted/50"
                disabled={userData?.earningBalance <= 0}
              />
            </div>

            <Button
              onClick={handleTransfer}
              className="w-full mb-3"
              disabled={transferLoading || !transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > (userData?.earningBalance || 0) || userData?.earningBalance <= 0}
            >
              {transferLoading ? "Transferring..." : "Transfer"}
            </Button>

            <Button
              onClick={() => {
                setShowTransferModal(false);
                setTransferError("");
                setTransferAmount("");
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
