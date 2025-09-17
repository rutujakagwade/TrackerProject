// frontend/lib/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE = "http://192.168.1.4:5000/api";
async function authFetch(url, options = {}) {
  const token = await AsyncStorage.getItem("token");
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}
// lib/api.js
export async function request(endpoint, method = "GET", body = null, token, isFormData = false) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body && !isFormData ? JSON.stringify(body) : body,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Request failed");
  }

  return res.json();
}



export async function updateAdminProfile(body, token) {
  const res = await fetch("http://192.168.1.4:5000/api/admin/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }

  return res.json();
}


// async function request(endpoint, method = "GET", body, token, isFormData = false) {
//   const headers = {}; // ✅ remove ": any"
//   if (!isFormData) headers["Content-Type"] = "application/json";
//   if (token) headers["Authorization"] = `Bearer ${token}`;

//   const res = await fetch(`${API_BASE}${endpoint}`, {
//     method,
//     headers,
//     body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || "Request failed");
//   }

//   return res.json();
// }


// =======================
// Auth (all users)
// =======================
export async function register(data) {
  return request("/auth/register", "POST", data);
}

export async function login(email, password) {
  const res = await request("/auth/login", "POST", { email, password });
  await AsyncStorage.setItem("token", res.token);
  return res;
}
// =======================
// SuperAdmin
// =======================
export async function superadminCreate(data) {
  return request("/superadmin/create", "POST", data);
}

export async function superadminLogin(email, password) {
  const res = await request("/superadmin/login", "POST", { email, password });
  await AsyncStorage.setItem("superadminToken", res.token);
  return res;
}

export async function superadminInviteAdmin(data, token) {
  return request("/superadmin/invite-admin", "POST", data, token);
}

// =======================
// Admin
// =======================
export async function getAdminProfile(token) {
  return request("/admin/profile", "GET", null, token);
}

export async function addMember(data, token) {
  return request("/admin/members/add", "POST", data, token);
}

export async function getMembers(token) {
  return request("/admin/members", "GET", null, token);
}



export async function getMemberProfile(memberId, token) {
  return request(`/admin/members/${memberId}`, "GET", null, token);
}

// =======================
// Balance
// =======================
export async function addBalance(memberId, amount, token) {
  return request(`/balance/${memberId}`, "POST", { amount }, token);
}

export async function getBalance(memberId, token) {
  return request(`/balance/${memberId}`, "GET", null, token);
}

// =======================
// Expenses
// =======================
export async function addExpense(formData, token) {
  return request("/expenses", "POST", formData, token, true);
}

// Get logged-in user's expenses
export async function getMyExpenses(token, status) {
  const query = status ? `?status=${status}` : "";
  return request(`/expenses/me${query}`, "GET", null, token);
}

// Get all expenses (filter by status)
export async function getAllExpenses(token, status) {
  try {
    const query = status ? `?status=${status}` : "";
    const res = await fetch(`${API_BASE}/expenses${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch expenses");
    return await res.json();
  } catch (err) {
    throw err;
  }
}
export async function updateExpenseStatus(expenseId, status, token) {
  return request(`/expenses/${expenseId}/status`, "PATCH", { status }, token);
}

export async function bulkUpdateExpenses(ids, status, token) {
  return request("/expenses/bulk/status", "PATCH", { ids, status }, token);
}