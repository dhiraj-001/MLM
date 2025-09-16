"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"
import ProtectedRoute from "@/components/protected-route"
import { ArrowLeft, Star, RefreshCw, Award, Zap, Users, Trophy, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export default function StarRankStatus() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [monthlyRewardData, setMonthlyRewardData] = useState(null)
  const [referralData, setReferralData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRankData = async () => {
      if (!user?.id) return
      
      setLoading(true)
      try {
        // Fetch both monthly reward and referral commission data
        const [monthlyReward, referralCommission] = await Promise.all([
          userService.getMonthlyReward(user.id, token),
          userService.getReferralCommission(user.id, token)
        ])
        
        setMonthlyRewardData(monthlyReward)
        setReferralData(referralCommission)
      } catch (err) {
        console.error("Failed to fetch rank data:", err)
        setError("Failed to load rank information. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchRankData()
  }, [user, token])

  // Define the star rank requirements
  const starRanks = [
    { star: "6-Star", direct: 150, team: 2000, reward: 3000 },
    { star: "5-Star", direct: 100, team: 1200, reward: 2000 },
    { star: "4-Star", direct: 75, team: 700, reward: 1200 },
    { star: "3-Star", direct: 50, team: 400, reward: 800 },
    { star: "2-Star", direct: 30, team: 200, reward: 500 },
    { star: "1-Star", direct: 15, team: 80, reward: 250 },
    { star: "0-Star", direct: 0, team: 0, reward: 0 },
  ]

  // Get current user rank
  const currentRank = monthlyRewardData?.currentRank || "0-Star"
  
  // Find current rank index and next rank
  const currentRankIndex = starRanks.findIndex(rank => rank.star === currentRank)
  const nextRank = currentRankIndex > 0 ? starRanks[currentRankIndex - 1] : null

  // Calculate progress to next rank
  const calculateProgress = (current, target, value) => {
    if (value >= target) return 100
    if (current === target) return 100
    return Math.min(Math.round((value / target) * 100), 99)
  }

  // Get direct referrals and team size
  const directReferrals = monthlyRewardData?.directReferrals || 0
  const teamSize = monthlyRewardData?.totalTeamMembers || 0

  // Calculate progress percentages
  const directProgress = nextRank ? calculateProgress(directReferrals, nextRank.direct, directReferrals) : 100
  const teamProgress = nextRank ? calculateProgress(teamSize, nextRank.team, teamSize) : 100

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
            <h1 className="text-2xl font-bold">Star Rank Status</h1>
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
              {/* Current Rank Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-background rounded-lg border border-border/40 shadow-sm p-8 mb-8"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto md:mx-0">
                      <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-yellow-400 to-amber-600 w-full h-full rounded-full flex items-center justify-center z-10">
                        <Award className="h-12 w-12 md:h-16 md:w-16 text-white" />
                      </div>
                      <div className="absolute top-0 right-0 bg-background rounded-full border-2 border-yellow-400 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center z-20">
                        <span className="font-bold text-yellow-600">{currentRank.split('-')[0]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                      Your Current Rank: {currentRank}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      You've built a network of {teamSize} members with {directReferrals} direct referrals.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-muted/40 px-4 py-2 rounded-lg">
                        <p className="text-sm text-muted-foreground">Monthly Bonus</p>
                        <p className="text-lg font-bold text-green-500">${monthlyRewardData?.monthlyBonus || 0}</p>
                      </div>
                      
                      <div className="bg-muted/40 px-4 py-2 rounded-lg">
                        <p className="text-sm text-muted-foreground">Commission Rate</p>
                        <p className="text-lg font-bold text-primary">
                          {referralData?.commissionPercentages?.A 
                            ? `${(referralData.commissionPercentages.A * 100).toFixed(1)}%` 
                            : "0%"}
                        </p>
                      </div>
                      
                      <div className="bg-muted/40 px-4 py-2 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Commission</p>
                        <p className="text-lg font-bold">${referralData?.totalCommission?.toFixed(2) || "0.00"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Next Rank Progress */}
              {nextRank && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-background rounded-lg border border-border/40 shadow-sm p-6 mb-8"
                >
                  <h2 className="text-xl font-bold mb-4">Progress to {nextRank.star}</h2>
                  <p className="text-muted-foreground mb-6">
                    Complete the following requirements to advance to the next rank and increase your rewards.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium">Direct Referrals</span>
                        </div>
                        <span className="text-sm font-medium">
                          {directReferrals} / {nextRank.direct}
                        </span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${directProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {nextRank.direct - directReferrals > 0 
                          ? `You need ${nextRank.direct - directReferrals} more direct referrals`
                          : "Requirement completed!"}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-amber-500" />
                          <span className="font-medium">Team Size</span>
                        </div>
                        <span className="text-sm font-medium">
                          {teamSize} / {nextRank.team}
                        </span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${teamProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {nextRank.team - teamSize > 0 
                          ? `You need ${nextRank.team - teamSize} more team members`
                          : "Requirement completed!"}
                      </p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">Monthly Bonus at {nextRank.star}</span>
                      </div>
                      <p className="text-2xl font-bold text-green-500">${nextRank.reward}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {monthlyRewardData?.monthlyBonus 
                          ? `That's a $${nextRank.reward - monthlyRewardData.monthlyBonus} increase from your current bonus!`
                          : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* All Rank Levels */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-background rounded-lg border border-border/40 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border/40">
                  <h2 className="text-xl font-semibold">Star Rank Levels</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    All available ranks and their requirements
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-6 py-3 text-left text-sm font-semibold">Rank</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Direct Referrals</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Team Size</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Monthly Bonus</th>
                        <th className="px-6 py-3 text-sm font-semibold"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {starRanks.slice(0, -1).map((rank, index) => (
                        <tr 
                          key={rank.star}
                          className={`${rank.star === currentRank ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(parseInt(rank.star.split('-')[0]))].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      rank.star === currentRank ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-400'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="font-medium">{rank.star}</span>
                              {rank.star === currentRank && (
                                <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {rank.direct}
                            {rank.star === currentRank && directReferrals < rank.direct && (
                              <span className="ml-1 text-amber-600">
                                ({rank.direct - directReferrals} needed)
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {rank.team}
                            {rank.star === currentRank && teamSize < rank.team && (
                              <span className="ml-1 text-amber-600">
                                ({rank.team - teamSize} needed)
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">${rank.reward}</td>
                          <td className="px-6 py-4 text-right">
                            {rank.star === nextRank?.star && (
                              <span className="text-xs text-primary flex items-center justify-end">
                                Next Rank <ChevronRight className="h-4 w-4" />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
