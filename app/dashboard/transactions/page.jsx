"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"
import ProtectedRoute from "@/components/protected-route"
import { 
  ArrowLeft, 
  RefreshCw, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CreditCard, 
  Wallet,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"

export default function TransactionsPage() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deposits, setDeposits] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [activeTab, setActiveTab] = useState("all") // all, deposits, withdrawals
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ field: 'date', direction: 'desc' })
  const transactionsPerPage = 10

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) return
      
      setLoading(true)
      try {
        // Fetch both deposit and withdrawal history
        const [depositResponse, withdrawalResponse] = await Promise.all([
          userService.getDepositHistory(token),
          userService.getWithdrawalHistory(token)
        ])
        
        setDeposits(depositResponse.deposits || [])
        setWithdrawals(withdrawalResponse.withdrawals || [])
      } catch (err) {
        console.error("Failed to fetch transaction history:", err)
        setError("Failed to load transaction history. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [token])

  // Process and combine transactions
  const processedTransactions = [
    ...deposits.map(deposit => ({
      id: deposit._id,
      type: 'deposit',
      amount: deposit.amount,
      date: deposit.createdAt,
      status: deposit.status,
      details: `Transaction ID: ${deposit.transactionId}`,
      rawData: deposit
    })),
    ...withdrawals.map(withdrawal => ({
      id: withdrawal._id,
      type: 'withdrawal',
      amount: withdrawal.amount,
      date: withdrawal.createdAt,
      status: withdrawal.status,
      details: `Bank: ${withdrawal.accountDetails?.bankName || 'N/A'}`,
      rawData: withdrawal
    }))
  ]

  // Filter transactions based on active tab and search term
  const filteredTransactions = processedTransactions
    .filter(transaction => {
      if (activeTab === 'all') return true
      return transaction.type === activeTab.slice(0, -1) // remove 's' from the end
    })
    .filter(transaction => {
      if (!searchTerm) return true
      return (
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = a[sortConfig.field]
    const bValue = b[sortConfig.field]
    
    if (sortConfig.field === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue)
    }
    
    if (sortConfig.field === 'amount') {
      return sortConfig.direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue
    }
    
    return sortConfig.direction === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue)
  })

  // Handle sorting
  const requestSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage)
  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Determine the status style and badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Pending
          </span>
        )
    }
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy • h:mm a')
    } catch (e) {
      return dateString
    }
  }

  // Get transaction type icon
  const getTransactionIcon = (type) => {
    return type === 'deposit' 
      ? <ArrowDownLeft className="h-4 w-4 text-green-500" /> 
      : <ArrowUpRight className="h-4 w-4 text-amber-500" />
  }

  // Calculate transaction stats
  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0)
  const totalWithdrawals = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0)
  const netBalance = totalDeposits - totalWithdrawals

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link 
              href="/dashboard" 
              className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>

          {/* Transaction Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Deposits</p>
                    <h3 className="text-2xl font-bold mt-1 text-green-500">${totalDeposits.toFixed(2)}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <ArrowDownLeft className="h-6 w-6 text-green-500" />
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
                    <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                    <h3 className="text-2xl font-bold mt-1 text-amber-500">${totalWithdrawals.toFixed(2)}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-amber-500" />
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
                    <p className="text-sm text-muted-foreground">Net Balance</p>
                    <h3 className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${netBalance.toFixed(2)}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-background border border-border/40 hover:bg-muted/50 transition-colors'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('deposits')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'deposits' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-background border border-border/40 hover:bg-muted/50 transition-colors'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'withdrawals' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-background border border-border/40 hover:bg-muted/50 transition-colors'
                }`}
              >
                Withdrawals
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-background rounded-lg border border-border/40 shadow-sm overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : sortedTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  {activeTab !== 'all' 
                    ? `You don't have any ${activeTab} yet.` 
                    : "You haven't made any transactions yet."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                        <th 
                          className="px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:text-primary"
                          onClick={() => requestSort('date')}
                        >
                          <div className="flex items-center gap-1">
                            Date
                            {sortConfig.field === 'date' && (
                              <ChevronDown className={`h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:text-primary"
                          onClick={() => requestSort('amount')}
                        >
                          <div className="flex items-center gap-1">
                            Amount
                            {sortConfig.field === 'amount' && (
                              <ChevronDown className={`h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Details</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {currentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-muted/20">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.type)}
                              <span className="text-sm capitalize">{transaction.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {transaction.details}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {getStatusBadge(transaction.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-border/20 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {indexOfFirstTransaction + 1}-{Math.min(indexOfLastTransaction, sortedTransactions.length)} of {sortedTransactions.length} transactions
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-border/40 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Calculate page numbers to display
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => paginate(pageNum)}
                            className={`w-8 h-8 rounded-md ${
                              currentPage === pageNum
                                ? 'bg-primary text-white'
                                : 'border border-border/40 hover:bg-muted'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md border border-border/40 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/deposit">
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-4 hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <ArrowDownLeft className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Make a Deposit</h3>
                    <p className="text-sm text-muted-foreground">Add funds to your account</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/withdrawal">
              <div className="bg-background rounded-lg border border-border/40 shadow-sm p-4 hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <ArrowUpRight className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Withdraw Funds</h3>
                    <p className="text-sm text-muted-foreground">Cash out your earnings</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
