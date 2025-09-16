"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { adminService } from "@/services/api"
import { Search, RefreshCw, Users, ChevronDown, ChevronRight, Mail, Wallet } from "lucide-react"

export default function AdminNetwork() {
  const { token } = useAuth()
  const [networkData, setNetworkData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedUsers, setExpandedUsers] = useState({})

  useEffect(() => {
    const fetchNetworkData = async () => {
      if (!token) return
      
      setLoading(true)
      try {
        const data = await adminService.getAllTeamMembers(token)
        setNetworkData(data)
        
        // Initialize expanded state
        const expanded = {}
        data.teamMembers.forEach(member => {
          if (member.level === 1) {
            expanded[member._id] = true
          }
        })
        setExpandedUsers(expanded)
      } catch (err) {
        console.error("Failed to fetch network data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNetworkData()
  }, [token])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const toggleExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  const filteredMembers = searchTerm && networkData?.teamMembers 
    ? networkData.teamMembers.filter(member => 
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : networkData?.teamMembers || []

  // Group members by level for hierarchical display
  const groupedMembers = filteredMembers.reduce((acc, member) => {
    const level = member.level
    if (!acc[level]) acc[level] = []
    acc[level].push(member)
    return acc
  }, {})

  const getLevelLabel = (level) => {
    switch (level) {
      case 1: return "Level 1 (Direct Referrals)"
      case 2: return "Level 2"
      case 3: return "Level 3"
      default: return `Level ${level}`
    }
  }

  const findReferrals = (referralCode) => {
    return filteredMembers.filter(member => member.referredBy === referralCode)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Network Structure</h1>
        
        <div className="flex items-center gap-2">
          {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search members..."
              className="rounded-md border border-border bg-background pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border border-border/40 bg-background shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <p>Loading network data...</p>
          </div>
        ) : !networkData ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No network data available</p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium">Network Overview</h2>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-md bg-primary/10 p-4">
                  <div className="font-medium text-primary mb-1">Root Referral Code</div>
                  <div className="text-xl font-bold">{networkData.rootReferralCode}</div>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <div className="font-medium text-muted-foreground mb-1">Total Members</div>
                  <div className="text-xl font-bold">{networkData.totalMembers}</div>
                </div>
              </div>
            </div>

            {searchTerm ? (
              // Flat list for search results
              <div>
                <h3 className="mb-3 text-muted-foreground font-medium">Search Results ({filteredMembers.length})</h3>
                <div className="space-y-2">
                  {filteredMembers.map(member => (
                    <div key={member._id} className="border border-border/40 rounded-md p-3 hover:bg-muted/30">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{member.email}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Level {member.level}
                          </span>
                        </div>
                      </div>
                      <div className="flex mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center mr-4">
                          <Wallet className="h-3 w-3 mr-1" />
                          ${member.balance?.toFixed(2) || "0.00"}
                        </div>
                        <div>
                          Referred by: {member.referredBy}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Hierarchical tree view for normal display
              <div>
                <h3 className="mb-3 text-muted-foreground font-medium">Network Hierarchy</h3>
                
                {Object.keys(groupedMembers).sort((a, b) => a - b).map(level => {
                  const levelMembers = groupedMembers[level]
                  
                  return (
                    <div key={level} className="mb-6">
                      <h4 className="text-sm font-medium mb-2">{getLevelLabel(parseInt(level))}</h4>
                      <div className="space-y-2 pl-4">
                        {levelMembers.map(member => {
                          const referrals = findReferrals(member.referralCode)
                          const hasReferrals = referrals.length > 0
                          const isExpanded = expandedUsers[member._id]
                          
                          return (
                            <div key={member._id} className="border-l-2 border-border/60 pl-4">
                              <div 
                                className="flex items-center justify-between border border-border/40 rounded-md p-3 hover:bg-muted/30 cursor-pointer"
                                onClick={() => hasReferrals && toggleExpand(member._id)}
                              >
                                <div className="flex items-center">
                                  {hasReferrals ? (
                                    isExpanded ? (
                                      <ChevronDown className="h-4 w-4 mr-2 text-primary" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                                    )
                                  ) : (
                                    <div className="w-4 mr-2" />
                                  )}
                                  <span className="font-medium">{member.email}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-muted-foreground">
                                    ${member.balance?.toFixed(2) || "0.00"}
                                  </span>
                                  {hasReferrals && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                      {referrals.length} referrals
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {isExpanded && hasReferrals && (
                                <div className="pl-4 mt-2 space-y-2">
                                  {referrals.map(referral => (
                                    <div 
                                      key={referral._id} 
                                      className="border-l-2 border-dashed border-border/60 pl-4"
                                    >
                                      <div className="border border-border/40 rounded-md p-2 hover:bg-muted/30">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm">{referral.email}</span>
                                          <span className="text-xs text-muted-foreground">
                                            ${referral.balance?.toFixed(2) || "0.00"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
