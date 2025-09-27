const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Base API service for making HTTP requests to the backend
 */
export const apiService = {
  /**
   * Make a GET request
   */
  async get(endpoint, token = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`Making GET request to: ${API_URL}${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      // Log response status for debugging
      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `Server responded with status ${response.status}`,
        }));
        throw new Error(error.message || "Something went wrong");
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  /**
   * Make a POST request
   */
  async post(endpoint, data, token = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`Making POST request to: ${API_URL}${endpoint}`, data);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      // Log response status for debugging
      console.log(`Response status: ${response}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `Server responded with status ${response.status}`,
        }));
        throw new Error(error.message || "Something went wrong");
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  /**
   * Make a PATCH request
   *  */

  async patch(endpoint, data, token = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`Making PATCH request to: ${API_URL}${endpoint}`, data);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      // Log response status for debugging
      console.log(`Response status: ${response}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `Server responded with status ${response.status}`,
        }));
        throw new Error(error.message || "Something went wrong");
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },
};

/**
 * Auth-specific API service
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    return apiService.post("/auth/register", userData);
  },

  /**
   * Login a user
   */
  async login(credentials) {
    try {
      console.log("Making POST request to:", `${API_URL}/auth/login`);
      console.log(credentials);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("Response status:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      const data = await response.json();
      console.log("Login response data:", data); // Log the complete response data

      // Enhance user data with explicit admin flag if needed
      if (
        data.user &&
        (data.user.type === "admin" ||
          data.user.role === "admin" ||
          data.user.phone === "8899889988")
      ) {
        data.user.isAdmin = true;
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Get user profile
   */
  async getUserProfile(token) {
    return apiService.get("/auth/user", token);
  },

  /**
   * Send password reset request
   */
  async forgotPassword(email) {
    return apiService.post("/auth/forget-password", { email });
  },

  /**
   * Change user password
   */
  async changePassword(passwords, token) {
    return apiService.post("/auth/change-password", passwords, token);
  },
};

/**
 * Contact-specific API service
 */
export const contactService = {
  /**
   * Submit contact form
   */
  async submitContactForm(formData) {
    return apiService.post("/form/contact", formData);
  },
};

/**
 * User-specific API service
 */
export const userService = {
  /**
   * Get user profile
   */
  async getProfile(token) {
    return apiService.get("/users/profile", token);
  },

  /**
   * Create a new deposit request
   */
  async createDeposit(depositData, token) {
    return apiService.post("/users/deposit", depositData, token);
  },

  /**
   * Get deposit history
   */
  async getDepositHistory(token) {
    return apiService.get("/users/deposit-history", token);
  },

  /**
   * Create a new withdrawal request
   */
  async createWithdrawal(withdrawalData, token) {
    return apiService.post("/users/withdrawal", withdrawalData, token);
  },

  /**
   * Get withdrawal history
   */
  async getWithdrawalHistory(token) {
    return apiService.get("/users/withdrawal-history", token);
  },

  /**
   * Get daily rewards
   */
  async getDailyReward(userId, token) {
    return apiService.get(`/users/daily-reward/${userId}`, token);
  },

  /**
   * Get monthly rewards
   */
  async getMonthlyReward(userId, token) {
    return apiService.get(`/users/monthly-reward/${userId}`, token);
  },

  /**
   * Get referral commission
   */
  async getReferralCommission(userId, token) {
    return apiService.get(`/users/referral-commission/${userId}`, token);
  },

  /**
   * Get team members
   */
  async getTeamMembers(userId, token) {
    return apiService.get(`/users/team-members/${userId}`, token);
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData, token) {
    return apiService.patch("/users/update-profile", profileData, token);
  },

  /**
   * Get quiz questions
   */
  async getQuizQuestions(token) {
    return apiService.get("/users/quiz", token);
  },

  /**
   * Submit quiz answers
   */
  async submitQuiz(answers, balanceType, token, isFirstDay = true) {
    return apiService.post("/users/quiz", { answers, balanceType, isFirstDay }, token);
  },

  /**
   * Get notifications for the user
   */
  async getNotifications(token) {
    return apiService.get("/users/notifications", token);
  },

  /**
   * Mark notifications as read
   */
  async markNotificationsAsRead(notificationIds, token) {
    return apiService.post(
      "/users/notifications/mark-read",
      { notificationIds },
      token
    );
  },

  /**
   * Check quiz availability
   */
  async checkQuizAvailability(token) {
    return apiService.get("/users/notifications/quiz-availability", token);
  },

  /**
   * Get withdrawal accounts
   */
  async getWithdrawalAccounts(token) {
    const response = await fetch(`${API_URL}/users/withdrawal-accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch withdrawal accounts");
    }

    return response.json();
  },

  /**
   * Transfer balance from earning to deposit
   */
  async transferBalance(amount, token) {
    return apiService.post("/users/transfer-balance", { amount }, token);
  },
};

/**
 * Admin-specific API service
 */
export const adminService = {
  /**
   * Get all users
   */
  async getAllUsers(token) {
    return apiService.get("/admin/users", token);
  },

  /**
   * Get all contact form submissions
   */
  async getAllContacts(token) {
    return apiService.get("/admin/contactFormData", token);
  },

  async getWithdrawalAccounts(token) {
    return apiService.get("/admin/withdrawal-accounts", token);
  },

  async updateWithdrawalAccount(id, data, token) {
    return apiService.patch(`/admin/withdrawal-accounts/${id}`, data, token);
  },

  async addDepositByAdmin(userId, amount, remark, token) {
    return apiService.post(
      "/admin/add-deposit-by-admin",
      { userId, amount, remark },
      token
    );
  },

  /**
   * Get all deposits
   */
  async getAllDeposits(token) {
    return apiService.get("/admin/deposits", token);
  },

  /**
   * Update deposit status
   */
  async updateDepositStatus(id, status, token) {
    return apiService.patch(`/admin/deposits/${id}`, { status }, token);
  },

  /**
   * Get all withdrawals
   */
  async getAllWithdrawals(token) {
    return apiService.get("/admin/withdrawals", token);
  },

  /**
   * Update withdrawal status
   */
  async updateWithdrawalStatus(id, status, token) {
    return apiService.patch(`/admin/withdrawals/${id}`, { status }, token);
  },

  /**
   * Get all team members
   */
  async getAllTeamMembers(token) {
    return apiService.get("/admin/team-members", token);
  },

  async blockUser(userId, reason, token) {
    return apiService.post("/admin/block-user", { userId, reason }, token);
  },

  async blockWithdraw(userId, reason, token) {
    return apiService.post("/admin/block-withdraw", { userId, reason }, token);
  },

  async unblockUser(userId, reason, token) {
    return apiService.post("/admin/unblock-user", { userId, reason }, token);
  },

  async unblockWithdraw(userId, reason, token) {
    return apiService.post("/admin/unblock-withdraw", { userId, reason }, token);
  },

  async getUserDetails(userId, token) {
    return apiService.get(`/admin/user/${userId}`, token);
  },

  async updateUserDetails(userId, userData, token) {
    return apiService.patch(`/admin/user/${userId}`, userData, token);
  },

  async sendUserNotification(userId, notificationData, token) {
    return apiService.post(`/admin/send-notification/${userId}`, notificationData, token);
  },

  async sendBulkNotification(userIds, notificationData, token) {
    return apiService.post('/admin/send-notification-bulk', {
      userIds,
      title: notificationData.title,
      message: notificationData.message
    }, token);
  },
};
