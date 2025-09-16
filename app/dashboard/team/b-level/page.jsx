"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"
import ProtectedRoute from "@/components/protected-route"
import { ArrowLeft, Users, RefreshCw, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function BLevelTeam() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [teamData, setTeamData] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

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

  // Filter for B-level members (level 2)
  const bLevelMembers = teamData?.teamMembers?.filter(member => member.level === 2) || []
  
  // Filter by search term if any
  const filteredMembers = searchTerm 
    ? bLevelMembers.filter(member => 
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : bLevelMembers

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
            <h1 className="text-2xl font-bold">B-Level Team Members</h1>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">B-Level Members</p>
                    <h3 className="text-2xl font-bold mt-1">{bLevelMembers.length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">All Team Members</p>
                    <h3 className="text-2xl font-bold mt-1">{teamData?.totalTeamMembers || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Commission Rate</p>
                    <h3 className="text-2xl font-bold mt-1 text-green-500">
                      {teamData?.commissionPercentages?.B 
                        ? `${(teamData.commissionPercentages.B * 100).toFixed(1)}%` 
                        : "Loading..."}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-green-500">B</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Link href="/dashboard/team/direct">
                <button className="px-4 py-2 rounded-lg bg-background border border-border/40 hover:bg-muted/50 transition-colors">A-Level</button>
              </Link>
              <Link href="/dashboard/team/b-level">
                <button className="px-4 py-2 rounded-lg bg-primary text-white">B-Level</button>
              </Link>
              <Link href="/dashboard/team/c-level">
                <button className="px-4 py-2 rounded-lg bg-background border border-border/40 hover:bg-muted/50 transition-colors">C-Level</button>
              </Link>
              <Link href="/dashboard/team/d-level">
                <button className="px-4 py-2 rounded-lg bg-background border border-border/40 hover:bg-muted/50 transition-colors">D-Level</button>
              </Link>
            </div>
          </div>

          {/* Team Members Table */}
          <div className="bg-background rounded-lg border border-border/40 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-semibold">Your B-Level Team Members</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Members who were referred by your direct referrals
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No B-Level members yet</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Encourage your direct referrals to invite more members to grow your network.
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
                    {filteredMembers.map((member, index) => (
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
                          <span className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs">
                            B-Level
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
