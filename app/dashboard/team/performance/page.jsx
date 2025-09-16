"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"
import ProtectedRoute from "@/components/protected-route"
import { ArrowLeft, RefreshCw, TrendingUp, BarChart2, PieChart, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

export default function TeamPerformance() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [referralData, setReferralData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!user?.id) return
      
      setLoading(true)
      try {
        const response = await userService.getReferralCommission(user.id, token)
        console.log("Referral Commission Data:", response)
        setReferralData(response)
      } catch (err) {
        console.error("Failed to fetch referral data:", err)
        setError("Failed to load team performance data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchReferralData()
  }, [user, token])

  // Helper to format currency
  const formatCurrency = (amount) => {
    return amount?.toFixed(2) || "0.00"
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link 
              href="/dashboard" 
              className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Team Performance</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Commission</p>
                        <h3 className="text-2xl font-bold">${formatCurrency(referralData?.totalCommission)}</h3>
                      </div>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Commission Rate</p>
                        <h3 className="text-2xl font-bold">
                          {(referralData?.commissionPercentages?.A * 100).toFixed(1)}%
                          <span className="text-sm text-muted-foreground ml-1">Level A</span>
                        </h3>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>0%</span>
                      <span>25%</span>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500" 
                        style={{ width: `${(referralData?.commissionPercentages?.A * 100) * 4}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <BarChart2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Network Size</p>
                        <div className="flex items-baseline gap-1">
                          <h3 className="text-2xl font-bold">{referralData?.totalTeamMembers}</h3>
                          <span className="text-sm text-green-500">+{referralData?.directReferrals}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Team Members: {referralData?.totalTeamMembers}</span>
                      <span>Direct: {referralData?.directReferrals}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <PieChart className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Rank</p>
                        <h3 className="text-2xl font-bold">{referralData?.currentRank}</h3>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Link href="/dashboard/rank" className="text-primary hover:underline">
                        View rank details →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Commission Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
              >
                {/* Commission by Level */}
                <div className="bg-background rounded-lg border border-border/40 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-border/40">
                    <h2 className="text-xl font-semibold">Commission by Level</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Breakdown of commissions earned from each level
                    </p>
                  </div>
                  
                  <div className="p-6">
                    {/* Level A */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="font-medium">Level A (Direct)</span>
                        </div>
                        <span className="font-medium">${formatCurrency(referralData?.commissionBreakdown?.fromDirectReferrals)}</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ 
                            width: `${(referralData?.commissionBreakdown?.fromDirectReferrals / referralData?.totalCommission) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Rate: {(referralData?.commissionPercentages?.A * 100).toFixed(1)}%</span>
                        <span>Total Balance: ${formatCurrency(referralData?.balanceSummary?.levelA_TotalBalance)}</span>
                      </div>
                    </div>
                    
                    {/* Level B */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                          <span className="font-medium">Level B</span>
                        </div>
                        <span className="font-medium">${formatCurrency(referralData?.commissionBreakdown?.fromLevelB)}</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ 
                            width: `${(referralData?.commissionBreakdown?.fromLevelB / referralData?.totalCommission) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Rate: {(referralData?.commissionPercentages?.B * 100).toFixed(1)}%</span>
                        <span>Total Balance: ${formatCurrency(referralData?.balanceSummary?.levelB_TotalBalance)}</span>
                      </div>
                    </div>
                    
                    {/* Level C */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="font-medium">Level C</span>
                        </div>
                        <span className="font-medium">${formatCurrency(referralData?.commissionBreakdown?.fromLevelC)}</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ 
                            width: `${(referralData?.commissionBreakdown?.fromLevelC / referralData?.totalCommission) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Rate: {(referralData?.commissionPercentages?.C * 100).toFixed(1)}%</span>
                        <span>Total Balance: ${formatCurrency(referralData?.balanceSummary?.levelC_TotalBalance)}</span>
                      </div>
                    </div>
                    
                    {/* Level D */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                          <span className="font-medium">Level D</span>
                        </div>
                        <span className="font-medium">${formatCurrency(referralData?.commissionBreakdown?.fromLevelD)}</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ 
                            width: `${(referralData?.commissionBreakdown?.fromLevelD / referralData?.totalCommission) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Rate: {(referralData?.commissionPercentages?.D * 100).toFixed(1)}%</span>
                        <span>Total Balance: ${formatCurrency(referralData?.balanceSummary?.levelD_TotalBalance)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Team Balance Distribution */}
                <div className="bg-background rounded-lg border border-border/40 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-border/40">
                    <h2 className="text-xl font-semibold">Team Balance Distribution</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total balance distribution across network levels
                    </p>
                  </div>
                  
                  <div className="p-6">
                    {/* Donut Chart Visualization (Simplified) */}
                    <div className="relative w-full aspect-square max-w-[300px] mx-auto mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold">${formatCurrency(
                            referralData?.balanceSummary?.levelA_TotalBalance +
                            referralData?.balanceSummary?.levelB_TotalBalance +
                            referralData?.balanceSummary?.levelC_TotalBalance +
                            referralData?.balanceSummary?.levelD_TotalBalance
                          )}</div>
                          <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                      </div>
                      
                      {/* Simplified Donut Chart using CSS */}
                      <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                        {/* Level A */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="hsl(var(--primary))"
                          strokeWidth="20"
                          strokeDasharray={`${calculatePercentage(referralData?.balanceSummary?.levelA_TotalBalance, referralData)} ${100 - calculatePercentage(referralData?.balanceSummary?.levelA_TotalBalance, referralData)}`}
                          strokeDashoffset="0"
                          fill="none"
                        />
                        
                        {/* Level B */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="hsl(226, 70%, 55%)" // indigo-500
                          strokeWidth="20"
                          strokeDasharray={`${calculatePercentage(referralData?.balanceSummary?.levelB_TotalBalance, referralData)} ${100 - calculatePercentage(referralData?.balanceSummary?.levelB_TotalBalance, referralData)}`}
                          strokeDashoffset={`${-1 * calculatePercentage(referralData?.balanceSummary?.levelA_TotalBalance, referralData)}`}
                          fill="none"
                        />
                        
                        {/* Level C */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="hsl(217, 91%, 60%)" // blue-500
                          strokeWidth="20"
                          strokeDasharray={`${calculatePercentage(referralData?.balanceSummary?.levelC_TotalBalance, referralData)} ${100 - calculatePercentage(referralData?.balanceSummary?.levelC_TotalBalance, referralData)}`}
                          strokeDashoffset={`${-1 * (
                            calculatePercentage(referralData?.balanceSummary?.levelA_TotalBalance, referralData) + 
                            calculatePercentage(referralData?.balanceSummary?.levelB_TotalBalance, referralData)
                          )}`}
                          fill="none"
                        />
                        
                        {/* Level D */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="hsl(45, 93%, 47%)" // amber-500
                          strokeWidth="20"
                          strokeDasharray={`${calculatePercentage(referralData?.balanceSummary?.levelD_TotalBalance, referralData)} ${100 - calculatePercentage(referralData?.balanceSummary?.levelD_TotalBalance, referralData)}`}
                          strokeDashoffset={`${-1 * (
                            calculatePercentage(referralData?.balanceSummary?.levelA_TotalBalance, referralData) + 
                            calculatePercentage(referralData?.balanceSummary?.levelB_TotalBalance, referralData) +
                            calculatePercentage(referralData?.balanceSummary?.levelC_TotalBalance, referralData)
                          )}`}
                          fill="none"
                        />
                      </svg>
                    </div>
                    
                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Level A: ${formatCurrency(referralData?.balanceSummary?.levelA_TotalBalance)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                        <span className="text-sm">Level B: ${formatCurrency(referralData?.balanceSummary?.levelB_TotalBalance)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Level C: ${formatCurrency(referralData?.balanceSummary?.levelC_TotalBalance)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm">Level D: ${formatCurrency(referralData?.balanceSummary?.levelD_TotalBalance)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Potential Earnings Projections */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="bg-background rounded-lg border border-border/40 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-semibold">Performance Insights</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Strategic insights for maximizing your team earnings
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recommendation 1 */}
                    <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                      <h3 className="font-medium text-primary mb-2">Direct Referrals Impact</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Each new direct referral increases your commission by approximately 
                        <span className="font-medium text-foreground"> ${((referralData?.balanceSummary?.levelA_TotalBalance / (referralData?.directReferrals || 1)) * (referralData?.commissionPercentages?.A)).toFixed(2)}</span> on average.
                      </p>
                      <div className="text-xs text-primary">
                        Focus on growing your direct referrals for highest impact.
                      </div>
                    </div>
                    
                    {/* Recommendation 2 */}
                    <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                      <h3 className="font-medium text-indigo-500 mb-2">Level Distribution</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your highest earning level is 
                        <span className="font-medium text-foreground"> {
                          getHighestEarningLevel(referralData?.commissionBreakdown)
                        }</span>, generating {getHighestEarningPercentage(referralData?.commissionBreakdown, referralData?.totalCommission)}% of your total commission.
                      </p>
                      <div className="text-xs text-indigo-500">
                        A balanced network across all levels maximizes earnings.
                      </div>
                    </div>
                    
                    {/* Recommendation 3 */}
                    <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                      <h3 className="font-medium text-green-500 mb-2">Next Milestone</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {getNextMilestone(referralData)}
                      </p>
                      <div className="text-xs text-green-500">
                        Continue building your network to reach the next commission stage.
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h3 className="font-medium text-primary mb-2">Current Commission Stage</h3>
                    <p className="text-sm mb-3">
                      You're currently at {referralData?.currentRank} with rates:
                      Level A: {(referralData?.commissionPercentages?.A * 100).toFixed(1)}%,
                      Level B: {(referralData?.commissionPercentages?.B * 100).toFixed(1)}%,
                      Level C: {(referralData?.commissionPercentages?.C * 100).toFixed(1)}%,
                      Level D: {(referralData?.commissionPercentages?.D * 100).toFixed(1)}%
                    </p>
                    <div className="flex justify-end">
                      <Link href="/dashboard/rank" className="text-sm text-primary hover:underline">
                        View all stages →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Helper functions for chart calculations and insights
function calculatePercentage(levelBalance, referralData) {
  if (!levelBalance || !referralData) return 0
  
  const totalBalance = 
    referralData.balanceSummary?.levelA_TotalBalance +
    referralData.balanceSummary?.levelB_TotalBalance +
    referralData.balanceSummary?.levelC_TotalBalance +
    referralData.balanceSummary?.levelD_TotalBalance
    
  if (!totalBalance) return 0
  
  return (levelBalance / totalBalance) * 100
}

function getHighestEarningLevel(commissionBreakdown) {
  if (!commissionBreakdown) return "Level A"
  
  const commissions = [
    { level: "Level A", amount: commissionBreakdown.fromDirectReferrals || 0 },
    { level: "Level B", amount: commissionBreakdown.fromLevelB || 0 },
    { level: "Level C", amount: commissionBreakdown.fromLevelC || 0 },
    { level: "Level D", amount: commissionBreakdown.fromLevelD || 0 },
  ]
  
  commissions.sort((a, b) => b.amount - a.amount)
  return commissions[0].level
}

function getHighestEarningPercentage(commissionBreakdown, totalCommission) {
  if (!commissionBreakdown || !totalCommission) return 0
  
  const commissions = [
    { level: "Level A", amount: commissionBreakdown.fromDirectReferrals || 0 },
    { level: "Level B", amount: commissionBreakdown.fromLevelB || 0 },
    { level: "Level C", amount: commissionBreakdown.fromLevelC || 0 },
    { level: "Level D", amount: commissionBreakdown.fromLevelD || 0 },
  ]
  
  commissions.sort((a, b) => b.amount - a.amount)
  return ((commissions[0].amount / totalCommission) * 100).toFixed(0)
}

function getNextMilestone(referralData) {
  if (!referralData) return "Add your first team member to start earning commissions."
  
  // Commission stages from the backend
  const stages = [
    { direct: 50, team: 500, A: 0.21, B: 0.11, C: 0.1, D: 0.06 },
    { direct: 45, team: 350, A: 0.2, B: 0.1, C: 0.09, D: 0.05 },
    { direct: 35, team: 250, A: 0.18, B: 0.09, C: 0.08, D: 0.04 },
    { direct: 25, team: 100, A: 0.16, B: 0.08, C: 0.07, D: 0.03 },
    { direct: 15, team: 50, A: 0.15, B: 0.07, C: 0.05, D: 0.02 },
    { direct: 6, team: 30, A: 0.13, B: 0.06, C: 0.02, D: 0.01 },
    { direct: 3, team: 10, A: 0.12, B: 0.05, C: 0.02, D: 0.01 },
    { direct: 0, team: 0, A: 0, B: 0, C: 0, D: 0 },
  ]
  
  const directReferrals = referralData.directReferrals || 0
  const teamSize = referralData.totalTeamMembers || 0
  
  // Find current stage
  const currentStageIndex = stages.findIndex(stage => directReferrals >= stage.direct && teamSize >= stage.team)
  
  // If at top stage already
  if (currentStageIndex === 0) {
    return "You've reached the highest commission stage! Continue growing your network for more earnings."
  }
  
  // Next stage
  const nextStage = stages[currentStageIndex - 1]
  
  const directNeeded = Math.max(0, nextStage.direct - directReferrals)
  const teamNeeded = Math.max(0, nextStage.team - teamSize)
  
  if (directNeeded > 0 && teamNeeded > 0) {
    return `You need ${directNeeded} more direct referrals and ${teamNeeded} more team members to reach the next commission stage.`
  } else if (directNeeded > 0) {
    return `You need ${directNeeded} more direct referrals to reach the next commission stage.`
  } else if (teamNeeded > 0) {
    return `You need ${teamNeeded} more team members to reach the next commission stage.`
  } else {
    return "Keep growing your network to maintain your current commission stage."
  }
}
