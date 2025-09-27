"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { adminService } from "@/services/admin"
import { Search, RefreshCw, Users, Network, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function AdminNetwork() {
  const { token } = useAuth()
  const [networkData, setNetworkData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeLevelTab, setActiveLevelTab] = useState("all")

  useEffect(() => {
    const fetchNetworkData = async () => {
      if (!token) return

      setLoading(true)
      try {
        const data = await adminService.getAllTeamMembers(token)
        setNetworkData(data)
      } catch (err) {
        console.error("Failed to fetch network data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNetworkData()
  }, [token])

  // Organize team members by level
  const levelAMembers = networkData?.teamMembers?.filter(member => member.level === 1) || []
  const levelBMembers = networkData?.teamMembers?.filter(member => member.level === 2) || []
  const levelCMembers = networkData?.teamMembers?.filter(member => member.level === 3) || []
  const levelDMembers = networkData?.teamMembers?.filter(member => member.level === 4) || []

  // Get displayed members based on active tab
  const getDisplayedMembers = () => {
    switch (activeLevelTab) {
      case "a": return levelAMembers
      case "b": return levelBMembers
      case "c": return levelCMembers
      case "d": return levelDMembers
      default: return networkData?.teamMembers || []
    }
  }

  const displayedMembers = getDisplayedMembers()

  // Filter by search term if any
  const filteredMembers = searchTerm
    ? displayedMembers.filter(member =>
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : displayedMembers

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link
            href="/admin"
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Network Structure</h1>
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
                  <h3 className="text-2xl font-bold mt-1">{networkData?.totalMembers || 0}</h3>
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

        {/* Search and Level Tabs */}
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
            <button
              onClick={() => setActiveLevelTab("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeLevelTab === "all"
                  ? "bg-primary text-white"
                  : "bg-background border border-border/40 hover:bg-muted/50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveLevelTab("a")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeLevelTab === "a"
                  ? "bg-primary text-white"
                  : "bg-background border border-border/40 hover:bg-muted/50"
              }`}
            >
              Level A
            </button>
            <button
              onClick={() => setActiveLevelTab("b")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeLevelTab === "b"
                  ? "bg-indigo-500 text-white"
                  : "bg-background border border-border/40 hover:bg-muted/50"
              }`}
            >
              Level B
            </button>
            <button
              onClick={() => setActiveLevelTab("c")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeLevelTab === "c"
                  ? "bg-blue-500 text-white"
                  : "bg-background border border-border/40 hover:bg-muted/50"
              }`}
            >
              Level C
            </button>
            <button
              onClick={() => setActiveLevelTab("d")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeLevelTab === "d"
                  ? "bg-amber-500 text-white"
                  : "bg-background border border-border/40 hover:bg-muted/50"
              }`}
            >
              Level D
            </button>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-background rounded-lg border border-border/40 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/40">
            <h2 className="text-xl font-semibold">All Team Members</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Complete list of all members in the network
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !networkData ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Network className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No network data available</h3>
              <p className="text-muted-foreground max-w-md">
                The network structure will appear here once users start registering with referral codes.
              </p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No members at this level</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                As the network grows, you'll start seeing members at this level.
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
        </div>
      </div>
    </div>
  )
}
