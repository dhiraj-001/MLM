"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"
import ProtectedRoute from "@/components/protected-route"
import { ArrowLeft, CreditCard, Clock, Check, X } from "lucide-react"
import { format } from "date-fns"

export default function WithdrawalPage() {
  const { user, token } = useAuth()
  const [amount, setAmount] = useState('')
  const [image, setImage] = useState(null)
  const [transactionId, setTransactionId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [withdrawalHistory, setWithdrawalHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Fetch withdrawal history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return

      setLoading(true)
      try {
        const response = await userService.getWithdrawalHistory(token)
        setWithdrawalHistory(response.withdrawals || [])
      } catch (err) {
        console.error("Failed to fetch withdrawal history:", err)
        setError("Failed to load withdrawal history. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [token])

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'interviewX');

    setUploading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dsgmhrwkc/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error('Upload failed:', err);
      throw new Error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Basic validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid positive amount")
      return
    }

    setSubmitting(true)
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const withdrawalData = {
        amount: parseFloat(amount),
        proofImage: imageUrl,
        transactionId: transactionId || undefined
      }

      const response = await userService.createWithdrawal(withdrawalData, token)
      setSuccess("Withdrawal request submitted successfully!")

      // Reset form
      setAmount('')
      setImage(null)
      setTransactionId('')

      // Refresh history
      const historyResponse = await userService.getWithdrawalHistory(token)
      setWithdrawalHistory(historyResponse.withdrawals || [])
    } catch (err) {
      console.error("Withdrawal submission failed:", err)
      setError(err.message || "Failed to submit withdrawal request. Please try again.")
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
            <h1 className="text-2xl font-bold">Withdraw Funds</h1>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-2 flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-primary" />
              Withdrawal Information
            </h2>
            <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
              <li>Minimum withdrawal amount is $50.</li>
              <li>Withdrawals are processed within 2-3 business days.</li>
              <li>Ensure your bank details are accurate to avoid processing delays.</li>
              <li>A 5% processing fee applies to all withdrawals.</li>
            </ul>
          </div>

          {/* Form */}
          <div className="bg-background rounded-lg border border-border/40 shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Submit Withdrawal Request</h2>

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
                  min="50"
                  step="any"
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Minimum withdrawal: $50
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="transactionId" className="block text-sm font-medium mb-1">
                  Account ID (Optional)
                </label>
                <input
                  type="text"
                  id="transactionId"
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter Account ID"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium mb-1">
                  QR Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  className="w-full p-2 border border-border rounded-md bg-background"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Upload screenshot or image of your QR Code
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {submitting || uploading ? "Processing..." : "Submit Withdrawal Request"}
              </button>
            </form>
          </div>

          {/* Withdrawal History */}
          <div className="bg-background rounded-lg border border-border/40 shadow-sm">
            <div className="p-4 border-b border-border/40">
              <h2 className="text-xl font-semibold">Withdrawal History</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading withdrawal history...
              </div>
            ) : withdrawalHistory.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No withdrawal history found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {withdrawalHistory.map((withdrawal) => (
                      <tr key={withdrawal._id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-sm">
                          {format(new Date(withdrawal.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          ${withdrawal.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getStatusBadge(withdrawal.status)}
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
