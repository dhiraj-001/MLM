"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  RefreshCw,
  Mail,
  Phone,
  Wallet,
  User,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Zap,
  DollarSign,
  Clock,
  CheckCircle2,
  Ban,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { adminService } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addFundsUserId, setAddFundsUserId] = useState(null);
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [addFundsRemark, setAddFundsRemark] = useState("");
  const [addFundsLoading, setAddFundsLoading] = useState(false);
  const [showBlockUserDialog, setShowBlockUserDialog] = useState(false);
  const [showBlockWithdrawDialog, setShowBlockWithdrawDialog] = useState(false);
  const [blockUserId, setBlockUserId] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    phone: "",
    newPassword: "",
  });
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
  });
  const [showBulkNotification, setShowBulkNotification] = useState(false);
  const [bulkNotificationForm, setBulkNotificationForm] = useState({
    title: "",
    message: "",
    step: "compose", // 'compose' or 'select'
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  console.log("User Data", users);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const usersData = await adminService.getAllUsers(token);
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone && user.phone.toString().includes(searchTerm))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddFunds = (userId) => {
    console.log("Adding funds for user:", userId);
    setAddFundsUserId(userId);
    setShowAddFunds(true);
    setAddFundsAmount("");
    setAddFundsRemark("");
  };

  const handleAddFundsSubmit = async (e) => {
    e.preventDefault();
    if (
      !addFundsAmount ||
      isNaN(addFundsAmount) ||
      Number(addFundsAmount) <= 0
    ) {
      toast.error("Please enter a valid amount.");
      return;
    }
    setAddFundsLoading(true);
    try {
      await adminService.addDepositByAdmin(
        addFundsUserId,
        Number(addFundsAmount),
        addFundsRemark,
        token
      );
      toast.success("Deposit added successfully.");
      setShowAddFunds(false);
      setShowUserDetails(false);
      // Refresh users
      const usersData = await adminService.getAllUsers(token);
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      toast.error(err.message || "Failed to add funds");
    } finally {
      setAddFundsLoading(false);
    }
  };

  const handleBlockUser = async (e) => {
    e.preventDefault();
    setBlockLoading(true);
    try {
      await adminService.blockUser(blockUserId, blockReason, token);
      toast.success("User blocked successfully");
      setShowBlockUserDialog(false);
      // Refresh users
      const usersData = await adminService.getAllUsers(token);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setShowUserDetails(false);
    } catch (err) {
      toast.error(err.message || "Failed to block user");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleBlockWithdraw = async (e) => {
    e.preventDefault();
    setBlockLoading(true);
    try {
      await adminService.blockWithdraw(blockUserId, blockReason, token);
      toast.success("User withdraw blocked successfully");
      setShowBlockWithdrawDialog(false);
      // Refresh users
      const usersData = await adminService.getAllUsers(token);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setShowUserDetails(false);
    } catch (err) {
      toast.error(err.message || "Failed to block withdraw");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblockUser = async (e) => {
    e.preventDefault();
    setBlockLoading(true);
    try {
      await adminService.unblockUser(blockUserId, blockReason, token);
      toast.success("User unblocked successfully");
      setShowBlockUserDialog(false);
      // Refresh users
      const usersData = await adminService.getAllUsers(token);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setShowUserDetails(false);
    } catch (err) {
      toast.error(err.message || "Failed to unblock user");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblockWithdraw = async (e) => {
    e.preventDefault();
    setBlockLoading(true);
    try {
      await adminService.unblockWithdraw(blockUserId, blockReason, token);
      toast.success("User withdraw unblocked successfully");
      setShowBlockWithdrawDialog(false);
      // Refresh users
      const usersData = await adminService.getAllUsers(token);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setShowUserDetails(false);
    } catch (err) {
      toast.error(err.message || "Failed to unblock withdraw");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    setLoadingUserDetails(true);
    try {
      const data = await adminService.getUserDetails(userId, token);
      setSelectedUser(data);
      setShowUserDetails(true);
    } catch (err) {
      toast.error("Failed to fetch user details");
      console.error(err);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const calculateUserStats = (user, submissions) => {
    const totalQuizRewards = submissions.reduce(
      (sum, sub) => sum + (sub.reward || 0),
      0
    );
    const activeDays = submissions.length;
    const successRate =
      submissions.length > 0
        ? ((submissions.filter((sub) => sub.score >= 3).length / submissions.length) * 100).toFixed(1)
        : 0;
    const averageScore =
      submissions.length > 0
        ? (submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length).toFixed(1)
        : 0;
    const lastActive =
      submissions.length > 0
        ? new Date(Math.max(...submissions.map((s) => new Date(s.submittedAt))))
        : null;

    return {
      totalQuizRewards,
      activeDays,
      successRate,
      averageScore,
      lastActive,
    };
  };

  const handleModalUserBlock = async () => {
    setBlockReason("");
    setBlockUserId(selectedUser.user._id);
    setShowBlockUserDialog(true);
  };

  const handleModalWithdrawBlock = async () => {
    setBlockReason("");
    setBlockUserId(selectedUser.user._id);
    setShowBlockWithdrawDialog(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUserDetails(
        selectedUser.user._id,
        editFormData,
        token
      );
      toast.success("User details updated successfully");
      setEditMode(false);
      // Refresh user details
      const data = await adminService.getUserDetails(selectedUser.user._id, token);
      setSelectedUser(data);
    } catch (err) {
      toast.error(err.message || "Failed to update user details");
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await adminService.sendUserNotification(
        selectedUser.user._id,
        notificationForm,
        token
      );
      toast.success("Notification sent successfully");
      setNotificationForm({ title: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send notification");
    }
  };

  const handleBulkNotification = async (e) => {
    e.preventDefault();
    setBulkLoading(true);
    try {
      await adminService.sendBulkNotification(
        selectedUsers,
        bulkNotificationForm,
        token
      );
      toast.success("Bulk notifications sent successfully");
      setShowBulkNotification(false);
      setBulkNotificationForm({ title: "", message: "", step: "compose" });
      setSelectedUsers([]);
    } catch (err) {
      toast.error(err.message || "Failed to send notifications");
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user._id));
    }
  };

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setShowBulkNotification(true)}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Send Bulk Notification
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          {loading && (
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              className="rounded-md border border-border bg-background pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border  bg-background shadow-sm overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Users className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b  bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    S. No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Member ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Total Balance
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Deposit Balance
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Earning Balance
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Refer ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Joining Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Referred By
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Edited By Admin
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Block
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-r ">
                    Withdraw
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/90">
                {filteredUsers.map((user, i) => (
                  <tr key={user._id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm border-r ">
                      <div className="flex items-center">{i + 1}</div>
                    </td>
                    <td className="px-4 py-3 text-sm border-r ">
                      <div className="flex items-center">{user._id.slice(16)}</div>
                    </td>
                    <td className="px-4 py-3 text-sm border-r ">
                      <div className="flex items-center">{user.username}</div>
                    </td>
                    <td className="px-4 py-3 text-sm border-r ">
                      <div className="flex items-center font-medium text-gray-800 dark:text-gray-200">
                        <Wallet className="mr-1.5 h-4 w-4 text-muted-foreground" />
                        ${user.balance?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm border-r ">
                      <div className="flex items-center font-medium text-blue-600 dark:text-blue-400">
                        <Wallet className="mr-1.5 h-4 w-4 text-blue-500" />
                        ${user.depositBalance?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm border-r ">
                                      <button
                          onClick={() => handleAddFunds(user._id)}
                          className="inline-flex items-center gap-1 rounded-md border border-green-600 text-green-700 bg-green-50 px-2 py-1 text-xs font-semibold hover:bg-green-100 hover:text-green-800 transition"
                        >
                          <Wallet className="h-3.5 w-3.5" />
                          Add
                        </button>
                      </div>
                    </td>           <button
                                        </td>            </button>
                      </div>
                    </td>
                          className="inline-flex items-center gap-1 rounded-md border border-green-600 text-green-700 bg-green-50 px-2 py-1 text-xs font-semibold hover:bg-green-100 hover:text-green-800 transition"
                        >
                          <Wallet className="h-3.5 w-3.5" />
                          Add
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm border-r ">
                      {user.referralCode}
                    </td>
                    <td className="px-4 py-3 text-sm border-r ">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>

                    <td className="px-4 py-3 text-sm border-r ">
                      {user.referredBy}
                    </td>

                    <td className="px-4 py-3 text-sm border-r ">
                      {user.editedByAdmin ? (
                        new Date(user.editedByAdmin).toLocaleDateString("en-GB")
                      ) : (
                        <span className="text-muted-foreground italic">
                          Not Edited
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm border-r ">
                      <button
                        onClick={() => handleViewUser(user._id)}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition"
                      >
                        <User className="h-3 w-3" />
                        {loadingUserDetails ? "Loading..." : "View"}
                      </button>
                    </td>

                    <td className="px-4 py-3 text-sm border-r ">
                      {!user.isAdmin && (
                        <button
                          onClick={() => {
                            setBlockUserId(user._id);
                            setBlockReason("");
                            setShowBlockUserDialog(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition ${user.isBlocked
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm border-r ">
                      {!user.isAdmin && (
                        <button
                          onClick={() => {
                            setBlockUserId(user._id);
                            setBlockReason("");
                            setShowBlockWithdrawDialog(true);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition ${user.canWithdraw
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {user.canWithdraw ? "Disable" : "Enable"}
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isAdmin
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}
                      >
                        <User className="mr-1 h-3 w-3" />
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>
              Enter the amount to deposit and an optional remark.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFundsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="w-full rounded-md border px-3 py-2"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Remark (optional)
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2"
                value={addFundsRemark}
                onChange={(e) => setAddFundsRemark(e.target.value)}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowAddFunds(false)}
                disabled={addFundsLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                disabled={addFundsLoading}
              >
                {addFundsLoading ? "Adding..." : "Add Funds"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showBlockUserDialog} onOpenChange={setShowBlockUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{filteredUsers.find(u => u._id === blockUserId)?.isBlocked ? 'Unblock' : 'Block'} User</DialogTitle>
            <DialogDescription>
              Enter a reason for {filteredUsers.find(u => u._id === blockUserId)?.isBlocked ? 'unblocking' : 'blocking'} this user (optional).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={filteredUsers.find(u => u._id === blockUserId)?.isBlocked ? handleUnblockUser : handleBlockUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowBlockUserDialog(false)}
                disabled={blockLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white hover:opacity-90 ${filteredUsers.find(u => u._id === blockUserId)?.isBlocked
                  ? "bg-green-600"
                  : "bg-red-600"
                  }`}
                disabled={blockLoading}
              >
                {blockLoading ? "Processing..." : filteredUsers.find(u => u._id === blockUserId)?.isBlocked ? "Unblock User" : "Block User"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showBlockWithdrawDialog} onOpenChange={setShowBlockWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{filteredUsers.find(u => u._id === blockUserId)?.canWithdraw ? 'Disable' : 'Enable'} Withdrawals</DialogTitle>
            <DialogDescription>
              Enter a reason for {filteredUsers.find(u => u._id === blockUserId)?.canWithdraw ? 'disabling' : 'enabling'} withdrawals (optional).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={filteredUsers.find(u => u._id === blockUserId)?.canWithdraw ? handleBlockWithdraw : handleUnblockWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowBlockWithdrawDialog(false)}
                disabled={blockLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white hover:opacity-90 ${filteredUsers.find(u => u._id === blockUserId)?.canWithdraw
                  ? "bg-red-600"
                  : "bg-green-600"
                  }`}
                disabled={blockLoading}
              >
                {blockLoading ? "Processing..." : filteredUsers.find(u => u._id === blockUserId)?.canWithdraw ? "Disable Withdrawals" : "Enable Withdrawals"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedUser ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="deposits">
                  Deposits ({selectedUser.deposits.length})
                </TabsTrigger>
                <TabsTrigger value="withdrawals">
                  Withdrawals ({selectedUser.withdrawals.length})
                </TabsTrigger>
                <TabsTrigger value="quiz">
                  Quiz History ({selectedUser.submissions.length})
                </TabsTrigger>
                <TabsTrigger value="notifications">Send Notification</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-4">
                {/* User Stats Cards */}
                <div className="grid grid-cols-4 gap-4">
                  {selectedUser && (
                    <>
                      <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Active Days</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {
                            calculateUserStats(
                              selectedUser.user,
                              selectedUser.submissions
                            ).activeDays
                          }
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Balance</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          ${selectedUser.user.balance.toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Quiz Rewards</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          $
                          {calculateUserStats(
                            selectedUser.user,
                            selectedUser.submissions
                          ).totalQuizRewards.toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Avg. Score</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {
                            calculateUserStats(
                              selectedUser.user,
                              selectedUser.submissions
                            ).averageScore
                          }
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Account Actions Section */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold mb-2">Account Actions</h3>

                  <div className="flex flex-col gap-4">
                    {!selectedUser.user.isAdmin && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {selectedUser.user.isBlocked ? (
                              <ShieldAlert className="h-5 w-5 text-red-500" />
                            ) : (
                              <ShieldCheck className="h-5 w-5 text-green-500" />
                            )}
                            <div>
                              <p className="font-medium">Account Status</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedUser.user.isBlocked
                                  ? "This account is currently blocked from all activities"
                                  : "This account is active and can perform all activities"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleModalUserBlock}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedUser.user.isBlocked
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                          >
                            {selectedUser.user.isBlocked ? (
                              <>
                                <Unlock className="h-4 w-4" />
                                Unblock Account
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4" />
                                Block Account
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {selectedUser.user.canWithdraw ? (
                              <Unlock className="h-5 w-5 text-green-500" />
                            ) : (
                              <Lock className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <p className="font-medium">Withdrawal Status</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedUser.user.canWithdraw
                                  ? "User can make withdrawal requests"
                                  : "User is blocked from making withdrawals"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleModalWithdrawBlock}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedUser.user.canWithdraw
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                          >
                            {selectedUser.user.canWithdraw ? (
                              <>
                                <Lock className="h-4 w-4" />
                                Block Withdrawals
                              </>
                            ) : (
                              <>
                                <Unlock className="h-4 w-4" />
                                Enable Withdrawals
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Balance Management</p>
                          <p className="text-sm text-muted-foreground">
                            Add funds to user's account balance
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddFunds(selectedUser.user._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        <Wallet className="h-4 w-4" />
                        Add Funds
                      </button>
                    </div>
                  </div>
                </div>

                {/* Edit User Information */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">User Information</h3>
                    <button
                      onClick={() => {
                        setEditMode(!editMode);
                        setEditFormData({
                          username: selectedUser.user.username || "",
                          email: selectedUser.user.email || "",
                          phone: selectedUser.user.phone || "",
                          newPassword: "",
                        });
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {editMode ? "Cancel Edit" : "Edit Info"}
                    </button>
                  </div>

                  {editMode ? (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            value={editFormData.username}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                username: e.target.value,
                              })
                            }
                            className="w-full rounded-md border px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={editFormData.email}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                email: e.target.value,
                              })
                            }
                            className="w-full rounded-md border px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={editFormData.phone}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full rounded-md border px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={editFormData.newPassword}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Leave blank to keep unchanged"
                            className="w-full rounded-md border px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium">{selectedUser.user.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedUser.user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedUser.user.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member ID</p>
                        <p className="font-medium">{selectedUser.user._id}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="deposits" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-4 text-left">Date</th>
                          <th className="py-2 px-4 text-left">Amount</th>
                          <th className="py-2 px-4 text-left">Transaction ID</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Added By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser.deposits.map((deposit) => (
                          <tr key={deposit._id} className="border-b">
                            <td className="py-2 px-4">
                              {new Date(deposit.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4">
                              ${deposit.amount.toFixed(2)}
                            </td>
                            <td className="py-2 px-4">
                              {deposit.transactionId}
                            </td>
                            <td className="py-2 px-4">
                              <Badge
                                variant={
                                  deposit.status === "approved"
                                    ? "success"
                                    : deposit.status === "rejected"
                                      ? "destructive"
                                      : "default"
                                }
                              >
                                {deposit.status}
                              </Badge>
                            </td>
                            <td className="py-2 px-4">
                              <Badge variant="outline">
                                {deposit.addedByAdmin ? "Admin" : "User"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="withdrawals" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-4 text-left">Date</th>
                          <th className="py-2 px-4 text-left">Amount</th>
                          <th className="py-2 px-4 text-left">Account</th>
                          <th className="py-2 px-4 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser.withdrawals.map((withdrawal) => (
                          <tr key={withdrawal._id} className="border-b">
                            <td className="py-2 px-4">
                              {new Date(withdrawal.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4">
                              ${withdrawal.amount.toFixed(2)}
                            </td>
                            <td className="py-2 px-4">
                              {withdrawal.accountId || "N/A"}
                            </td>
                            <td className="py-2 px-4">
                              <Badge
                                variant={
                                  withdrawal.status === "approved"
                                    ? "success"
                                    : withdrawal.status === "rejected"
                                      ? "destructive"
                                      : "default"
                                }
                              >
                                {withdrawal.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="quiz" className="mt-4">
                <div className="space-y-6">
                  {/* Quiz Performance Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <h3 className="font-medium">Performance</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Success Rate
                          </span>
                          <span className="font-medium">
                            {
                              calculateUserStats(
                                selectedUser.user,
                                selectedUser.submissions
                              ).successRate
                            }
                            %
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Average Score
                          </span>
                          <span className="font-medium">
                            {
                              calculateUserStats(
                                selectedUser.user,
                                selectedUser.submissions
                              ).averageScore
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <h3 className="font-medium">Rewards</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Earned
                          </span>
                          <span className="font-medium">
                            $
                            {calculateUserStats(
                              selectedUser.user,
                              selectedUser.submissions
                            ).totalQuizRewards.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Avg. per Quiz
                          </span>
                          <span className="font-medium">
                            $
                            {(
                              calculateUserStats(
                                selectedUser.user,
                                selectedUser.submissions
                              ).totalQuizRewards /
                              (selectedUser.submissions.length || 1)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <h3 className="font-medium">Activity</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Days
                          </span>
                          <span className="font-medium">
                            {calculateUserStats(
                              selectedUser.user,
                              selectedUser.submissions
                            ).activeDays}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Last Active
                          </span>
                          <span className="font-medium">
                            {calculateUserStats(
                              selectedUser.user,
                              selectedUser.submissions
                            ).lastActive
                              ? new Date(
                                calculateUserStats(
                                  selectedUser.user,
                                  selectedUser.submissions
                                ).lastActive
                              ).toLocaleDateString()
                              : "Never"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quiz History Table */}
                  <ScrollArea className="h-[400px]">
                    <div className="rounded-md border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-2 px-4 text-left">Date</th>
                            <th className="py-2 px-4 text-left">Score</th>
                            <th className="py-2 px-4 text-left">Reward</th>
                            <th className="py-2 px-4 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.submissions.map((submission) => (
                            <tr key={submission._id} className="border-b">
                              <td className="py-2 px-4">
                                {new Date(submission.submittedAt).toLocaleDateString()}
                              </td>
                              <td className="py-2 px-4">
                                <Badge
                                  variant={
                                    submission.score >= 3
                                      ? "success"
                                      : "destructive"
                                  }
                                >
                                  {submission.score}/5
                                </Badge>
                              </td>
                              <td className="py-2 px-4">
                                <span className="font-medium text-green-600">
                                  ${submission.reward}
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <div className="flex items-center gap-1">
                                  <CheckCircle2
                                    className={`h-4 w-4 ${submission.score >= 3
                                      ? "text-green-500"
                                      : "text-red-500"
                                      }`}
                                  />
                                  <span
                                    className={
                                      submission.score >= 3
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {submission.score >= 3 ? "Passed" : "Failed"}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-4">
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">
                      Send Notification to User
                    </h3>
                    <form onSubmit={handleSendNotification} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border px-3 py-2"
                          value={notificationForm.title}
                          onChange={(e) =>
                            setNotificationForm({
                              ...notificationForm,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="w-full rounded-md border px-3 py-2 min-h-[100px]"
                          value={notificationForm.message}
                          onChange={(e) =>
                            setNotificationForm({
                              ...notificationForm,
                              message: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Send Notification
                      </button>
                    </form>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">
                      When to use notifications?
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Send important account updates</li>
                      <li>Notify about changes in user status</li>
                      <li>Send reminders or warnings</li>
                      <li>Communicate critical information</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center p-4">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              <p>Loading user details...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkNotification} onOpenChange={setShowBulkNotification}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Send Bulk Notification</DialogTitle>
            <DialogDescription>
              {bulkNotificationForm.step === "compose"
                ? "Compose your notification message"
                : "Select users to receive the notification"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={bulkNotificationForm.step} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger
                value="compose"
                onClick={() =>
                  setBulkNotificationForm((prev) => ({ ...prev, step: "compose" }))
                }
              >
                Compose
              </TabsTrigger>
              <TabsTrigger
                value="select"
                onClick={() =>
                  setBulkNotificationForm((prev) => ({ ...prev, step: "select" }))
                }
                disabled={!bulkNotificationForm.title || !bulkNotificationForm.message}
              >
                Select Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="mt-4">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border px-3 py-2"
                    value={bulkNotificationForm.title}
                    onChange={(e) =>
                      setBulkNotificationForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 min-h-[100px]"
                    value={bulkNotificationForm.message}
                    onChange={(e) =>
                      setBulkNotificationForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setBulkNotificationForm((prev) => ({ ...prev, step: "select" }))
                    }
                    disabled={!bulkNotificationForm.title || !bulkNotificationForm.message}
                    className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    Next: Select Users
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="select" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="rounded-md border pl-8 pr-4 py-2 w-full"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={toggleAllUsers}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {selectedUsers.length === filteredUsers.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>

                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-2">
                    {filteredUsers
                      .filter(
                        (user) =>
                          user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          user.username.toLowerCase().includes(userSearch.toLowerCase())
                      )
                      .map((user) => (
                        <label
                          key={user._id}
                          className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => {
                              setSelectedUsers((prev) =>
                                prev.includes(user._id)
                                  ? prev.filter((id) => id !== user._id)
                                  : [...prev, user._id]
                              );
                            }}
                            className="rounded border-gray-300"
                          />
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </label>
                      ))}
                  </div>
                </ScrollArea>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {selectedUsers.length} users selected
                  </p>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        setBulkNotificationForm((prev) => ({ ...prev, step: "compose" }))
                      }
                      className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBulkNotification}
                      disabled={!selectedUsers.length || bulkLoading}
                      className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      {bulkLoading ? "Sending..." : "Send Notification"}
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
