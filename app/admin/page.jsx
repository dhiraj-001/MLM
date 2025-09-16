"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { adminService } from "@/services/api"
import { Users, Database, CreditCard, FileText, ArrowUpRight } from "lucide-react"
import { formatDistance } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { subDays, subMonths, subYears, startOfDay, format } from 'date-fns'

export default function AdminDashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    todayJoinedUsers: 0,
    pendingDeposits: 0,
    completedDeposits: 0,
    totalDepositAmount: 0,
    pendingWithdrawals: 0,
    completedWithdrawals: 0,
    totalWithdrawalAmount: 0,
    totalContacts: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [timeFilter, setTimeFilter] = useState('7days')
  const [graphData, setGraphData] = useState([])

  const timeFilters = {
    '24h': { label: 'Last 24 Hours', fn: () => subDays(new Date(), 1) },
    '7days': { label: 'Last 7 Days', fn: () => subDays(new Date(), 7) },
    '30days': { label: 'Last Month', fn: () => subMonths(new Date(), 1) },
    '1year': { label: 'Last Year', fn: () => subYears(new Date(), 1) },
    'lifetime': { label: 'Lifetime', fn: () => new Date(0) }
  }

  const processTransactionData = (deposits, withdrawals, startDate) => {
    const dateMap = new Map()

    const processTransactions = (transactions, type) => {
      transactions.forEach(t => {
        const date = startOfDay(new Date(t.createdAt))
        if (date >= startDate) {
          const dateStr = format(date, 'MMM dd')
          if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, { date: dateStr, deposits: 0, withdrawals: 0 })
          }
          const entry = dateMap.get(dateStr)
          entry[type] += Number(t.amount) || 0
        }
      })
    }

    processTransactions(deposits, 'deposits')
    processTransactions(withdrawals, 'withdrawals')

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return

      setLoading(true)
      try {
        // Fetch all data in parallel
        const [users, deposits, withdrawals, contacts] = await Promise.all([
          adminService.getAllUsers(token),
          adminService.getAllDeposits(token),
          adminService.getAllWithdrawals(token),
          adminService.getAllContacts(token)
        ])

        // Get today's date at midnight for comparison
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        setStats({
          totalUsers: users.length,
          blockedUsers: users.filter(u => u.isBlocked).length,
          todayJoinedUsers: users.filter(u => new Date(u.createdAt) >= today).length,
          pendingDeposits: deposits.filter(d => d.status === 'pending').length,
          completedDeposits: deposits.filter(d => d.status === 'approved').length,
          totalDepositAmount: deposits.filter(d => d.status === 'approved')
            .reduce((sum, d) => sum + (d.amount || 0), 0),
          pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
          completedWithdrawals: withdrawals.filter(w => w.status === 'approved').length,
          totalWithdrawalAmount: withdrawals.filter(w => w.status === 'approved')
            .reduce((sum, w) => sum + (w.amount || 0), 0),
          totalContacts: contacts.length
        })

        // Sort and set recent users
        const sortedUsers = [...users].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 10)
        setRecentUsers(sortedUsers)

        // Combine and sort recent transactions
        const allTransactions = [
          ...deposits.map(d => ({ ...d, type: 'deposit' })),
          ...withdrawals.map(w => ({ ...w, type: 'withdrawal' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10)

        setRecentTransactions(allTransactions)

        // Process graph data
        const startDate = timeFilters[timeFilter].fn()
        const graphData = processTransactionData(deposits, withdrawals, startDate)
        setGraphData(graphData)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token, timeFilter])

  const StatCard = ({ title, value, icon: Icon, href, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      green: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      amber: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
      purple: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      red: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    }

    return (
      <div className="rounded-lg border border-border/40 bg-background shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className="mt-1 text-2xl font-semibold">{loading ? '...' : value}</h3>
            </div>
            <div className={`rounded-full p-2 ${colorClasses[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          <Link
            href={href}
            className="mt-6 flex items-center justify-end text-sm font-medium text-primary"
          >
            View All <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          href="/admin/users"
          color="blue"
        />
        <StatCard
          title="Blocked Users"
          value={stats.blockedUsers}
          icon={Users}
          href="/admin/users?filter=blocked"
          color="red"
        />
        <StatCard
          title="Today's Signups"
          value={stats.todayJoinedUsers}
          icon={Users}
          href="/admin/users"
          color="green"
        />
        <StatCard
          title="Pending Deposits"
          value={stats.pendingDeposits}
          icon={Database}
          href="/admin/deposits?status=pending"
          color="amber"
        />
        <StatCard
          title="Completed Deposits"
          value={stats.completedDeposits}
          icon={Database}
          href="/admin/deposits?status=completed"
          color="green"
        />
        <StatCard
          title="Total Deposits"
          value={`$${stats.totalDepositAmount.toFixed(2)}`}
          icon={Database}
          href="/admin/deposits"
          color="blue"
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          icon={CreditCard}
          href="/admin/withdrawals?status=pending"
          color="amber"
        />
        <StatCard
          title="Completed Withdrawals"
          value={stats.completedWithdrawals}
          icon={CreditCard}
          href="/admin/withdrawals?status=completed"
          color="green"
        />
        <StatCard
          title="Total Withdrawals"
          value={`$${stats.totalWithdrawalAmount.toFixed(2)}`}
          icon={CreditCard}
          href="/admin/withdrawals"
          color="blue"
        />
        <StatCard
          title="Contact Forms"
          value={stats.totalContacts}
          icon={FileText}
          href="/admin/contacts"
          color="purple"
        />
      </div>

      {/* Transaction Graph */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <div className="flex gap-2">
            {Object.entries(timeFilters).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setTimeFilter(key)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${timeFilter === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/40 bg-background p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="deposits"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="withdrawals"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-lg border border-border/40 bg-background p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Users</h2>
          <div className="space-y-4">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    Joined {formatDistance(new Date(user.createdAt), new Date(), { addSuffix: true })}
                  </p>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-lg border border-border/40 bg-background p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    ${transaction.amount}
                    <span className="ml-2 text-sm capitalize text-muted-foreground">
                      {transaction.type}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistance(new Date(transaction.createdAt), new Date(), { addSuffix: true })}
                  </p>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${transaction.status === 'pending'
                  ? 'bg-amber-100 text-amber-700'
                  : transaction.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {transaction.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/deposits"
            className="flex items-center rounded-lg border border-border/40 bg-background p-4 shadow-sm transition-colors hover:bg-muted/50"
          >
            <Database className="mr-3 h-5 w-5 text-primary" />
            <span>Manage Deposit Requests</span>
          </Link>
          <Link
            href="/admin/withdrawals"
            className="flex items-center rounded-lg border border-border/40 bg-background p-4 shadow-sm transition-colors hover:bg-muted/50"
          >
            <CreditCard className="mr-3 h-5 w-5 text-primary" />
            <span>Manage Withdrawal Requests</span>
          </Link>
          <Link
            href="/admin/network"
            className="flex items-center rounded-lg border border-border/40 bg-background p-4 shadow-sm transition-colors hover:bg-muted/50"
          >
            <Users className="mr-3 h-5 w-5 text-primary" />
            <span>View Network Structure</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
