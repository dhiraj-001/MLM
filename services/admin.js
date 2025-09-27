const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const adminService = {
  getAllTeamMembers: async (token) => {
    const response = await fetch(`${API_URL}/admin/team-members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch team members");
    return response.json();
  },

  getWithdrawalAccounts: async (token) => {
    const response = await fetch(`${API_URL}/admin/withdrawal-accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch accounts");
    return response.json();
  },

  updateWithdrawalAccount: async (id, data, token) => {
    const response = await fetch(`${API_URL}/admin/withdrawal-accounts/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update account");
    return response.json();
  },

  addDepositByAdmin: async (userId, amount, remark, token) => {
    const response = await fetch(`${API_URL}/admin/add-deposit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, amount, remark }),
    });
    if (!response.ok) throw new Error("Failed to add deposit");
    return response.json();
  },
};
