"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"
import ProtectedRoute from "@/components/protected-route"
import { ArrowLeft, ChevronRight, Wallet, Clock, Check, X } from "lucide-react"
import { format } from "date-fns"

export default function DepositPage() {
  const { user, token } = useAuth()
  const [amount, setAmount] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [depositHistory, setDepositHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [withdrawalAccounts, setWithdrawalAccounts] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(true)

  // Fetch deposit history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return

      setLoading(true)
      try {
        const response = await userService.getDepositHistory(token)
        setDepositHistory(response.deposits || [])
      } catch (err) {
        console.error("Failed to fetch deposit history:", err)
        setError("Failed to load deposit history. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [token])

  // Add new useEffect for fetching withdrawal accounts
  useEffect(() => {
    const fetchWithdrawalAccounts = async () => {
      if (!token) return

      try {
        const response = await userService.getWithdrawalAccounts(token)
        setWithdrawalAccounts(response || [])
      } catch (err) {
        console.error("Failed to fetch withdrawal accounts:", err)
      } finally {
        setAccountsLoading(false)
      }
    }

    fetchWithdrawalAccounts()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Basic validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid positive amount")
      return
    }

    if (!transactionId || transactionId.trim().length < 3) {
      setError("Transaction ID must be at least 3 characters")
      return
    }

    setSubmitting(true)
    try {
      const depositData = {
        amount: parseFloat(amount),
        transactionId: transactionId.trim()
      }

      const response = await userService.createDeposit(depositData, token)
      setSuccess("Deposit request submitted successfully!")

      // Reset form
      setAmount('')
      setTransactionId('')

      // Refresh history
      const historyResponse = await userService.getDepositHistory(token)
      setDepositHistory(historyResponse.deposits || [])
    } catch (err) {
      console.error("Deposit submission failed:", err)
      setError(err.message || "Failed to submit deposit request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <Check className="w-3 h-3 mr-1" /> Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            <X className="w-3 h-3 mr-1" /> Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        )
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link
              href="/dashboard"
              className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Deposit Funds</h1>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-2 flex items-center">
              <Wallet className="h-4 w-4 mr-2 text-primary" />
              How to Deposit
            </h2>
            <ol className="list-decimal ml-5 space-y-2 text-sm text-muted-foreground">
              <li>Send the amount you wish to deposit to our payment account.</li>
              <li>Record the transaction ID from your payment receipt.</li>
              <li>Enter the amount and transaction ID in the form below.</li>
              <li>Your deposit will be processed within 24 hours.</li>
            </ol>
            <div className="mt-4 p-3 bg-background rounded border border-border">
              <p className="text-sm font-medium">Payment Details:</p>

              {accountsLoading ? (
                <p className="text-sm text-muted-foreground">Loading payment details...</p>
              ) : withdrawalAccounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payment accounts available.</p>
              ) : (
                <>
                  {withdrawalAccounts.map((account, index) => (
                    <div key={account.accountID} className={index > 0 ? 'mt-6' : ''}>
                      <p className="text-sm mt-1">Account ID: {account.accountID}</p>
                      <div className="mt-4">
                        <img
                          src={account.qrImg}
                          alt={`QR Code for ${account.accountID}`}
                          className="w-32 h-32 rounded-md border border-border"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Scan the QR code to deposit directly to our account.
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Submit Deposit Request</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 rounded-md text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium mb-1">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  id="amount"
                  min="1"
                  step="any"
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="transactionId" className="block text-sm font-medium mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  id="transactionId"
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  The transaction ID from your payment receipt
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit Deposit Request"}
              </button>
            </form>
          </div>

          {/* Deposit History */}
          <div className="bg-background rounded-lg border border-border/40 shadow-sm">
            <div className="p-4 border-b border-border/40">
              <h2 className="text-xl font-semibold">Deposit History</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading deposit history...
              </div>
            ) : depositHistory.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No deposit history found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Transaction ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {depositHistory.map((deposit) => (
                      <tr key={deposit._id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-sm">
                          {format(new Date(deposit.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          ${deposit.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {deposit.transactionId}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getStatusBadge(deposit.status)}
                        </td>
                      </tr>
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
