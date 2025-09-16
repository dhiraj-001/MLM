"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { adminService } from "@/services/api"
import { format } from "date-fns"
import { Search, RefreshCw, Check, X, Clock, AlertCircle } from "lucide-react"

export default function AdminDeposits() {
  const { token } = useAuth()
  const [deposits, setDeposits] = useState([])
  const [filteredDeposits, setFilteredDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [processing, setProcessing] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchDeposits = async () => {
      if (!token) return
      
      setLoading(true)
      try {
        const depositsData = await adminService.getAllDeposits(token)
        setDeposits(depositsData)
        setFilteredDeposits(depositsData)
      } catch (err) {
        console.error("Failed to fetch deposits:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDeposits()
  }, [token])

  useEffect(() => {
    let filtered = [...deposits]
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(deposit => deposit.status === statusFilter)
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(deposit => 
        deposit.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deposit.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredDeposits(filtered)
  }, [searchTerm, statusFilter, deposits])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusChange = async (id, status) => {
    if (!token || processing) return
    
    setProcessing(true)
    try {
      await adminService.updateDepositStatus(id, status, token)
      
      // Update local state
      setDeposits(deposits.map(deposit => 
        deposit._id === id ? { ...deposit, status } : deposit
      ))
    } catch (err) {
      console.error(`Failed to ${status} deposit:`, err)
      alert(`Failed to ${status} deposit. Please try again.`)
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <Check className="w-3 h-3 mr-1" /> Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <X className="w-3 h-3 mr-1" /> Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        )
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Deposits</h1>
        
        <div className="flex items-center gap-3">
          {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deposits..."
              className="rounded-md border border-border bg-background pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border border-border/40 bg-background shadow-sm overflow-hidden">
        {loading && deposits.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <p>Loading deposits...</p>
          </div>
        ) : filteredDeposits.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No deposits found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredDeposits.map((deposit) => (
                  <tr key={deposit._id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm">
                      {format(new Date(deposit.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {deposit.user?.email || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      ${deposit.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="font-mono">{deposit.transactionId}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(deposit.status)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {deposit.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(deposit._id, 'approved')}
                            disabled={processing}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3 h-3 mr-1" /> Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(deposit._id, 'rejected')}
                            disabled={processing}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                          >
                            <X className="w-3 h-3 mr-1" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
