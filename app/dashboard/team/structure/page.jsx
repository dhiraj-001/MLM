"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"
import ProtectedRoute from "@/components/protected-route"
import { ArrowLeft, Users, RefreshCw, Search, Network, Share2, GitBranchPlus, GitPullRequestIcon } from "lucide-react"
import { motion } from "framer-motion"

export default function TeamStructure() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [teamData, setTeamData] = useState(null)
  const [error, setError] = useState(null)
  const [activeLevelTab, setActiveLevelTab] = useState("all")

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!user?.id) return
      
      setLoading(true)
      try {
        const response = await userService.getTeamMembers(user.id, token)
        setTeamData(response)
      } catch (err) {
        console.error("Failed to fetch team data:", err)
        setError("Failed to load team members. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [user, token])
  
  // Organize team members by level
  const levelAMembers = teamData?.teamMembers?.filter(member => member.level === 1) || []
  const levelBMembers = teamData?.teamMembers?.filter(member => member.level === 2) || []
  const levelCMembers = teamData?.teamMembers?.filter(member => member.level === 3) || []
  const levelDMembers = teamData?.teamMembers?.filter(member => member.level === 4) || []
  
  // Get displayed members based on active tab
  const getDisplayedMembers = () => {
    switch (activeLevelTab) {
      case "a": return levelAMembers
      case "b": return levelBMembers
      case "c": return levelCMembers
      case "d": return levelDMembers
      default: return teamData?.teamMembers || []
    }
  }
  
  const displayedMembers = getDisplayedMembers()

  // Node colors by level
  const getLevelColor = (level) => {
    switch (level) {
      case 1: return "bg-primary/10 text-primary border-primary/30"
      case 2: return "bg-indigo-500/10 text-indigo-500 border-indigo-500/30"
      case 3: return "bg-blue-500/10 text-blue-500 border-blue-500/30"
      case 4: return "bg-amber-500/10 text-amber-500 border-amber-500/30"
      default: return "bg-muted/50 text-muted-foreground border-border/30"
    }
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
            <h1 className="text-2xl font-bold">Team Structure</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:col-span-2"
            >
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Team Members</p>
                    <h3 className="text-2xl font-bold mt-1">{teamData?.totalTeamMembers || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Network className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="col-span-1"
            >
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                <p className="text-sm text-muted-foreground">Level A</p>
                <h3 className="text-xl font-bold mt-1">{levelAMembers.length}</h3>
                <p className="text-xs text-muted-foreground mt-1">Direct Referrals</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="col-span-1"
            >
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                <p className="text-sm text-muted-foreground">Level B</p>
                <h3 className="text-xl font-bold mt-1">{levelBMembers.length}</h3>
                <p className="text-xs text-muted-foreground mt-1">2nd Level</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="md:col-span-2 lg:col-span-1"
            >
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                <p className="text-sm text-muted-foreground">Level C+D</p>
                <h3 className="text-xl font-bold mt-1">{levelCMembers.length + levelDMembers.length}</h3>
                <p className="text-xs text-muted-foreground mt-1">3rd & 4th Levels</p>
              </div>
            </motion.div>
          </div>

          {/* Network Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-background rounded-lg border border-border/40 shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6">Network Visualization</h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : teamData?.teamMembers?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                <Share2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No team members yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Share your referral link to start building your network. As you gather referrals, you'll see your team structure visualized here.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Network Tree Visualization */}
                <div className="overflow-auto">
                  <div className="min-h-[400px] min-w-[700px] flex flex-col items-center p-4">
                    {/* You - Root Node */}
                    <div className="relative flex flex-col items-center">
                      <div className="z-10 p-3 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 font-medium mb-10">
                        You ({user?.email?.split('@')[0]})
                      </div>
                      
                      {/* Level A - Direct Referrals */}
                      {levelAMembers.length > 0 && (
                        <div className="w-full relative mb-12">
                          <div className="absolute top-[-20px] left-0 right-0 h-px bg-border/40"></div>
                          <div className="absolute top-[-20px] left-1/2 w-px h-[20px] bg-border/40"></div>
                          
                          <p className="text-xs text-muted-foreground mb-3 text-center">Level A - Direct Referrals</p>
                          
                          <div className="flex flex-wrap justify-center gap-4">
                            {levelAMembers.slice(0, 12).map((member, index) => (
                              <motion.div
                                key={member._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-2 rounded-lg border ${getLevelColor(member.level)}`}
                              >
                                <p className="text-xs">{member.email?.split('@')[0]}</p>
                              </motion.div>
                            ))}
                            {levelAMembers.length > 12 && (
                              <div className="p-2 rounded-lg border border-border/30 bg-muted/30">
                                <p className="text-xs">+{levelAMembers.length - 12} more</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Level B */}
                      {levelBMembers.length > 0 && (
                        <div className="w-full relative mb-12">
                          <div className="absolute top-[-20px] left-1/4 right-1/4 h-px bg-border/40"></div>
                          <div className="absolute top-[-20px] left-1/2 w-px h-[20px] bg-border/40"></div>
                          
                          <p className="text-xs text-muted-foreground mb-3 text-center">Level B</p>
                          
                          <div className="flex flex-wrap justify-center gap-4">
                            {levelBMembers.slice(0, 10).map((member, index) => (
                              <motion.div
                                key={member._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                className={`p-2 rounded-lg border ${getLevelColor(member.level)}`}
                              >
                                <p className="text-xs">{member.email?.split('@')[0]}</p>
                              </motion.div>
                            ))}
                            {levelBMembers.length > 10 && (
                              <div className="p-2 rounded-lg border border-border/30 bg-muted/30">
                                <p className="text-xs">+{levelBMembers.length - 10} more</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Level C and D - Simplified View */}
                      {(levelCMembers.length > 0 || levelDMembers.length > 0) && (
                        <div className="w-full relative">
                          <div className="absolute top-[-20px] left-1/3 right-1/3 h-px bg-border/40"></div>
                          <div className="absolute top-[-20px] left-1/2 w-px h-[20px] bg-border/40"></div>
                          
                          <p className="text-xs text-muted-foreground mb-3 text-center">Levels C & D</p>
                          
                          <div className="flex justify-center gap-4">
                            {levelCMembers.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10"
                              >
                                <p className="text-sm text-blue-500 font-medium">{levelCMembers.length} Level C Members</p>
                              </motion.div>
                            )}
                            
                            {levelDMembers.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10"
                              >
                                <p className="text-sm text-amber-500 font-medium">{levelDMembers.length} Level D Members</p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                  <div className="text-xs text-muted-foreground">Levels:</div>
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-primary"></span>
                    <span className="text-xs">A</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
                    <span className="text-xs">B</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                    <span className="text-xs">C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                    <span className="text-xs">D</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Team Members List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-background rounded-lg border border-border/40 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-semibold">All Team Members</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Complete list of all members in your network
              </p>
            </div>
            
            {/* Level Tabs */}
            <div className="flex border-b border-border/40">
              <button
                onClick={() => setActiveLevelTab("all")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeLevelTab === "all" 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveLevelTab("a")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeLevelTab === "a" 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Level A
              </button>
              <button
                onClick={() => setActiveLevelTab("b")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeLevelTab === "b" 
                    ? "border-b-2 border-indigo-500 text-indigo-500" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Level B
              </button>
              <button
                onClick={() => setActiveLevelTab("c")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeLevelTab === "c" 
                    ? "border-b-2 border-blue-500 text-blue-500" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Level C
              </button>
              <button
                onClick={() => setActiveLevelTab("d")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeLevelTab === "d" 
                    ? "border-b-2 border-amber-500 text-amber-500" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Level D
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : displayedMembers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No members at this level</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  As your network grows, you'll start seeing members at this level.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Level</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Balance</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Referred By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {displayedMembers.map((member, index) => (
                      <motion.tr 
                        key={member._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-muted/20"
                      >
                        <td className="px-6 py-4 text-sm">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium">{member.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.level === 1 ? "bg-primary/10 text-primary" :
                            member.level === 2 ? "bg-indigo-500/10 text-indigo-500" :
                            member.level === 3 ? "bg-blue-500/10 text-blue-500" :
                            "bg-amber-500/10 text-amber-500"
                          }`}>
                            {member.level === 1 ? "A-Level" :
                             member.level === 2 ? "B-Level" :
                             member.level === 3 ? "C-Level" :
                             "D-Level"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">${member.balance?.toFixed(2) || "0.00"}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{member.referredBy}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
